<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%><%@ taglib uri="http://java.sun.com/jsp/jstl/core"
prefix="c" %>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Preview Post</title>
	  <link rel="stylesheet" href="./style.css">
</head>
<body>
	<div class="header"><h1>Preview Post</h1></div>
	<div class="button-row">
	<form action="post" method="POST">
		<input type="hidden" name="username" value="<%=request.getParameter("username")%>"> 
   		<input type="hidden" name="postid" value="<%= request.getParameter("postid")%>">
   		<input type="hidden" name="title" value="<%= request.getParameter("title")%>">
   		<input type="hidden" name="body" value="<%= request.getParameter("body")%>">
   		<button type="submit" name="action" value="open">Close Preview</button>
	</form>
	</div>
	<div class="preview-text">
		<h2> <%= request.getAttribute("titleString")%></h2>
		<h4 style="padding-left: 4%"><p><%= request.getAttribute("bodyString")%></p></h3>
	</div>
</div>
</body>
</html>