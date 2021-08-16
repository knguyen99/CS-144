import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { Post } from '../blog.service';
import { ActivatedRoute } from '@angular/router';
import { Parser, HtmlRenderer } from 'commonmark';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  post: Post;
  postid: number;
  htmlTitle: string;
  htmlBody: string;
  parser: Parser;
  htmlRender: HtmlRenderer;

  constructor(
  	private blogService: BlogService,
    private route: ActivatedRoute,
    public router: Router 
	) {
  	this.parser = new Parser();
  	this.htmlRender = new HtmlRenderer();

  }

  ngOnInit(): void {
  	this.route.paramMap.subscribe(() => this.getPost());
  	let cur_draft = this.blogService.getCurrentDraft();
    //If there is a current draft just use that.
    if (cur_draft != null && this.postid == cur_draft.postid) {
      //use currentDraft
      this.post = cur_draft;
    }
  }

 private parseJWT(token: string) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  }

  getPost(): void {
  	this.postid = +this.route.snapshot.paramMap.get("id");
  	this.blogService.getPost( this.parseJWT(document.cookie).usr ,this.postid)
  		.then((queried_post) => {
  			 if (
            	typeof queried_post != 'undefined' &&
            	this.blogService.real_postid != queried_post.postid
          	){
  			 	this.htmlTitle = this.htmlRender.render(this.parser.parse(queried_post.title));
  			 	this.htmlBody = this.htmlRender.render(this.parser.parse(queried_post.body));
  			 }
  		}); 
  }



}
