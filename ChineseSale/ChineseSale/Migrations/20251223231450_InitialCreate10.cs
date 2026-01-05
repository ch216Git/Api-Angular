using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChineseSale.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate10 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BasketId",
                table: "Gifts",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Gifts_BasketId",
                table: "Gifts",
                column: "BasketId");

            migrationBuilder.AddForeignKey(
                name: "FK_Gifts_Baskets_BasketId",
                table: "Gifts",
                column: "BasketId",
                principalTable: "Baskets",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Gifts_Baskets_BasketId",
                table: "Gifts");

            migrationBuilder.DropIndex(
                name: "IX_Gifts_BasketId",
                table: "Gifts");

            migrationBuilder.DropColumn(
                name: "BasketId",
                table: "Gifts");
        }
    }
}
