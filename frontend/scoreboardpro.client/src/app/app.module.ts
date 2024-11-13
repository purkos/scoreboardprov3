import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatIconModule } from "@angular/material/icon";
import { HeaderComponent } from "./components/header/header.component";
import { SidenavComponent } from "./components/sidenav/sidenav.component";
import { HomeComponent } from "./pages/home/home.component";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { AboutComponent } from "./pages/about/about.component";
import { ContactComponent } from "./pages/contact/contact.component";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { MatMenuModule } from "@angular/material/menu";
import { PlayersComponent } from "./pages/players/players.component";
import { TopPlayersComponent } from "./pages/top-players/top-players.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { RankingComponent } from "./pages/ranking/ranking.component";
import { SearchBarComponent } from "./pages/players/components/search-bar/search-bar.component";
import { PlayerComponent } from "./pages/players/player/player.component";
import { PlayerDetailsComponent } from './pages/players/player-details/player-details.component';
import { UserManagement } from './pages/profile/components/user-management/user-management';
import { FavoritePlayersComponent } from './pages/profile/components/favorite-players/favorite-players.component';
import { RatedPlayersComponent } from './pages/profile/components/rated-players/rated-players.component';
import {MatButtonModule} from '@angular/material/button';
import {AuthInterceptor} from './Interceptors/AuthInterceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    PlayersComponent,
    TopPlayersComponent,
    ProfileComponent,
    RankingComponent,
    SearchBarComponent,
    PlayerComponent,
    PlayerDetailsComponent,
    UserManagement,
    FavoritePlayersComponent,
    RatedPlayersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatIconModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatMenuModule,
    FormsModule,
    MatButtonModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
