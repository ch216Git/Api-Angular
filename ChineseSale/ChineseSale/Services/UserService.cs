using ChineseSale.Dtos;
using ChineseSale.Models;
using ChineseSale.Repositories;
using System.Text;
using System.Security.Cryptography;

namespace ChineseSale.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            return Convert.ToBase64String(sha256.ComputeHash(Encoding.UTF8.GetBytes(password)));
        }
        public async Task<IEnumerable<GetUserDto>> GetAllUsersAsync()
        {
            IEnumerable<User> users = await _userRepository.GetAllUsersAsync();
            List<GetUserDto> userDtos = new List<GetUserDto>();
            foreach (var user in users)
            {
                GetUserDto userDto = new GetUserDto()
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Address = user.Address,
                    Phone = user.Phone,
                    UserName = user.UserName,
                    Role = user.Role
                };
                userDtos.Add(userDto);
            }
            return userDtos;
        }

        public async Task<GetUserDto?> GetUserByIdAsync(int Id)
        {
            User user = await _userRepository.GetUserByIdAsync(Id);
            if (user != null)
            {


                GetUserDto userDto = new GetUserDto()
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Address = user.Address,
                    Phone = user.Phone,
                    UserName = user.UserName,
                    Role = user.Role
                };
                return userDto;
            }
            else
                throw new ArgumentException("user not found");
        }
        public async Task<GetUserDto?> GetUserByUserNameAsync(string UserName)
        {
            User user = await _userRepository.GetUserByUserNameAsync(UserName);
            if (user != null)
            {
                GetUserDto userDto = new GetUserDto()
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Address = user.Address,
                    Phone = user.Phone,
                    UserName = user.UserName,
                    Role = user.Role
                };
                return userDto;
            }
            else
                throw new ArgumentException("user not found");
        }
        public async Task<GetUserDto> CreateUserAsync(CreateUserDto userDto)
        {
            User duplicate = await _userRepository.GetUserByUserNameAsync(userDto.UserName);
            if (duplicate != null)
            {
                throw new ArgumentException("username already exists");
            }
            User user = new User()
            {
                Name = userDto.Name,
                Email = userDto.Email,
                Address = userDto.Address,
                Phone = userDto.Phone,
                UserName = userDto.UserName,
                Password = HashPassword(userDto.Password),
                Role = Role.Customer

            };

            await _userRepository.CreateUserAsync(user);
            User user1 = await _userRepository.GetUserByIdAsync(user.Id);

            return new GetUserDto()
            {
                Id = user1.Id,
                Name = user1.Name,
                Email = user1.Email,
                Address = user1.Address,
                Phone = user1.Phone,
                UserName = user1.UserName,
                Role = user1.Role

            };
        }
        public async Task<GetUserDto?> UpdateUserAsync(UpdateUserDto userDto)
        {
            User user = await _userRepository.GetUserByIdAsync(userDto.Id);
            if (user == null)
            {
                throw new ArgumentException("not found user");
            }
            if(user.UserName != userDto.UserName) { 
                User duplicate = await _userRepository.GetUserByUserNameAsync(userDto.UserName);
                if (duplicate != null)
                {
                    throw new ArgumentException("username already exists");
                }
            }
            if(userDto.Name!=null) user.Name = userDto.Name;
            if (userDto.Email != null)  user.Email = userDto.Email;
            if (userDto.Address != null) user.Address = userDto.Address;
            if (userDto.Phone != null)  user.Phone = userDto.Phone;
            if (userDto.UserName != null)  user.UserName = userDto.UserName;
            User user1 = await _userRepository.UpdateUserAsync(user);
            return await GetUserByIdAsync(user1.Id);
        }

        public async Task<bool> DeleteUserAsync(int Id)
        {
            User user = await _userRepository.GetUserByIdAsync(Id);
            if (user == null)
                return false;
            await _userRepository.DeleteUserAsync(user);
            return true;
        }
        public async Task<User> LoginAsync(LoginDto dto)
        {
            var user = await _userRepository.GetUserByUserNameAsync(dto.UserName);
            if (user == null) 
                throw new UnauthorizedAccessException("Invalid credentials");

            if (user.Password != HashPassword(dto.Password))
                throw new UnauthorizedAccessException("Invalid credentials");

            return user;
        }


    }
}
