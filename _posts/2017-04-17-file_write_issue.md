---
layout: post
title: File write할 때 발생하는 문제점
comments: true
---

Codegate 2017 해킹방어대회 대학생부 본선을 참여하면서 발견한 문제점이 있습니다.

```python
#!/usr/bin/python
dummy_data = ''.join([chr(i) for i in range(0x100)])
print len(dummy_data)
print repr(dummy_data)

# just write
f = open('testfile', 'w')
f.write(dummy_data)
f.close()

# just read
f = open('testfile', 'r')
read_data = f.read()
f.close()

print len(read_data)
print repr(read_data)
```
위 코드는 매우 단순한 예제인데, 위 코드를 macOS와 같은 UNIX환경에서 실행시켰을 경우 문제가 없습니다.

아래는 macOS에서의 실행 화면 입니다.
```
256
'\x00\x01 ... \xfe\xff'
256
'\x00\x01 ... \xfe\xff'
```
하지만 위 코드를 Windows환경에서 실행을 시킨다면?...
```
256
'\x00\x01 ... \xfe\xff'
26
'\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\x0c\r\x0e\x0f\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19'
```

네, 바로 0x20 즉 Whitespace이전까지 읽어 오고 있는 것을 볼 수 있습니다.

또 알아볼 것은 읽어올 때 모드를  `'r'`이 아닌 `'rb'`로 읽어올 때는 어떻게 되는지 확인 해봅시다. 아래는 macOS에서 실행 시킨 화면입니다.
```
256
'\x00\x01 ... \xfe\xff'
256
'\x00\x01 ... \xfe\xff'
```
하지만 Windows에서 실행을 시킨다면??
```
256
'\x00\x01 ... \xfe\xff'
257
'\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\r\n\x0b\x0c\r\x0e\x0f\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1a\x1b\x1c\x1d\x1e\x1f !"#$%&\'()*+,-./0123456789:; ... \xfe\xff'
```
네, 쓰는 데이터는 똑같지만 읽어온 데이터 중 1 byte가 늘어난 것을 알 수 있는데 과연 어디가 늘어났을까요?

자세히 보시면 `\n` 앞에는 본래 `\t`가 와야되는데 `\r`이 있는 것을 볼 수 있습니다. return carriage가 있는 것을 볼 수 있습니다.

그렇습니다. 윈도우에서 파일 모드를 `'w'`로 했을 때 `\n`을 기록할 때 `\r\n`으로 기록하기 때문입니다. ~~(윈도우를 갖다 버립시다...)~~

참고로 파일 기록할 때의 모드를 `'wb'`로 했을 경우 문제는 없습니다만... ~~넘나 짱나는거...~~

이러한 문제가 발생하는 것은 UNIX계열의 줄바꿈은 `\n`이고 Windows계열의 줄바꿈은 `\r\n`인 것으로 생각됩니다.

요약을 하면 다음과 같습니다.
 * Windows환경에서 `'r'` 모드로 파일에서 문자열을 읽을 경우 Whitespace 이전까지 읽는다.
 * Windows환경에서 `'w'` 모드로 파일에 문자열을 기록할 경우 `\n`은 `\r\n`이 된다.
 * UNIX환경에서는 이러한 문제가 발생하지 않는다.

 뭐든지 장단은 있기 마련이지만... 이번 기회에 아주 좋은 교훈을 얻었습니다.
