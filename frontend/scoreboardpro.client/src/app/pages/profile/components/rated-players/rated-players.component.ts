import {Component, OnInit} from '@angular/core';
import {PlayerService} from '../../../../services/player.service';
import {forkJoin, map} from 'rxjs';

@Component({
  selector: 'app-rated-players',
  templateUrl: './rated-players.component.html',
  styleUrls: ['./rated-players.component.sass']
})
export class RatedPlayersComponent implements OnInit{
  public ratedPlayers: any[] = [];

  constructor(private playerService: PlayerService) {
  }

  ngOnInit() {
    this.loadRatedPlayers();
  }

  public loadRatedPlayers(): void {
    this.ratedPlayers = [];
    this.playerService.getRatedPlayersByUsers().subscribe((players: any[]) => {
      const playerDetailsRequests = players.map(player =>
          this.playerService.getPlayerById(player.playerId).pipe(
              map(playerDetails => ({
                ...player,
                ...playerDetails
              }))
          )
      );

      forkJoin(playerDetailsRequests).subscribe((playersWithDetails) => {
        this.ratedPlayers = playersWithDetails;
      });

    });
  }

  public updateRating(playerId: string, rating: number): void {
    this.playerService.updateRating(playerId,rating).subscribe(() => {
      this.loadRatedPlayers();
    })
  }

  public deleteRating(playerId: string): void {
    this.playerService.deleteRating(playerId).subscribe(()=> {
      this.loadRatedPlayers();
    })
  }

  public sortRated(sortBy: string): void {
    switch (sortBy) {
      case "sortDesc":
        this.ratedPlayers.sort((a,b)=>a.rating - b.rating)
        break;
      case "sortAsc":
        this.ratedPlayers.sort((a,b)=> b.rating - a.rating);
        break;
    }
  }
}
