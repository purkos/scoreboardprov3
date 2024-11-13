import {Component, inject, OnInit} from '@angular/core';
import { PlayerService } from "../../../services/player.service";
import {Player} from '../../../models/player.model';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: "app-player-details",
  templateUrl: "./player-details.component.html",
  styleUrls: ["./player-details.component.sass"],
})
export class PlayerDetailsComponent implements OnInit {
  private playerService = inject(PlayerService);
  private route = inject(ActivatedRoute)
  player!: Player;

  ngOnInit() {
    this.route.params.subscribe((params)=> {
      const playerId = params["id"];
      this.playerService.getPlayerById(playerId).subscribe((response)=> {
        this.player = response;
      })
    })
  }
  public isImageAvailable(): boolean {
    return !!this.player?.strCutout;
  }
}
