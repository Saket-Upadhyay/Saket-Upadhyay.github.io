---
layout: post
title: Why RSA is NOT used to encrypt LARGE files?
tags:
  - Cryptography
---

<div class="message">
Practical Understanding of Public-Key based Encryption Strategies and their Efficiency.
</div>



# ...But,

then why do PGP / GPG and other encryption tools have `"encrypt with RSA"` option?
And, what’s even the use of this if we can’t use it to encrypt large files?
Are you saying RSA is useless? and if not, where it is used then?
… In this article, we will try to understand all the above questions and more, with an experiment and some basic theory to back it up.

![](https://miro.medium.com/max/875/1*YvSpFRuXUo_qo4fjnn5q-w.png)

## Basic Prerequisite
It is assumed that you have some initial knowledge of RSA and Public-Key Cryptography and Cryptography in General… or at least you heard these terms earlier… anyways, here is a super-short reference.

### Public Key Cryptography (Asymmetric Cryptography)

> Public-key cryptography, or asymmetric cryptography, is an encryption scheme that uses two mathematically related, but not identical, keys — a public key and a private key. Unlike symmetric key algorithms that rely on one key to both encrypt and decrypt, each key performs a unique function. The public key is used to encrypt and the private key is used to decrypt. ~globalsign.com

### What is RSA?
> RSA (Rivest–Shamir–Adleman) is a public-key cryptosystem that is widely used for secure data transmission. It is also one of the oldest. The acronym RSA comes from the surnames of Ron Rivest, Adi Shamir, and Leonard Adleman, who publicly described the algorithm in 1977. ~Wikipedia

![](https://miro.medium.com/max/760/1*Qs2hNe3N2U9dIYy8yU5_7g.png)


**To** understand this, I’ve prepared a small, simple and cute experiment in python3.
Here’s what we will do,

1. Create a File (relatively small,725 KB, for this demo.) with “Random” Printable ASCII one-liner data. (7,41,600 characters in this demo.)

2. Do the following routine for AES,RSA and AES+RSA (just read it now, will explain later what AES+RSA means) :-

|**(i)** Generate Keys for Encryption |**(ii)**Encrypt File |**(iii)**Decrypt File |**(iv)** Check MD5 hash of Original File v/s Decrypted file (should match)

3. Clock each of the above steps and the whole program runtime = RT

4. Take Avg.RT out of 5 Consecutive runs of each encryption and compare.

5. Provide the Results of some theoretical backbone.

# The Experiment
## Encryption Parameter Details

`RSA: Key_Length = 1024 bits |Mode = PKCS1_v1_5 |Encoding = base64`

`AES: checksum = SHA256 |Length = 32 |Salted = Yes |Iteration = 1,00,000 |Mode=Cipher Block Chaining (CBC)`

## Code
If you want to perform this experiment in your computer (which you should), here is my GitHub Repo containing all the code and an academic lab record which I summited for grading 👀

[CHECK THIS GITHUB REPOSITORY](https://github.com/Saket-Upadhyay/RSA-Large-File-Efficiency-Compare)

## Result

#### RSA Only:-

![](https://miro.medium.com/max/875/1*DWUDx1btcMmPG41sTI6Bdg.png)

In above screenshot, Result of RSA only bulk encryption clocked at 33.85 seconds!

#### AES Only:-

![](https://miro.medium.com/max/875/1*3MRO9OyviVY2ebEfPoHgPw.png)

In above screenshot, Result of AES only file encryption clocked at 0.32 seconds!

## Any explanation for this mayhem? Yes.

At last, most of the things in RSA breaks down to one thing, **SDMDPN** ...

<figure class="image">
  <img src="https://miro.medium.com/max/875/1*NsjYVpbs7Z_Tnm1btLjSyw.png" alt="image">
  <figcaption>Image Credits: <a href="https://www.google.com/search?q=Optimus+Prime">Optimus Prime</a> (Team Lead, Auto Bots Inc. )</figcaption>
</figure>

As the size of data increases, the process load increases and the whole thing ends up taking too much time to complete.

> Also, “As a rule of thumb, you can only encrypt data as large as the RSA key length. So, if you’ve got a 4096-bit RSA key, you can only encrypt messages up to 4096 bits long” ~[security.stackexchange.com](https://security.stackexchange.com/questions/33434/rsa-maximum-bytes-to-encrypt-comparison-to-aes-in-terms-of-security#:~:text=Given%20a%20message%20signed%20by,up%20to%204096%20bits%20long.)

On the other hand, AES is a simple symmetric crypto. it doesn’t play with such large primes, ultimately encrypts data fast.
But AES or any other symmetric key crypto. is super weak in comparison to RSA’s security and its anti-Bruteforce stance.

## The Balance of Speed and Security (AES+RSA)

<figure class="image">
  <img src="https://miro.medium.com/max/875/1*eIRJXLFi_pQcnqWI6I_kjQ.png" alt="image">
  <figcaption>In Frame: Late Mr. <a href="https://www.google.com/search?q=thanos">Thanos</a></figcaption>
</figure>


Well, PKC was never meant to encrypt large files, instead, we use it to encrypt AES’s encryption key. So we encrypt the large datafiles with good symmetric encryption and then we use strong public-key encryption to encrypt the key of symmetric encryption used to encrypt the large file and we share this encrypted Symmetric Key, and the encrypted File which can be decrypted with receiver’s private key.
And this is what all encryption tools mean when they say `"Encrypt with RSA"`

Here is the performance of the same in our experiment :

![](https://miro.medium.com/max/875/1*N3Wn4vZSAqCL0z2iKTvw7w.png)

In above result, AES+RSA bulk + key encryption clocked at 1.09 seconds!

## Mean Runtime Observation

![](https://miro.medium.com/max/875/1*XkG5y4pRCqFC2mrs4gBURg.png)

Image Src: My college assignment document :-)

# Conclusion

We can see from the above Mean RT table that why the standard approach is better and how poor RSA performs with large files.
And that’s why we don’t use RSA on large files, directly.


<center> . . . </center> 


#### Bonus Content

![](https://miro.medium.com/max/625/1*RCy53C9TF2s_fSai-nnl4Q.png)

**R.I.P. (x_x)**

But if you said RSA cannot encrypt more data than Key-Size then how did we encrypt the file with it?
Well, instead of encrypting the whole file, I divided the file into blocks of `86 characters` and then stored them in encrypted file line-wise, then to decrypt we read the file line-by-line and then decrypt and concatenate the results to get original data. 😬

...
