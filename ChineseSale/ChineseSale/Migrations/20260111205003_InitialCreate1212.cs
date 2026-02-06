using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChineseSale.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate1212 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CountNormalCard",
                table: "Packages");

            migrationBuilder.DropColumn(
                name: "TypeCard",
                table: "Gifts");

            migrationBuilder.RenameColumn(
                name: "CountSpecialCard",
                table: "Packages",
                newName: "CountCard");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CountCard",
                table: "Packages",
                newName: "CountSpecialCard");

            migrationBuilder.AddColumn<int>(
                name: "CountNormalCard",
                table: "Packages",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TypeCard",
                table: "Gifts",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
