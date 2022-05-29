---
layout: post
title: "Taking over by Instruction Rewriting."
author: Saket
date:   2019-11-25 12:12:12 +0530
image: https://miro.medium.com/max/1400/1*K_G78S10NaB8cpo5rCagRg.png
image_caption: 
---


<div class="message">
  Baby steps to binary rewriting and reverse engineering.
</div>


`"Almost every code we write and compile is converted into machine code and set of instructions."`

Pretty basic definition for what compiler does huh?

Well, let me re-frame that with respect to a reverse engineer’s point of view,
<!--more-->
`"It doesn’t matter if you write your code in C, C++ or C# it will be converted into machine code, which can be viewed as a common low level language, Assembly."`

In simpler terms, all we need to understand is the assembly of code and without having its actual source code we can conclude what it will do. Now what to do from here?

Imagine we got a program that will activate when provided with valid key, pretty common scenario right? You might say just buy the key, or download the crack etc. pretty boring solutions too… Now, what if I tell you, we can activate the program just by changing it’s binary, that too just 2–6 bytes! YES! And that’s what we will try to understand in this article.

Actually most of such programs use comparison statements to check if your key matches with the actual key or not, e.g. "if (input == key) {//do thing here}" etc.

And that very thing in assembly is done by "CMP" instruction and then followed by a "JMP" or similar instruction to shift the flow of controls according to the result of comparison.

---

### Let’s do it.

Let us make an application, this application works in the same fashion, check for the key and activate if matches. The program is written in C and compiled by the GCC compiler.

```c
#include <string.h>
#include <stdio.h>

int main(int argc, char *argv[]) {
        if(argc==2) {
		printf("Checking License: %s\n", argv[1]);
                int sum = 0;
                for (int i = 0; i < strlen(argv[1]); i++) {
			sum+= (int)argv[1][i];	
		}
		if(sum==1000) {
			printf("Access Granted!\n");
		} else {
			printf("WRONG!\n");
		}
	} else {
		printf("Usage: <key>\n");
	}
	return 0;
}
```

Here is one example where we use “saket” as the key.

![](https://miro.medium.com/max/1400/1*K_G78S10NaB8cpo5rCagRg.png)
As we expected it to behave, when provided with invalid key it will say “WRONG!”

When we observe the compiled binary in our favorite debugger we can see one instruction **“CMP [RBP+VAR_18], 394H”** that checks the string passed and then compares it with *(394)h =(916)d* that seems to be string length or something, the interesting part is that it is followed by **“JNZ SHORT LOC_400657”** instruction, which makes **EIP** or **instruction pointer** to point at 400657th location. In simple words, **shifts the control flow to 400657th** location in memory , and execute instruction from there. Further we can see that **LOC_400657** contains instructions of **WRONG KEY** part of software.

![](https://miro.medium.com/max/1400/1*QiRX5E9kSXkvrN7YyTFedg.png)
So what if we can just skip that jump statement and whatever the result of the CMP we will just continue to **Access Granted** part. To do that we will just **change jump address in HEX DUMP from “0C” to “00”** which will cause **EIP** to just continue to the next instruction.

For that we will go to the hex equivalent of the instruction in dump and change the value in target address.
![](https://miro.medium.com/max/1400/1*Ndw-9qh6-jx-Pw79bJhUiQ.png)
here we can observe JNZ instruction starts at 400649 (relative address), we can go to same in hex dump to get equivalent hex values.

![](https://miro.medium.com/max/1378/1*uxriK_ycJjHxt-aYJYJ-3w.png)

now we know that ***JNZ SHORT LOC_400649 ~ 75 0C;*** Now keeping JNZ intact, i.e. not changing 75, we can change 0C to 00 to try to null it’s effect. or we can just replace the next effective address,something like this :
![](https://miro.medium.com/max/1042/1*OLDef_3bUFDIOlGgpSA3rg.png)
But for this article, we will just replace 0C with 00…

THAT IS, THIS
![](https://miro.medium.com/max/121/1*9xX5CM7-5zkwUw-jLW_vsg.png)
TO
![](https://miro.medium.com/max/91/1*dUlh5aSmPdg0vdDGWOzXnw.png)
And now you can see our instruction continues to ACCESS GRANTED part, and no instruction points to WRONG KEY. That means we should be able to activate the software with any key we want!.

![](https://miro.medium.com/max/1400/1*BVYRUDW4dLcBwd2jCT16HQ.png)
Now let’s check that with the same key we provided, and just another key to check our modification.
![](https://miro.medium.com/max/1400/1*-In-V9fwv_pAMbyqhCYTJg.png)
![](https://miro.medium.com/max/1400/1*wZb8fjJzQLS1MKEV0gO2xA.png)
And that works pretty good!

### Conclusion

Binary rewriting in **real-world scenarios is much more complex** than this example, but anyways this is just introduction with the aim to get the us familiar with the concept.

I hope you enjoyed this, have a super productive day ahead !