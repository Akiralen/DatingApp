using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Enteties;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseAPIController
    {
        private readonly DataContext _context;
        public AccountController(DataContext context)
        {
            _context = context;

        }
        [HttpPost("register")] // api/account.register
        public async Task<ActionResult<AppUser>> Register(RegisterDTO registerDTO)
        {
            if (await UserExists(registerDTO.username)) {return BadRequest("User already exists.");}
            using var hmac = new HMACSHA512();
            var user = new AppUser
            {
                userName = registerDTO.username,
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.password)),
                passwordSalt = hmac.Key
            };    
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return user;
        }
        [HttpPost("login")]
        public async Task<ActionResult<AppUser>> Login(LoginDTO loginDTO)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => 
                x.userName == loginDTO.username);
            if (user == null) return Unauthorized();

            using var hmac = new HMACSHA512(user.passwordSalt);
            var passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDTO.password));
            for (int i = 0;i<passwordHash.Length;i++)
            {
                if (passwordHash[i] != user.passwordHash[i])
                {
                    return Unauthorized();
                }
            }
            return user;

        }
        private async Task<bool> UserExists(string username){
            return await _context.Users.AnyAsync(x => x.userName.ToLower() == username.ToLower());
        }
    }
}