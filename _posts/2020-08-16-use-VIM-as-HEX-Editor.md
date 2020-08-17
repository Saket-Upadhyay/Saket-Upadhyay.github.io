---
layout: post
title: Use VIM as HEX editor like a boss  
tags:
  - Tricks
  - CTF
---

<div class="message">
VIM's already OP. Here's how to do more.
</div>

### Background

VIM in itself is a pretty powerful text editor, and the fact we can integrate this with other programs and scripts makes it stronger.

In this article, I want to share one such trick I learned recently to combine `vim` and `xxd` to edit a file at hex level.
This actually helps a lot in situations where we want a quick fix to something, let it be minor binary patching or some file header repair.

### xxd 
xxd creates a hex dump of a given file or standard input.  It can also convert a hex dump back to its original binary form.  Like, uuencode and uudecode(1)  it allows the transmission of binary data in a 'mail-safe' ASCII representation but has the advantage of decoding to standard output.
Moreover, it can be used to perform binary file patching.

`xxd <filename>` will give us hex dump of the file and `xxd -r <hexdump>` will resurrect the file back from hexdump and these are the two properties we will use with vim to edit the file in vim in its hex rep.

### How to?
> In this we will use the executable file with name ***executable***
> you can change this to your target file

#### Open the file in vim
`vim executable`
![](/assets/images/vim/1.png)

#### Execute `xxd` in vim
in the vim command type,

`: %!xxd`

![](/assets/images/vim/2.png)
this will convert the file to the hex rep.

![](/assets/images/vim/3.png)

#### Search for specific hex pattern
Searching is same as regular vim usage, pattern preceded by `/` 

`/837d fc00 752a`

![](/assets/images/vim/4.png)
Here I am searching for `752a` opcode which I want to patch in this case, in short, `75 = JNE` and `74 = JE` so this will change the flow of control in the application.

to know more about this check my [Taking over the software by Instruction Rewriting.](/article/2019/11/25/Taking-over-a-software-by-Instruction-Rewriting.html) article.

Now as we have the pattern we can just change the opcode `75` to `74` 

![](/assets/images/vim/5.png)

#### Reverse the HEX-dump into the binary file
again in vim command, type,

`:%!xxd -r`

![](/assets/images/vim/6.png)
this will convert it back to binary
![](/assets/images/vim/7.png)

#### Save, Exit and you're done.
`:wq`

is all it takes to complete the process.

### Conclusion 
We have edited the file at the hex level!

here is the quick check for the above `executable`, the file was `ELF x64 executable` duh! hence the name :-)

![](/assets/images/vim/8.png)

The first execution is before patching and the second is after the patch...

Well, at this point the article is over but if you are curious about what we exactly did above here it is ...

we compiled this program :

```cpp
#include<iostream>

using namespace std;

int main()
	{

		int x=0;
		if(x == 0){
			std::cout<<"zero"<<std::endl;
		}
		else{
			std::cout<<"not zero"<<std::endl;
		}

		return 0;
	}

```

And then patched the `if statement` by patching `75` opcode to `74`

in simple term converting `if(x == 0)` to `if(x != 0)` statement.

But as it said earlier, check out  [Taking over the software by Instruction Rewriting.](/article/2019/11/25/Taking-over-a-software-by-Instruction-Rewriting.html) article.


See ya in the next one! 

---
