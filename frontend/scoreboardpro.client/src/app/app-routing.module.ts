import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { AboutComponent } from "./pages/about/about.component";
import { ContactComponent } from "./pages/contact/contact.component";
import { AuthComponent } from "./pages/auth/auth.component";
import { PlayersComponent } from "./pages/players/players.component";
import { PlayerDetailsComponent } from "./pages/players/player-details/player-details.component";
import { ProfileComponent } from "./pages/profile/profile.component";

const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "about", component: AboutComponent },
  { path: "contact", component: ContactComponent },
  { path: "auth/:action", component: AuthComponent },
  { path: "players", component: PlayersComponent },
  { path: "players/:id", component: PlayerDetailsComponent },
  { path: "profile", component: ProfileComponent },
  { path: "", component: HomeComponent, pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
