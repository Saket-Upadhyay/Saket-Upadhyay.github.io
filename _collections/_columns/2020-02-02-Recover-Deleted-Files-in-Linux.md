---
layout: post
title: "Recover Files in Linux from Live Processes"
author: Saket
date:   2020-02-02 12:12:12 +0530
image: https://miro.medium.com/max/2000/1*iCZcVmfFRLe2poxYp8vHzg.png
image_caption:
---

<div class="message">
Recover recently deleted file (if it’s still open in some process) using properties of procfs
</div>


Ever deleted an important file while it’s still open in some other process?
or Someone opened a PDF file in your PC from pen drive and removed the pen drive while it’s still open in some PDF-Viewer and you wanted to save it first and now you are just not touching that process because that’s the last trace of that file left in your computer?

Well, luckily you have **procfs** to your rescue. Let’s check the definition :
<!--more-->


> **/proc** is very special in that it is also a virtual filesystem. It’s sometimes referred to as a process information pseudo-file system. It doesn’t contain ‘real’ files but runtime system information (e.g. system memory, devices mounted, hardware configuration, etc). For this reason it can be regarded as a control and information centre for the kernel. In fact, quite a lot of system utilities are simply calls to files in this directory. For example, **‘lsmod’** is the same as ‘**cat /proc/modules’** while ***‘lspci’ is a synonym for ‘cat /proc/pci’***. By altering files located in this directory you can even read/change kernel parameters (sysctl) while the system is running.

<sup>source : <a href="https://www.tldp.org/LDP/Linux-Filesystem-Hierarchy/html/proc.html">www.tldp.org</a></sup>



### Setup.

For this demonstration we just need one pdf file and... well that’s it!

*[I am using Ubuntu 18.04 LTS for this demo.]*

### How to.

Let’s follow this step-by-step.

#### STEP 0:

Open the PDF file with default PDF viewer.

![](https://miro.medium.com/max/1400/1*ZbJE03T5B3HXw4yuf_cnMQ.png "PDF document open in a PDF viewer (Ubuntu 18.04 LTS)")

#### STEP 1:

DELETE THE FILE. FROM THE FOLDER. P E R M A N E N T L Y.

![](https://miro.medium.com/max/1280/1*7rcljwEYNFzH2cY-lPXEmw.png)
![](https://miro.medium.com/max/552/1*36beTPYYSIqjvCgSZrvK-g.png)

#### STEP 2:

Now as we have deleted the file, let’s get on work to recover that.

Let’s fetch our PDF viewer’s PID (Process ID) using “ps”

What’s pid you might ask? here…

> the process identifier (a.k.a. process ID or PID) is a number used by most operating system kernels — such as those of Unix, macOS and Windows — to uniquely identify an active process.

<sup>source : <a href="https://en.wikipedia.org/wiki/Process_identifier">WikiPedia</a></sup>

![](https://miro.medium.com/max/2000/1*iCZcVmfFRLe2poxYp8vHzg.png)

so now we have our PID = **5201.**

#### STEP 3:

Let's go to /proc/**\<pid\>**,yes that’s how your Linux PC keeps track of processes.

In our case it’s ***/proc/5201/***

![](https://miro.medium.com/max/2000/1*oiitajakNYIaKFXmPYlD6Q.png)

#### STEP 4:

We will now try to locate the file descriptor for our target file in the process, file descriptor? here you go…

> A **file descriptor** is a number that uniquely identifies an open file in a computer’s operating system. It describes a data resource, and how that resource may be accessed.

Now, go to “fd” (file descriptor) folder.

![](https://miro.medium.com/max/2000/1*YzcnPHuUv8vMMJs_wlcBZw.png)

We can see that **file descriptor 14** points to our ex-impotant-ish file DocumentPDF.pdf and smartly shows “(deleted)” status after it.

But our program still has access to the PDF file and it’s open there, so how? ‘cause file descriptor points to the file’s actual real-time location from which the program is using it,so if not on disk then in memory.

#### STEP 5:

Just “cat” the file pointer to some other location, and that’s it!

![](https://miro.medium.com/max/2000/1*BKXfsQkGCjjCiQmJgN9qog.png)

Here we write the file bit-wise to **“restore.pdf”** using ‘cat’.

![](https://miro.medium.com/max/1024/1*c9Ht4a7Lm8CQavq7l-6sOQ.png)

AND BAM !!! We have our file back.

![](https://miro.medium.com/max/1400/1*naQC7KHea6tIdED5Tn9a1A.png)

### Conclusion

This is one of the things I found interesting enough while reading about Linux file system and mysteries of it’s file and process management techniques, which was worth sharing.

### From Here ...

[PROCFS](https://en.wikipedia.org/wiki/Procfs)

[All You Need To Know About Processes in Linux](https://www.tecmint.com/linux-process-management/)

[What is a File Descriptor?](https://www.computerhope.com/jargon/f/file-descriptor.htm)


---
