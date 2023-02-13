using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Enteties;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseAPIController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        public AccountController(DataContext context, ITokenService tokenService)
        {
            _tokenService = tokenService;
            _context = context;

        }
        [HttpPost("register")] // api/account.register
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO)
        {
            if (await UserExists(registerDTO.username)) { return BadRequest("User already exists."); }
            using var hmac = new HMACSHA512();
            var user = new AppUser
            {
                username = registerDTO.username,
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.password)),
                passwordSalt = hmac.Key
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserDTO
            {
                username = user.username,
                token = _tokenService.CreateToken(user)
            };
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
        {
            var user = await _context.Users
                .Include(p => p.photos)
                .SingleOrDefaultAsync(x => x.username == loginDTO.username);
            if (user == null) return Unauthorized();

            using var hmac = new HMACSHA512(user.passwordSalt);
            var passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDTO.password));
            for (int i = 0; i < passwordHash.Length; i++)
            {
                if (passwordHash[i] != user.passwordHash[i])
                {
                    return Unauthorized();
                }
            }

            return new UserDTO
            {
                username = user.username,
                token = _tokenService.CreateToken(user),
                mainPhotoURL = user.photos.FirstOrDefault(x => x.isMain).url
            };

        }
        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.username.ToLower() == username.ToLower());
        }
    }
}