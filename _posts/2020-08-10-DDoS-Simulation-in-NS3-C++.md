---
layout: post
title: DDoS attack Simulation in NS3 
tags:
  - C++
  - NS3
  - Simulation
---

<div class="message">
Distributed Denial of Service Attack Simuation Build from scratch in C++
</div>

![](https://miro.medium.com/max/700/1*Gaixy9imX-y-q7NJQY5qog.png)

### What is this?
This article is about coding a Distributed Denial of Service Attack simulation in NS-3 discrete event network simulator.

### Why do we need it?

Because visual representation of basic concepts which you can play around with is better right?

### Where can you get the code?

As part of a community project I am collecting / building multiple cybersecurity simulations and scenarios in NS3 and logging them in GitHub.

You can check the repo from`PROJECTS` section of this site.

### How to ?
Now this is what this article is all about. Let’s jump into it.


#### Creating Base Model 
The base model for this attack is relatively simple : We have 3 main nodes Alice \[n0\] (Legitimate Client), Bob \[ n2\] (Server Application) and a connecting node in between let’s say Dave [n1].

![](https://miro.medium.com/max/512/1*V3PJ6E4Mba2zMnW71GwbgQ.png)("Legitimate Connection Model")

Now we will add as many bots we want to attack the network and let’s call them Mallory `[bi | i∈ (N)]`.



#### Code \[C++\]

Let's first include all the required headers.

```cpp
#include <ns3/csma-helper.h>
#include "ns3/mobility-module.h"
#include "ns3/nstime.h"
#include "ns3/core-module.h"
#include "ns3/network-module.h"
#include "ns3/internet-module.h"
#include "ns3/point-to-point-module.h"
#include "ns3/applications-module.h"
#include "ns3/ipv4-global-routing-helper.h"
#include "ns3/netanim-module.h"
```
next we define some global configurations so that we can play around with them later.

```cpp
#define TCP_SINK_PORT 9000
#define UDP_SINK_PORT 9001

//experimental parameters
#define MAX_BULK_BYTES 100000
#define DDOS_RATE "20480kb/s"
#define MAX_SIMULATION_TIME 10.0

//Number of Bots for DDoS
#define NUMBER_OF_BOTS 10

NS_LOG_COMPONENT_DEFINE("DDoSAttack");
using namespace ns3;
```
Now inside typical `main()` function we will start creating our base model.

#### Creating Nodes

Nodes are nothing but the points of communication we structured in our design phase.

This will create 3 good nodes and as many Bot nodes defined by `NUMBER_OF_BOTS`.

```cpp
//Legitimate connection bots
NodeContainer nodes;
nodes.Create(3);

//Nodes for attack bots
NodeContainer botNodes;
botNodes.Create(NUMBER_OF_BOTS);
```

#### Connecting Nodes

We can use point-to-point helper to connect different nodes.

```cpp
// Define the Point-To-Point Links and their Paramters
PointToPointHelper pp1, pp2;
pp1.SetDeviceAttribute("DataRate", StringValue("100Mbps"));
pp1.SetChannelAttribute("Delay", StringValue("1ms"));

pp2.SetDeviceAttribute("DataRate", StringValue("100Mbps"));
pp2.SetChannelAttribute("Delay", StringValue("1ms"));

```
and then install the P2P device in the nodes to actually connect them. One thing to keep in mind here is that our number of bots are dynamic and we don’t want the user to change the whole algorithm when changing the number so we can use simple for loop for P2P installation in the bots.

***We will use these “for-loops” wherever we will assign or install something to bot nodes.***

```cpp
NetDeviceContainer d02, d12, botDeviceContainer[NUMBER_OF_BOTS];
d02 = pp1.Install(nodes.Get(0), nodes.Get(1));
d12 = pp1.Install(nodes.Get(1), nodes.Get(2));

for (int i = 0; i < NUMBER_OF_BOTS; ++i)
{
    botDeviceContainer[i] = pp2.Install(botNodes.Get(i), nodes.Get(1));
}
```

#### Assignment of IP Address and Internet Stack

In this case we are using IPv4 Address for our nodes and can be setup by ipv4-helper class. This will connect our devices to virtual internet stack.

```cpp
//Assign IP to bots
InternetStackHelper stack;
stack.Install(nodes);
stack.Install(botNodes);
Ipv4AddressHelper ipv4_n;
ipv4_n.SetBase("10.0.0.0", "255.255.255.252");

Ipv4AddressHelper a02, a12, a23, a34;
a02.SetBase("10.1.1.0", "255.255.255.0");
a12.SetBase("10.1.2.0", "255.255.255.0");

for (int j = 0; j < NUMBER_OF_BOTS; ++j)
{
    ipv4_n.Assign(botDeviceContainer[j]);
    ipv4_n.NewNetwork();
}

//Assign IP to legitimate nodes
Ipv4InterfaceContainer i02, i12;
i02 = a02.Assign(d02);
i12 = a12.Assign(d12);
```

#### Installing Attacker Application in the bots

Now we want to install applications in our nodes so that they can communicate with their neighbors. Let’s create attacker application.

The attacker application in this case is simple UDP OnOff Sender which can be created by :


```cpp
// DDoS Application Behaviour
OnOffHelper onoff("ns3::UdpSocketFactory", Address(InetSocketAddress(i12.GetAddress(1), UDP_SINK_PORT)));
onoff.SetConstantRate(DataRate(DDOS_RATE));
onoff.SetAttribute("OnTime", StringValue("ns3::ConstantRandomVariable[Constant=30]"));
onoff.SetAttribute("OffTime", StringValue("ns3::ConstantRandomVariable[Constant=0]"));
ApplicationContainer onOffApp[NUMBER_OF_BOTS];
```
Then we can install in each bot node by :

```cpp
//Install application in all bots
for (int k = 0; k < NUMBER_OF_BOTS; ++k)
{
    onOffApp[k] = onoff.Install(botNodes.Get(k));
    onOffApp[k].Start(Seconds(0.0));
    onOffApp[k].Stop(Seconds(MAX_SIMULATION_TIME));
}
```

#### Client Application 

Now the client also needs application stack to simulate communication from server. We will use BulkTCP connection for this purpose simulation some large file transfer for resource request.

```cpp
// Sender Application (Packets generated by this application are throttled)
BulkSendHelper bulkSend("ns3::TcpSocketFactory", InetSocketAddress(i12.GetAddress(1), TCP_SINK_PORT));
bulkSend.SetAttribute("MaxBytes", UintegerValue(MAX_BULK_BYTES));
ApplicationContainer bulkSendApp = bulkSend.Install(nodes.Get(0));
bulkSendApp.Start(Seconds(0.0));
bulkSendApp.Stop(Seconds(MAX_SIMULATION_TIME - 10));

```

#### Server Side TCP and UDP sinks

Now let’s install application in our server to receive these packets

```cpp
// UDPSink on receiver side
PacketSinkHelper UDPsink("ns3::UdpSocketFactory",
                         Address(InetSocketAddress(Ipv4Address::GetAny(), UDP_SINK_PORT)));
ApplicationContainer UDPSinkApp = UDPsink.Install(nodes.Get(2));
UDPSinkApp.Start(Seconds(0.0));
UDPSinkApp.Stop(Seconds(MAX_SIMULATION_TIME));

// TCP Sink Application on server side
PacketSinkHelper TCPsink("ns3::TcpSocketFactory",
                         InetSocketAddress(Ipv4Address::GetAny(), TCP_SINK_PORT));
ApplicationContainer TCPSinkApp = TCPsink.Install(nodes.Get(2));
TCPSinkApp.Start(Seconds(0.0));
TCPSinkApp.Stop(Seconds(MAX_SIMULATION_TIME));

```

We can then populate the IP ROUTING TABLE by :
```cpp
Ipv4GlobalRoutingHelper::PopulateRoutingTables();
```
This will bake all the network connections and applications in place for simulation.

#### Setting up Animation in NetAnim Module

Our main structure is complete and now we can prepare our simulation grounds.

Configuring mobility in nodes:

```cpp
//Simulation NetAnim configuration and node placement
MobilityHelper mobility;

mobility.SetPositionAllocator("ns3::GridPositionAllocator",
                              "MinX", DoubleValue(0.0), "MinY", DoubleValue(0.0), "DeltaX", DoubleValue(5.0), "DeltaY", DoubleValue(10.0),
                              "GridWidth", UintegerValue(5), "LayoutType", StringValue("RowFirst"));

mobility.SetMobilityModel("ns3::ConstantPositionMobilityModel");

mobility.Install(nodes);
mobility.Install(botNodes);
```

Placing Nodes in Simulation Grid:

```cpp
AnimationInterface anim("DDoSim.xml");

ns3::AnimationInterface::SetConstantPosition(nodes.Get(0), 0, 0);
ns3::AnimationInterface::SetConstantPosition(nodes.Get(1), 10, 10);
ns3::AnimationInterface::SetConstantPosition(nodes.Get(2), 20, 10);

uint32_t x_pos = 0;
for (int l = 0; l < NUMBER_OF_BOTS; ++l)
{
    ns3::AnimationInterface::SetConstantPosition(botNodes.Get(l), x_pos++, 30);
}
```
We are almost done then we just need to run the simulation and view in NetAnim.

### Full Code

```cpp
/*       
 * LICENSE : GNU General Public License v3.0 (https://github.com/Saket-Upadhyay/ns3-cybersecurity-simulations/blob/master/LICENSE)
 * REPOSITORY : https://github.com/Saket-Upadhyay/ns3-cybersecurity-simulations
 * =================================================================================
 * 
 * In this we follow the following setup / node placement
 * 
 *    (n1)
 *      \
 *       \
 *         -------- (n2) -------- (n3)
 *                 / |  \
 *                /  |   \ 
 *               /   |    \
 *             (B0),(B2)...(Bn) 
 *                 
 *  N0 is legitimate user, communicating with server N2 (data server) via node N1 (maybe website server interface )
 *  B0-Bn are bots DDoS-ing the network.
 * 
 * NetAnim XML is saved as -> DDoSim.xml 
 *  
 */
#include <ns3/csma-helper.h>
#include "ns3/mobility-module.h"
#include "ns3/nstime.h"
#include "ns3/core-module.h"
#include "ns3/network-module.h"
#include "ns3/internet-module.h"
#include "ns3/point-to-point-module.h"
#include "ns3/applications-module.h"
#include "ns3/ipv4-global-routing-helper.h"
#include "ns3/netanim-module.h"

#define TCP_SINK_PORT 9000
#define UDP_SINK_PORT 9001

//experimental parameters
#define MAX_BULK_BYTES 100000
#define DDOS_RATE "20480kb/s"
#define MAX_SIMULATION_TIME 10.0

//Number of Bots for DDoS
#define NUMBER_OF_BOTS 10

using namespace ns3;

NS_LOG_COMPONENT_DEFINE("DDoSAttack");

int main(int argc, char *argv[])
{
    CommandLine cmd;
    cmd.Parse(argc, argv);

    Time::SetResolution(Time::NS);
    LogComponentEnable("UdpEchoClientApplication", LOG_LEVEL_INFO);
    LogComponentEnable("UdpEchoServerApplication", LOG_LEVEL_INFO);


    //Legitimate connection bots
    NodeContainer nodes;
    nodes.Create(3);

    //Nodes for attack bots
    NodeContainer botNodes;
    botNodes.Create(NUMBER_OF_BOTS);

    // Define the Point-To-Point Links and their Paramters
    PointToPointHelper pp1, pp2;
    pp1.SetDeviceAttribute("DataRate", StringValue("100Mbps"));
    pp1.SetChannelAttribute("Delay", StringValue("1ms"));

    pp2.SetDeviceAttribute("DataRate", StringValue("100Mbps"));
    pp2.SetChannelAttribute("Delay", StringValue("1ms"));

    // Install the Point-To-Point Connections between Nodes
    NetDeviceContainer d02, d12, botDeviceContainer[NUMBER_OF_BOTS];
    d02 = pp1.Install(nodes.Get(0), nodes.Get(1));
    d12 = pp1.Install(nodes.Get(1), nodes.Get(2));

    for (int i = 0; i < NUMBER_OF_BOTS; ++i)
    {
        botDeviceContainer[i] = pp2.Install(botNodes.Get(i), nodes.Get(1));
    }

    //Assign IP to bots
    InternetStackHelper stack;
    stack.Install(nodes);
    stack.Install(botNodes);
    Ipv4AddressHelper ipv4_n;
    ipv4_n.SetBase("10.0.0.0", "255.255.255.252");

    Ipv4AddressHelper a02, a12, a23, a34;
    a02.SetBase("10.1.1.0", "255.255.255.0");
    a12.SetBase("10.1.2.0", "255.255.255.0");

    for (int j = 0; j < NUMBER_OF_BOTS; ++j)
    {
        ipv4_n.Assign(botDeviceContainer[j]);
        ipv4_n.NewNetwork();
    }

    //Assign IP to legitimate nodes
    Ipv4InterfaceContainer i02, i12;
    i02 = a02.Assign(d02);
    i12 = a12.Assign(d12);

    // DDoS Application Behaviour
    OnOffHelper onoff("ns3::UdpSocketFactory", Address(InetSocketAddress(i12.GetAddress(1), UDP_SINK_PORT)));
    onoff.SetConstantRate(DataRate(DDOS_RATE));
    onoff.SetAttribute("OnTime", StringValue("ns3::ConstantRandomVariable[Constant=30]"));
    onoff.SetAttribute("OffTime", StringValue("ns3::ConstantRandomVariable[Constant=0]"));
    ApplicationContainer onOffApp[NUMBER_OF_BOTS];

    //Install application in all bots
    for (int k = 0; k < NUMBER_OF_BOTS; ++k)
    {
        onOffApp[k] = onoff.Install(botNodes.Get(k));
        onOffApp[k].Start(Seconds(0.0));
        onOffApp[k].Stop(Seconds(MAX_SIMULATION_TIME));
    }

    // Sender Application (Packets generated by this application are throttled)
    BulkSendHelper bulkSend("ns3::TcpSocketFactory", InetSocketAddress(i12.GetAddress(1), TCP_SINK_PORT));
    bulkSend.SetAttribute("MaxBytes", UintegerValue(MAX_BULK_BYTES));
    ApplicationContainer bulkSendApp = bulkSend.Install(nodes.Get(0));
    bulkSendApp.Start(Seconds(0.0));
    bulkSendApp.Stop(Seconds(MAX_SIMULATION_TIME - 10));

    // UDPSink on receiver side
    PacketSinkHelper UDPsink("ns3::UdpSocketFactory",
                             Address(InetSocketAddress(Ipv4Address::GetAny(), UDP_SINK_PORT)));
    ApplicationContainer UDPSinkApp = UDPsink.Install(nodes.Get(2));
    UDPSinkApp.Start(Seconds(0.0));
    UDPSinkApp.Stop(Seconds(MAX_SIMULATION_TIME));

    // TCP Sink Application on server side
    PacketSinkHelper TCPsink("ns3::TcpSocketFactory",
                             InetSocketAddress(Ipv4Address::GetAny(), TCP_SINK_PORT));
    ApplicationContainer TCPSinkApp = TCPsink.Install(nodes.Get(2));
    TCPSinkApp.Start(Seconds(0.0));
    TCPSinkApp.Stop(Seconds(MAX_SIMULATION_TIME));

    Ipv4GlobalRoutingHelper::PopulateRoutingTables();

    //Simulation NetAnim configuration and node placement
    MobilityHelper mobility;

    mobility.SetPositionAllocator("ns3::GridPositionAllocator",
                                  "MinX", DoubleValue(0.0), "MinY", DoubleValue(0.0), "DeltaX", DoubleValue(5.0), "DeltaY", DoubleValue(10.0),
                                  "GridWidth", UintegerValue(5), "LayoutType", StringValue("RowFirst"));

    mobility.SetMobilityModel("ns3::ConstantPositionMobilityModel");

    mobility.Install(nodes);
    mobility.Install(botNodes);

    AnimationInterface anim("DDoSim.xml");

    ns3::AnimationInterface::SetConstantPosition(nodes.Get(0), 0, 0);
    ns3::AnimationInterface::SetConstantPosition(nodes.Get(1), 10, 10);
    ns3::AnimationInterface::SetConstantPosition(nodes.Get(2), 20, 10);

    uint32_t x_pos = 0;
    for (int l = 0; l < NUMBER_OF_BOTS; ++l)
    {
        ns3::AnimationInterface::SetConstantPosition(botNodes.Get(l), x_pos++, 30);
    }

    //Run the Simulation
    Simulator::Run();
    Simulator::Destroy();
    return 0;
}

```
### Simulation Result

Let’s build the project and check our simulations.

```sh
./waf --run DDoSim
```
![](https://miro.medium.com/max/700/1*bfscwe_3yJ2EDK8Wsa6ssg.png)("Building Simulation with waf")

After that we should have DDoSim.xml which we can load in NetAnim for Simulation.

#### With 1 Bot

![](/assets/images/1botsim.gif)

Here we can see that there is not much interference in network speed. and Alice is able to complete the file transfer.

#### With 10 Bots

![](/assets/images/10botsim.gif)
Here we can see significant effect on network speed and the after 2nd packet client is struggling in receiving requested resources.

### Conclusion

We can experiment with the above program and increase or decrease number of bots, bandwidth etc and observe the effect on the network.

I hope this will help you to visualize DDoS and get some technical insight.

The code is under GNU General Public License v3.0, so it can be used anywhere with proper citation.

That’s all for this article, will see you in next one.

Till then stay Caffeinated !

##### Resources

NS-3 Docs : [Official Website](https://www.nsnam.org/) | [NSNAM Tutorials](https://www.nsnam.org/docs/tutorial/html/) | [Official Documentation](https://www.nsnam.org/documentation/)


--
