import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Post } from './post.model'
import { catchError, map, tap } from 'rxjs/operators'
import { Subject, throwError } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class PostService {
  errorSubject = new Subject()

  constructor(private http: HttpClient) {}

  recreateAndStore(title: string, content: string): any {
    const postData: Post = { title: title, content: content }
    return this.http
      .post<{ name: string }>(
        'https://ng-complete-guide-97598-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
        postData,
        {
          observe: 'response',
        },
      )
      .subscribe(
        (data) => {
          // console.log(data)
        },
        (err) => {
          this.errorSubject.next(err)
        },
      )
  }

  fetchPosts() {
    let paramsInstance = new HttpParams()
    // makes a new instance because it is immutable
    paramsInstance = paramsInstance.append('a', 'b')
    paramsInstance = paramsInstance.append('c', 'd')
    return (
      this.http
        .get<{ [key: string]: Post }>(
          'https://ng-complete-guide-97598-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
          {
            headers: new HttpHeaders({
              'Custom-Header': 'Hello',
              'another-header': 'world',
            }),
            params: paramsInstance,
          },
        )
        .pipe(
          map((responseData) => {
            const postsArray: Post[] = []
            for (const key in responseData) {
              if (responseData.hasOwnProperty(key)) {
                postsArray.push({ ...responseData[key], id: key })
              }
            }
            return postsArray
          }),
          catchError((errorResponse) => {
            console.log(errorResponse)
            // this is a rethrow
            // i can also give it custom error message
            // return throwError({message: 'This is my custom error message!'})
            return throwError(errorResponse)
          }),
        )
    )
  }

  deletePosts(): any {
    return this.http
      .delete(
        'https://ng-complete-guide-97598-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
        {
          observe: 'events',
          responseType: 'json',
        },
      )
      .pipe(
        tap((event) => {
          if (event.type === HttpEventType.Sent) {
            console.log('sent')
            console.log(event)
          }
          if (event.type === HttpEventType.Response) {
            console.log('response')
            console.log(event)
          }
        }),
      )
  }
}
