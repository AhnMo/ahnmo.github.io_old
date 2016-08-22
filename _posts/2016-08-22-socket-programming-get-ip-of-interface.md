---
layout: post
title: Socket Programming - Interface IP 알아오기
comments: true
---

바이너리 분석하다가 신기해서 찾아서 정리합니당.

```cpp
#include <stdio.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <sys/ioctl.h>
#include <arpa/inet.h>
#include <net/if.h>

#define ADDR_MAX        32

int main(int argc, char *argv[]) {
  int fd;
  struct ifreq ifr;
  struct sockaddr_in *aptr;
  char address[ADDR_MAX] = { 0, };

  if (argc != 2) {
    fprintf(stderr, "usage: %s INTERFACE\n", argv[0]);
    return 1;
  }

  fd = socket(AF_INET, SOCK_DGRAM, 0);
  if (fd < 0) {
    fprintf(stderr, "socket(2) failed\n");
    return 1;
  }

  strncpy(ifr.ifr_name, argv[1], IFNAMSIZ);

  printf("INTERFACE: %s\n", argv[1]);

  if (ioctl(fd, SIOCGIFADDR, &ifr) < 0) {
    fprintf(stderr, "ioctl(2) failed\n");
    return 1;
  }

  aptr = (struct sockaddr_in *)&ifr.ifr_addr;
  inet_ntop(AF_INET, &aptr->sin_addr, address, ADDR_MAX);
  printf("IPADDRESS: %s\n", address);

  if (ioctl(fd, SIOCGIFBRDADDR, &ifr) < 0) {
    fprintf(stderr, "ioctl(2) failed\n");
    return 1;
  }

  aptr = (struct sockaddr_in *)&ifr.ifr_addr;
  inet_ntop(AF_INET, &aptr->sin_addr, address, ADDR_MAX);
  printf("BROADCAST: %s\n", address);

  return 0;
}
```

0x8915 == SIOCGIFADDR

0x891B == SIOCGIFBRDADDR

```
Parkui-MacBook-Air:test AhnMo$ ./test en0
INTERFACE: en0
IPADDRESS: 192.168.0.59
BROADCAST: 192.168.0.255
Parkui-MacBook-Air:test AhnMo$
```

### 참고 자료

- [인터페이스의 ip 알려주는 함수 알려주세요.](https://kldp.org/node/69567)
