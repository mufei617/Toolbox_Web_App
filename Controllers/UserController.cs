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
using app.Services;
using app.Repositories;
using app.Interfaces;

namespace app.Controllers
{
    public class UserController : BaseController
    {
        private readonly MyDbContext _DbContext;
        private readonly IUserRepository _userRepository;
        public UserController(MyDbContext DbContext, IUserRepository userRepository)
        {
            _DbContext = DbContext;
            _userRepository = userRepository;
        }

        //用户注册
        [HttpPost("register")]
        public async Task<ActionResult<Users>> Register(RegisterDto registerDto)
        {
            //如果用户名存在，返回400 "Username is taken"
            if (await _userRepository.UserExists(registerDto.username)) return BadRequest("Username is taken");
            var user = new Users
            {
                username = registerDto.username,
                password_hash = UserPasswordHashExtension.GetMD5Hash(registerDto.password),//加密密码
                role_id = 2,//默认用户类型为Clients
                created_at = DateTime.Now
            };
            _DbContext.users.Add(user);
            await _DbContext.SaveChangesAsync();
            return Ok();
        }


        [HttpPost("login")]
        public async Task<ActionResult<Users>> Login(RegisterDto registerDto)
        {
             await _userRepository.getUserInfo(registerDto.username,registerDto.password);
            return Ok();
        }


        //显示所有用户信息
        [HttpGet("getallusers")]
        public async Task<ActionResult<IEnumerable<Users>>> GetUsers()
        {
            var allUsers = await _userRepository.GetAllUsers();
            return Ok(allUsers);
        }

        //根据用户id获取用户信息
        [HttpGet("getuser/{id}")]
        public async Task<ActionResult<Users>> GetUser(int id)
        {
            var user = await _userRepository.GetUserById(id);
            if(user == null)
            {
                return BadRequest("User not exists!");
            }
            return Ok(user);
        }


    }
}
