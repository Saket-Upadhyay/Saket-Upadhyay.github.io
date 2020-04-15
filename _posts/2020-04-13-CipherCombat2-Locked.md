---
layout: post
title: Locked [CipherCombat2.0 CTF write-up]
tags:
  - CTF Writeup
  - CTF
---

<div class="message">
Reverse Engineering Challenge of Hacker Earth CipherCombat2.0
</div>

![](https://miro.medium.com/max/976/1*er3VhPR2dIn2nI7BXu_uVg.png "Question Header")

### What we get ?

We get a zip file with our binary in it with password hackerearth.
![](https://miro.medium.com/max/1400/1*YlLxAp6kziXd1d_db8HIUA.png)

After unzipping the file, we can start looking at the binary.

![](https://miro.medium.com/max/1400/1*gYTW45PJ_L2Zap_-KENFlw.png)

Important stuff : it’s Linux Executable and not stripped… This makes task easier.

### Solving the challenge

Let’s make the file executable by chmod.

![](https://miro.medium.com/max/1400/1*zLCzrFMLMXOzhGJfirn2Bg.png)

now let’s run it once and see what it actually does…

![](https://miro.medium.com/max/1400/1*X657SCKYqyTcoQsLsdrSvA.png)

So seems like some type password check, and the name of challenge checks out !

Let’s Disassemble it and try to understand the checking mechanism.

doing Strings on the file we get something interesting…

![](https://miro.medium.com/max/1262/1*jcUCXvcFuhsdFUZUODtQEQ.png)

Looks like good password? Also if we see the disassembly we see main calls the **fun2()** function before **test eax,eax** at **0x000012d7** which controls the flow of program… and see what it compares! the same string !

![](https://miro.medium.com/max/1400/1*MvkJYxg2J9qjStMB20DYIw.png)
![](https://miro.medium.com/max/1400/1*s1VfuFXEvf_Z5GjST_vXVg.png)

Let’s just try this as password…

![](https://miro.medium.com/max/1400/1*3oQeagCI-u_3zWlyJxgr6g.png)

And that works ! submit the flag and get them points…


### About CTF

Hacker Earth’s CipherCombat2.0 was great CTF for beginners in the security field. Overall nice refresher.
