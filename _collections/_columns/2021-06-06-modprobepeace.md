---
layout: post
title: "Modprobe for peace of mind"
author: Saket
date:   2021-06-06 12:12:12 +0530
image: https://miro.medium.com/max/813/0*jy6POViAcL4Xhho-.png
image_caption: Add and remove modules from the Linux Kernel for digital privacy.
---

modprobe intelligently adds or removes a module from the Linux kernel. modprobe looks in the module directory /lib/modules/`uname -r` for all the modules and other files, except for the optional configuration files in the /etc/modprobe.d directory.
~(man)ual pages

<!--more-->
# Kernel and Kernel Modules in Linux
In Linux you can add capabilities to base kernel via ‘kernel modules’. These are programs that you can load at kernel level and then use the exposed APIs to communicate with your assets. This is how most of the drivers work in Linux, they load their kernel modules and extend the capabilities of kernel to do what they want to achieve and then run rest of the code at user level using the newly exposed functions of kernel.

# Kernel modules and Privacy

So as we know that kernel modules are being used to drive devices, how about we remove these drivers and disable the device at kernel level?
That’s exactly what we are going to do, turning off camera is one thing, but removing the cam driver itself is sometimes overkill but a necessary evil. The image below visualizes this idea nicely.

![](https://miro.medium.com/max/813/0*jy6POViAcL4Xhho-.png)

Let’s say we want to block our webcam, then we will just remove (unload) the camera kernel module (driver) doing so will disable the only link between hardware and your programs, hence forbidding any usage of webcam feed in future unless you reload the drivers, or if you don’t use your camera at all or the concerned device is production machine with attached camera, you can directly blacklist the drives and modules, that will deny inclusion of that module during boot procedure.

## Basic unload syntax

To unload any module use `modprobe -r <module_name>`, this will remove the module from current running kernel (the module will load again on reboot).

## Blacklisting procedure

To blacklist a module -

1. `nano /etc/modprobe.d/blacklist.config` (or use your fav. text editor).

2. `add blacklist <module_name>` as newline in the file and save it.

The module will not be loaded next time you boot.

> Note : blacklisted modules can be manually loaded via `modprobe <module_name>` or `insmod` utilities.

# How to disable your webcam?

To disable your webcam, you need to unload `uvcvideo` module, you can read more about this module [here](https://www.kernel.org/doc/html/v4.13/media/v4l-drivers/uvcvideo.html)

To do this with modprobe, `sudo modprobe -r uvcvideo` should do it. Now try to open any application that uses camera. To visualize this, you did something similar to -

![](https://miro.medium.com/max/813/1*FxuP17ddOQuCW0GYc-Y6xg.png)


Similarly you can handpick specific drivers and modules and unload them or blacklist them (for camera module add a new line → `blacklist uvcvideo` in `/etc/modprobe.d/blacklist.config` and reboot).

### lsmod
To list all loaded kernel modules you can use `lsmod`
![](https://miro.medium.com/max/875/1*9BqDVwVd5A-DWJTMwX0x5w.png)

### modinfo

You can also use modinfo to get information about the module.

![](https://miro.medium.com/max/875/1*Iriz1CFjkEQzG0Y7qPkBDA.png)

# Be careful
BE SUPERDUPERHYPER CAREFUL when unloading kernel modules, one bad move and there goes your whole system burning down into a beautiful crash!

![](https://miro.medium.com/max/875/1*32yRtz0GZluB2sFKTlw9CA.png)

# Closing thoughts
This will protect you from 90% of malware attacks and 100% user error based oh-shit-my-cam-was-open shame.
This will not protect you from people who know what they are doing, but will increase their efforts and might act as deterrent.