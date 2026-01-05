using Microsoft.EntityFrameworkCore;
using ChineseSale.Data;

namespace ChineseSale.Data
{
    public class ChineseSaleDbFactory
    {
        private const string ConnectionString = "Server=DESKTOP-01CJEFL;DataBase=ChineseSaleContextDB_216242123;Integrated Security=SSPI;" +
           "Persist Security Info=False;TrustServerCertificate=true";

        public static ChineseSaleContextDB CreateContext()
        {
            var optionsBuilder = new DbContextOptionsBuilder<ChineseSaleContextDB>();
            optionsBuilder.UseSqlServer(ConnectionString);
            return new ChineseSaleContextDB(optionsBuilder.Options);
        }
    }
}
