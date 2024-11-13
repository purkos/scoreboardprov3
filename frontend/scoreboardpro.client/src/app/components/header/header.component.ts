import { Component, inject, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.sass"],
})
export class HeaderComponent implements OnInit {
  isAuthenticated: boolean = false;
  user!: any;
  private authService = inject(AuthService);

  ngOnInit() {
    this.authService.autoLogin();
    //
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user
    })
    // this.user = this.authService.getUserData();
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.isAuthenticated = false;
    });
  }
}
