import java.io.IOException;
import java.sql.*;
import java.util.List;
import java.util.ArrayList;
import java.util.Date;
import java.text.SimpleDateFormat;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import javax.xml.transform.OutputKeys;

import org.commonmark.node.*;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;

/**
 * Done: Open Server-side
 *       Save Server-side
 *      Edit Page -> All buttons 
 *      List Page -> All buttons 
 * To-Do:  
 *      Test to make sure no 500 responses get returned (basically error handling).
 *      **Optional CSSS
 */
/**
 * Servlet implementation class for Servlet: ConfigurationTest
 *
 */
public class Editor extends HttpServlet {
    /**
     * The Servlet constructor
     * 
     * @see javax.servlet.http.HttpServlet#HttpServlet()
     */
    private static final String DB_DRIVER = "com.mysql.jdbc.Driver";
    private static final String DB_URL = "jdbc:mysql://localhost:3306/CS144";
    private static final String DB_USER = "cs144";
    private static final String DB_PW = "";

    public Editor() {
    }

    public void init() throws ServletException {
        /* write any servlet initialization code here or remove this function */
        System.out.println("Servlet initializing now.");
    }

    public void destroy() {
        /* write any servlet cleanup code here or remove this function */
        System.out.println("Servlet Terminating now.");
    }

    /*
     * Objective of this helper function is to validate that the corresponding
     * fields match the action in the request. Checks for any issues before
     * function.
     */
    public int determineStatusCode(HttpServletRequest request) {
        String action = request.getParameter("action");
        String username = request.getParameter("username");
        String post_id = request.getParameter("postid");
        String title = request.getParameter("title");
        String body = request.getParameter("body");
        System.out.println("Action: " + action);
        System.out.println("UserName: " + username);
        System.out.println("postid: " + post_id);
        System.out.println("Title: " + title);
        System.out.println("Body: " + body);
        int return_status = HttpServletResponse.SC_OK;

        if (action == null) { // No Action was specified
            return_status = HttpServletResponse.SC_BAD_REQUEST;
        } else if (action.equals("open")) {

            if (username == null || post_id == null) { // OPEN doesnt have the required parameters
                return_status = HttpServletResponse.SC_BAD_REQUEST;
                return return_status;
            }
            // make sure that the postid is int
            try {
                int casted_post_id = Integer.parseInt(post_id);
            } catch (NumberFormatException e) {
                System.out.println("NumberFormat Exception: Post ID not in proper format");
                return_status = HttpServletResponse.SC_BAD_REQUEST;
            } catch (NullPointerException e) {
                System.out.println("Post id was a null pointer");
                return_status = HttpServletResponse.SC_BAD_REQUEST;
            }

        } else if (action.equals("save")) {
            if (username == null || post_id == null || title == null || body == null) {
                return_status = HttpServletResponse.SC_BAD_REQUEST;
                return return_status;
            }
            // validate postid
            try {
                int casted_post_id = Integer.parseInt(post_id);
            } catch (NumberFormatException e) {
                System.out.println("NumberFormat Exception: Post ID not in proper format");
                return_status = HttpServletResponse.SC_BAD_REQUEST;
            } catch (NullPointerException e) {
                System.out.println("Post id was a null pointer");
                return_status = HttpServletResponse.SC_BAD_REQUEST;
            }

        } else if (action.equals("delete")) {
            if (username == null || post_id == null) {
                return_status = HttpServletResponse.SC_BAD_REQUEST;
                return return_status;
            }
        } else if (action == "preview") {
            if (username == null || post_id == null || title == null || body == null) {
                return_status = HttpServletResponse.SC_BAD_REQUEST;
                return return_status;
            }
        } else if (action.equals("list")) {
            if (username == null) {
                return_status = HttpServletResponse.SC_BAD_REQUEST;
                return return_status;
            }

        }
        return return_status;

    }

    /**
     * Handles HTTP GET requests
     * 
     * @see javax.servlet.http.HttpServlet#doGet(HttpServletRequest request,
     *      HttpServletResponse response)
     */
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // implement your GET method handling code here
        // currently we simply show the page generated by "edit.jsp"
        /*
         * 1) Check the status of the responses if theres a failure then return the
         * response with the updated response code 2) Branch off into the specific logic
         */
        System.out.println("-----------------Start of doGet------------------");
        System.out.println("----------------Start of Function determineStatusCode ------------------");
        int status_code = determineStatusCode(request);
        System.out.println("---------------End of Function determineStatusCode ------------------");

        if (status_code == HttpServletResponse.SC_BAD_REQUEST) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // At this point the required parameters in the request are valid.

        String action = request.getParameter("action").toLowerCase();

        // Decide which action it is and perform the specific function.
        if (action.equals("open")) {
            System.out.println("----------------Start of Function processOpen --------------------");
            processOpen(request, response);
            System.out.println("------------------End of Function processOpen --------------------");
        } else if (action.equals("save")) { // GET - Save should be 400
            System.out.println("---------------DoGet Save is a 400 ----------------------");
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
        } else if (action.equals("delete")) { // GET Delete should be 400
            System.out.println("------------------DoGet Delete is a 400 -----------------------");
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
        } else if (action.equals("preview")) {
            System.out.println("-------------------Start of Function processPreview -----------------------");
            processPreview(request, response);
            System.out.println("------------------End of Function processPreview --------------------");
        } else if (action.equals("list")) {
            System.out.println("-----------------Start of Function processList--------------------");
            processList(request, response);
            System.out.println("------------------End of Function processList ----------------------");
        }
        System.out.println("------------------End of Function doGet--------------------");
    }

    /**
     * Function that returns the edit page for the post with the given postid by the
     * user.
     * 
     * 
     * @param request
     * @param response
     * @throws ServletException
     * @throws IOException
     */
    private void processOpen(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String action = request.getParameter("action");
        String username = request.getParameter("username");
        String post_id = request.getParameter("postid");
        String title = request.getParameter("title");
        String body = request.getParameter("body");

        int casted_post_id = Integer.parseInt(post_id);

        if (casted_post_id <= 0) { // Postid <=0
            if (body != null && title != null) { // Use passed params to fill
                // explicitly setting.

                request.setAttribute("title", title);
                request.setAttribute("body", body);
            } else {
                // title & body = empty

                request.setAttribute("title", "");
                request.setAttribute("body", "");
                // default okay
            }
        } else { // Postid >0

            if (body != null && title != null) { // title and body passed
                // explicitly setting.

                request.setAttribute("title", title);
                request.setAttribute("body", body);
            } else {
                if (username != null && post_id != null) {// retrieve title and body from Posts Table
                    // Load Driver

                    try {
                        Class.forName(DB_DRIVER);
                    } catch (ClassNotFoundException ex) {
                        System.out.println(ex);
                    }

                    // Start connection and get result from query
                    Connection c = null;
                    PreparedStatement s = null;
                    ResultSet rs = null;
                    try {
                        c = DriverManager.getConnection(DB_URL, DB_USER, DB_PW);
                        s = c.prepareStatement("Select * from Posts where username = ? AND postid =?");
                        s.setString(1, username);
                        s.setString(2, post_id);

                        rs = s.executeQuery();

                        // Check result from query
                        if (rs.next()) {
                            request.setAttribute("title", rs.getString("title"));
                            request.setAttribute("body", rs.getString("body"));
                        } else {
                            response.sendError(HttpServletResponse.SC_NOT_FOUND);
                            return;
                        }

                    } catch (SQLException ex) {
                        System.out.println("ProcessOpen function SQL exception");
                        response.sendError(HttpServletResponse.SC_BAD_REQUEST);
                        return;
                    } finally {
                        try {
                            rs.close();
                        } catch (Exception e) {
                            /* ignored */ }
                        try {
                            s.close();
                        } catch (Exception e) {
                            /* ignored */ }
                        try {
                            c.close();
                        } catch (Exception e) {
                            /* ignored */ }
                    }

                } else {

                    response.sendError(HttpServletResponse.SC_NOT_FOUND);
                    return;
                }
            }

        }
        // dispatch and okay success

        response.setStatus(HttpServletResponse.SC_OK);
        request.getRequestDispatcher("/edit.jsp").forward(request, response);
    }

    private void processSave(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String action = request.getParameter("action");
        String username = request.getParameter("username");
        String post_id = request.getParameter("postid");
        String title = request.getParameter("title");
        String body = request.getParameter("body");
        int casted_post_id = Integer.parseInt(post_id);
        if (casted_post_id <= 0) {
            int next_postid = -1;
            // assign a new postid and save content as a new post
            // how? grab max postid of the user and +1 then save
            try {
                Class.forName(DB_DRIVER);
            } catch (ClassNotFoundException ex) {
                System.out.println("ClassNotFoundException " + ex);
            }

            // Start connection and get result from query
            Connection c = null;
            PreparedStatement s = null;
            ResultSet rs = null;
            try {
                c = DriverManager.getConnection(DB_URL, DB_USER, DB_PW);
                s = c.prepareStatement("Select MAX(postid) AS max_postid from Posts where username = ?");
                s.setString(1, username);
                rs = s.executeQuery();

                // Check result from query
                if (rs.next()) {
                    // System.out.println("Max POST ID rn" + rs.getInt("max_postid"));
                    next_postid = rs.getInt("max_postid") + 1;

                } else {
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST);
                    return;
                }
                // System.out.println("User: " + username + "has the next post id of: " +
                // next_postid);
                // now save content as a new post in the DB
                s = c.prepareStatement(
                        "INSERT INTO Posts (username,postid,title,body,modified,created) VALUES(?,?,?,?,?,?)");
                s.setString(1, username);
                s.setInt(2, next_postid);
                s.setString(3, title);
                s.setString(4, body);
                // Adding a new post means created and modified are the same time
                Date date = new Date();

                Timestamp ts = new Timestamp(date.getTime());

                s.setTimestamp(5, ts);
                s.setTimestamp(6, ts);

                s.execute();
            } catch (SQLException ex) {
                System.out.println("ProcessSave function SQL exception" + ex.getErrorCode());
                response.sendError(HttpServletResponse.SC_BAD_REQUEST);
                return;
            } finally {
                try {
                    rs.close();
                } catch (Exception e) {
                    /* ignored */ }
                try {
                    s.close();
                } catch (Exception e) {
                    /* ignored */ }
                try {
                    c.close();
                } catch (Exception e) {
                    /* ignored */ }
            }

        } else {
            // if user/post row exists in the database update db
            // otherwise dont make a change
            if (username != null && post_id != null) {
                try {
                    Class.forName(DB_DRIVER);
                } catch (ClassNotFoundException ex) {
                    System.out.println(ex);
                }
                // Start connection and get result from query
                Connection c = null;
                PreparedStatement s = null;
                ResultSet rs = null;
                try {
                    c = DriverManager.getConnection(DB_URL, DB_USER, DB_PW);
                    s = c.prepareStatement("Select * from Posts where username = ? AND postid =?");
                    s.setString(1, username);
                    s.setString(2, post_id);

                    rs = s.executeQuery();

                    // Check result from query and if it's there update it.
                    if (rs.next()) {
                        // update the specific primary key entry
                        s = c.prepareStatement(
                                "UPDATE Posts SET title=?, body=?, modified=? where username=? AND postid=?");
                        s.setString(1, title);
                        s.setString(2, body);
                        Date date = new Date();
                        Timestamp ts = new Timestamp(date.getTime());

                        s.setTimestamp(3, ts);
                        s.setString(4, username);
                        s.setString(5, post_id);
                        s.executeUpdate();
                    } else {
                        response.sendError(HttpServletResponse.SC_BAD_REQUEST);
                        return;
                    }

                } catch (SQLException ex) {
                    System.out.println("ProcessOpen function SQL exception");
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST);
                    return;
                } finally {
                    try {
                        rs.close();
                    } catch (Exception e) {
                        /* ignored */ }
                    try {
                        s.close();
                    } catch (Exception e) {
                        /* ignored */ }
                    try {
                        c.close();
                    } catch (Exception e) {
                        /* ignored */ }
                }
            }

        }
        // request.setAttribute("action", "list");
        // request.setAttribute("username", username);
        System.out.println("-------------------Parent processSave starting processList------------------------");
        processList(request, response);
        System.out.println("-------------------Parent processSave ending processList-------------------------");
        // go to the list page.
        // response.sendRedirect("/list.jsp");
    }

    private void processDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String action = request.getParameter("action");
        String username = request.getParameter("username");
        String post_id = request.getParameter("postid");
        String title = request.getParameter("title");
        String body = request.getParameter("body");

        // determine status code already made sure the required parameters were there.

        // FIRST go to db and delete post.
        try {
            Class.forName(DB_DRIVER);
        } catch (ClassNotFoundException ex) {
            System.out.println("ClassNotFoundException " + ex);
        }
        Connection c = null;
        PreparedStatement s = null;
        ResultSet rs = null;
        try {
            c = DriverManager.getConnection(DB_URL, DB_USER, DB_PW);
            s = c.prepareStatement("DELETE FROM Posts where username= ? AND postid=?");
            s.setString(1, username);
            s.setString(2, post_id);

            s.execute();

        } catch (SQLException ex) {
            System.out.println("ProcessDelete function SQL Exception" + ex);
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            return;
        } finally {
            try {
                rs.close();
            } catch (Exception e) {
                /* ignored */ }
            try {
                s.close();
            } catch (Exception e) {
                /* ignored */ }
            try {
                c.close();
            } catch (Exception e) {
                /* ignored */ }
        }
        // SECOND processList
        System.out.println("------------------Parent processDelete  starting processList -------------------");
        processList(request, response);
        System.out.println("-------------------Parent processDelete  ending processList ---------------------");
    }

    private void processPreview(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String action = request.getParameter("action");
        String username = request.getParameter("username");
        String post_id = request.getParameter("postid");
        String title = request.getParameter("title");
        String body = request.getParameter("body");

        //build parser and renderer
        Parser parse = Parser.builder().build();
        HtmlRenderer render = HtmlRenderer.builder().build();

        //reder title and body
        String titleString = render.render(parse.parse(title));
        String bodyString = render.render(parse.parse(body));

        request.setAttribute("titleString", titleString);
        request.setAttribute("bodyString", bodyString);
        request.getRequestDispatcher("/preview.jsp").forward(request, response);
    }

    /**
     * This Function handles retrieving all saved posts from the specified user and
     * helps list it.
     * 
     * @param request
     * @param response
     * @throws ServletException
     * @throws IOException
     */
    private void processList(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // query database for info for given username and have it as a list.
        try {
            Class.forName(DB_DRIVER);
        } catch (ClassNotFoundException ex) {
            System.out.println(ex);
        }

        // Start connection and get result from query
        String username = request.getParameter("username");
        Connection c = null;
        PreparedStatement s = null;
        ResultSet rs = null;
        try {
            c = DriverManager.getConnection(DB_URL, DB_USER, DB_PW);
            // ascending order by postid
            s = c.prepareStatement("Select * from Posts where username = ? ORDER BY postid ");
            s.setString(1, username);

            rs = s.executeQuery();

            ArrayList<PostEntry> result_list = new ArrayList<>();
            // Check result from query

            while (rs.next()) {
                PostEntry an_entry = new PostEntry();
                an_entry.setUserName(rs.getString("username"));
                an_entry.setPostId(rs.getInt("postid"));
                an_entry.setTitle(rs.getString("title"));
                an_entry.setBody(rs.getString("body"));
                an_entry.setModified(rs.getTimestamp("modified"));
                an_entry.setCreate(rs.getTimestamp("created"));
                // create a object and add to list
                result_list.add(an_entry);
            }
            // create a new attribute in the request to access later in the list.jsp
            request.setAttribute("post_list", result_list);

        } catch (SQLException ex) {
            System.out.println("ProcessList function SQL exception");
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            return;
        } finally {
            try {
                rs.close();
            } catch (Exception e) {
                /* ignored */ }
            try {
                s.close();
            } catch (Exception e) {
                /* ignored */ }
            try {
                c.close();
            } catch (Exception e) {
                /* ignored */ }
        }
        request.getRequestDispatcher("/list.jsp").forward(request, response);
    }

    /**
     * Handles HTTP POST requests
     * 
     * @see javax.servlet.http.HttpServlet#doPost(HttpServletRequest request,
     *      HttpServletResponse response)
     */
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // implement your POST method handling code here

        System.out.println("----------------Start of Function doPost-----------------");
        // step 1 check status of request if valid
        System.out.println("-------------------Start of Function determineStatusCode----------------------");
        int status_code = determineStatusCode(request);

        System.out.println("-------------------End of Function determineStatusCode----------------------");

        if (status_code == HttpServletResponse.SC_BAD_REQUEST) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // pick which logic to branch off into
        String action = request.getParameter("action").toLowerCase();

        // Decide which action it is and perform the specific function.
        if (action.equals("open")) {
            System.out.println("--------------------Start of Function processOpen----------------------");
            processOpen(request, response);
            System.out.println("---------------------End of Function processOpen-----------------------");
        } else if (action.equals("save")) {
            System.out.println("--------------------Start of Function processSave------------------------");
            processSave(request, response);
            System.out.println("--------------------End of Function processSave------------------------");
        } else if (action.equals("delete")) {
            System.out.println("--------------------Start of Function processDelete-------------------------");
            processDelete(request, response);
            System.out.println("---------------------End of Function processDelete-------------------------");
        } else if (action.equals("preview")) {
            System.out.println("-----------------------Start of Function processPreview------------------------");
            processPreview(request, response);
            System.out.println("----------------------End of Function processPreview------------------------");
        } else if (action.equals("list")) {
            System.out.println("----------------------Start of Function processList-------------------------");
            processList(request, response);
            System.out.println("----------------------End of Function processList-------------------------");
        }
        System.out.println("--------------------End of Function doPost-----------------------");

    }

}
