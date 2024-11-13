import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.sass"],
})
export class ProfileComponent implements OnInit{
  public userInfo: any = {};
  isAdminUser: boolean = false;
  isEditMode: boolean = false;

  constructor(private userService: UserService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.isAdminUser = this.authService.isAdmin();
    this.userService.getUserInfo().subscribe((user) => {
        this.userInfo = user;
    })
  }
}
