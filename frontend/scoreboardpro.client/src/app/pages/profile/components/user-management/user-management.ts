import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import { AuthService } from "../../../../services/auth.service";
import {UserService} from '../../../../services/user.service';


 interface HistoryActions {
  history_id: number;
  user_id: number;
  action_description: string;
  short_desc: string;
  timestamp: Date;
}
@Component({
  selector: "app-user-management",
  templateUrl: "./user-management.html",
  styleUrls: ["./user-management.sass"],
})
export class UserManagement implements OnInit {
  users: any[] = [];
  sortedUsers: any[] = [];

  constructor(private userService: UserService) {
  }
  ngOnInit() {
    this.getUsers();
  }

  public getUsers(): void {
    this.userService.getAllUsers().subscribe((data: any[]) => {
      this.users = data;
      this.sortedUsers = [...this.users]
    })
  }
  public sortUsers(order: string) {
    this.sortedUsers = [...this.users];
    if (order === 'sortAsc') {
      this.sortedUsers.sort((a, b) => a.name.localeCompare(b.name));
    } else if (order === 'sortDesc') {
      this.sortedUsers.sort((a, b) => b.name.localeCompare(a.name));
    }
  }

  public deleteUser(userId: string) {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (confirmed) {
      this.userService.deleteUser(userId).subscribe(() => {
        this.users = this.users.filter(user => user.id !== userId);
        this.sortedUsers = [...this.users];
      });
    }
  }


}
