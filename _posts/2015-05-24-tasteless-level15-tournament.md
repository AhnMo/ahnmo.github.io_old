---
layout: post
title: Tasteless Level15 Tournament
comments: true
---

채팅 시스템이 구현 되어 있다.

일단 DB에 저장을 해 놓는 것으로 추정을 할 수 있고, INSERT 구문을 Guessing하면 다음과 같다.

```sql
INSERT INTO chatlog VALUES(..., 'NAME', 'TEXT');
```

쿼티를 넣어서 입력을 해보면 그대로 입력되어 들어가는것을 볼 수 있다.

backslash를 name 부분에 넣어 보면 정상적으로 쿼리가 실행이 되지 않아 chatlog가 쌓이지 않는 것을 볼 수 있다.

NAME 부분에 backslash가 들어가면 _', 'TEXT_에서 _', _가 문자열이 되고 TEXT 부분에 문자열이 아닌 임의의 쿼리를 구성 할 수 있다.

__name__에 _123&x5D;_를 넣고 __text__에 _, 0x41)#_를 넣으면 다음과 같은 결과가 나온다.

```
123', : A
```
__text__에 _, 0x41)#_대신에 _, (SELECT flag FROM level15_flag))#_를 넣으면 subquery가 실행되어 flag값을 text에 담게 되어 화면에 출력됨을 알 수 있다.

```
123', : e7216e0dedf28792fcd605702947f004
```