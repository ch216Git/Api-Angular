using Microsoft.EntityFrameworkCore;
using ChineseSale.Models;

namespace ChineseSale.Data
{
    public class ChineseSaleContextDB:DbContext
    {
        internal readonly object Gift;

        public ChineseSaleContextDB(DbContextOptions<ChineseSaleContextDB> options) : base(options) { }
        public DbSet<Gift> Gifts => Set<Gift>();
        public DbSet<User> Users => Set<User>();
        public DbSet<Basket> Baskets => Set<Basket>();
        public DbSet<Prize> Prizes => Set<Prize>();
        public DbSet<Donor> Donors => Set<Donor>();
        public DbSet<Category> Categorys => Set<Category>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<Package> Packages => Set<Package>();

    }
}
