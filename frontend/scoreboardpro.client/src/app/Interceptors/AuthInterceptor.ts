import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import {enviroment} from '../enviroment/enviroment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.getToken();

        const isAuthApi = req.url.includes(enviroment.apiUrl)

        if (token && isAuthApi) {
            const cloned = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            return next.handle(cloned);
        } else {
            return next.handle(req);
        }
    }
}
