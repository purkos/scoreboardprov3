import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, Observable, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { enviroment } from "../enviroment/enviroment";
import { Player } from "../models/player.model";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class PlayerService {
  readonly apiSoccerUrl = enviroment.soccerApiUrl;
  userId!: number;
  readonly apiUrl = enviroment.apiUrl;
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  public searchPlayer(playerName: string): Observable<Player[]> {
    return this.http
      .get<Player[]>(`${this.apiSoccerUrl}/searchplayers.php?p=${playerName}`)
      .pipe(
        map((response: any) => response.player as Player[]),
        map((players: Player[]) => {
          // Filter the players based on the strSport property
          return players.filter((player) => player.strSport === "Soccer");
        }),
      );
  }
  public getPlayerById(playerId: string):Observable<any> {
    return this.http.get(`${this.apiSoccerUrl}/lookupplayer.php?id=${playerId}`).pipe(
        map((response: any)=> {
          return response.players[0]
        })
    )
  }
  public addPlayerToFav(playerId: string): Observable<any> {
    const payload = { PlayerId: playerId};

    return this.http
      .post<any>(`${this.apiUrl}/player/add-to-favorites`, payload)
      .pipe(
        catchError((error) => {
          console.error("Error adding player to favorites", error);
          return throwError(error);
        }),
      );
  }
  public isInFavorites(playerId: string): Observable<any> {
    return this.http.get<boolean>(
        `${this.apiUrl}/player/is-favorite/${playerId}`
    )
  }
  public removePlayerFromFav(playerId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/player/remove-from-favorites/${playerId}`)
  }

  public getFavoritePlayers(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/account/favorite-players`)
  }

  public addRating(playerId: string, rating: number): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/player/rate`, { playerId, rating });
  }

  public getRatedPlayersByUsers(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/player/user-ratings`);
  }

  public updateRating(playerId: string, rating: number): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/player/rate`, {playerId, rating});
  }

  public deleteRating(playerId: string): Observable<any> {
      return this.http.delete<any>(`${this.apiUrl}/player/rate/${playerId}`);
  }
}
