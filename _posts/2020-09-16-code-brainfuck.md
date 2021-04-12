---
layout: post
title: How to code in BrainF*ck without Losing Your Mind…
tags:
  - Brain Fuck
  - esoteric language
---

<div class="message">
A DETAILED GUIDE ON BRAINF*CK FOR BEGINNERS AND ENTHUSIASTS.
</div>



# WTF?

> Brainfuck is the most famous esoteric programming language, and has inspired the creation of a host of other languages. Due to the fact that the last half of its name is often considered one of the most offensive words in the English language, it is sometimes referred to as brainf***, brainf*ck, brainfsck, b****fuck (as a joke), brainf**k, branflakes, brainoof, brainfrick, or bf.

## First Things First

![](https://miro.medium.com/max/1000/1*Q2S8AWxhbnfb5VDyX5QOFg.jpeg)

> Note : After reading this article, be prepared to FLEX ᕦ(ò_óˇ)

# F\*\*king Basics !

BF operates on an array of memory cells, each initially set to zero. The size of the array is not defined as standard but was 30,000 cells long in initial implementation. But this can be different depending on the implementation. Also generally the value of each cell is between the range (0–255) and if somehow it goes beyond this, it is reset to the nearest integer (i.e. 0–1=255 and 255+1=0).

### 8 Operators

There are total 8 operators in BF,
![](https://miro.medium.com/max/565/1*Gsqky7OwV_d4xG56dZsvhw.png)

Anything other than `+-<>,.[]` is ignored in original basic implementation. And I think it’s genius ! These are just the simple operations one needs to do basic programming.

### Stack Manipulation

Our overall goal is to control the values and pointers of stack to get the output we want. More on it later.

# Understanding Each Operation
## Pointer Shift { < > }:

The right shit `>` operation will **shift the stack pointer to right by 1 step** and, left shift operation `<` will decrement the stack pointer position by 1, that means it will **shift stack pointer to left by 1 step.**

## Increment & Decrement { + - } :

The increment and decrement operations `+ —` manipulate the **values AT location of stack pointer**, Increasing or Decreasing them by 1.

## Input & Output { , . }:

These do that they say they do, `.` will **print the ASCII representation of value stored in current pointer location**. And `,` will **take input** and write it at current pointer location.

## Looping { [ ] }:

This concept is relatively difficult to understand (with respect to above operations) at first, but once you do, you are golden.

So anything between `[` and `]` is considered a loop, whenever `[` is encountered it checks the value at current stack pointer if it’s not zero (0) it will continue to execute code after it, but if it is zero (0) then it will skip to the code after corresponding `]` .

If `]` is encountered, it will continue the code (i.e. will not loop) if value at current stack pointer is zero, otherwise it will execute code after corresponding `[` encountered earlier.

# Elemental C++ Representation :

So you know some basic C++? Cool! this might help you :

```cpp
#include<iosteam>
using namespace std;
int main()
{
  int STACK[100]; //ALLOCATION OF 100 ELEMENTS ; CELLS
  int *iptr; //INIT STACK POINTER
  
  iptr=&STACK; //ASSIGN POINTER TO 1ST ELEMENT 
  
  // < > OPERATION 
  
  iptr++; // > 
  iptr--; // <
  // =================================
  // + - OPERATION
  
  *iptr++; // +
  *iptr--; // -
  // =================================
  // , . OPERATION
  cout << *iptr; // .
  cin >> *iptr; // ,
  // =================================
  // [ ] OPERATION
  :openloop
   
  if(*iptr == 0)   // [
    goto closeloop;
  else:
    continue
      
   // EXECUTE CODE BETWEEN [...] 
      
  if(*iptr == 0)  // ]
    goto closeloop;
  else:
    goto openloop;
  
  :closeloop
  // =================================
  //AFTER PROGRAM ENDS
  delete iptr;
  return 0;
}
```

# Program Visualization

Let us see what we mean by stack operation and everything we talked about earlier.

![](https://miro.medium.com/max/700/1*NHYuHQe5kN0PieJf9Ux0pw.png)

In the above stack let’s see what basic operations do:

If we just execute `+` we will see that the value of current stack pointer position is incremented by 1.

![](https://miro.medium.com/max/700/1*wey5AOgk-Lz0csLD-8ILCA.png)

If we do `++++++++++` , (i.e. 10 times `+`)we will see ...

![](https://miro.medium.com/max/700/1*_RguzUdIsRWWTezd0nKvRQ.png)

Now let’s do `>` and we will see that the pointer to stack moves to right by 1 step.
![](https://miro.medium.com/max/700/1*4HMgqaYUKiZG7IZGK5TBQw.png)

Easy right? Let’s try this : +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++>++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++>+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

Just so that you don’t start counting, it’s 65 times `+` then `>` then 66 times `+` then `>` then 67 times `+` . So this will give is 65,66,67 in consecutive cells.

![](https://miro.medium.com/max/700/1*3VBqWGYO48xcnpYCFnnm6Q.png)

Now these values are ASCII Equivalent of `A`,`B` and `C` respectively, let’s check out .

So let’s go back 2 cells by `<<` and then print its content by a `.` , that should print ASCII of `65 -> A` . So the code becomes : 
!()[https://miro.medium.com/max/700/1*DPmWgoj1ZmibCtNbrwp1cw.png]
!()[https://miro.medium.com/max/700/1*2p5hukZe9L1lboAs6YviVQ.png]

Awesome! Now if we shift right by one step and print the ASCII and then again shift right and print, we will get complete `ABC` So can you tell me the code we need to add to achieve this?

Yes, we can just add `>.>.` to our above created program, which will give us :

`+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++>++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++>+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++<<.>.>.`

And this will result in :

![](https://miro.medium.com/max/700/1*F19DlYVSHkEAeVgmhiysFA.png)
![](https://miro.medium.com/max/700/1*wh_px3pKF0iV3dl0yrqQyg.png)

In this way we can print anything we want !!

# Un-F\*\*king “Hello World”

Now you know how to print ASCII characters, so can you print “HELLO WORLD” by using above discussed method?

For your reference here are the ASCII codes for all the characters of “Hello World”

![](https://miro.medium.com/max/700/1*yBH6mj6Er13uzA4-Z1T5Sw.png)

So simple approach is increase the value of current cell to our ASCII value then print it with `.` and move on to next cell by `>` and then repeat until we get our output.

Following similar strategy we will have this code :

```
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.>+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.>++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.>++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.>+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.>++++++++++++++++++++++++++++++++.>+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.>+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.>++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.>++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.>++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++.
```
This will give us :
![](https://miro.medium.com/max/700/1*TB7wPvLMe1vnerFvNnEySQ.png)
![](https://miro.medium.com/max/700/1*U1ss5cFBdiERyyDVB5Wyew.png)
![](https://miro.medium.com/max/556/1*wN_9lCyKH79sTEKuyT3xQQ.gif)

# Code Optimization
## Looping : Optimization Part 1

First of all, Congratulations! You have made your first program in BF.

Now, let’s optimize it. It’s actually simple, just answer this;

>     Q: How can we represent 65?

>    Ans 1: 1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1
> 
>   Ans 2: “(10x6)+5“ OR “13 x 5”

If we observe, we **wrote our previous program using 1st logic**, now **let’s do it using 2nd logic**.

The multiplication is nothing but continuous addition right? and we know that we can do something over and over again via loops, so, let’s try this.

`+++++[>++++<-]` This will increment value of 2nd cell by 20.

![](https://miro.medium.com/max/700/1*NAdy8OfdrsrhPLtboqD9wA.png)

How? Simple, How many `+` are there in cell 1? (ans = 5), now refer to the logic we discussed earlier via C++ program. The loop will execute until this value is zero.

Code inside loop : `>++++ <-` This will move pointer to next cell, add 4 to it, go back to previous cell and subtract 1 from it, and repeat.

Then the loop will check the value of the pointer (i.e. element 1) and run the code till it’s zero.

Now if we add 4 to the next cell 5 times we will get 20 (4x5) as it will take 5 turns to zero out 1st element (-1x5 = -5). Let’s see this step by step, **(Bold and <ins>underlined</ins> instruction(s) is(are) under execution)**

![](https://miro.medium.com/max/694/1*Z08qrfPrwjH2RTVI-kwPbA.gif)

### Step by Step Loop :


<img src="https://miro.medium.com/max/225/1*Hgyt3qTiKFIz_CCsFpoHrg.png">

<p><ins>+++++</ins>[>++++<-]</p>

<img src="https://miro.medium.com/max/225/1*XcJJWdseIksgvUT-6dvNsA.png">

<p>+++++[<ins>></ins>++++<-]</p>


<img src="https://miro.medium.com/max/224/1*dRigsXKUKYVjKJ-1ag-ddQ.png">
<p>+++++[>++++<-]</p>

<img src="https://miro.medium.com/max/193/1*STSNMmRBsDmLPMsU71lztQ.png">
<p>+++++[>++++<-]</p>


<img src="https://miro.medium.com/max/224/1*1MeprlDwLP0gu7mcCQFXKA.png">
<p>+++++[>++++<-]</p>

<img src="https://miro.medium.com/max/224/1*4NwPWExJydTU9Uha0PBe9g.png">
<p>+++++[>++++<-]</p>

<img src="https://miro.medium.com/max/195/1*jBXgyFTaGHRrL4EGZ0iwcg.png">
<p>+++++[>++++<-]</p>

<img src="https://miro.medium.com/max/223/1*FT0GkhsokXMdvetpIIduZg.png">
<p>+++++[>++++<-]</p>


<img src="https://miro.medium.com/max/223/1*uYAozkN-nK62m3wLBuhmLQ.png">
<p>+++++[>++++<-]</p>


<img src="https://miro.medium.com/max/223/1*ung9lbvL-zB-cABAaQafKA.png">
<p>+++++[>++++<-]</p>

<img src="https://miro.medium.com/max/225/1*a8f9V1kdkpSb20y5SYP2Rw.png">
<p>+++++[>++++<-]</p>


Now as we have 0 at pointer location, `]` will NOT return to `[` and will end the loop.

*Phew.. that was lots of screenshots*

Okay now instead of increasing the value of each element by `+` we can use loops to get the nearest value and then add or subtract minor digits to get our desired result.

That being said, can you now try to understand this code? (I've commented the logic too) :


```c

+++++ +++++ //LOOP 10 TIMES
[
>+++++ ++ //SET VALUE TO 10x7=70
>+++++ ++ //SET VALUE TO 10x7=70
>+++++ +++ //SET VALUE TO 10x8=80
>+++++ +++ //SET VALUE TO 10x8=80
>+++++ +++ //SET VALUE TO 10x8=80
>+++
>+++++ ++++ //SET VALUE TO 10x9=90
>+++++ +++ //SET VALUE TO 10x8=80
>+++++ +++ //SET VALUE TO 10x8=80
>+++++ +++ //SET VALUE TO 10x8=80
>+++++ ++ //SET VALUE TO 10x7=70
<<<<<<<<<<<-
]

// Now we do minor adjustments to all values and print

>++. // 70 + 2 = 72 -> H
>-.  // 70 -1 = 69 -> E
>----. // 80 -4 = 76 -> L
>----. // 80 -4 = 76 -> L
>-.  // 80-1 = 79 -> O
>++. // 30+2 = 32 -> space
>---.  // 90-3 = 87 -> W
>-.  // 80-1= 79 -> O
>++. // 80+2 = 82 -> R
>----. // 80-4 = 76 -> L
>--. // 70 -2 = 68 -> D

```

The first part of stack setting will give us :

![](https://miro.medium.com/max/413/1*4dnWvOWrsi2TBEK_meyn-w.png)

![](https://miro.medium.com/max/694/1*npFw5TR6dnOEz0wBs5ZGkw.gif)


And then after minor adjustments we get :
![](https://miro.medium.com/max/410/1*PQQv3km8yL-8Bp4413BcuQ.png)

![](https://miro.medium.com/max/700/1*1JJ64SclUoX1R6D1vYaGIQ.png)

So the overall compressed code looks like:

```c
++++++++++[>+++++++>+++++++>++++++++>++++++++>++++++++>+++>+++++++++>++++++++>++++++++>++++++++>+++++++<<<<<<<<<<<-]>++.>-.>----.>----.>-.>++.>---.>-.>++.>----.>--.
```

Way better than previous mammoth. But we can still reduce it. How? By reusing values. Suppose we have to print `HE` , `H = 72` and `E = 69` So **why count again to 70 and subtract 2 if we can get same by subtracting 4 from H?**

## Reusing Values : Optimization Part 2

Let’s observe our string and stack again :

In `"HELLO WORLD"` : `Letter Count -> Hx1, Ex1, Lx3, Ox2, Wx1, Dx1`

That means **we can reduce at least 3 cells just by reusing `L` and `E` .**

Also, `H -4= E -1 = D` We need only 1 cell for these 3 characters

`O -3 = L` We need only 1 cell to show `O` and `L` and `W — 5 = R` , 1 cell for `W` and `R` .

So at last we only need **3 cells for all letters of `HELLO WORLD`** and **+1 for loop control** and **+1 for blank space** = **total 5 cells for whole program instead of 12 we used earlier**. We have **reduced our memory usage to ~40%** of previous implementation! That’s some good optimization! Well done.

Now the code becomes :

```
+++++ +++++ //LOOP 10 TIMES
[
>+++++ ++   //SET VALUE TO 10x7=70
>+++++ +++  //SET VALUE TO 10x8=80
>+++        //SET VALUE TO 10x3=30
>+++++ ++++ //SET VALUE TO 10x9=90
<<<<-
]

//NOW WE DO ADJUSTMENTS

>++.      // 70 + 2 = 72                   -> H
---.      // 72 - 3 = 69                   -> E
>----.    // 80 - 4 = 76                   -> L
.         // USING AGAIN TO PRINT          -> L
+++.      // 76 + 3 = 79                   -> O
>++.      // 30 + 2 = 32 -> SPACE
>---.     // 90 - 3 = 87                   -> W
<<.       // REUSING CELL 3                -> O
>>-----.  // 87 - 5 = 82                   -> R
<<---.    // REUSING CELL 3 -> 79 - 3 = 76 -> L
<-.       // REUSING CELL 2 -> 69 - 1 = 68 -> D 

//FINAL CODE :
++++++++++[>+++++++>++++++++>+++>+++++++++<<<<-]>++.---.>----..+++.>++.>---.<<.>>-----.<<---.<-.
```

Final Code = 
``` 
++++++++++[>+++++++>++++++++>+++>+++++++++<<<<-]>++.---.>----..+++.>++.>---.<<.>>-----.<<---.<-.
```

Which results in following stack :

![](https://miro.medium.com/max/192/1*fc2nR_jnvULxmj-BHFGqzw.png)

![](https://miro.medium.com/max/694/1*-Rm2IOar5d6dBeple1jyoQ.gif)

![](https://miro.medium.com/max/191/1*Gls3qoyYnRX_V9DDboDPhA.png)

![](https://miro.medium.com/max/694/1*OZX4LJ9CxFmUX7ir0NSlYg.gif)

![](https://miro.medium.com/max/700/1*1JJ64SclUoX1R6D1vYaGIQ.png)

**AWESOME! & CONGRATS! now you have your own First Program in an Esoteric Language, Whatta Skill !**

ᕙ(⇀‸↼‶)ᕗ

(╯°□°）╯︵ ┻━┻

---

# Further Practice and Conclusion

So that’s it ! Now I hope you will be able to write basic BF Codes and Flex your new skill to other geeks.

One of the main skill to be developed by anyone who is programming is power of visualisation. One should be able to run the code in mind to certain degree to write effective code in any langauge, this might require more of that.

BF is easy to learn and kinda hard to write code in. You need to plan your strategy in your mind before writing code. but this also stresses those brain cells which might help you grow your code-imagination power!

Start with these simple questions and then release your imagination deamon:

>   Q : Write a program in BF to print all ASCII printable characters

>    Q : Write a program in BF to print your name.

>   Q : Optimise these two programs in two ways:

>    a. Minimum Code

>    b. Minimum Memory

# Advance Programs

[This Repository](https://github.com/fabianishere/brainfuck/tree/master/examples) contains lots of good and complex codes to play around with.

# Below is a program I made, (Password Vault in BF)

> This program prints “SRT MSG” when provided correct key “P A S S” in ASCII or “80 65 83 83” in decimals; It takes 4 inputs for 4 characters. Then does ROT13 operation on the password characters and then maps the characters with reference to the calculated numbers and then prints the message using that character map.

[Check it out HERE](https://github.com/Saket-Upadhyay/brainfuck/blob/master/examples/password-vault.bf)
```c
\\ This program prints "SRT MSG" when provided correct key "P A S S" in Ascii or "80 65 83 83" in decimals; It takes 4 inputs for 4 characters. Then does ROT13 operation on the password characters and then maps the characters with reference to the calculated numbers and then prints the message using that character map. 
\\ Copyright (c) 2020 Saket Upadhyay [https://github.com/Saket-Upadhyay]
\\ Distributed under MIT License.
++++[++++>---<]>++.-[--->+<]>++.++++++.+++[->+++<]>.+++++++++++++.[-->+++++<]>+++.[-->+++++<]>.[------->++<]>+.--[--->+<]>--..++++.--------.+++.--------------.[----->+++<]>++.<<<<<<<<++[>+++++<-]>.[-]<,[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>++++++++++++++<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>>+++++[<----->-]<<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>++++++++++++++<-[>+<-[>+<-[>+<-[>+<-[>+<-[>++++++++++++++<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>>+++++[<----->-]<<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>++++++++++++++<-[>+<-]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]>.<]>>,[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>++++++++++++++<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>>+++++[<----->-]<<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>++++++++++++++<-[>+<-[>+<-[>+<-[>+<-[>+<-[>++++++++++++++<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>>+++++[<----->-]<<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>++++++++++++++<-[>+<-]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]>.<]>>,[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>++++++++++++++<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>>+++++[<----->-]<<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>++++++++++++++<-[>+<-[>+<-[>+<-[>+<-[>+<-[>++++++++++++++<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>>+++++[<----->-]<<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>++++++++++++++<-[>+<-]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]>.<]>>,[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>++++++++++++++<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>>+++++[<----->-]<<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>++++++++++++++<-[>+<-[>+<-[>+<-[>+<-[>+<-[>++++++++++++++<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>>+++++[<----->-]<<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>+<-[>++++++++++++++<-[>+<-]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]>.<]<<<<<++++++++++++++++.>>++++.++.<++++++++++[>>+++<<-]>>++.>+++++++.<<<<.>>>>------.


```

---


