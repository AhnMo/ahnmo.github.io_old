---
layout: post
title: How to use Pintool
comments: true
---

2016 Inc0gnito conference에서 세종대 SSG의 15년도 회장이자 BOB 5기생이라는 이용준씨께서 Pintool Tutorial이라는 주제로 발표를 해주셨고, 특별한 내용은 없었으나 처음해보는 초보자들에게 괜찮다 싶어 정리를 하게 되었다.

<span style='text-decoration: line-through;'>실습파일 [pintool.zip](http://inc0gnito.com/asdf/pintool.zip)이다.</span>

[160817_pintool.zip](/public/upload/160817_pintool.zip) 벌써 원본 링크를 지웠나보다.

일단 관련 이론에 대해서는 넘기도록 하겠다.

<span style='text-decoration: line-through;'>(글이 길어지니 다루더라도 추가적인 포스트를 작성하겠다.)</span>

Pintool을 [공식홈페이지](https://software.intel.com/en-us/articles/pintool-downloads)에서 다운받아준다.

```
notroot@ubuntu:~$ uname -a
Linux ubuntu 4.4.0-21-generic #37-Ubuntu SMP Mon Apr 18 18:33:37 UTC 2016 x86_64 x86_64 x86_64 GNU/Linux
notroot@ubuntu:~$ wget http://software.intel.com/sites/landingpage/pintool/downloads/pin-3.0-76991-gcc-linux.tar.gz
...
notroot@ubuntu:~$ ls -l
total 33664
-rw-r--r-- 1 notroot notroot     6150 Aug 16 22:01 160817_pintool.zip
-rw-rw-r-- 1 notroot notroot 34460332 Mar 21 12:21 pin-3.0-76991-gcc-linux.tar.gz
notroot@ubuntu:~$ unzip 160817_pintool.zip
...
notroot@ubuntu:~$ tar -zxvf pin-3.0-76991-gcc-linux.tar.gz
...
notroot@ubuntu:~$ ls -l
total 33704
-rw-r--r-- 1 notroot notroot     6150 Aug 16 22:01 160817_pintool.zip
-rwxr-xr-x 1 notroot notroot     8658 Aug  1 00:01 e
drwxr-x--- 8 notroot notroot     4096 Mar 17 01:36 pin-3.0-76991-gcc-linux
-rw-rw-r-- 1 notroot notroot 34460332 Mar 21 12:21 pin-3.0-76991-gcc-linux.tar.gz
-rw-r--r-- 1 notroot notroot      614 Jul 30 06:07 pintest_1.cpp
-rw-r--r-- 1 notroot notroot      733 Aug  1 01:26 pintest_2.cpp
-rw-r--r-- 1 notroot notroot      819 Aug  1 01:26 pintest_3.cpp
-rw-r--r-- 1 notroot notroot     1207 Jul 31 23:46 pintest_4.cpp
-rw-r--r-- 1 notroot notroot      378 Jul 30 06:07 pintest.cpp
-rw-r--r-- 1 notroot notroot      207 Aug  7 22:03 test.c
notroot@ubuntu:~$
```

실습하고자 하는 시스템은 Linux 64bit이다. (실습파일에 있는 문제 파일 'e'가 Linux 64bit라 카더라..)

실슴 문제 파일에는 대략 60개의 if문이 존재하는데 이를 직접 따라가봐도 되겠지만 이를 자동화하는 것을 목적으로 하기 때문에 그렇게 하지 않겠다.

```
notroot@ubuntu:~$ cd pin-3.0-76991-gcc-linux/
notroot@ubuntu:~/pin-3.0-76991-gcc-linux$ ls -al
total 312
drwxr-x--- 8 notroot notroot   4096 Mar 17 01:36 .
drwxr-xr-x 4 notroot notroot   4096 Aug 16 22:05 ..
drwxr-x--- 3 notroot notroot   4096 Mar 17 01:18 doc
drwxr-x--- 2 notroot notroot   4096 Mar 17 01:18 extlicense
drwxr-x--- 8 notroot notroot   4096 Mar 17 01:18 extras
drwxr-x--- 6 notroot notroot   4096 Mar 17 01:17 ia32
drwxr-x--- 6 notroot notroot   4096 Mar 17 01:17 intel64
-rw-r----- 1 notroot notroot   7524 Mar 17 01:16 LICENSE
-rwxr-x--- 1 notroot notroot 231280 Mar 17 01:36 pin
-rw-r----- 1 notroot notroot  39661 Mar 17 01:16 README
-rw-r----- 1 notroot notroot     42 Mar 17 01:16 redist.txt
drwxr-x--- 5 notroot notroot   4096 Mar 17 01:18 source
notroot@ubuntu:~/pin-3.0-76991-gcc-linux$
```

pin 바이너리가 들어있는 것을 확인 할 수 있고 우리가 실행시킬 프로그램이다.

```
notroot@ubuntu:~/pin-3.0-76991-gcc-linux$ cd source/tools/MyPinTool/
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ cp makefile.rules makefile.rules.1
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ vi makefile.rules
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ diff makefile.rules makefile.rules.1
20c20
< TEST_TOOL_ROOTS := MyPinTool pintest
---
> TEST_TOOL_ROOTS := MyPinTool
23,24c23
< TEST_ROOTS := pintest
<
---
> TEST_ROOTS :=
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$
```

위와 같이 작성을 해줘야 우리가 실험해볼 pintest.cpp가 컴파일이 된다더라.

(Master of makefile님은 그냥 편하신대로 하시면 된답니다.)

일단 문제 파일인 'e'를 풀기 이전에 test.c로 실험을 해보자.

```
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ cp ~/test.c .
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ cat test.c
#include <stdio.h>
#include <string.h>

int  main()
{
  char input[10];
  scanf("%s",input);

  if(input[0]=='A')
  {

    printf("Good!!");
  }
  return 0;
}
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ gcc -o test test.c
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$
```

문자열을 입력받아 해당 문자열의 첫번째 글자가 'A'이면 'Good!!'을 출력하는 아주 간단한 프로그램이다.

```
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ cp ~/pintest.cpp pintest.cpp
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ cat pintest.cpp
#include <stdio.h>
#include <iostream>
#include "pin.H"
using namespace std;

void Instruction(INS ins, VOID* v)
{

	printf("all code : %s\n",INS_Disassemble(ins).c_str());

}

int main(int argc,char* argv[])
{

  if(PIN_Init(argc,argv))
    return -1;

  INS_AddInstrumentFunction(Instruction,0);
  PIN_StartProgram();
  return 0;
}
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ make all
...
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ ls -l obj-intel64
total 4828
-rw-rw-r-- 1 notroot notroot  101624 Aug 16 22:47 MyPinTool.o
-rwxrwxr-x 1 notroot notroot 2434000 Aug 16 22:47 MyPinTool.so
-rw-rw-r-- 1 notroot notroot    2784 Aug 16 22:47 pintest.o
-rwxrwxr-x 1 notroot notroot 2399840 Aug 16 22:47 pintest.so
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$
```

pintest.cpp의 내용은 현재 실행이 되는 모든 프로그램의 Instruction을 출력해주는 프로그램이다.

```
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ ../../../pin -t obj-intel64/pintest.so -- ./test
...
all code : cmp dword ptr [rip+0x2d1df9], 0x0
all code : jnz 0x7f694789d9b9
all code : mov eax, 0x0
all code : syscall
```

scanf에서 멈춘 것으로 보인다. 하지만 너무 많은 Instruction이 나오기 때문에 main에 있는 내용만 출력해보자.

```
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ cp ~/pintest_1.cpp pintest.cpp
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ gdb test -q
Reading symbols from test...(no debugging symbols found)...done.
(gdb) disas main
Dump of assembler code for function main:
   0x00000000004005f6 <+0>:	push   %rbp
   0x00000000004005f7 <+1>:	mov    %rsp,%rbp
   0x00000000004005fa <+4>:	sub    $0x20,%rsp
   0x00000000004005fe <+8>:	mov    %fs:0x28,%rax
   0x0000000000400607 <+17>:	mov    %rax,-0x8(%rbp)
   0x000000000040060b <+21>:	xor    %eax,%eax
   0x000000000040060d <+23>:	lea    -0x20(%rbp),%rax
   0x0000000000400611 <+27>:	mov    %rax,%rsi
   0x0000000000400614 <+30>:	mov    $0x4006e4,%edi
   0x0000000000400619 <+35>:	mov    $0x0,%eax
   0x000000000040061e <+40>:	callq  0x4004e0 <__isoc99_scanf@plt>
   0x0000000000400623 <+45>:	movzbl -0x20(%rbp),%eax
   0x0000000000400627 <+49>:	cmp    $0x41,%al
   0x0000000000400629 <+51>:	jne    0x40063a <main+68>
   0x000000000040062b <+53>:	mov    $0x4006e7,%edi
   0x0000000000400630 <+58>:	mov    $0x0,%eax
   0x0000000000400635 <+63>:	callq  0x4004c0 <printf@plt>
   0x000000000040063a <+68>:	mov    $0x0,%eax
   0x000000000040063f <+73>:	mov    -0x8(%rbp),%rdx
   0x0000000000400643 <+77>:	xor    %fs:0x28,%rdx
   0x000000000040064c <+86>:	je     0x400653 <main+93>
   0x000000000040064e <+88>:	callq  0x4004b0 <__stack_chk_fail@plt>
   0x0000000000400653 <+93>:	leaveq
   0x0000000000400654 <+94>:	retq
End of assembler dump.
(gdb) q
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ vi pintest.cpp
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ cat pintest.cpp
#include <stdio.h>
#include <iostream>
#include "pin.H"
using namespace std;
#define START	0x4005f6
#define END	  0x400654

void Instruction(INS ins, VOID* v)
{
  long int a = (long int)INS_Address(ins);//ins의 주소값
  if(START<=a && a<=END)//해당 주소값 사이의 값만 출력
  {
    printf("all code : %s\n",INS_Disassemble(ins).c_str());
  }
}

int main(int argc,char* argv[])
{

  if(PIN_Init(argc,argv))
    return -1;

  INS_AddInstrumentFunction(Instruction,0);
  PIN_StartProgram();
  return 0;
}
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ make all
make[1]: Leaving directory '/home/notroot/pin-3.0-76991-gcc-linux/source/tools/MyPinTool'
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$
```

pintest_1.cpp에 있던 내용은 시작 주소와 끝 주소를 정해 해당 주소일 경우 출력을 하고 아니면 안하는 것이다.

이와 같은 방식으로 원하는 주소에 대해서만 pin을 동작하게 하면 고질적으로 매우나도 느린 pin을 조금(도 눈에 보이지 않을 정도로) 개선을 할 수 있다.

```
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ ../../../pin -t obj-intel64/pintest.so -- ./test
all code : push rbp
all code : mov rbp, rsp
all code : sub rsp, 0x20
all code : mov rax, qword ptr fs:[0x28]
all code : mov qword ptr [rbp-0x8], rax
all code : xor eax, eax
all code : lea rax, ptr [rbp-0x20]
all code : mov rsi, rax
all code : mov edi, 0x4006e4
all code : mov eax, 0x0
all code : call 0x4004e0
abcd
all code : movzx eax, byte ptr [rbp-0x20]
all code : cmp al, 0x41
all code : jnz 0x40063a
all code : mov edi, 0x4006e7
all code : mov eax, 0x0
all code : call 0x4004c0
all code : mov eax, 0x0
all code : mov rdx, qword ptr [rbp-0x8]
all code : xor rdx, qword ptr fs:[0x28]
all code : jz 0x400653
all code : call 0x4004b0
all code : leave
all code : ret
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$
```

abcd는 내가 입력한 부분이고 실제 출력되는 부문이 많이 줄은 것을 확인 할 수 있다.

이제 구동되는 어셈블리어를 볼 수 있는데 이제 원하는 부분만 뽑아내서 봐보자.

if(input[0]=='A')에 해당하는 cmp al, 0x41만 뽑아서 보면 되지 않겠는가?

```
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ cp ~/pintest_2.cpp pintest.cpp
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ vi pintest.cpp
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ cat pintest.cpp
#include <stdio.h>
#include <iostream>
#include "pin.H"
using namespace std;
#define START 0x4005f6
#define END   0x400654

void Instruction(INS ins, VOID* v)
{
  long int a = (long int) INS_Address(ins);
  if(START <=a && a<= END)
  {
    if((strncmp(INS_Disassemble(ins).c_str(), "cmp", 3)==0))
    {
      printf("cmp code : %s\n",INS_Disassemble(ins).c_str());
    }
  }
}

int main(int argc,char* argv[])
{
  if(PIN_Init(argc,argv))
    return -1;

  INS_AddInstrumentFunction(Instruction,0);
  PIN_StartProgram();
  return 0;
}
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ make all
make objects
...
make[1]: Leaving directory '/home/notroot/pin-3.0-76991-gcc-linux/source/tools/MyPinTool'
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$
```

pintest_2.cpp에 있는 것 처럼 앞에 3글자만 비교를 하면 cmp를 볼 수 있겠다.

```
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ ../../../pin -t obj-intel64/pintest.so -- ./testasdf
cmp code : cmp al, 0x41
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$
```

이제 우리가 뽑아내고자 하는 문제 파일 'e'로 시도를 해보자.

```
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ cp ~/e .
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ gdb ./e -q
Reading symbols from ./e...(no debugging symbols found)...done.
(gdb) disas main
Dump of assembler code for function main:
   0x00000000004005ed <+0>:	push   %rbp
   0x00000000004005ee <+1>:	mov    %rsp,%rbp
   0x00000000004005f1 <+4>:	sub    $0x410,%rsp
   0x00000000004005f8 <+11>:	mov    %fs:0x28,%rax
...
   0x000000000040091d <+816>:	xor    %fs:0x28,%rdx
   0x0000000000400926 <+825>:	je     0x40092d <main+832>
   0x0000000000400928 <+827>:	callq  0x4004c0 <__stack_chk_fail@plt>
   0x000000000040092d <+832>:	leaveq
   0x000000000040092e <+833>:	retq
End of assembler dump.
(gdb) q
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ vi pintest.cpp
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ make all
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$
```

시작 주소와 끝 주소를 다시 바꿔 주고 컴파일을 해줬다.

```
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ ../../../pin -t obj-intel64/pintest.so -- ./e
asdf
cmp code : cmp al, 0x27
cmp code : cmp al, 0x7a
cmp code : cmp al, 0x62
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ ../../../pin -t obj-intel64/pintest.so -- ./e
aaaaa
cmp code : cmp al, 0x27
cmp code : cmp al, 0x7a
cmp code : cmp al, 0x62
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ ../../../pin -t obj-intel64/pintest.so -- ./e
zxcv
cmp code : cmp al, 0x27
cmp code : cmp al, 0x7a
cmp code : cmp al, 0x62
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$
```

정작 실행결과는 모든 cmp구문이 나오지 않고 있다...

중간에 비교결과가 False가 되고 종료되버리기 때문이다.

pintest_3.cpp에는 cmp의 다음 구문인 jge나 jnz와 같은 것들을 skip하도록 되어있다.

```
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ cp ~/pintest_3.cpp pintest.cpp
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ cat pintest.cpp
#include <stdio.h>
#include <iostream>
#include "pin.H"
using namespace std;
#define START 0x4005ed
#define END   0x40092e

void Instruction(INS ins, VOID* v)
{
  long int a = (long int)INS_Address(ins);//ins의 주소값
  if(START<=a && a<=END)  //해당 주소값 사이의 값만 출력
  {
    if((strncmp(INS_Disassemble(ins).c_str(),"cmp",3)==0))//cmp이면 출력
    {
      printf("cmp code : %s\n",INS_Disassemble(ins).c_str());
      INS_Delete(INS_Next(ins));//jge를 만나지 않고 점프!!!
    }
  }
}

int main(int argc,char* argv[])
{
  if(PIN_Init(argc,argv))
    return -1;

  INS_AddInstrumentFunction(Instruction,0);
  PIN_StartProgram();
  return 0;
}
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ make all
make objects
...
make[1]: Leaving directory '/home/notroot/pin-3.0-76991-gcc-linux/source/tools/MyPinTool'
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$
```

한번 실행을 시켜보자!

```
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ ../../../pin -t obj-intel64/pintest.so -- ./e
asdf
cmp code : cmp al, 0x27
cmp code : cmp al, 0x7a
cmp code : cmp al, 0x62
...
cmp code : cmp al, 0x7b
cmp code : cmp al, 0x4b
cmp code : cmp al, 0x60
Wow
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$
```

모든 cmp 구문이 출력되고 마지막에 Wow가 출력되는 것을 볼 수 있다. 물론 이건 디버거에서 JMP구문을 모두 NOP으로 해놓은 것과 같으므로 크게 의미가 없을 것이다.

pintest_4.cpp에는 위 cmp구문을 Parsing해서 각각의 Hex값을 Char로 변환해주는 것을 하고 있다.

strtol 이용하는 것 보다 개인적으로 sscanf로 하는게 더 깔끔하지 않을까 해서 내 식대로 바꿔봤다.

```
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ vi pintest.cpp
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ cat pintest.cpp
#include <stdio.h>
#include <iostream>
#include "pin.H"
using namespace std;
#define START 0x4005ed
#define END   0x40092e

char key[BUFSIZ] = {0,};
int idx = 0;

void Instruction(INS ins, VOID* v)
{
  long int a = (long int) INS_Address(ins);
  if(START <= a && a <= END)
  {
    if((strncmp(INS_Disassemble(ins).c_str(), "cmp", 3)==0))
    {
      printf("cmp code : %s\n",INS_Disassemble(ins).c_str());
      INS_Delete(INS_Next(ins));
      {
        char buf[BUFSIZ];
        int c;
        strcpy(buf, INS_Disassemble(ins).c_str());
        sscanf(buf, "cmp al, 0x%02X", &c);
        key[idx++] = (char) c;
        puts(key);
      }
    }
  }
}

int main(int argc, char *argv[])
{

  if (PIN_Init(argc, argv)) return -1;

  INS_AddInstrumentFunction(Instruction,0);
  PIN_StartProgram();

  return 0;
}
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ make all
make objects
...
make[1]: Leaving directory '/home/notroot/pin-3.0-76991-gcc-linux/source/tools/MyPinTool'
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$
```

자 이제 pintool을 돌려보자.

```
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ ../../../pin -t obj-intel64/pintest.so -- ./e [Aasdf
cmp code : cmp al, 0x27
'
cmp code : cmp al, 0x7a
'z
cmp code : cmp al, 0x62
'zb
...
cmp code : cmp al, 0x4b
'zbmUFvs&26q`Q:)9S!4\aDiJ`yk4GU"}0Rn(,,u`F&i7NC.{v{K
cmp code : cmp al, 0x60
'zbmUFvs&26q`Q:)9S!4\aDiJ`yk4GU"}0Rn(,,u`F&i7NC.{v{K`
Wow
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$
```

대략 입력해야되는 문자열은 온갖 특수문자가 난무하는 저 문자열인것 같다. 확인해보자.

```
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$ ./e
'zbmUFvs&26q`Q:)9S!4\aDiJ`yk4GU"}0Rn(,,u`F&i7NC.{v{K`
Wow
notroot@ubuntu:~/pin-3.0-76991-gcc-linux/source/tools/MyPinTool$
```

맞는 것 같아보인다.


최근 Binary Analysis Automation이 크게 화두가 되어 있는데 그중 꽤나 먼저 나온 pintool을 사용해봤다.

위 내용은 컨퍼런스에서 들은 내용 최대한 그대로 작성해봤다. (진짜?)

이제 이를 어떻게 활용해야할지는 여러분의 몫이다.

추가적인 자료는 [PIN 공식 홈페이지](https://software.intel.com/en-us/articles/pin-a-dynamic-binary-instrumentation-tool)나 [Pin: Pin 3.0 User Guide](https://software.intel.com/sites/landingpage/pintool/docs/76991/Pin/html/)에서 찾아 볼 수 있고 동작 원리와 관련해서도 찾아 볼 수 있기 때문에 관심있는 사람은 찾아보길 바란다.

//FIN
