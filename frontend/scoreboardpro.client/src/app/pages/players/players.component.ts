// players.component.ts
import { Component, inject } from "@angular/core";
import { PlayerService } from "../../services/player.service";
import { Player } from "../../models/player.model";

@Component({
  selector: "app-players",
  templateUrl: "./players.component.html",
  styleUrls: ["./players.component.sass"],
})
export class PlayersComponent {
  public isLoading: boolean = false;
  public errorResponse: string = "";
  // selectedPlayer: string = "";
  players!: Player[];
  private playerService = inject(PlayerService);

  public searchPlayer(playerName: string) {
    this.isLoading = true;
    this.errorResponse = "";
    this.playerService.searchPlayer(playerName).subscribe(
      (players) => {
        this.players = players;
        this.isLoading = false;
      },
      (error) => {
        this.errorResponse = "Player not found!";

        this.isLoading = false;
      },
    );
  }
  public sortPlayers(sortBy: string) {
    switch (sortBy) {
      case "sortDesc":
        this.players.sort((a, b) => a.strPlayer.localeCompare(b.strPlayer));
        break;
      case "sortAsc":
        this.players.sort((a, b) => b.strPlayer.localeCompare(a.strPlayer));
        break;
    }
  }
}
