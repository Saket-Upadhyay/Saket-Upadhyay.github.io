---
layout: post
title: Shifter2 [CipherCombat2.0 CTF write-up]
tags:
  - CTF Writeup
  - CTF
---

<div class="message">
Reverse Engineering Challenge of Hacker Earth CipherCombat2.0
</div>
<!--more-->
![](https://miro.medium.com/max/986/1*5HJibwnLn_XKQpwXrS_AJg.png)

### What we get?

A zip file with password “hakerearth”… In there we find a PNG image

![](https://miro.medium.com/max/1400/1*0grm3yTRon_G1N1rVhir4Q.png)

Checking the file for strings and embedded files we find nothing, and this is reverse engineering challenge so we will not go for stenography mumbo jumbo.

### Let’s Solve this

Looking at the image, we can see it’s Graph representation of assembly code, and here is the image we get :-

![](https://miro.medium.com/max/3510/1*L7e4TQtggVNv8lVNdJayWw.png)

Now let’s try to understand what this is trying to do.

#### 1st Block

![](https://miro.medium.com/max/1000/1*4Wqzg1mliI6Icey6dz102Q.png)

The first block is our MAIN() function taking some arguments

```c
int main(int argc,char **argv,char **envp);
```

    argc = no of arguments

    argv = argument pointer

    envp = enviornment pointer

    It initializes bunch of variables and then stack setting routine.

we also see that it compares argc with 1 followed by JE condition

checking number of arguments should be equal to 2, argv\[0\] is always program name and argv\[1\] is our supplied password. That means we have to give **exactly ONE parameter** to the program.

![](https://miro.medium.com/max/1000/1*WrOeYnyhUO_IukWtAGUb8Q.png)

If the condition is not satisfied it’s putting 1 in EAX (that’s our return register) and then returning from the main() routine, that’s equivalent to `exit(1);`, but here implemented through `return 1;`

#### 2nd Block

![](https://miro.medium.com/max/1000/1*pkXCvu2IckRwOkC4UCNHXg.png)

Most of this block is just initialization of some variables and then a jump statement to get to next block.

also interesting thing to notice is that address spaces are separated by 4bytes each, looks similar? Yes, it’s character **array allocation of 15 characters.**

then it sets **var_4h = 1**

Let’s start building the program to side by side…

![](https://miro.medium.com/max/2000/1*ucuhdJV_NSM0XJqK_LZnWw.png "Array Recreated in Python")

#### 3rd Block

![](https://miro.medium.com/max/1000/1*baW1SBXF4GzcBL_vmlhuVg.png)

Now this looks like

    Initialize a var > do something > add 1 to it> check if var =>0xf i.e (15)base > repeat

Looks familiar? loops something with increasing variable?

It’s nothing but a **for()/while()** loop implementation which iterates for 15 times, same as our character array length.

so let’s define it as 

```c
for(int i=1;i≤15;i++){ loop body }
```
also, at the end of loop body it compares something and if it fails it shows “Better Luck next time” and then exit.

Other wise it completes the loop and exit with “c0ngrats!” message.

#### The Loop Body

![](https://miro.medium.com/max/898/1*zsGBKxn_DxW26ofiVq6_Bw.png)

The loop body is pretty interesting, it might look intimidating to new reverse engineer but it’s really simple.With some experience, you can already tell what it’s doing.

Let’s have a look at it.

now as we know it’s a loop and var_4h is our control variable let’s call it “i”. First we load the value of i in EAX, then we load the address of rax*8 to RDX, and then move our ARGUMENT(var_60h) into RAX. Then we do logical and RAX,RDX and mov Quad Word value at address of RAX to RAX, now we Move with Zero extended (movzx) byte value of RAX to …… ahhhhh… i am pretty sure this does not make it easier for you to understand it, all i am doing is dictating the instructions one by one…

> Know this : Look at it, remember the pattern and know that it is one of the methods compilers implement **fetching an element at some given index.**

You can ofcourse take some values yourself and try this but the full explaination is out of scope for this writeup, also it will make it boring and long enough.

Some important instruction reference (links):

[Convert Doubleword to Quadword (CDQE)](https://www.felixcloutier.com/x86/cbw:cwde:cdqe)

[Move with Zero-Extend (MOVZX)](https://www.felixcloutier.com/x86/movzx)

[Move with Sign-Extension (MOVSX)](https://www.felixcloutier.com/x86/movsx:movsxd)

Okay so what it actually did? Lemme explain:

1. Take value at \[i-1\] index from our argument **=argv\[i-1\] let’s say = arg**
2. Take value at \[i-1\] index from our character array = charp\[i-1\]
3. Add i to our charp = charp\[i-1\]+i
4. Add 1 to Step3 = **charp\[i-1\]+i+1 , let’s say = charpnew**
5. Compare **arg == charpnew**.

![](https://miro.medium.com/max/200/1*bdGkZ4cylX17rnq36F7DJA.png)

These instructions are responsible for step 3 and 4, remember we stored our i in EAX ? and then we add EAX (i.e. i )to ECX, our element which is stored in EAX and then again add 1 to new EAX.

and now converting it to code we have :

![](https://miro.medium.com/max/1324/1*SnTdBpFKV0kYQU_rqXCEvA.png "Code reversed from Assembly Graph")

Now instead of checking the flag we can print it !!

Here’s is relatively clean Python Implementation of above algorithm, Running it spits out the flag.

```python
#!/bin/python3
given_array=[0x71, 0x65, 0x65, 0x61, 0x6e, 
             0x2c, 0x6a, 0x56, 0x68, 0x5a,
             0x68, 0x68, 0x64, 0x5f, 0x63]

for i in range(1,len(given_array)+1):

    print(chr(given_array[i-1]+i+1),end='')


print("\n")
```

![](https://miro.medium.com/max/1400/1*-Cw8YRpP7UzyLHpl7eFzWg.png)

And we got the flag **HE{shift3r_returns}** we can also check it with the C++ program we reconstructed.

![](https://miro.medium.com/max/2000/1*TKgw7s99BDWM9zeHEcGHew.png)

That’s it for this challenge, actually an easy one, just some basic experience in reverse engineering needed.

---