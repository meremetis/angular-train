import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

export class LoginInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(req.headers);

    console.log('Outgoing requests')
    console.log(req.url)

    return next.handle(req).pipe(
      tap((event) => {
        if (event.type === HttpEventType.Response) {
          console.log('incoming response')
          console.log(event.body)
        }
      })
    )
  }
}
