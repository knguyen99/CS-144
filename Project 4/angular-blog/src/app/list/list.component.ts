import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { Post } from '../blog.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  posts: Post[];

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    console.log('start list');
    console.log(document.cookie);
    //TO-DO: figure out how to send list component the fact that we have deleted a post and make that update.
  }

  private parseJWT(token: string) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  }
  setCurrent(a_post: Post): void {
    this.blogService.setCurrentDraft(a_post);
  }
  //TO-DO: figure out the scenario where we click new post, we display the edit view of that new post. ,try to oak demo
  createPost() {
    //get max postid atm and pass it to navigate. The reason we dont add to lists because we havent actually
    //saved it yet so why would we want to display it yet.
    //console.log(this.parseJWT(document.cookie).usr);
    this.blogService
      .fetchPosts(this.parseJWT(document.cookie).usr)
      .then((data) => {
        let all_posts: Post[] = Array.from(data).sort(
          (a, b) => a.postid - b.postid
        );

        if (all_posts.length == 0) {
          console.log('Clicked new post and there were no posts left so use 1');
          let newpost = new Post();
          newpost.body = ' ';
          newpost.title = ' ';
          newpost.created = new Date();
          newpost.modified = new Date();
          newpost.postid = 1;
          this.blogService.real_postid = 1;
          this.blogService
            .newPost(this.parseJWT(document.cookie).usr, newpost)
            .then(() => {
              this.router.navigate(['/edit/' + 1]);
            });
        } else {
          console.log('Clicked new post and there are existing posts so use');

          let new_postid = all_posts[all_posts.length - 1].postid + 1;
          this.blogService.real_postid = new_postid;
          let newpost = new Post();
          newpost.body = ' ';
          newpost.title = ' ';
          newpost.created = new Date();
          newpost.modified = new Date();
          newpost.postid = new_postid;
          /*
          basically on new post, add it to the db and then route to edit.
           that way the get request to new_postid will be valid.

          Flow: 
            1) Add new post to DB
            2) Navigate to url with the new postid and it will work because the post exists.
            3) Once we navigate to the url, we check if the case of new Post occured and just delete the post from db.
            4) Actually process new post.
          */
          this.blogService
            .newPost(this.parseJWT(document.cookie).usr, newpost)
            .then(() => {
              this.router.navigate(['/edit/' + new_postid]);
            });
        }
      });
  }

  ngOnInit(): void {
    console.log(this.parseJWT(document.cookie));
    //Show the list in sorted order by ascending postid.
    this.blogService
      .fetchPosts(this.parseJWT(document.cookie).usr)
      .then((data) => {
        let all_posts: Post[] = Array.from(data).sort(
          (a, b) => a.postid - b.postid
        );
        //all_posts.forEach((ele) => console.log(ele.postid));
        this.posts = all_posts;
      })
      .then(() => console.log('Length of the posts is ' + this.posts.length));
  }
}
