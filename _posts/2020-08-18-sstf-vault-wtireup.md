---
layout: post
title: Samsung CTF App Reverse Eng. Writeup 
tags:
  - CTF Writeup
  - CTF
  - FrigidSec
---

<div class="message">
A writeup of Reverse Engineering Challenge of Samsung CTF "Hacker's Playground 2020"
<br>
Points : 500
<br>
Solves : 15
</div>

### Background
I took part in Samsung's CTF event and tried to do some reverse engineering challenges, I was able to solve one but the sad part is i got the flag 1 min. after timeout so the points were not added :(

Anyways this post is about my approach to the solution and the things learned from the challenge, so let's get into that.


### What we get as question.
A file named `Vault101.0.1-release.apk` and a banner saying `Can you get the password?`

#### Brief 
The main goal of this challenge is `Security in obsecurity is not enough` and we will get to know this as this application is heavily obfuscated and encrypted. But the weakness being once you understand the working and decode the obfuscation the data and the key is hardcoded and is not being obtained by some server or keystore.

That being said let's get into analysis. My approach in this is majorly Static Analysis and we will be using some custom scripts to recreate encryption algorithms. So this is gonna be long and detailed, I also wrote a smaller and compat version on Medium for all the people who don't have enough time in life. [READ IT HERE IF YOU ARE ONE OF THEM](https://medium.com/@saketupadhyay/vault-101-samsung-ctf-android-reverse-engineering-challenge-write-up-d5a2b16a9212)

### Decompilation and Initial Analysis 
![](/assets/images/sctf/ldt.jpg)
We can decompile the application via anything we feel comfortable with, I chose `JADX` as this gives reasonable java code for the android application with usable directory structure.

After decompilation the first step is pretty ususal for everone i think and that is _finding the Main.java_ file as this is usually responsible for initial code of the application _(and complication_

So after decompilation we got the following structure and it's generally easy to find the `Main.java` at `./source/com/vendorname/.../Main.java` and that works here too as we are greeted with the files below :
We found ours at `sources/com/sctf2020/vault101/`

![](/assets/images/sctf/mainfile.png)

And here is `Main.java` :

```java
package com.sctf2020.vault101;

import a.b.k.e;
public class MainActivity extends e implements OnClickListener {
    public EditText p;
    public Button q;
    public AnimatedVectorDrawable r;
    public volatile b.c.a.b s;
    public ServiceConnection t = new a();
    public class a implements ServiceConnection {
        public a() {}
        public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
            MainActivity.this.s = b.c.a.b.a.b(iBinder);
            MainActivity mainActivity = MainActivity.this;
            mainActivity.q.setOnClickListener(mainActivity);
        }
        public void onServiceDisconnected(ComponentName componentName) {
            MainActivity.this.s = null;
            MainActivity.this.q.setOnClickListener(null);}}
    public class b implements TextWatcher {
        public b() {}
        public void afterTextChanged(Editable editable) {
            MainActivity.this.q.setEnabled(editable.length() > 0);
        }
        public void beforeTextChanged(CharSequence charSequence, int i, int i2, int i3) {}
        public void onTextChanged(CharSequence charSequence, int i, int i2, int i3) {}
}
    public void onClick(View view) {
        try {
            boolean a2 = this.s.a(this.p.getText().toString());
            Toast toast = new Toast(this);
            toast.setView(getLayoutInflater().inflate(a2 ? R.layout.toast_success_layout : R.layout.toast_fail_layout, (ViewGroup) findViewById(R.id.custom_toast_container)));
            toast.setGravity(17, 0, 0);
            toast.setDuration(1);
            toast.show();
            if (!a2) {this.p.getText().clear();}
        } catch (RemoteException e) {e.printStackTrace();}
    }
    public void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        setContentView((int) R.layout.activity_main);
        this.q = (Button) findViewById(R.id.button);
        EditText editText = (EditText) findViewById(R.id.editText);
        this.p = editText;
        editText.addTextChangedListener(new b());
        AnimatedVectorDrawable animatedVectorDrawable = (AnimatedVectorDrawable) ((ImageView) findViewById(R.id.imageView)).getDrawable();
        this.r = animatedVectorDrawable;
        animatedVectorDrawable.start();
        bindService(new Intent(this, VaultService.class), this.t, 1);
    }
    public void onDestroy() {
        super.onDestroy();
        unbindService(this.t);
    }
    public void onResume() {
        super.onResume();
        this.r.start();}}
```

_I have Removed the import part to save space_

After a brief walkthrough over code, we can see how we get our `GOOD PASSWORD` or `BAD PASSWORD` messages.
Check out this part :

```java
 try {
            boolean a2 = this.s.a(this.p.getText().toString());
            Toast toast = new Toast(this);
            toast.setView(getLayoutInflater().inflate(a2 ? R.layout.toast_success_layout : R.layout.toast_fail_layout, (ViewGroup) findViewById(R.id.custom_toast_container)));
            toast.setGravity(17, 0, 0);
            toast.setDuration(1);
            toast.show();
            if (!a2) {
                this.p.getText().clear();
            }

```

So when we get `true` from `boolean function this.s.a()` we say password is accepted.

Also note that you won't find any `s\a.java` in the folder structure, because see this :

```java
public volatile b.c.a.b s;
```

It's actually `b.c.a.b.a()` .

So let's go analyse all these crazy functions...

### Deep Analysis and Finding Obfuscation

![](/assets/images/sctf/deep.jpg)
Let's analyse all the functions, plan is simple we will go branch by branch, i.e. : 
> first analysise function X and if it calls Y we will go and check Y and come back when it returns.

So back to our class `b.c.a.b`'s function `a()` :

This is out `b.java`
```java
package b.c.a;
import android.os.Binder;import android.os.IBinder;import android.os.IInterface;import android.os.Parcel;
public interface b extends IInterface {
    public static abstract class a extends Binder implements b {
        public static class C0039a implements b {
            public IBinder f822a;
            public C0039a(IBinder iBinder) {
                this.f822a = iBinder;
            }
            public boolean a(String str) {
                Parcel obtain = Parcel.obtain();
                Parcel obtain2 = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken("com.sctf2020.vault101.IVault");
                    obtain.writeString(str);
                    boolean z = false;
                    this.f822a.transact(1, obtain, obtain2, 0);
                    obtain2.readException();
                    if (obtain2.readInt() != 0) {z = true;}
                    return z;
                } finally {
                    obtain2.recycle();
                    obtain.recycle();}}
            public IBinder asBinder() {return this.f822a;}}
        public a() {attachInterface(this, "com.sctf2020.vault101.IVault");}
        public static b b(IBinder iBinder) {
            if (iBinder == null) {return null;}
            IInterface queryLocalInterface = iBinder.queryLocalInterface("com.sctf2020.vault101.IVault");
            return (queryLocalInterface == null || !(queryLocalInterface instanceof b)) ? new C0039a(iBinder) : (b) queryLocalInterface;
      }
        public IBinder asBinder() {return this;}
        public boolean inTransact(int i, Parcel parcel, Parcel parcel2, int i2) {
            String str = "com.sctf2020.vault101.IVault";
            if (i == 1) {
                parcel.enforceInterface(str);
                boolean a2 = a(parcel.readString());
                parcel2.writeNoException();
                parcel2.writeInt(a2 ? 1 : 0);
                return true;
            } else if (i != 1598968902){return super.onTransact(i, parcel, parcel2, i2);} else {
                parcel2.writeString(str);return true;}}}
 boolean a(String str);
}
```

so we called `a(String _ourinput_)` so this implimentation of `a()` in class `b.java` will be called : 

```java
public boolean a(String str) {
                Parcel obtain = Parcel.obtain();
                Parcel obtain2 = Parcel.obtain();
                try {
                    obtain.writeInterfaceToken("com.sctf2020.vault101.IVault");
                    obtain.writeString(str);
                    boolean z = false;
                    this.f822a.transact(1, obtain, obtain2, 0);
                    obtain2.readException();
                    if (obtain2.readInt() != 0) {
				 z = true;
                    }
                    return z;
                } finally {
                    obtain2.recycle();
                    obtain.recycle();}
            public IBinder asBinder() {return this.f822a;}}
``` 
Which is just using `Parcel` to obtain the string and the app token to pass the data via `transact` 

So let's observe `onTransact` 

```java
        public boolean onTransact(int i, Parcel parcel, Parcel parcel2, int i2) {
            String str = "com.sctf2020.vault101.IVault";
            if (i == 1) {
                parcel.enforceInterface(str);
                boolean a2 = a(parcel.readString());
                parcel2.writeNoException();
                parcel2.writeInt(a2 ? 1 : 0);
                return true;

...
```

Here we also see if we pass `int 1` and then our 2 parcels, it will call

```java
 boolean a2 = a(parcel.readString());
```
Now this is `function a()` of extended `a()` in `VaultService.java` so let's check that out.


##### VaultService.java : Encrypted Class Extends b.c.a.b.a()

`VaultService.java` extends `a(String str)` which is the new functionality invoked in previous :

```java
  boolean a2 = a(parcel.readString());
```

So let's have a look on `VaultService.java`

```java
package com.sctf2020.vault101;

import android.app.Service;import android.content.Intent;import android.os.IBinder;import java.lang.reflect.Array;

import b.c.a.c;

public class VaultService extends Service {
    public IBinder f873b = new b(null);
    public class b extends b.c.a.b.a {
        public int f874a;
        public b(a aVar) {}
        public boolean a(String str) {
            try {
                int i = this.f874a + 1;
                this.f874a = i;
                if (i > 3) {
                    Class.forName(c.d(";È\u0003p¯4Å¶orÂ\"Ý\u0010|", -500953648)).getMethod(c.d("qó%", 991422357), new Class[]{(Class) Class.forName(c.d("~jxe\u0005reíY:Bè`niaY", 1069257791)).getDeclaredField(c.d("\u0001ò¬\u0010", 1659367412)).get(null)}).invoke(null, new Object[]{Integer.valueOf(0)});
                    return false;
                } else if (str == null) {
                    return false;
                } else {
                    byte[] b2 = b.c.a.a.b((byte[]) Class.forName(c.d(".Â®$\u000fß1Ç\u0003?Ú6Ê¶\"", 1451800421)).getMethod(c.d("7Ì£\u0002rØ0X", -552283301), new Class[0]).invoke(str, new Object[0]));
                    Object invoke = Class.forName(c.d("aogrfle¯}qjì.Cbsl35", 823239689)).getMethod(c.d("$OX{Í\u0010", -2050089752), new Class[]{Class.forName(c.d("\u000eé", 937562454)), (Class) Class.forName(c.d(";HCp¯\u0005tå¶ohõ%LRtó", -730536752)).getDeclaredField(c.d("\u0014ø¡\u0014", -1215097919)).get(null)}).invoke(null, new Object[]{b2, Class.forName(c.d("pç\u000bfÆ´!\rÌ!BZ?Ë\u000egÌëq", -1393972808)).getDeclaredField(c.d("\u001aä\u0017Yï\u0004", 1778992991)).get(null)});
                    Object newInstance = Class.forName(c.d("~jxe\u0005remY:Xrfb`c", 1356052543)).getConstructor(new Class[]{Class.forName(c.d("[C", 591904395))}).newInstance(new Object[]{invoke});
                    Object invoke2 = Class.forName(c.d("$Í\u001efÆ4\u0007:EH Í\u000e:ê>]-_", -248372756)).getMethod(c.d("&DÇ\u0003ÿ\u0016xg¬", 64103114), new Class[]{(Class) Class.forName(c.d("/BNt\u001fqç`ó1F_pÓ", -401453852)).getDeclaredField(c.d("\u0001ò\u0004D", 195131734)).get(null)}).invoke(VaultService.this, new Object[]{Integer.valueOf(R.string.magic)});
                    return ((Boolean) Class.forName(c.d("zhs`-ddmu.Rwb`kf", -754317293)).getMethod(c.d("tø\u001auÅ®", 528601528), new Class[]{Class.forName(c.d("oâ5º!OÈzä\u0016oæ ", -1620091986))}).invoke(invoke2, new Object[]{newInstance})).booleanValue();
                }
            } catch (Throwable unused) {
                throw new RuntimeException();
            }
        }
    }
    public IBinder onBind(Intent intent) {return this.f873b;}
    public void onCreate() {
        try {
            Object invoke = Class.forName(c.d("0Gqsn@q¥2noÿ4Ga/BF{ÿ4yu", 1132272720)).getMethod(c.d("bf~VNeoô]wn÷", 1545475118), new Class[0]).invoke(this, new Object[0]);
            Object invoke2 = Class.forName(c.d("!Ï#î5£.Ï%Ïó\"$Ò5Ó4ò", 354045889)).getMethod(c.d("#Fä\u0012uQyç#@ó»%Z", 1074255429), new Class[]{(Class) Class.forName(c.d("ê1§£%Íúkêaî5û", -72994916)).getDeclaredField(c.d("\u0010zBE", 1821340751)).get(null)}).invoke(invoke, new Object[]{Integer.valueOf(R.array.kind_of_magic)});
            if (invoke2 != null) {
                int length = Array.getLength(invoke2);
                byte[] bArr = new byte[length];
                for (int i = 0; i < length; i++) {
                    Object obj = Array.get(invoke2, i);
                    Object invoke3 = Class.forName(c.d("uå&Ä· \rË Â\u001a:É'Îèp", 446383039)).getMethod(c.d(" Fñ/mB", 825348685), new Class[]{Class.forName(c.d("+À§ -Ì0Ç$.Ò3È¿&", 1167863618)), (Class) Class.forName(c.d("?Ê¨%\u0007Ó5E\u001a;Â\u0000!Î¹![", -521211012)).getDeclaredField(c.d("\u0010zè\u0010", -1491966233)).get(null)}).invoke(null, new Object[]{obj, Class.forName(c.d("$M^fÆ\u001et§!Bðka[gÌA$", -1048288020)).getDeclaredField(c.d("\nlÇ\u0012qs@", 282303079)).get(null)});
                    String d = c.d((CharSequence) Class.forName(c.d(";HÁ1§\u0001te¾kð.#@Ù7", -158782760)).getConstructor(new Class[]{Class.forName(c.d("JË", 543344920))}).newInstance(new Object[]{invoke3}), i ^ 137);
                    bArr[i] = (byte) ((Character) Class.forName(c.d("k`Õ1¥(`oìjð$shÍ7", 25375370)).getMethod(c.d("wã\u000ffè«", -375635523), new Class[]{(Class) Class.forName(c.d("oâ6`/ï!Ob/HOqæ'ds", 1759650052)).getDeclaredField(c.d("\u0000rÌ\u0000", 575374967)).get(null)}).invoke(d, new Object[]{Integer.valueOf(0)})).charValue();
                }
                b.c.a.a.class.getDeclaredFields()[0].set(null, bArr);
                return;
            }
            throw new NullPointerException();
        } catch (Throwable unused) {
            throw new RuntimeException();
        }
    }
}
```

And yes, that's where actual headache starts ! All the above class is encoded... but we see some significant leads, and here they are :

* This includes b.c.a.a class
* We have multiple instance of `Class.forName()`, `invoke()` and `.getMethod()` calls
* function `d()` of class c.java is used with varying variables passed.

#### GetMethod(), Class.forName() and Invoke()

On searching in java Docs (yes it exists) we can see that the `GetClass()` will actually do what it says.... gets the class by name and it is same for others.

SO HERE'S THE DEAL :

> If I say **object = GetClass("System").getMethod("out").getMethod("println")**
> And then I do **object.invoke(null,new Object String("HELLO WORLD"))**
> I am actually doing : **System.out.println("HELLO WORLD");**

So they are building their intended code by passing names of class which they are decoding somehow via `d()` function in `c.java` 

AAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHHHHHHHHH........

OKAY now let's check `d()`.

#### Custom encryption in the app.

so basically the `c.java` is the class responsible for all general encryption in the app. It's main source of the obfuscation in all the major library calls.

Let's C `C.java` hehe you saw what i did there.

```java
package b.c.a;
public class c {
    public static int f823a;
    public static char a(char c, int i) {
        return (char) (c & ((1 << i) ^ 65535));
    }
    public static char b(char c, int i) {
        return (char) (c | (1 << i));
    }
    public static char c(char c, int i) {
        return (char) ((c & (1 << i)) >> i);
    }
    public static String d(CharSequence charSequence, int i) {
        StringBuilder sb = new StringBuilder();
        if (i == 0) {
            return sb.toString();
        }
        for (int i2 = 0; i2 < charSequence.length(); i2++) {
            char charAt = charSequence.charAt(i2);
            char c = (char) (i >> (i2 % 4));
            int i3 = i2 % 3;
            if (i3 == 0) {
                for (int i4 = 0; i4 < 8; i4 += 2) {
                    char c2 = c(charAt, i4) ^ c(c, i4);
                    if (c2 == 0) {
                        charAt = a(charAt, i4);
                    } else if (c2 == 1) {
                        charAt = b(charAt, i4);
                    }
                }
            } else if (i3 == 1) {
                for (int i5 = 1; i5 < 8; i5 += 2) {
                    char c3 = c(charAt, i5) ^ c(c, i5);
                    if (c3 == 0) {
                        charAt = a(charAt, i5);
                    } else if (c3 == 1) {
                        charAt = b(charAt, i5);
                    }
                }
            } else if (i3 == 2) {
                for (int i6 = 0; i6 < 8; i6++) {
                    char c4 = c(charAt, i6) ^ c(c, i6);
                    if (c4 == 0) {
                        charAt = a(charAt, i6);
                    } else if (c4 == 1) {
                        charAt = b(charAt, i6);
                    }}}
            sb.append((char) (charAt ^ f823a));
        }
        return sb.toString();}}
```

So this is nice, some code that we can read with human comprehension.

Now focus on that XOR part at end of `d()` : `sb.append((char) (charAt ^ f823a));` 

here `f823a` is local variable whose value is set via `VaultApplication.java` 

```java
package com.sctf2020.vault101;

import android.app.Application;
import b.c.a.c;

public class VaultApplication extends Application {
    public void onCreate() {
        super.onCreate();

\\ SET VALUE FOR XOR KEY IN c.java
        c.f823a = 1;
    }
}
```


Okay we as it's not dynamic so we can skip this class and hardcode the value for `f823a` in our recreation of this algo.

### Recreating the Algo for de-obfuscation
![](/assets/images/sctf/start.jpg)
_I really hope de-obfuscation is valid techinical term_


So this is simple and here is my implementation for it:

```java
package com.x64mayhem;
import javax.crypto.BadPaddingException;import javax.crypto.Cipher;import javax.crypto.IllegalBlockSizeException;import javax.crypto.NoSuchPaddingException;import javax.crypto.spec.IvParameterSpec;import javax.crypto.spec.SecretKeySpec;import java.io.UnsupportedEncodingException;import java.lang.reflect.Array;import java.security.InvalidAlgorithmParameterException;import java.security.InvalidKeyException;import java.security.NoSuchAlgorithmException;import java.util.Base64;

public class Main {
    public static void main(String[] args) throws IllegalAccessException, UnsupportedEncodingException {
     //TOOL FOR DECODING INSTRUCTIONS
       System.out.println(
            //HERE YOU CAN PUT ANY D() CALL TO DECRYPT IT 

               d(">JÂ0ûDwù¯0Õ´zhÝ!ë\u000ff", -989022505)
       
       );}

    //WE SET THIS XOR KEY TO 1 AND REMOVE THAT CLASS 
    public static int INTGET=1;
    public static char a(char c, int i) {return (char) (c & ((1 << i) ^ 65535));}
    public static char b(char c, int i) {return (char) (c | (1 << i));}
    public static char c(char c, int i) {return (char) ((c & (1 << i)) >> i);}
    public static String d(CharSequence charSequence, int i) {
        StringBuilder sb = new StringBuilder();
        if (i == 0) {return sb.toString();}
        for (int i2 = 0; i2 < charSequence.length(); i2++) {
            char charAt = charSequence.charAt(i2);
            char c = (char) (i >> (i2 % 4));
            int i3 = i2 % 3;
            if (i3 == 0) {
                for (int i4 = 0; i4 < 8; i4 += 2) {
                    char c2 = (char) (c(charAt, i4) ^ c(c, i4));
                    if (c2 == 0) {
                        charAt = a(charAt, i4);
                    } else if (c2 == 1) {
                        charAt = b(charAt, i4);
                    }}
            } else if (i3 == 1) {
                for (int i5 = 1; i5 < 8; i5 += 2) {
                    char c3 = (char) (c(charAt, i5) ^ c(c, i5));
                    if (c3 == 0) {
                        charAt = a(charAt, i5);
                    } else if (c3 == 1) {
                        charAt = b(charAt, i5);
                    }
                }
            } else if (i3 == 2) {
                for (int i6 = 0; i6 < 8; i6++) {
                    char c4 = (char) (c(charAt, i6) ^ c(c, i6));
                    if (c4 == 0) {
                        charAt = a(charAt, i6);
                    } else if (c4 == 1) {
                        charAt = b(charAt, i6)}}}
            sb.append((char) (charAt ^ INTGET));}
        return sb.toString();}}
```

Now you can try this on your own.

The Idea is we will pass the `d()`  call and it will decrypt the gibberish and will give us something valid and it works...

Check this out ::

![](/assets/images/sctf/1.png)

Here we can see that the following code in obfuscated app :
```java
Object invoke = Class.forName(c.d(">JÂ0ûDwù¯0Õ´zhÝ!ë\u000ff", -989022505)).getMethod(c.d("rî:MGì0BSvn", -2055632580), new Class[]{Class.forName(c.d("+À0­0G¤nò\r3È6", 675347394))}).invoke(null, new Object[]{c.d("QLÜkh^F,j_È\u0015%Yî Oukd", -1263812037)});
```
IS EQUIVALENT TO THIS ->

```java
Object invoke = Class.forName("javax.crypto.Cipher").getMethod("getInstance", 
	new Class[]{Class.forName("java.lang.String")}).invoke(null, new Object[]{"AES/CBC/PKCS5Padding"});
```
which actually is nothing but this ->

```java
Cipher AESCBC = Cipher.getInstance("AES/CBC/PKCS5Padding");
```

So we are getting some code afterall huh ? NOICE !!
![](/assets/images/sctf/noice.gif)
So as we are not doing via dynamic approach, we have to decode all the `d()` calls like this .... Don't worry i will do it for ya, just a sec, till then you can grab some coffee 'cause nect part is actually amusingly simple :)

### De-Obfuscaton and Code Cleaning
![](/assets/images/sctf/clean.jpeg)
Okay, so these are the java files after processing :

**b/c/a/a.java**
```java
package b.c.a;
public class a {
    /* renamed from: a reason: collision with root package name */
    public static byte[] f821a;
    public static byte[] a(byte[] bArr) {
        //DECRYPT 
        Class<a> cls = a.class;
        try {
            Object AESCBC = javax.crypto.Cipher.getInstance, new Class[]{java.lang.String}).invoke(null, new Object[]{AES/CBC/PKCS5Padding});
            Object newInstance = javax.crypto.spec.SecretKeySpec(cls.getDeclaredFields()[0].get(null), "AES");
            Object IvPARAM = javax.crypto.spec.IvParameterSpec(cls.getDeclaredFields()[0].get(null);
            Object DECRYPT = javax.crypto.Cipher.DECRYPT_MODE.get(null);
            javax.crypto.Cipher.init(0, java.security.Key, java.security.spec.AlgorithmParameterSpec).invoke(AESCBC, new Object[]{DECRYPT, newInstance, IvPARAM});
            return (byte[]) javax.crypto.Cipher.doFinal, new Class[]{Class.forName("[B")}).invoke(AESCBC, new Object[]{bArr});
        } catch (Throwable unused) {throw new RuntimeException();}
    }
    public static byte[] b(byte[] bArr) {
        Class<a> cls = a.class;
        try {
            Object AESCBC = javax.crypto.Cipher.getInstance, new Class[]{java.lang.String}).invoke(null, new Object[]{AES/CBC/PKCS5Padding});
            Object newInstance = javax.crypto.spec.SecretKeySpec.getConstructor(new Class[]{Class.forName("[B"), java.lang.String}).newInstance(new Object[]{cls.getDeclaredFields()[0].get(null), AES});
            Object IvPARAM = javax.crypto.spec.IvParameterSpec.getConstructor(new Class[]{Class.forName("[B")}).newInstance(new Object[]{cls.getDeclaredFields()[0].get(null)});
            Object ENCRYPT = javax.crypto.Cipher.getDeclaredField(ENCRYPT_MODE.get(null);
           javax.crypto.Cipher.init, new Class[]{(Class) Integer.TYPE.get(null), java.security.Key, java.security.spec.AlgorithmParameterSpec}).invoke(AESCBC, new Object[]{ENCRYPT, newInstance, IvPARAM});
            return (byte[]) javax.crypto.Cipher.doFinal, new Class[]{Class.forName("[B")}).invoke(AESCBC, new Object[]{bArr});
        } catch (Throwable unused) {throw new RuntimeException();}}}
```

**VaultService.java**
```java
package com.sctf2020.vault101;
import android.app.Service;import android.content.Intent;import android.os.IBinder;import b.c.a.c;import java.lang.reflect.Array;
public class VaultService extends Service {
    public IBinder f873b = new b(null);
    public class b extends b.c.a.b.a {
        public int f874a;
        public b(a aVar) {}
        public boolean a(String str) {
            try {
                int i = this.f874a + 1;
                this.f874a = i;
                if (i > 3) {java.lang.System.exit(0); return false;
                } else if (str == null) { return false;
                } else {
                    byte[] ENCRYPTEDDATAINPUT = b.c.a.a.b((byte[]) java.lang.String.getBytes(str));
                    Object base64ENCDATA = android.util.Base64.encode(ENCRYPTEDDATAINPUT, android.util.Base64.NO_WRAP);
                    Object OURENCRYPTEDDATA = java.lang.String.(base64ENCDATA)
                    Object MAGIC = android.content.Context.getString, new Class[]{(Class) java.lang.Integer.TYPE.get(null)}).invoke(VaultService.this, new Object[]{Integer.valueOf(R.string.magic)});

                    return ((Boolean) java.lang.String.equals(MAGIC,OURENCRYPTEDDATA)
                }} catch (Throwable unused) {throw new RuntimeException();} }}
    public IBinder onBind(Intent intent) {return this.f873b;
    public void onCreate() {
        try {
            Object invoke = Class.forName(android.content.Context.getResources, null).invoke(this, 0);
            Object KINDOFMAGIC = String(R.array.kind_of_magic);
            if (KINDOFMAGIC != null) {

                int length = Array.getLength(KINDOFMAGIC);
                byte[] NEWBYTEARRAYKOM = new byte[length];
                for (int i = 0; i < length; i++) {
                    Object obj = Array.get(KINDOFMAGIC, i);
                    Object invoke3 = android.util.Base64.decode(obj, android.util.Base64.NO_WRAP);
                    String d = c.d((CharSequence)invoke3, i ^ 137);
                    NEWBYTEARRAYKOM[i] = (byte) (((Character) java.lang.String.charAt,invoke(d, 0)).charValue();)}
                b.c.a.a.class.getDeclaredFields()[0].set(null, NEWBYTEARRAYKOM);
                return;
            }throw new NullPointerException();} catch (Throwable unused) {throw new RuntimeException();}}}
```

Now let's solve !!

### ReCreating the AES Encryption and Getting the Flag
Ok so now we know enough to get the flag. and by analysing all the above codes we can see that application work something like this :

* Get Input From User
* Pass that to VaultService.java
* Encrypt the Input in AES via `b/c/a/a.java:b(byte [])`
```java
byte[] ENCRYPTEDDATAINPUT = b.c.a.a.b((byte[]) java.lang.String.getBytes(str));
```
* Encode in Base64
```java
Object base64ENCDATA = android.util.Base64.encode(ENCRYPTEDDATAINPUT, android.util.Base64.NO_WRAP);
Object OURENCRYPTEDDATA = java.lang.String.(base64ENCDATA);
```
* Get data from strings.xml with name tag = `magic`
```java
Object MAGIC = android.content.Context.getString, new Class[]{(Class) java.lang.Integer.TYPE.get(null)}).invoke(VaultService.this, new Object[]{Integer.valueOf(R.string.magic)});
```
* Compare the data and return `True // False` boolean

#### AES

The encryption is actually simple,
This code generates the key :

```java
//GET STRING ARRAY FROM arrays.xml in values resource
Object KINDOFMAGIC = String(R.array.kind_of_magic);

if (KINDOFMAGIC != null) {

int length = Array.getLength(KINDOFMAGIC);

byte[] NEWBYTEARRAYKOM = new byte[length];

for (int i = 0; i < length; i++) {

Object obj = Array.get(KINDOFMAGIC, i);

//B64 DECODE EACH ELEMENT OF THE ARRAY AND DECRYPT IT USING INBUILD d() FUNCTION

Object invoke3 = android.util.Base64.decode(obj, android.util.Base64.NO_WRAP);

//XOR WITH '137' and DECRYPT VIA d()
String d = c.d((CharSequence)invoke3, i ^ 137);

//APPEND ARRAY TO NEW MEMORY
NEWBYTEARRAYKOM[i] = (byte) (((Character) java.lang.String.charAt,invoke(d, 0)).charValue();)

}
//SET KEY IN THE ENCRYPTION CLASS FROM HERE
b.c.a.a.class.getDeclaredFields()[0].set(null, NEWBYTEARRAYKOM);

return;
```

I have commented the above code so we don't have to explain all again here, okay the new thing here is `class.getDeclaredFields[0].set()` call,

this is actually easy, `getDeclaredFields` will return list of all declared vars in the class, we select the first one via `[0]` and then we use `set()` to change its value.

> java is actually like progamming in drunken english.

Now moving on and getting the flag.

#### FLAG !!!

So to get the flag we can reverse the process on the saved string and will get it as we have all parameters of encoding and encryption.
So here is what I came up with.

> WE KINDA CREATED WHOLE NEW IMPLEMENTATION OF AES AND DECRYPTION AS SOME OF THE ANDROID KEYWORDS WILL NOT WORK IN GENERAL JAVA.

**SOLVE.java**
```java
package com.x64mayhem;
import javax.crypto.BadPaddingException;import javax.crypto.Cipher;import javax.crypto.IllegalBlockSizeException;import javax.crypto.NoSuchPaddingException;import javax.crypto.spec.IvParameterSpec;import javax.crypto.spec.SecretKeySpec;import java.io.UnsupportedEncodingException;import java.lang.reflect.Array;import java.security.InvalidAlgorithmParameterException;import java.security.InvalidKeyException;import java.security.NoSuchAlgorithmException;import java.util.Base64;
public class Main {
    public static void main(String[] args) throws IllegalAccessException, UnsupportedEncodingException {

       String KINDOFMAGIC[]={"UEBxWw==", "Sk5xVcOICw==", "bnRX", "S0BgWw==", "Nw==", "R0ZxRMOLElk=", "TkJhWw==", "dHZHdcOl", "eWRNYQ==", "bHRSeMOi", "R05tVw==", "d2hScA==", "T0xyVMOADQ==", "f2pQ", "Q0xsVw==", "Nw=="};

       String magic= "7E3Q5fm4lBSKXaHTnlCO52VL/iY6f+hQQ35oeFphtZIu3pf0QuOEpFB5nTeg8GTx";

        // TO GET THE KEY FROM KINDOFMAGIC ARRAY
       int length = Array.getLength(KINDOFMAGIC);
       Base64.Decoder decode=Base64.getDecoder();
       byte[] NEWBYTEARRAYKOM = new byte[length];
       for (int i = 0; i < length; i++) {
           Object obj = Array.get(KINDOFMAGIC,i);
           byte[] invoke3 = decode.decode(obj.toString());
           String hmm = d(new String(invoke3,"UTF-8"), i ^ 137);
           NEWBYTEARRAYKOM[i] = ((byte) hmm.charAt(0));}
       //SET THE KEY IN ENCRYPTION CLASS
       a.class.getDeclaredFields()[0].set(null, NEWBYTEARRAYKOM);
       Base64.Decoder decoder=Base64.getDecoder();
       byte[] bdecode=decoder.decode(magic);
       //CALL OUR IMPLEMENTATION OF a.java TO DECRYPT THE DATA
       byte[] ANSWER =a.a(bdecode);

       //PRINT FLAG IN UTF-8 STRING

       System.out.println(new String(ANSWER));
    
}

public static int INTGET=1;
public static char a(char c, int i) {return (char) (c & ((1 << i) ^ 65535));}
public static char b(char c, int i) {return (char) (c | (1 << i));}
public static char c(char c, int i) { return (char) ((c & (1 << i)) >> i);}
public static String d(CharSequence charSequence, int i) {
StringBuilder sb = new StringBuilder();
if (i == 0) {return sb.toString();}
for (int i2 = 0; i2 < charSequence.length(); i2++) {
    char charAt = charSequence.charAt(i2);
    char c = (char) (i >> (i2 % 4));
    int i3 = i2 % 3;
    if (i3 == 0) {
        for (int i4 = 0; i4 < 8; i4 += 2) {
            char c2 = (char) (c(charAt, i4) ^ c(c, i4));
            if (c2 == 0) {
                charAt = a(charAt, i4);
            } else if (c2 == 1) {
                charAt = b(charAt, i4);}}
    } else if (i3 == 1) {
        for (int i5 = 1; i5 < 8; i5 += 2) {
            char c3 = (char) (c(charAt, i5) ^ c(c, i5));
            if (c3 == 0) {
                charAt = a(charAt, i5);
            } else if (c3 == 1) {
                charAt = b(charAt, i5);}}
    } else if (i3 == 2) {
        for (int i6 = 0; i6 < 8; i6++) {
            char c4 = (char) (c(charAt, i6) ^ c(c, i6));
            if (c4 == 0) {
                charAt = a(charAt, i6);
            } else if (c4 == 1) {
                charAt = b(charAt, i6);
            }}}
    sb.append((char) (charAt ^ INTGET));}
return sb.toString();}}
```

**OUR `a.java`**
```java
package com.x64mayhem;

import javax.crypto.BadPaddingException;import javax.crypto.Cipher;import javax.crypto.IllegalBlockSizeException;import javax.crypto.NoSuchPaddingException;import javax.crypto.spec.IvParameterSpec;import javax.crypto.spec.SecretKeySpec;import java.security.InvalidAlgorithmParameterException;import java.security.InvalidKeyException;import java.security.NoSuchAlgorithmException;

public class a {

    public static byte[] f821a;
    public static byte[] a(byte[] bArr) {

        //DECRYPT

        Class<a> cls = a.class;
        try {

            Cipher AESCBC = Cipher.getInstance("AES/CBC/PKCS5Padding");
            SecretKeySpec keyspec = new SecretKeySpec((byte[]) cls.getDeclaredFields()[0].get(null), "AES");
            IvParameterSpec IVSPEC = new IvParameterSpec((byte[]) cls.getDeclaredFields()[0].get(null));
            AESCBC.init(Cipher.DECRYPT_MODE, keyspec, IVSPEC);
            return (byte[]) AESCBC.doFinal(bArr);

} catch (NoSuchPaddingException ex) {ex.printStackTrace();}
catch (NoSuchAlgorithmException ex) {ex.printStackTrace();}
catch (InvalidAlgorithmParameterException ex) {ex.printStackTrace();}
catch (InvalidKeyException ex) {ex.printStackTrace();}
catch (BadPaddingException ex) {ex.printStackTrace();}
catch (IllegalBlockSizeException ex) {ex.printStackTrace();}
catch (IllegalAccessException e) {e.printStackTrace();}

return null;}}


```

Executing the above code will give us our love of CTFs : `SCTF{53CUr17Y_7Hr0U6H_085CUr17Y_15_N07_3N0U6H}`

![](/assets/images/sctf/2.png)
![](/assets/images/sctf/final.jpg)
PHEW ! That's all for this one.. see ya all in next one.

And you know the drill right? Till then .... Stay Caffinenated Enough!

---
