using app.DataAccess;
using app.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;

namespace app.Controllers
{
    public class UserController : BaseController
    {
        private readonly MyDbContext _DbContext;
        public UserController(MyDbContext DbContext)
        {
            _DbContext = DbContext;
        }

        [HttpPost("register")]
        public async Task<ActionResult<Users>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username)) return BadRequest("Username is taken");
            using var hmac = new HMACSHA512();
            var user = new Users
            {
                username = registerDto.Username.ToLower(),
                password_hash = GetMD5Hash(registerDto.Password),
                role_id = 2,
                created_at = DateTime.Now
            };
            _DbContext.users.Add(user);
            await _DbContext.SaveChangesAsync();
            return Ok();
        }


        [HttpGet("allusers")]
        public async Task<ActionResult<IEnumerable<Users>>> GetUsers()
        {
            var users = await _DbContext.users.ToListAsync();
            return users;
        }

        private static string GetMD5Hash(string inputString)
        {
            using (MD5 md5 = MD5.Create())
            {
                byte[] inputBytes = Encoding.UTF8.GetBytes(inputString);
                byte[] hashBytes = md5.ComputeHash(inputBytes);
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < hashBytes.Length; i++)
                {
                    sb.Append(hashBytes[i].ToString("x2"));
                }
                return sb.ToString();
            }
        }

        private async Task<bool> UserExists(string username)
        {
            return await _DbContext.users.AnyAsync(x => x.username == username.ToLower());
        }

    }
}
