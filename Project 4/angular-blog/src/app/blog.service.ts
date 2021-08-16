import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Post {
  postid: number;
  created: Date;
  modified: Date;
  title: string;
  body: string;
}

export class BlogService {
  draft: Post;
  real_postid: number;

  constructor() {
  }

  /*
    Sends an http get req to /api/:username 
     -> retrieves all blog posts by the user. 

     Success -> Post array containing all user's posts.
     Fail-> error(response_status_code)

     To do: test/debug
  */
  fetchPosts(username: string): Promise<Post[]> {
    return fetch('/api/' + username, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .catch((err) => console.log(err)); //might need to come back
  }
  /*Dependent on fetchPost called first. Just query a local copy. */
  getPost(username: string, postid: number): Promise<Post> {
    return fetch('/api/' + username + '/' + postid, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .catch((err) => console.log(err));
  }

  /**Takes in a new post and I will send an HTTP Post request to save it  in the Server.*/
  newPost(username: string, post: Post): Promise<any> {
    //sending 'http://localhost:3000/api/username/postid where the post info is in the body
    return fetch('/api/' + username + '/' + post.postid, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post), //convert to json to string
    }).catch((err) => console.log(err));
  }
  /*Assumption is given the post we wanted to make updates to, */
  updatePost(username: string, post: Post): Promise<any> {
    //sending 'http://localhost:3000/api/username/postid where the updated post info is in the body
    return fetch('/api/' + username + '/' + post.postid.toString(), {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    }).catch((err) => console.log(err));
  }
  deletePost(username: string, postid: number): Promise<any> {
    return fetch('/api/' + username + '/' + postid, {
      method: 'DELETE',
      credentials: 'include',
    }).catch((err) => {
      console.log(err);
    });
  }

  /**
   *This method saves the post as the current draft so that it can be returned
   later when getCurrentDraft is called
   * @param post
   */
  setCurrentDraft(post: Post): void {
    this.draft = post;
    console.log('Set Current draft to post id' + this.draft.postid);
  }
  getCurrentDraft(): Post {
    if (this.draft) {
      return this.draft;
    } else {
      console.log("We're just returning a placeholder. Please know that.");
      let placeholder = new Post();
      return placeholder;
    }
  }
}
