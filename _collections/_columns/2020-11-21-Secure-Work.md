---
layout: post
title: "Secure your work like a Pro"
author: Saket
date:   2020-11-21 12:12:12 +0530
image: https://miro.medium.com/max/1400/1*Cl9YwRsUBbgIlrSAcudFYg.png
image_caption:
---
<div class="message">Utilizing PGP Keys to Encrypt Everything you have.
</div>

If you have some super private or confidential data on your computer and **don’t want anyone to have it, even if they have login access of your computer**, then you already know the answer to “Why should we do this”.

Now all that remains is "What" & "How" and that’s what we are going to talk about today. Let’s have quick look into TOC for this article…
<!--more-->

> Difficulty : Intermediate, (or easy, once you know the basic concepts and process of public-key crypto.)

![](https://miro.medium.com/max/1400/1*lH5N0v7kqRHMZmyTbinWrQ.png)

## What’s PGP & GPG?

Pretty Good Privacy or PGP uses several encryption technologies, like hashing, data compression, and public/private PGP keys to protect an organization’s critical information. BUT, it’s propriety owned by Symantec.

Yes the makers of Norton Antivirus.

Luckily there is OpenPGP, it is an open source standard that allows PGP to be used in software that is typically free to the public. The term “Open PGP” is often applied to tools, features, or solutions that support open-source PGP encryption technology.

And now GnuPG or GPG, stands for GNU Privacy Guard. GPG is a different implementation of the Open PGP standard and a strong alternative to Symantec’s official PGP software.

> “GnuPG is a complete and free implementation of the OpenPGP standard as defined by RFC4880 (also known as PGP). GnuPG allows you to encrypt and sign your data and communications; it features a versatile key management system, along with access modules for all kinds of public key directories. GnuPG, also known as GPG, is a command line tool with features for easy integration with other applications” ~ https://gnupg.org/

And that’s what we are gonna use.

## How to set up our GPG keys?

### Installing GPG in Linux and MacOS 🐧 🍎

Usually it’s already installed, but should this is not be the case with you, you can download the GPG source from :-

[https://gnupg.org/download/index.html](https://gnupg.org/download/index.html)

and Compile it using the Instructions from official manual : [https://gnupg.org/documentation/manuals.html](https://gnupg.org/documentation/manuals.html)

If you are in Debian-base system, then you might be able to do:-

`$ sudo apt-get install gnupg` to install it via repos. or `$ sudo yum install gnupg` for CentOS, Fedora, RHEL etc.

### Installing in Windows
GPG is not usually default in windows and you might need to install it on your own, don’t worry you can download gpg4win from official source : [https://gnupg.org/download/](https://gnupg.org/download/).

OR you can refer following [PDF from http://www.ibiblio.org/shadow/pgp/install-gpg.pdf](http://www.ibiblio.org/shadow/pgp/install-gpg.pdf)

In short it follows the simple windows installation and the command are same for everything via powershell.

So once you’ve installed it, you are golden.

## Generating New Key Pair 🔑

Now as we have installed gpg, we need to generate our new key pair to be used for signing and encryption.

Why I said key “pair” ? Check this out ➡️ [https://cheapsslsecurity.com/blog/what-is-asymmetric-encryption-understand-with-simple-examples/](https://cheapsslsecurity.com/blog/what-is-asymmetric-encryption-understand-with-simple-examples/)

Anyways, let’s generate ours.
To generate key pair, open terminal and type :-

`$ gpg --full-generate-key`

![](https://miro.medium.com/max/1400/1*90zyktS0M6dhVc979N_HYg.png)

Select `1` , it means we will use `RSA for both signing and encryption.`

![](https://miro.medium.com/max/1400/1*KN-HUjm-oCIWxj5oSE6MYQ.png)

Next it will ask for **Key Size**. To be on safe side use **4096** bits long key. Just input `4096`.

Next it will ask you to set expiration, for now we will set key does not expire, input `0` here and continue.

![](https://miro.medium.com/max/1400/1*uLG-S-aQEPfSGy-Q1AxlDw.png)

Next it will confirm your input, just say `y` and continue. Then it will ask you to enter your **basic details, to associate your keys** with, give ’em that.

![](https://miro.medium.com/max/1400/1*wXqph3O1LyCM4_UvHpUTDA.png)

After that it will confirm your inputs, check it and if it’s okay, input `O`  and continue.

Then it will ask you for your password, _**FILL THIS CAREFULLY.**_

![](https://miro.medium.com/max/1400/1*zf6fkfDRGyQVxMCzrMw1_Q.png)

Here I chose `1234` for the sake of this article, **make sure you provide strong password that you can remember**.

![](https://miro.medium.com/max/1400/1*qfxI0-RKn5PGgpcJe4WfPA.png)

![](https://miro.medium.com/max/1400/1*Cl9YwRsUBbgIlrSAcudFYg.png)


Confirm the password and select OK (press enter key).

After this you might see something like this :-

![](https://miro.medium.com/max/1400/1*-q4BJFjoz9jKouIMSEPSDg.png)

This is because we need to generate high entropy random number, just move your mouse around and it would be fast, you don’t need to do anything special in this, gpg is collecting random values from your system so just wait.

After this is done, we will have our keys generated :

![](https://miro.medium.com/max/1400/1*E541VUFPnW_z-LhXijSRRg.png)

***YAY !! Now you have your own key pair !***

### See your keys 👀
You can see all you keys in the key-ring by:-

`gpg --list-keys`

![](https://miro.medium.com/max/1400/1*qgN93-F-MtFrQzdAnnDvgA.png)

---

## How to use these keys ?
So now we have our keys, let’s put them to good use for encrypting and signing (topic for another article :-) )

### Encrypt Your Data 🔐
To encrypt any data : `gpg --encrypt <file_to_encrypt>`

It will ask for recipients, type your **Name** or **EmailID** here (which is used to generate keys) and Press “enter key” to end the prompt. This will encrypt the file with your encryption public key (or someone else’s public key if you have it in your keyring and provide their Name or Email in recipients section.)

![](https://miro.medium.com/max/1400/1*mODIb8wekfkDdDTWWEzMcA.png)

After that, you will see new file **imp.txt.gpg** which is our encrypted file.

![](https://miro.medium.com/max/1400/1*qUr15QHACDcEcsFEPTgZ5g.png)

Let’s see the difference:-

![](https://miro.medium.com/max/1400/1*R5qUhSBPRIK1BGdZVaL5bw.png)

As we can see that our `imp.txt.gpg` is encrypted, and we can delete original `imp.txt` file.

![](https://miro.medium.com/max/1400/1*CknVYKT6MgzTxtJvOo_Iew.png)

Now we only have our encrypted file.

### Decrypt Your Data 🔓
To decrypt the file :-

`gpg --decrypt <encrypted_gpg_file>`

![](https://miro.medium.com/max/1400/1*JMmBMF41Dy_c71P3N-M6AQ.png)

![](https://miro.medium.com/max/1400/1*gOGg1d8PMJHiMSZfXInrMw.png)

Provide your **password that we used when creating the key**, in this case `1234`.

![](https://miro.medium.com/max/1400/1*AJupyWCU2obzxbxtl5Ad5g.png)

In this case we got our answer on stdout, we can divert it into a file by redirection :-
 `gpg --decrypt imp.txt.gpg > imp.txt`

![](https://miro.medium.com/max/1400/1*xv9qWevCR17O7YVAB7VSHQ.png)


![](https://miro.medium.com/max/1400/1*rQavH6ElDiwRWvMTiUJYCw.png)

We can check the contents of the decrypted file by simply using cat in this case.

---

### Closing words ✏️
Now we have basic setup for gpg encryption and can encrypt ANY file we want in our workflow.

There is more to it, can we can combine different tactics for ultimate security / signing etc. but that we will try to cover in future articles.

So see ya in next one, till then, stay caffeinated!

---

#### Resources 🌱

1. [https://gnupg.org/](https://gnupg.org/)
2. [https://www.varonis.com/blog/pgp-encryption/](https://www.varonis.com/blog/pgp-encryption/)
3. [https://itsfoss.com/ubuntu-keyring/](https://itsfoss.com/ubuntu-keyring/)