import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from './post.model';
import { PostService } from './post.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching: boolean = false;
  postsObservable: Observable<Post[]>;
  error = null;
  private errorSubscription: Subscription;

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.fetchPosts();

    this.errorSubscription = this.postService.errorSubject.subscribe(err => {
      this.error = err;
    })
  }

  onCreatePost(postData: Post) {
    this.postService
      .recreateAndStore(postData.title, postData.content)
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts() {
    this.postService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
    });
  }

  fetchPosts() {
    this.isFetching = true;
    // this.postsObservable = this.postService.fetchPosts().pipe(
    //   tap(() => {
    //     this.isFetching = false;
    //   }
    // ),
    // take(1))
    this.postService.fetchPosts().subscribe(
      (posts: Post[]) => {
        this.loadedPosts = posts;
        this.isFetching = false;
      },
      (error) => {
        this.isFetching = false;
        console.log(error);

        this.error = error.message;
      }
    );
  }

  onHandleError() {
    this.error = null;
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }
}
