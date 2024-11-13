import {Injectable} from '@angular/core';
import {enviroment} from '../enviroment/enviroment';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {User} from '../models/user.model';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: "root"
})
export class UserService {
    private readonly apiUrl = `${enviroment.apiUrl}/account`;
    private userInfoSubject = new BehaviorSubject<any | null>(null);
    public userInfo$ = this.userInfoSubject.asObservable();

    constructor(private http: HttpClient) {
    }

    public getUserInfo(): Observable<any> {
        return this.http.get<User>(`${this.apiUrl}/user-info`).pipe(
            tap((user) => this.userInfoSubject.next(user))
        );
    }

    public getAllUsers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/users`);
    }

    public deleteUser(userId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/users/${userId}`);
    }

    public getRatedPlayers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/rated-players`);
    }

    public updatePlayerRating(playerId: number, rating: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/rate-player/${playerId}`, { rating });
    }

    public addFavoritePlayer(playerId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/favorite-players`, { playerId });
    }

    public removeFavoritePlayer(playerId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/favorite-players/${playerId}`);
    }

}
