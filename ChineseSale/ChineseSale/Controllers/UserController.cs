using ChineseSale.Dtos;
using ChineseSale.Models;
using ChineseSale.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Logging;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using ChineseSale.Data;

namespace ChineseSale.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _config;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService userService, IConfiguration config, ILogger<UserController> logger)
        {
            _userService = userService;
            _config = config;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<ActionResult<GetUserDto>> Register(CreateUserDto dto)
        {
            try
            {
                var user = await _userService.CreateUserAsync(dto);
                _logger.LogInformation($"New user registered with ID: {user.Id}");
                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering user");
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(LoginDto dto)
        {
            try
            {
                var user = await _userService.LoginAsync(dto);
                var token = GenerateJwtToken(user);
                _logger.LogInformation($"User logged in with ID: {user.Id}");
                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging in user");
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("demo-login")]
        public async Task<ActionResult<string>> DemoLogin()
        {
            // Works only when DEMO_MODE=true is set in the environment
            var demo = Environment.GetEnvironmentVariable("DEMO_MODE");
            if (!string.Equals(demo, "true", StringComparison.OrdinalIgnoreCase))
                return NotFound();

            var db = HttpContext.RequestServices.GetRequiredService<ChineseSaleContextDB>();
            var users = db.Set<ChineseSale.Models.User>();

            var user = await users.FirstOrDefaultAsync(u => u.UserName == "demo");
            if (user == null)
            {
                user = new ChineseSale.Models.User
                {
                    UserName = "demo",
                    Password = Guid.NewGuid().ToString("N"),
                    Name = "Demo Manager",
                    Phone = "0500000000",
                    Address = "Demo",
                    Email = "demo@example.com",
                    Role = ChineseSale.Models.Role.Manager
                };
                users.Add(user);
                await db.SaveChangesAsync();
            }

            var token = GenerateJwtToken(user);
            return Ok(new { Token = token });
        }

        [Authorize(Roles = "Manager")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetUserDto>>> GetAllUsersAsync()
        {
            _logger.LogInformation("Retrieving all users");
            return Ok(await _userService.GetAllUsersAsync());
        }

        //[Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<GetUserDto>> GetUserByIdAsync(int id)
        {
            //var userId = GetUserIdFromToken();
            //var role = User.Claims.First(c => c.Type == ClaimTypes.Role).Value;

            //if (role != "Manager" && userId != id)
            //    return Forbid("You can only access your own profile.");

            _logger.LogInformation($"Retrieving user with ID: {id}");
            return Ok(await _userService.GetUserByIdAsync(id));
        }

        [Authorize]
        [HttpPost("Update")]
        public async Task<ActionResult<GetUserDto>> UpdateUserAsync(UpdateUserDto dto)
        {
            var userId = GetUserIdFromToken();

            if (userId != dto.Id)
                return Forbid("You can only update your own profile.");

            _logger.LogInformation($"Updating user with ID: {dto.Id}");
            return Ok(await _userService.UpdateUserAsync(dto));
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserAsync(int Id)
        {
            var userId = GetUserIdFromToken();
            if (userId != Id)
                return Forbid("You can only delete your own profile.");

            try
            {
                bool result = await _userService.DeleteUserAsync(Id);
                if (result)
                {
                    _logger.LogInformation($"User with ID: {Id} deleted successfully");
                    return Ok("User deleted successfully");
                }
                else
                {
                    _logger.LogWarning($"Failed to delete user with ID: {Id}");
                    return BadRequest("Failed to delete user");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user");
                return BadRequest(ex.Message);
            }
        }

        private string GenerateJwtToken(User user)
        {
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("id", user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.Role.ToString()),
                    new Claim("username", user.UserName),
                    new Claim(ClaimTypes.Name, user.Name.ToString()),
                    new Claim(ClaimTypes.StreetAddress, user.Address.ToString()),
                    new Claim(ClaimTypes.HomePhone, user.Phone.ToString()),
                    new Claim(ClaimTypes.Email, user.Email.ToString()),
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private int GetUserIdFromToken()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "id");
            if (userIdClaim == null)
                throw new UnauthorizedAccessException("User ID claim missing");

            return int.Parse(userIdClaim.Value);
        }
    }
}
