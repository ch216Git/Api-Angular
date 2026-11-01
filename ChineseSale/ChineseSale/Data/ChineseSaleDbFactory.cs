using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Text.Json;

namespace ChineseSale.Data
{
    public static class ChineseSaleDbFactory
    {
        public static ChineseSaleContextDB CreateContext()
        {
            // 1. Environment variable (used on Render and locally)
            string? connectionString =
                Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
                ?? Environment.GetEnvironmentVariable("DefaultConnection")
                ?? Environment.GetEnvironmentVariable("CONNECTION_STRING");

            // 2. appsettings.json -> ConnectionStrings:DefaultConnection
            if (string.IsNullOrWhiteSpace(connectionString))
            {
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
                    // ignore
                }
            }

            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new InvalidOperationException(
                    "Connection string not found. Set ConnectionStrings__DefaultConnection.");
            }

            var optionsBuilder = new DbContextOptionsBuilder<ChineseSaleContextDB>();
            optionsBuilder.UseNpgsql(connectionString);
            return new ChineseSaleContextDB(optionsBuilder.Options);
        }
    }
}