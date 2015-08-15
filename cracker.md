---
layout: page
title: Cracker
---
<style type="text/css">
#cracker {width: 400px; margin: 0 auto;}
#cracker .box textarea {width: 100%; height: 200px;}
#cracker .box td {text-align: center;}
</style>
<div id="cracker">

<h2>Base64</h2>
<table class="box" id="base64">
<tr><td><textarea></textarea></td></tr>
<tr><td>
<button class="encode">Encode</button>
<button class="decode">Decode</button>
<button class="binary_decode">Binary Decode</button>
</td></tr>
</table>

<h2>Base85</h2>

<table class="box" id="ascii85">
<tr><td><textarea></textarea></td></tr>
<tr><td>
<button class="encode">Encode</button>
<button class="decode">Decode</button>
</td></tr>
</table>

<h2>MD4</h2>

<table class="box" id="md4">
<tr><td><textarea></textarea></td></tr>
<tr><td>
<button class="hash">Hash</button>
</td></tr>
</table>

<h2>MD5</h2>

<table class="box" id="md5">
<tr><td><textarea></textarea></td></tr>
<tr><td>
<button class="hash">Hash</button>
</td></tr>
<tr><td>
<dl>
<dt>CR4CK</dt>
<dd><a href="http://md5.rednoize.com/">http://md5.rednoize.com/</a></dd>
<dd><a href="http://md5box.org/">http://md5box.org/</a></dd>
</dl>
</td></tr>
</table>

<h2>SHA1</h2>

<table class="box" id="sha1">
<tr><td><textarea></textarea></td></tr>
<tr><td>
<button class="hash">Hash</button>
</td></tr>
</table>

<h2>SHA256</h2>

<table class="box" id="sha2">
<tr><td><textarea></textarea></td></tr>
<tr><td>
<button class="hash">Hash</button>
</td></tr>
</table>

<h2>Unescape</h2>

<table class="box" id="unescape">
<tr><td><textarea></textarea></td></tr>
<tr><td>
<button class="encode">Escape</button>
<button class="decode">Unescape</button>
</td></tr>
</table>

<h2>Morse Code</h2>

<table class="box" id="morse">
<tr><td><textarea></textarea></td></tr>
<tr><td>
<button class="encode">Encode</button>
<button class="decode">Decode</button>
</td></tr>
</table>

<h2>Unix Time</h2>

<table class="box" id="unixtime">
<tr><td><input type="text" id="timestamp" /></td></tr>
<tr><td>
<button class="fe2st">↑</button>
<button class="st2fe">↓</button>
</td></tr>
<tr><td>
<input type="text" id="year" size="4" placeholder="Year" /> / <input type="text" id="month" size="2" placeholder="Mon" /> / <input type="text" id="day" size="2" placeholder="Day" /><br/>
@ <input type="text" id="hour" size="2" placeholder="Hour" /> : <input type="text" id="minute" size="2" placeholder="Min" /> : <input type="text" id="second" size="2" placeholder="Sec" />
</td></tr>
</table>


<h2>SQL Utility</h2>

<h3>string2hex</h3>

<table class="box" id="string2hex">
<tr>
<td>Input:</td>
<td><input type="text" id="input" /></td>
</tr>
<tr>
<td>Output:</td>
<td><input type="text" id="output" /></td>
</tr>
<tr>
<td colspan="2"><button id="convert">Convert</button></td>
</tr>
</table>

<h3>string2ascii</h3>

<table class="box" id="string2ascii">
<tr>
<td>Input:</td>
<td><input type="text" id="input" /></td>
</tr>
<tr>
<td>Output:</td>
<td><input type="text" id="output" /></td>
</tr>
<tr>
<td colspan="2"><button id="convert">Convert</button></td>
</tr>
</table>
</div>

<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script type="text/javascript" src="/public/js/cracker/base64.js"></script>
<script type="text/javascript" src="/public/js/cracker/ascii85.js"></script>
<script type="text/javascript" src="/public/js/cracker/md4.js"></script>
<script type="text/javascript" src="/public/js/cracker/md5.js"></script>
<script type="text/javascript" src="/public/js/cracker/sha1.js"></script>
<script type="text/javascript" src="/public/js/cracker/sha256.js"></script>
<script type="text/javascript" src="/public/js/cracker/escape.js"></script>
<script type="text/javascript" src="/public/js/cracker/morse.js"></script>
<script type="text/javascript" src="/public/js/cracker/unixtime.js"></script>
<script type="text/javascript">
$(function() {
	$("#base64 .encode").click(function(){a=$("#base64 textarea");a.val(base64.encode(a.val()))});
	$("#base64 .decode").click(function(){a=$("#base64 textarea");a.val(base64.decode(a.val()))});
	$("#base64 .binary_decode").click(function(){a=$("#base64 textarea");a.val(base64.binary_to_base64(a.val()))});
	$("#ascii85 .encode").click(function(){a=$("#ascii85 textarea");a.val(ascii85.encode(a.val()))});
	$("#ascii85 .decode").click(function(){a=$("#ascii85 textarea");a.val(ascii85.decode(a.val()))});
	$("#md4 .hash").click(function(){a=$("#md4 textarea");a.val(md4.hex_md4(a.val()))});
	$("#md5 .hash").click(function(){a=$("#md5 textarea");a.val(md5.hex_md5(a.val()))});
	$("#sha1 .hash").click(function(){a=$("#sha1 textarea");a.val(hex_sha1(a.val()))});
	$("#sha2 .hash").click(function(){a=$("#sha2 textarea");a.val(hex_sha2(a.val()))});
	$("#unescape .encode").click(function(){a=$("#unescape textarea");a.val(escapeClass.escapeTxt(a.val()))});
	$("#unescape .decode").click(function(){a=$("#unescape textarea");a.val(escapeClass.unescapeTxt(a.val()))});
	$("#morse .encode").click(function(){a=$("#morse textarea");a.val(morse.Encrypt(a.val()))});
	$("#morse .decode").click(function(){a=$("#morse textarea");a.val(morse.Decrypt(a.val()))});
	$("#unixtime .fe2st").click(function(){$("#unixtime input#timestamp").val(unixtime.mktime($("#unixtime input#hour").val(),$("#unixtime input#minute").val(),$("#unixtime input#second").val(),$("#unixtime input#month").val(),$("#unixtime input#day").val(),$("#unixtime input#year").val()))});
	$("#unixtime .st2fe").click(function(){a=unixtime.date("Y m d H i s",$("#unixtime input#timestamp").val()).split(' ');$("#unixtime input#year").val(a[0]),$("#unixtime input#month").val(a[1]),$("#unixtime input#day").val(a[2]),$("#unixtime input#hour").val(a[3]),$("#unixtime input#minute").val(a[4]),$("#unixtime input#second").val(a[5])});
	$("#string2hex #convert").click(function(){input=$("#string2hex #input").val();output='0x';for(i=0;i<input.length;i++)output+=input.charCodeAt(i).toString(16);$("#string2hex #output").val(output);});
	$("#string2ascii #convert").click(function(){input=$("#string2ascii #input").val();output='char(';for(i=0;i<input.length;i++)output+=((i)?",":"")+input.charCodeAt(i).toString(10);$("#string2ascii #output").val(output+")");});
});
</script>

