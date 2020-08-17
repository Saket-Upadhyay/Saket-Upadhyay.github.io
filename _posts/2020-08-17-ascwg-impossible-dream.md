---
layout: post
title: ASCWG CTF Impossible Dream Writeup  
tags:
  - CTF Writeup
  - CTF
  - FrigidSec
---

<div class="message">
Writeup of Forensics Challenge of Arab Security Cyber WarGames.

Points : 600
</div>

### Background
The description said :

> The notorious terrorist group known as the 10 rings got their elite hacker `5` to hack into Stark Industries and steal the some sensitive files inlcuding the blueprints for the `aRC` Reactor second model, the hackers `messed up the data` badly and encrypted the files. Can you retrieve the files?

you see some marked text in the challange? that was not there, we put it there and will break it down later. holdon.

### First Look 
So we got a file which looks like a `WAV` file. But ofc it was corrupt.
![](/assets/images/tid/1.png)

So the _header fixer guy_ of our team just fixed the `WAV Header`  

![](/assets/images/tid/2.png)

![](/assets/images/tid/3.png)

See easy. Now what? now we did the following :

* Played the song
* Tested in Audacity
* stegcrack
* steghide
* LSB Steg

but none of the above gave any kind of result so we kinda moved on to different channalge..

### DeepSound Extraction
after sometime we tried to see more WAV file hiding stuff and went with `DeepSound`

I already had DeepSound installed in my VM. so just fired it up...

![](/assets/images/tid/4.png)
![](/assets/images/tid/5.png)
And oh boy it was there `challenge.img`, extracted it and transfered to our host machine for further analysis.

### Linux File System (Readonly)
![](/assets/images/tid/6.png)

So it was `ext4` linux disk image.

so next step was pretty obvious

![](/assets/images/tid/7.png)
![](/assets/images/tid/8.png)
![](/assets/images/tid/9.png)

So we found some files and only `pastebin.txt` seems to be readable.
The `RAR` files were password protected and we didn't had any hint.
### Encryption and Encodings

![](/assets/images/tid/10.png)
Initially we thought `pastebin.txt` is a hash as it resembled `SHA-256 (RAW)` but oh boy we wasted time on that lol..

After sometime we all again went reading challenge discription and noticed some special things in there like :

> Who names their team-mate `5` ?
> Why is `RC` capital in `aRC Reactor` ?
> They said hackers `encrypted` the data


5, RC, encrypted ?? DAMN !!!

`RC5 ENCRYPTED !!!`

so we fired up online decryption tool soon found out it was 

`RC2 with key=5` 


![](/assets/images/tid/11.png)

so we got a `pastebin` link, went there and saw some text which looks like `base32` OR `base64` encoding. so again we put that into online decoders.. yes it was but gave some gibbrish but again _the header fixer guy_
pointed out that it was `ROT47` and yes sir it was!

![](/assets/images/tid/12.png)
![](/assets/images/tid/13.png)

We got something like an online tag and our _twitter guy_ said it was `twitter ID` so we went there and found a tweet ..

 
![](/assets/images/tid/14.png)

By just seeing the tweet I knew it was substitution cipher and what to expect as the whole structure resembles URL, Caesar maybe.. that damn ape ...

So fired up another online tool and it was indeed `substitution cipher with 13 shift` 

![](/assets/images/tid/15.png)
and gave a `mega file service link` which had a hash stored in there...


![](/assets/images/tid/16.png)

and our _twitter guy_ was fast enough and gave us the type of hash `MD5` and also the password `Password120` 

this can also be done via online services like `crackstation` but I will share hashcat screenshot as it looks cool and I love OG Hash Cracking.


![](/assets/images/tid/17.png)

### Final Mind F\*\*\*

So now we had password and a rar file but ofc it will not work for 600 points... so we have a non working password and a rar file.

We wasted almost 30 mins on figuring out why the password was not working and what's wrong with obvious rar file.

and then after we tried everything we started studying all the steps and files we got..

and then I noticed something new....


![](/assets/images/tid/18.png)

You see? these two files show similar trend of strings ...

and after some more observation it was clear that this is also A RAR FILE !! but without propper header itself .... time for _header fixer guy_ again XD.

so we just patched the `RARv5` header in `Null` ...


![](/assets/images/tid/19.png)
![](/assets/images/tid/20.png)

and then we tried to extract this from _twitter guy's_ password `Password120` 

![](/assets/images/tid/21.png)
and DONE !! we saw one of the most beautiful message of that day ...

![](/assets/images/tid/22.png)

and we have the flag .. let me make a new header in this post for that ...

### FLAG 
And here you go :
![](/assets/images/tid/23.png)

That's all for this post ... see ya in next one !

in the mean time check other writeups from my teammates in our github repo.. [FrigidSec GitHub](https://github.com/FrigidSec/CTFWriteups)

---

This chal. had significant ammount of header fixing, so if you are new to this check this article out on how to use vim to edit files in hexdecimal level. 
[Use VIM as HEX editor like a boss](https://saket-upadhyay.github.io/2020/08/16/use-VIM-as-HEX-Editor.html)

---
