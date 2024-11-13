using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ScoreBoardProBackend.Migrations
{
    /// <inheritdoc />
    public partial class RemoveForeignKeyFromFavPlayers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FavPlayers_AspNetUsers_UserId",
                table: "FavPlayers");

            migrationBuilder.DropForeignKey(
                name: "FK_FavPlayers_Player_PlayerId",
                table: "FavPlayers");

            migrationBuilder.DropTable(
                name: "Player");

            migrationBuilder.DropIndex(
                name: "IX_FavPlayers_PlayerId",
                table: "FavPlayers");

            migrationBuilder.DropIndex(
                name: "IX_FavPlayers_UserId",
                table: "FavPlayers");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Player",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Player", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FavPlayers_PlayerId",
                table: "FavPlayers",
                column: "PlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_FavPlayers_UserId",
                table: "FavPlayers",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_FavPlayers_AspNetUsers_UserId",
                table: "FavPlayers",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FavPlayers_Player_PlayerId",
                table: "FavPlayers",
                column: "PlayerId",
                principalTable: "Player",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
