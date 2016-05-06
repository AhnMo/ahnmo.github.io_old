---
layout: post
title: 2016 코드게이트 대학생 해킹방어대회 - HackGgulJam
comments: true
---
문제 개요
======
문제의 기본 Base는 [wargame.kr의 dmbs335](http://wargame.kr:8080/dmbs335/)이다. 

달라진점 하나는 *firewall.php*가 추가가 됬다는 점이다.

아래는 *index.php*에서 추가된 부분이다.
```php
<?php 
if (isset($_GET['view-source'])) {
        show_source(__FILE__);
        exit();
}

include("firewall.php"); // You can see this code : firewall.php?view-source

include("inc.php"); // Database Connected

function getOperator(&$operator) { 
...
```

아래는 새로 추가된 파일인 *firewall.php*이다.
```php
<?php

if (isset($_GET['view-source'])) {
        show_source(__FILE__);
        exit();
}

function HackNoJam() {
    $INFO = parse_url($_SERVER['REQUEST_URI']);
    parse_str($INFO['query'], $query); 
    $filter = ['select', 'union', 'information_schema', 'from'];
    foreach ($query as $q) {
        foreach ($filter as $f) {
            if (preg_match("/".$f."/i", $q)) {
                HackingLog();
                die("attack detected!");
            }  
        }
    }
}

HackNoJam();

function HackingLog() { }

```

(따로 백업을 안해놔서 기억나는데로 작성했다.)

문제 의도
=====
```php
...
}

parse_str($_SERVER['QUERY_STRING']); 
getOperator($operator);
...
```
*index.php*에서는 *$_SERVER['QUERY_STRING']*를 직접 parse_str을 한다.

```php
...
function HackNoJam() {
    $INFO = parse_url($_SERVER['REQUEST_URI']);
    parse_str($INFO['query'], $query); 
    $filter = ['select', 'union', 'information_schema', 'from'];
...
```
반면, *firewall.php*에서는 *$_SERVER['REQUEST_URI']*를 *parse_url*로 분리한 후 *parse_str*을 한다.

이를 보고 공략 포인트가 여기란 것을 알 수 있다.

문제 풀이
=====
답은 [PHP: parse_url - Manual](http://php.net/manual/en/function.parse-url.php)에 있다.

```php
<?php
$url = '//www.example.com/path?googleguy=googley';

// Prior to 5.4.7 this would show the path as "//www.example.com/path"
var_dump(parse_url($url));
?>
```

위 코드에서 볼 수 있듯이 scheme를 생략한 형태로 parse_url을 사용할 수 있다. 

또한 *$_SERVER['REQUEST_URI']*는 *http://www.example.com/path*에서 **http://www.example.com**을 제외한 */path*부분이다.

위 두 가지를 조합할 때 

*$_SERVER['REQUEST_URI']*에 들어가는 값이 //가 위 코드에서 나온 scheme를 생략한 경우를 만들 수 있다.

![alt text](/public/upload/160503_1.png "code result")

~~ps. 정작 대회시간 동안에 문제풀 때는 저기가 공략포인트란건 감잡았는데 관련자료를 제대로 안찾아봤을까... ~~


