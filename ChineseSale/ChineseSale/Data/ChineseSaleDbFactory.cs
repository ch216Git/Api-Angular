using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Text.Json;
using ChineseSale.Data;

namespace ChineseSale.Data
{
    public static class ChineseSaleDbFactory
    {
        // Fallback connection string in case configuration is not available.
        private const string FallbackConnectionString = "Server=DESKTOP-01CJEFL;DataBase=ChineseSaleContextDB_216242123;Integrated Security=SSPI;Persist Security Info=False;TrustServerCertificate=true";


        public static ChineseSaleContextDB CreateContext()
        {
            // Try to read connection string from appsettings.json -> ConnectionStrings:DefaultConnection
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

            // Environment variable override (common in Docker/CI)
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
                                   ?? Environment.GetEnvironmentVariable("DefaultConnection")
                                   ?? Environment.GetEnvironmentVariable("CONNECTION_STRING");
            }

            if (string.IsNullOrWhiteSpace(connectionString))
            {
                connectionString = FallbackConnectionString;
            }

            var optionsBuilder = new DbContextOptionsBuilder<ChineseSaleContextDB>();
            optionsBuilder.UseSqlServer(connectionString);
            return new ChineseSaleContextDB(optionsBuilder.Options);
        }
    }
}
