import { Component, inject, Input, OnInit } from "@angular/core";
import { Player } from "../../../models/player.model";
import { AuthService } from "../../../services/auth.service";
import { PlayerService } from "../../../services/player.service";

@Component({
  selector: "app-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.sass"],
})
export class PlayerComponent implements OnInit {
  @Input() playerInfo!: Player;
  responseMessage: string = "";
  rating: number | null = null;
  // isAddedToFav = new BehaviorSubject<boolean>(false);
  isAddedToFav: boolean = false;
  public authService = inject(AuthService);
  private playerService = inject(PlayerService);
  public isImageAvailable(): boolean {
    return !!this.playerInfo.strCutout;
  }
  public onAddToFav(playerId: string) {
    this.playerService.addPlayerToFav(playerId).subscribe(
        (response) => {
          this.responseMessage = response.message;
          this.isAddedToFav = true;
          setTimeout(() => {
                      this.responseMessage = "";
                    }, 1000);

        },
        (error) => {
            console.log(error)
        }
    )
  }
  public onIsInFav(playerId: string) {
    this.playerService.isInFavorites(playerId).subscribe(
      (response) => {
          this.isAddedToFav = response.isFavorite;
      },
      (error) => {
        console.error(error);
      },
    );

  }
  public onRemoveFav(playerId: string) {
    this.playerService.removePlayerFromFav(playerId).subscribe(
        (response)=> {
          this.isAddedToFav = false;
          this.responseMessage = response.message
          setTimeout(() => {
            this.responseMessage = "";
          }, 1000);
        },
        (error) => {
          console.error(error)
        }
    )
  }

  public onSubmitRating(playerId: string) {
      if(this.rating == null || this.rating < 1 || this.rating > 10) {
          this.responseMessage = "Please provide a rating between 1 and 10";
          return;
      }

      this.playerService.addRating(playerId, this.rating).subscribe(
          (response) => {
              this.responseMessage = response.message;
              setTimeout(() => {
                  this.responseMessage = '';
              }, 1000);
          },
          (error) => {
              console.error(error);
              this.responseMessage = 'Error submitting rating.';
          }
      );
  }
  public onRatingChange(event: Event): void {
      const input = event.target as HTMLInputElement;
      const value = parseFloat(input.value);
      if (!isNaN(value)) {
          this.rating = value;
      } else {
          this.rating = null; // Reset if invalid input
      }
  }

  ngOnInit() {
      this.onIsInFav(this.playerInfo.idPlayer);
  }
}
