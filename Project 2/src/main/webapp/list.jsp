<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%><%@ taglib uri="http://java.sun.com/jsp/jstl/core"
prefix="c" %><!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Post List</title>
    <link rel="stylesheet" href="./style.css">
  </head>
  <body>
    <div class="header"><h1>Post List</h1></div>
    <div class="button-row">
      <form action="post" id="0">
        <button type="submit" name="action" value="open">New Post</button>
        <input type="hidden" name="username"
        value="<%=request.getParameter("username") %>" /> <input type="hidden"
        name="postid" value="0" />
      </form>
    </div>
    <div class="post-table">
      <br>
    <table>
      <tbody>
        <tr>
          <th>Title</th>
          <th>Created</th>
          <th>Modified</th>
          <th>&nbsp;</th>
        </tr>
        <!----To-Do: add dynamic # of table rows-->
        <c:forEach items="${post_list}" var="a_post" varStatus="cur_index">
          <tr>
            <form id="${cur_index.count}" action="post" method="POST">
            <input type="hidden" name="username" value="${a_post.getUserName()}">
            <input type="hidden" name="postid" value="${a_post.getPostId()}">
            <td>${a_post.getTitle()}</td>
            <td>${a_post.getCreate()}</td>
            <td>${a_post.getModified()}</td>
            <td><button type="submit" name="action" value="open" style="background-color: #53c964">Open </button>
            <button type="submit" name="action" value="Delete" style="background-color: #9c3838">Delete</button></td>
          </form>
          </tr>          

        </c:forEach>
      </tbody>
    </table>
  </div>
  </body>
</html>
