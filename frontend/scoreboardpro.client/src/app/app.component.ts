import { Component, inject, OnInit } from "@angular/core";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.sass"],
})
export class AppComponent implements OnInit {
  title = "scoreboardpro";

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    if(this.authService.isTokenExpired())
      this.authService.deleteToken()
    else
      this.authService.autoLogin();
  }
}
