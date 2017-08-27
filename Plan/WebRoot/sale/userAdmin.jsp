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
	<div>一共成功推广 ${count } 个用户</div>
	<table>
		<thead>
			<tr>
				<th>编号</th>
				<th>用户名</th>
				<th>手机号</th>
				<th>创建时间</th>
				<th>到期时间</th>
				<th>购买状态</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="user" items="${users}" varStatus="_user">
				<tr>
					<td>${_user.count }</td>
					<td>${user.name }</td>
					<td>${user.phone }</td>
					<td>${user.regist_time }</td>
					<td>${user.dead_time}</td>
					<td>${user.purchase_status}</td>
				</tr>
			</c:forEach>
		</tbody>
	</table>
	&nbsp;第&nbsp;<%
		long count = Long.parseLong(request.getAttribute("count").toString());
		long size = count / 10 + 1;
		for (int i = 0; i < size; i++) {
	%><a href="/Plan/admin/userAdmin/<%out.print(i);%>-${phone}"> <%
 	out.print(i + 1);
 	}
 %>
	</a>&nbsp;页 </article> </section>
</body>
</html>