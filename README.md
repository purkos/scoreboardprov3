# ScoreBoardPro Backend API Documentation
## Overview
### The ScoreBoardPro API provides endpoints for user authentication, player management, and rating. The API supports features like user registration, login, managing favorites, and rating players. It is built using ASP.NET Core and Entity Framework Core with JWT authentication.

# API Documentation

## Table of Contents
- [Account Endpoints](#account-endpoints)
  - [Register](#post-apicontrollerregister)
  - [Login](#post-apicontrollerlogin)
  - [Logout](#post-apicontrollerlogout)
  - [Get User Info](#get-apicontrolleruser-info)
  - [Get Favorite Players](#get-apicontrollerfavorite-players)
  - [Get All Users](#get-apicontrollerusers)
  - [Delete User](#delete-apicontrollerusersid)
  - [Assign Role](#post-apicontrollerassign-role)
- [Player Endpoints](#player-endpoints)
  - [Add to Favorites](#post-apiplayeradd-to-favorites)
  - [Check Favorite Status](#get-apiplayeris-favoriteplayerid)
  - [Rate a Player](#post-apiplayerrate)
  - [Remove from Favorites](#delete-apiplayerremove-from-favoritesplayerid)
  - [Get User Ratings](#get-apiplayeruser-ratings)
  - [Get Player Stats](#get-apiplayerplayer-stats)
  - [Delete Rating](#delete-apiplayerrateplayerid)

---

## Account Endpoints
These endpoints manage user authentication, authorization, and account information.

- **`POST /api/account/register`**  
  Registers a new user. Expects `email` and `password` in the request body. Returns a JWT on success.

- **`POST /api/account/login`**  
  Authenticates a user with email and password. Returns a JWT on success.

- **`POST /api/account/logout`**  
  Logs out the authenticated user, ending their session.

- **`GET /api/account/user-info`**  
  Retrieves the authenticated user's details, including user ID, email, username, and roles. Requires a valid JWT.

- **`GET /api/account/favorite-players`**  
  Retrieves the list of the user's favorite players. Requires a valid JWT.

- **`GET /api/account/users`**  
  Retrieves a list of all users (excluding the currently authenticated user). Requires an Admin role.

- **`DELETE /api/account/users/{id}`**  
  Deletes a specified user by their ID. Requires an Admin role.

- **`POST /api/account/assign-role`**  
  Assigns a specified role to a user. Expects `email` and `role` in the request body. Requires an Admin role.

## Player Endpoints
These endpoints manage player information, favorites, and ratings.

- **`POST /api/player/add-to-favorites`**  
  Adds a specified player to the authenticated user's favorites list. Expects `playerId` in the body. Requires a valid JWT.

- **`GET /api/player/is-favorite/{playerId}`**  
  Checks if a specific player is in the user's favorites. Requires a valid JWT.

- **`POST /api/player/rate`**  
  Adds or updates a rating for a specific player. Expects `playerId` and `rating` in the body. Requires a valid JWT.

- **`DELETE /api/player/remove-from-favorites/{playerId}`**  
  Removes a specific player from the user's favorites. Requires a valid JWT.

- **`GET /api/player/user-ratings`**  
  Retrieves all player ratings made by the authenticated user. Requires a valid JWT.

- **`GET /api/player/player-stats`**  
  Retrieves aggregated rating statistics for all players, including the count and average rating for each player.

- **`DELETE /api/player/rate/{playerId}`**  
  Deletes the authenticated user's rating for a specific player. Requires a valid JWT.

---

Each endpoint's request and response formats follow standard JSON structures. Use JWT authentication for all endpoints that require user identification.

## AddFavoritePlayer (Stored Procedure)
- This stored procedure adds a player to the logged-in user's favorites. It checks if the player is already a favorite and adds the player to the FavPlayers table
  <img width="944" alt="procedura" src="https://github.com/user-attachments/assets/dfa0dfa4-4340-4192-8611-f8a75e3aa2cb" />
- Explanation: This procedure ensures that a player is only added to the favorites if they aren't already present.


## GetAverageRating (Function)
- This function calculates and returns the average rating for each player from the ratings stored in the database.
  <img width="562" alt="funkcja_avg" src="https://github.com/user-attachments/assets/a2ba50d6-fa72-4385-bddf-ee1991c09d92" />
- Explanation: This function retrieves the average rating for a specific player by calculating the mean of all ratings associated with the player.

## DeleteUserData (Trigger)
- This trigger is activated when a user is deleted, automatically removing all data related to that user from the FavPlayers and PlayerRatings tables.
  <img width="609" alt="trigger1" src="https://github.com/user-attachments/assets/2f876d2f-e24c-48ca-9201-b3589e9c129c" />
  <img width="468" alt="trigger2" src="https://github.com/user-attachments/assets/d985acef-aa6b-4964-94ca-7e8612de8c46" />
- Explanation: This trigger ensures data integrity by deleting the user's related data from the FavPlayers and PlayerRatings tables whenever the user is removed from the system.

