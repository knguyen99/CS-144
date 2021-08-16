<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%><%@ taglib uri="http://java.sun.com/jsp/jstl/core"
prefix="c" %><!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Edit Post</title>

  <link rel="stylesheet" href="./style.css">

</head>
<body>
  <div class="header"><h1>Edit Post</h1></div>
  <form action="post" method="POST">
    <div class="button-row">
      <button type="submit" name="action" value="save">Save</button>
      <button type="submit" name="action" value="list">Close</button>
      <button type="submit" name="action" value="preview">Preview</button>
      <button type="submit" name="action" value="delete">Delete</button>
    </div>
      <!----To provide client request in the url info to servlet
      -->
      <input type="hidden" name="username" value="<%=request.getParameter("username")%>"> 
      <input type="hidden" name="postid" value="<%= request.getParameter("postid")%>">
      <div class="form-input">
        <div>
        <label for="title">Title</label>
        <br>
        <input type="text" name="title" value="<%=request.getAttribute("title")%>"/>
        </div>
        <div>
          <br>
          <label for="body">Body</label>
          <br>
          <textarea style="height: 20rem;" name="body"><%= request.getAttribute("body")%></textarea>
        </div>
      </div>
    </form>
  </body>
  </html>
