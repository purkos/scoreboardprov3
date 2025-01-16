import {Component, OnInit} from '@angular/core';
import {PlayerService} from '../../services/player.service';
import {forkJoin, map, mergeMap} from 'rxjs';

@Component({
  selector: "app-ranking",
  templateUrl: "./ranking.component.html",
  styleUrls: ["./ranking.component.sass"],
})
export class RankingComponent implements  OnInit{
  public rankedPlayers: any[] = [];

  constructor(private playerService: PlayerService) {
  }

  ngOnInit() {
    this.loadRatedPlayers();
  }

  public loadRatedPlayers(): void {
    this.playerService.getPlayersRanking().pipe(
        mergeMap(players =>
            forkJoin(
                players.map(player =>
                    this.playerService.getPlayerById(player.playerId).pipe(
                        map(playerDetails => ({
                          ...player,
                          ...playerDetails
                        }))
                    )
                )
            )
        )
    ).subscribe({
      next: (rankedPlayers) => {
        this.rankedPlayers = rankedPlayers;
        console.log('Ranked players loaded:', this.rankedPlayers);
      },
      error: (err) => {
        console.error('Error loading player rankings', err);
      }
    });
  }


  public playerStats = [
    {
      strPlayer: 'Lionel Messi',
      strThumb: 'https://path-to-image.com/messi.jpg',
      averageRating: 9.8
    },
    {
      strPlayer: 'Cristiano Ronaldo',
      strThumb: 'https://path-to-image.com/ronaldo.jpg',
      averageRating: 9.5
    }
    // Kolejni zawodnicy...
  ];

}
