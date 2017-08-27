<%@page import="com.mongodb.DBObject"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" import="java.util.*"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta charset="utf-8">
<title></title>
<script type="text/javascript" src="../js/jquery.min.js"></script>
<meta charset="utf-8">
<title>主页</title>
<style>
.section {
	display: flex;
	flex-direction: row;
}

.aside {
	width: 300px;
	line-height: 30px;
}

.article {
	
}

tr:nth-child(even) {
	background: #f5f5f5;
}

th, td {
	padding: 10px 20px;
}
</style>
</head>
<body>
	<nav> <a href="../sale/adminLogin.jsp">退出</a></nav>
	<section class="section"> <aside class="aside">
	<ul>
		<li><a
			href="/Plan/admin/salemanAdmin/0-<%DBObject o = (DBObject) session.getAttribute("admin");
			out.print(o.get("phone"));%>">推广人员管理</a></li>
		<li><a
			href="/Plan/admin/userAdmin/0-<%out.print(o.get("phone"));%>">用户查看</a></li>
	</ul>
	</aside> <article calss="article">
	<div>当前共有 ${count } 个推广人员</div>
	<table>
		<thead>
			<tr>
				<th>编号</th>
				<th>手机号</th>
				<th>姓名</th>
				<th>地址</th>
				<th>推广码</th>
				<th>注册日期</th>
				<th>推广员等级</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="saleman" items="${salemen}" varStatus="_saleman">
				<tr>
					<td>${_saleman.count }</td>
					<td>${saleman.phone }</td>
					<td>${saleman.name }</td>
					<td>${saleman.address }</td>
					<td style="color: blue; font-weight: 600;">${saleman.intro_no }</td>
					<td>${saleman.regist_time }</td>
					<td>${saleman.level }</td>
					<td style="font-size: 12px;"><a
						href="/Plan/admin/userAdmin/0-${saleman.phone }">查看邀请情况</a></td>
					<td style="font-size: 12px;"><a
						href="/Plan/admin/salemanAdmin/0-${saleman.phone }">查看下属推广员</a></td>
				</tr>
			</c:forEach>
		</tbody>
	</table>
	&nbsp;第&nbsp;<%
		int count = Integer.parseInt(request.getAttribute("count").toString());
		int size = count / 10 + 1;
		for (int i = 0; i < size; i++) {
	%><a href="/Plan/admin/salemanAdmin/<%out.print(i);%>-${phone}"> <%
 	out.print(i + 1);
 	}
 %>
	</a>&nbsp;页 </article> </section>
	<script>
		
	</script>
</body>
</html>