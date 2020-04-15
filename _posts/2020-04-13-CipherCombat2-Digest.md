---
layout: post
title: Digest [CipherCombat2.0 CTF write-up]
tags:
  - CTF Writeup
---

<div class="message">
Reverse Engineering Challenge of Hacker Earth CipherCombat2.0
</div>

![](https://miro.medium.com/max/916/1*Nuc4N5RaZtr63_YQFhz_0g.png)

### What we get?

A zip file with password “hackerearth”… unzip it and we get a Linux Executable
![](https://miro.medium.com/max/1400/1*vAjPVcnwMkk3vsJWwFYvCw.png)

Notice I highlighted LSB(Least Significant Bit) ? We will see why later…

### Solving the challenge

Let’s do strings …

![](https://miro.medium.com/max/1400/1*QituOMU8zpAkklSEngDR6g.png)

With strings we found some Texts but nothing like our flag.

Important thing to see here is **MD5 function calls** and use of **libcrypto.so.1.1** points at use of MD5 hash algorithm.

Further we can check this by listing all imports by RABIN2

![](https://miro.medium.com/max/1400/1*Zs5ILlbbLfM-sZEeRbzljw.png)

And we see that MD5 global functions are important.

Let’s check the disassembly now…

![](https://miro.medium.com/max/1400/1*mPe6hOAoX4GAUC4DhYytVA.png)

We can see that it compares the MD5 digest of string supplied with a hard coded MD5 value. We can also see it has moved hard-coded hex string to stack at **0x000011ad**

Any ways, it is comparing with something in stack, and my favorite way is to fire up GDB and check the stack in real-time to get the data.

Let’s have a look at GDB disassembly…

![](https://miro.medium.com/max/1368/1*lNZuiBDzkNvgSrHube7sgA.png)

We can see that string compare function is at *main+186 so we will put break point there.

![](https://miro.medium.com/max/1400/1*nmAFCPnQbBwgoA-1C2Jhuw.png)

![](https://miro.medium.com/max/766/1*6qb-pH2gzMPvaOLQhj3dtA.png)

Now let’s run the program and provide random input.

![](https://miro.medium.com/max/1400/1*6ad6Uix5zcBN7SQhMBWVhw.png)

We hit our breakpoints ! Let’s check registers, STRNCMP compares values stored in **[R/ESI]** with **[R/EDI]**...

![](https://miro.medium.com/max/1400/1*GEzuZe_tObGW6OpVnaz-Dg.png)

So get address of our hard-coded hash loaded in stack, lets check it out how it’s doing.

![](https://miro.medium.com/max/1400/1*4ESNSFiNrykRXxfoo0mZ7w.png)

And we get our values now let’s reconstruct the MD5

Remember about LSB? these values are stored like that, we need to convert it into MSB and then we can continue.

Copy the values in any text editor and rearrange them as following…

![](https://miro.medium.com/max/1400/1*6W3H0okjKG1LlN5e5bNaFg.png)

so at last we have our hash : **53a167c8d4dc964f7d7838dd4ce2d137**

Only thing left to do is brute force it, we can use online services, the one I used and which they later provided in their free hint is https://hashes.org/

![](https://miro.medium.com/max/1400/1*l3Cq8Jw-b3GGG3qS3V3REw.png)

And we have our flag :***HE{iamalmighty9}***

![](https://miro.medium.com/max/988/1*K7A9d8L1oQ5QBzLxV6Ngkw.png)

< And here is a cross check with the challenge binary.

Another Fun challenge! Done.

> NOTE: we could have done it in 3–4 less steps by just converting the strings found in **MOVABS** instructions,

![](https://miro.medium.com/max/1400/1*8RgD9zk0eJD2S6szrk-1Dg.png)

But what’s the fun in that, also i wanted to show you the dynamic analysis path. :-)

---
