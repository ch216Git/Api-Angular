using ChineseSale.Data;
using ChineseSale.Models;
using Microsoft.EntityFrameworkCore;

namespace ChineseSale.Repositories
{
    public class BasketRepository:IBasketRepository
    {
        private readonly ChineseSaleContextDB _context;
        public BasketRepository(ChineseSaleContextDB context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Basket>> GetAllBasketAsync()
        {
            return await _context.Baskets
                .Include(Basket=> Basket.User)
                .ToListAsync();
        }

        public async Task<Basket?> GetBasketByIdAsync(int Id)
        {
            return await _context.Baskets
                .Include(Basket => Basket.User)
                 .FirstOrDefaultAsync(c => c.Id == Id);
        }
        public async Task<Basket?> GetBasketByUserIdAsync(int UserId)
        {
            return await _context.Baskets
                .Include(Basket => Basket.User)
                 .FirstOrDefaultAsync(c => c.UserId == UserId);
        }
        public async Task<Basket> CreateBasketAsync(Basket basket)
        {
            _context.Baskets.Add(basket);
            await _context.SaveChangesAsync();
            return basket;
        }
        public async Task DeleteBasketAsync(Basket basket)
        {
            _context.Baskets.Remove(basket);
            await _context.SaveChangesAsync();
        }
        public async Task<Basket?> AddGiftToBasket(Basket basket,Gift gift)
        {
            basket.GiftsId.Add(gift.Id);
            _context.Baskets.Update(basket);
            gift.SumCustomers += 1;
            _context.Gifts.Update(gift);
            await _context.SaveChangesAsync();
            
            return basket;
        }
        public async Task<Basket?> DeleteGiftFromBasket(Basket basket, Gift gift)
        {
            basket.GiftsId.Remove(gift.Id);
            gift.SumCustomers -= 1;
            _context.Gifts.Update(gift);
            _context.Baskets.Update(basket);
            await _context.SaveChangesAsync();
            return basket;
        }
        public async Task<Basket?> AddPackageToBasket(Basket basket, Package package)
        {
            basket.PackagesId.Add(package.Id);
            basket.Sum += package.Price;
            _context.Baskets.Update(basket);
            await _context.SaveChangesAsync();
            return basket;
        }
        public async Task<Basket?> DeletePackageFromBasket(Basket basket, Package package)
        {
            basket.PackagesId.Remove(package.Id);
            basket.Sum -= package.Price;
            _context.Baskets.Update(basket);
            await _context.SaveChangesAsync();
            return basket;
        }
    }
}
