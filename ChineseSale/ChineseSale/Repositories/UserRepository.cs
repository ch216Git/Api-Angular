using ChineseSale.Data;
using ChineseSale.Models;
using Microsoft.EntityFrameworkCore;

namespace ChineseSale.Repositories
{
    public class UserRepository: IUserRepository
    {
        private readonly ChineseSaleContextDB _context;
        public UserRepository(ChineseSaleContextDB context)
        {
            _context = context;
        }
        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users
                .ToListAsync();
        }
        public async Task<User?> GetUserByIdAsync(int Id)
        {
            return await _context.Users
                 .FirstOrDefaultAsync(c => c.Id == Id);
        }
        public async Task<User?> GetUserByUserNameAsync(string UserName)
        {
            return await _context.Users
                 .FirstOrDefaultAsync(c => c.UserName == UserName);
        }
        public async Task<User> CreateUserAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }
        public async Task<User?> UpdateUserAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return user;
        }
        public async Task DeleteUserAsync(User user)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }

    }
}
