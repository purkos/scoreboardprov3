import { Component, inject, OnInit } from "@angular/core";
import { PlayerService } from "../../../../services/player.service";
import {forkJoin} from 'rxjs';

interface FavoritePlayer {
  favorite_id: number;
  user_id: number;
  player_id: number;
  // Add other properties if needed
}
@Component({
  selector: "app-favorite-players",
  templateUrl: "./favorite-players.component.html",
  styleUrls: ["./favorite-players.component.sass"],
})
export class FavoritePlayersComponent implements OnInit {
  private playerService = inject(PlayerService);
  public favoritePlayersList: any[] = [];

  ngOnInit() {
    this.loadFavoritePlayers();
  }

  private loadFavoritePlayers() {
    this.playerService.getFavoritePlayers().subscribe((favoriteIds: any[]) => {
      const playerDetailsRequests = favoriteIds.map((data) => {
        return this.playerService.getPlayerById(data.playerId);
      });

      forkJoin(playerDetailsRequests).subscribe((players) => {
        this.favoritePlayersList = players;
      });
    });
  }
  public sortFavorites(sortBy: string): void {
    switch (sortBy) {
      case "sortDesc":
        this.favoritePlayersList.sort((a,b)=>a.strPlayer.localeCompare(b.strPlayer))
        break;
      case "sortAsc":
        this.favoritePlayersList.sort((a,b)=> b.strPlayer.localeCompare(a.strPlayer))
        break;
    }
  }

  public removeFromFavorites(playerId: string) {
    this.playerService.removePlayerFromFav(playerId).subscribe(()=> {
      this.loadFavoritePlayers();
    })
  }
}
