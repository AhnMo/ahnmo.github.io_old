---
layout: post
title: python에서 'import capstone'시 문제
comments: true
---

인터넷에 아무리 찾아봐도 해결방법이 잘 안보이는데... 웬만해선 안 일어날 오류가 아닐까 싶다.

```
Python 2.7.6 (default, Mar 22 2014, 22:59:56) 
[GCC 4.8.2] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>>> import capstone
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "/usr/local/lib/python2.7/dist-packages/capstone/__init__.py", line 1, in <module>
    from capstone import Cs, CsError, cs_disasm_quick, cs_disasm_lite, cs_version, cs_support, version_bind, debug, CS_API_MAJOR, CS_API_MINOR, CS_ARCH_ARM, CS_ARCH_ARM64, CS_ARCH_MIPS, CS_ARCH_X86, CS_ARCH_PPC, CS_ARCH_ALL, CS_MODE_LITTLE_ENDIAN, CS_MODE_ARM, CS_MODE_THUMB, CS_OPT_SYNTAX, CS_OPT_SYNTAX_DEFAULT, CS_OPT_SYNTAX_INTEL, CS_OPT_SYNTAX_ATT, CS_OPT_SYNTAX_NOREGNAME, CS_OPT_DETAIL, CS_OPT_ON, CS_OPT_OFF, CS_MODE_16, CS_MODE_32, CS_MODE_64, CS_MODE_BIG_ENDIAN, CS_MODE_MICRO, CS_MODE_N64, CS_SUPPORT_DIET
  File "/usr/local/lib/python2.7/dist-packages/capstone/capstone.py", line 162, in <module>
    raise ImportError("ERROR: fail to load the dynamic library.")
ImportError: ERROR: fail to load the dynamic library.
>>> quit
Use quit() or Ctrl-D (i.e. EOF) to exit
>>> 
```

일단 내 상황은 capstone을 설치한다고 pip로 설치했었고, 잘 안되기래 [공식홈페이지](http://www.capstone-engine.org/download.html)에서 deb파일을 받아서 설치했었다. 

여기서 생각이 없었던게 pip를 통해 설치했던 capstone때문에 위와 같은 오류가 계속 났던것이다. 

고로 _pip uninstall capstone_을 하면 된다. 

참고로 공식홈페이지에 있는 libcapstone3 + pip로 설치한 python-capstone은 오류가 나니 꼭 공식홈페이지에 있는 libcapstone3 + python-capstone 조합으로 쓰길 바란다.

나같은 또다른 멍청이가 안나오길 바라며 글을 남긴다.


```
$ sudo pip uninstall capstone
Uninstalling capstone-2.1:
  /usr/local/lib/python2.7/dist-packages/capstone-2.1.egg-info
  /usr/local/lib/python2.7/dist-packages/capstone/__init__.py
  /usr/local/lib/python2.7/dist-packages/capstone/__init__.pyc
...
  /usr/local/lib/python2.7/dist-packages/capstone/x86.pyc
  /usr/local/lib/python2.7/dist-packages/capstone/x86_const.py
  /usr/local/lib/python2.7/dist-packages/capstone/x86_const.pyc
Proceed (y/n)? y
  Successfully uninstalled capstone-2.1
$ sudo dpkg -i libcapstone3_3.0.4-0.1ubuntu1_amd64.deb python-capstone_3.0.4-0.1ubuntu1_amd64.deb
Selecting previously unselected package python-capstone.
...
Setting up python-capstone (3.0.4-0.1ubuntu1) ...
$ python
Python 2.7.6 (default, Mar 22 2014, 22:59:56) 
[GCC 4.8.2] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>>> import capstone
>>> capstone
<module 'capstone' from '/usr/lib/python2.7/dist-packages/capstone/__init__.pyc'>
```
