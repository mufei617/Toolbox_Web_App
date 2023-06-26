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

        //用户注册
        [HttpPost("register")]
        public async Task<ActionResult<Users>> Register(RegisterDto registerDto)
        {
            //如果用户名存在，返回400 "Username is taken"
            if (await UserExists(registerDto.Username)) return BadRequest("Username is taken");
            var user = new Users
            {
                username = registerDto.Username,
                password_hash = GetMD5Hash(registerDto.Password),//加密密码
                role_id = 2,//默认用户类型为Clients
                created_at = DateTime.Now
            };
            _DbContext.users.Add(user);
            await _DbContext.SaveChangesAsync();
            return Ok();
        }

        //显示所有用户信息
        [HttpGet("allusers")]
        public async Task<ActionResult<IEnumerable<Users>>> GetUsers()
        {
            var users = await _DbContext.users.ToListAsync();
            return users;
        }

        //使用MD5 加密用户密码
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

        //判断用户名是否存在
        private async Task<bool> UserExists(string username)
        {
            //把数据库中的用户名和用户输入的转为小写字母进行比较
            return await _DbContext.users.AnyAsync(x => x.username.ToLower() == username.ToLower());
        }

    }
}
