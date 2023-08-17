using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using app.DataAccess;
using app.DTOs;
using app.Interfaces;
using app.Repositories;
using app.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace app.Controllers
{
    public class UserController : BaseController
    {
        private readonly MyDbContext _DbContext;
        private readonly IUserRepository _userRepository;
        private readonly ITokenService _tokenService;
        public UserController(MyDbContext DbContext, IUserRepository userRepository, ITokenService tokenService)
        {
            _DbContext = DbContext;
            _userRepository = userRepository;
            _tokenService = tokenService;
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
            var user = await _userRepository.getUserInfo(registerDto.username, registerDto.password);
            if (user == null)
            {
                return BadRequest("Invalid username/password");
            }
            var role = _DbContext.roles.Where(x => x.id == user.role_id).FirstOrDefault().role_name;
            LoginDto loginDto = new LoginDto()
            {
                id = user.id,
                username = user.username,
                token = _tokenService.CreateToken(user),
                role_id = user.role_id,
                role_name = role,
                expired_at = DateTime.Now.AddDays(1)
            };
            return Ok(loginDto);
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
            if (user == null)
            {
                return BadRequest("User not exists!");
            }
            return Ok(user);
        }

        //这里
        [HttpPut("changeusername")]
        public async Task<ActionResult<Users>> ChangeUsername(UpdateDTO updateDTO)
        {
            if (await _userRepository.UserExists(updateDTO.oldUsername))
            {
                var user = await _userRepository.changeUsername(updateDTO);
                return user;
            }

            // 如果旧用户名不存在，可以返回相应的错误响应
            return BadRequest("Old username does not exist.");
        }

        [HttpPut("changepassword")]
        public async Task<ActionResult<Users>> ChangePassword(UpdateDTO updateDTO)
        {
            if (await _userRepository.UserExists(updateDTO.oldUsername))
            {
                var user = await _userRepository.changePassword(updateDTO);
                return user;
            }

            // 如果旧用户名不存在，可以返回相应的错误响应
            return BadRequest("user does not exist.");
        }


    }
}