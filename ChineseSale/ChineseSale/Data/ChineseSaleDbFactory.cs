using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Text.Json;
using ChineseSale.Data;

namespace ChineseSale.Data
{
    public static class ChineseSaleDbFactory
    {
<<<<<<< HEAD
        private const string ConnectionString = "Server=CYPY;DataBase=ChineseSaleDBB_329213227;Integrated Security=SSPI;" +
           "Persist Security Info=False;TrustServerCertificate=true";
=======
        // זה השם הנכון של המשתנה
        private const string ConnectionString = "Server=DESKTOP-01CJEFL;DataBase=ChineseSaleContextDB_216242123;Integrated Security=SSPI;" +
                    "Persist Security Info=False;TrustServerCertificate=true";
>>>>>>> b0bf302066fd1516797600f2f19cf39a4e8dca93

        public static ChineseSaleContextDB CreateContext()
        {
            string connectionString = null;
            try
            {
                var appSettingsPath = Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");
                if (File.Exists(appSettingsPath))
                {
                    var json = File.ReadAllText(appSettingsPath);
                    using var doc = JsonDocument.Parse(json);
                    if (doc.RootElement.TryGetProperty("ConnectionStrings", out var cs) &&
                        cs.TryGetProperty("DefaultConnection", out var def))
                    {
                        connectionString = def.GetString();
                    }
                }
            }
            catch
            {
                // ignore and fall back
            }

            if (string.IsNullOrWhiteSpace(connectionString))
            {
                connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
                                   ?? Environment.GetEnvironmentVariable("DefaultConnection")
                                   ?? Environment.GetEnvironmentVariable("CONNECTION_STRING");
            }
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                connectionString = ConnectionString;
            }

            var optionsBuilder = new DbContextOptionsBuilder<ChineseSaleContextDB>();
            optionsBuilder.UseSqlServer(connectionString);
            return new ChineseSaleContextDB(optionsBuilder.Options);
        }
    }
}