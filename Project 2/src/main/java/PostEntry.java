import java.sql.Timestamp;

/*
 *Helper class whose objective is simply to behave like a struct in C++. Bundle the data that would've existed in MySQL Table
 and construct an object of type PostEntry that will contain the contents.
 
 Helper functions defined below are to help get and set values.
 */
public class PostEntry {
    String username;
    int post_id;
    String title;
    String body;
    Timestamp create_date;
    Timestamp modified_date;

    private static final int INVALID_POST_ID = -1;

    public PostEntry() {
        this.username = null;
        this.post_id = INVALID_POST_ID;
        this.title = null;
        this.body = null;
        this.create_date = null;
        this.modified_date = null;
    }

    /**
     * Setter for username
     * 
     * @param new_user
     */
    public void setUserName(String new_user) {
        this.username = new_user;
    }

    /***
     * Setter for post id
     * 
     * @param new_post
     */
    public void setPostId(int new_post) {
        this.post_id = new_post;
    }

    /**
     * Setter for set title
     * 
     * @param new_title
     */
    public void setTitle(String new_title) {
        this.title = new_title;
    }

    /**
     * Setter for body
     * 
     * @param new_body
     */
    public void setBody(String new_body) {
        this.body = new_body;
    }

    /**
     * Setter for Create Date
     * 
     * @param new_create
     */
    public void setCreate(Timestamp new_create) {
        this.create_date = new_create;
    }

    /**
     * Setter for Modified Date
     * 
     * @param new_modified
     */
    public void setModified(Timestamp new_modified) {
        this.modified_date = new_modified;
    }

    /**
     * Getter for Username
     * 
     * @return
     */
    public String getUserName() {
        return this.username;
    }

    /**
     * Getter for Post Id
     * 
     * @return
     */
    public int getPostId() {
        return this.post_id;
    }

    /**
     * Getter for Title
     * 
     * @return
     */
    public String getTitle() {
        return this.title;
    }

    /**
     * Getter for Body
     * 
     * @return
     */
    public String getBody() {
        return this.body;
    }

    /**
     * Getter for Create date
     */
    public Timestamp getCreate() {
        return this.create_date;
    }

    /**
     * Getter for Modified date
     * 
     * @return
     */
    public Timestamp getModified() {
        return this.modified_date;
    }

}