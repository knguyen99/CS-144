import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { Post } from '../blog.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

/**
 * To-Do: Debug when a app navigates to edit/:id, figure out how to display editComponent with
 * the title and body textarea filled in with post corresponding to postid = id.
 */
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  post: Post;
  postid: number;
  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    //the Idea is to just query for the post given the username and postid from the url.
    //Then assign our property variables to the queried post in the promise
    console.log(+this.route.snapshot.paramMap.get('id'));

    route.paramMap.subscribe(() =>
      this.blogService
        .getPost(
          this.parseJWT(document.cookie).usr,
          +this.route.snapshot.paramMap.get('id')
        )
        .then((queried_post) => {
          console.log('Edit queried post ' + queried_post);

          //if postid's don't match, then we know we didn't click new post. When that happens, that means they should be identical
          //b/c I put the postid in the database AND as a property of blogservice to be the same in that scenario.
          if (
            typeof queried_post != 'undefined' &&
            this.blogService.real_postid != queried_post.postid
          ) {
            this.post = queried_post;
            this.postid = queried_post.postid;
            this.blogService.setCurrentDraft(this.post);
          } else {
            ///When we click new post, we'll have to delete the copy in the database then make the new post.
            this.blogService
              .deletePost(
                this.parseJWT(document.cookie).usr,
                this.blogService.real_postid
              )
              .then(() => {
                let new_post = new Post();
                new_post.title = '';
                new_post.created = new Date();
                new_post.modified = new Date();
                new_post.body = '';
                new_post.postid = +this.route.snapshot.paramMap.get('id'); //use the postid from the url.
                this.post = new_post;

                this.blogService.setCurrentDraft(new_post);
              });
          }
        })
    );
  }
  refresh(): void {
    window.location.reload();
  }
  private parseJWT(token: string) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  }

  processDelete(): void {
    //this.router.navigate(['/']); //then navigate back to /
    //Delete the post from db then refresh.
    this.blogService
      .deletePost(this.parseJWT(document.cookie).usr, this.postid)
      .then(() => {
        this.post = null;
        this.postid = 0;
        this.refresh();
      });
  }
  processSave(): void {
    if (this.post.body == '' && this.post.title == '') {
      //If we got nothing to begin with b/c new post and it still was empty, dont save.
      return;
    }
    //Need to decide whether to POST or PUT.
    this.blogService
      .fetchPosts(this.parseJWT(document.cookie).usr)
      .then((all_posts) => {
        if (all_posts.length > 0) {
          let max_post_id = all_posts[all_posts.length - 1].postid + 1;
          console.log('The max post id' + max_post_id);
          console.log('This post id' + this.post.postid);
          if (max_post_id == this.post.postid) {
            //If this is a new post - POST
            this.blogService
              .newPost(this.parseJWT(document.cookie).usr, this.post)
              .then(() => {
                this.refresh();
              });
          } else {
            //modifying an existing post -PUT
            this.blogService
              .updatePost(this.parseJWT(document.cookie).usr, this.post)
              .then(() => {
                this.refresh();
              });
          }
        } else {
          //there aren't any posts in the db at all.
          if (this.post.postid == 1) {
            // case when new post
            this.blogService
              .newPost(this.parseJWT(document.cookie).usr, this.post)
              .then(() => {
                this.refresh();
              });
          }
          //otherwise don't need to do anything.
        }
      });
  }
  ngOnInit(): void {
    let cur_draft = this.blogService.getCurrentDraft();
    //If there is a current draft just use that.
    if (cur_draft != null && this.postid == cur_draft.postid) {
      //use currentDraft
      this.post = cur_draft;
    }
  }
}
