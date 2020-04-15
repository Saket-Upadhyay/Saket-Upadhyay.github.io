---
layout: post
title: Pipe Brute-force Attack via Password Generator
tags:
  - Password Cracking

category:
    - Article
---
<div class="message">(Efficient and resource saving trick that was there for decades)</div>

During password cracking you might decide to brute force a target hash,any service or online website, for that you may need/create heavy dictionaries which can take terabytes of data. But we can skip that step and feed the password directly from generator to brute-force automation software.

### How much an eight digit long numeric password take on disk?

Let’s have a look on most basic and may-be-doesn’t-even-happen-today kind of scenario, creating a 8 digit numerical password with crunch.

![Image1.png](https://miro.medium.com/max/1400/1*G9AhPXlIYWLwoJkFD-z6GA.png)
858 MB for 8 digit numeric? not too big right, with our 1–2TBs of hard-drives it will do no harm to us.

let’s come to real-life condition now, step-by-step …

8 letter lowercase alphabets ? …
![](https://miro.medium.com/max/1400/1*HKpP62dqfxk7o_V1W78uYA.png)
1 TB ! just for our new word-list, and to be honest I am writing this from my PC with total storage of 1TB … if i remove all the files and OSes then i may store it, but again i need OS to perform attacks ¯\_(ツ)_/¯.

and this is last one fulfilling all the basic NEEDS OF MODERN WEBSITES.

* at least one UPPERCASE
* use of NUMBERS
* lowecase
* SPECIAL SYMBOLS
* Alien species’s language and what ever your PC allows you to throw at login filed!

CHAR-SET =

> 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!”#$%&’()*+,-./:;<=>?@[\]^_`{|}~
![](https://miro.medium.com/max/1400/1*osEbNjaduUT5-BYTm0FvVQ.png)
now unless you own a data storage farm to store 54303 TB of data, that would be ~ 27150 common 2TB storage drives, so let’s get over this problem by ‘piping’ the output directly to software rather than storing it in the device itself.

### How to overcome this limitation?

Suppose we want to crack the hash of password **'17652986'** now md5 of this hash **ce5cff0195a6b059a3241c1b6202ab49** now we can either create a file of 8 digits numbers or can just pass the list from crunch directly to hashcat

```bash
crunch 8 8 123456789| hashcat -m 0 ce5cff0195a6b059a32411b6202ab49
```

notice the **‘|’** in the command? this is called **‘pipe’** it will change the standard output of the crunch command to to hashcat and the hashcat when supplied no word-lists, listens on standard input.
![](https://miro.medium.com/max/720/1*9adBjAYUSoDUAIB2TEnPnQ.png "Figure 1")
![](https://miro.medium.com/max/552/1*_gFnA_SDFEufJ00sdbVo-A.png "Figure 2")

Flow of data from buffer to brute-force program directly (left figure) — (1)

Flow of data to hard-disk and then to the program (right figure) — (2)

Here we can already see (1) is much faster and efficient in practice as it does not interact with the hard-disk at all.

![](https://miro.medium.com/max/1400/1*SUUvuNKweFdpjLSMVaabcg.png)
and you can see it took just 31 seconds to crack 8 digit numeric password *highlighted*, but that’s predictable and speed here was not our concern.

### Conclusion

So, our motive here is complete as we have saved resources and hacking with all the skills is also all about speed, accuracy and efficiency.