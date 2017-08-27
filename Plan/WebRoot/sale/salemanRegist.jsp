<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta charset="utf-8">
<title></title>
<style type="text/css">
html, body {
	width: 100%;
	height: 100%;
	margin: 0;
}

.panel {
	height: 60%;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
</head>
<body>
	<div class="panel">
		<form action="../admin/regist" method="post">
			<div>USU 推广人员注册</div>
			<br /> <label>手机：</label><input type="text" name="phone"><br />
			<br /> <label>密码：</label><input type="password" name="password"><br />
			<br /> <label>姓名：</label><input type="text" name="name"><br />
			<br /> <label>地址：</label><input type="text" name="address"><br />
			<label>上级推广员手机：</label><input type="text" name="father_phone"><br />
			<br /> <input type="submit" value="注册">
		</form>
	</div>
</body>
</html>