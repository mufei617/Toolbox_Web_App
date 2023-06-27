using app.DataAccess;
using app.DTOs;
using app.Interfaces;
using app.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace app.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly MyDbContext _DbContext;
        private readonly ITokenService _tokenService;

        public UserRepository(MyDbContext DbContext, ITokenService tokenService)
        {
            _DbContext = DbContext;
            _tokenService = tokenService;
        }


        public async Task<bool> UserExists(string username)
        {
            //判断用户名是否存在
            //把数据库中的用户名和用户输入的转为小写字母进行比较
            return await _DbContext.users.AnyAsync(x => x.username.ToLower() == username.ToLower());
        }

        public async Task<IEnumerable<UserDto>> GetAllUsers()
        {
            var query = (from u in _DbContext.users
                         join r in _DbContext.roles on u.role_id equals r.id
                         where u.deleted_at == null
                         select new UserDto
                         {
                             id = u.id,
                             username = u.username,
                             role_name = r.role_name
                         }).ToListAsync();
            return await query;
        }
        public async Task<LoginDto> getUserInfo(string username, string password)
        {
            var hashPassword = UserPasswordHashExtension.GetMD5Hash(password);
            var user = await _DbContext.users.SingleOrDefaultAsync(
                x => x.username == username && x.password_hash == hashPassword);


            return new LoginDto
            {
                id = user.id,
                username = user.username,
                token = _tokenService.CreateToken(user),
                role_id = user.role_id,
                expired_at = DateTime.Now.AddDays(7)
            };
        }
        public async Task<UserDto> GetUserById(int id)
        {
            var query = (from u in _DbContext.users
                         join r in _DbContext.roles on u.role_id equals r.id
                         where u.deleted_at == null && u.id == id
                         select new UserDto
                         {
                             id = u.id,
                             username = u.username,
                             role_name = r.role_name
                         }).FirstOrDefaultAsync();
            return await query;
        }

        Task<UserDto> IUserRepository.getUserInfo(string username, string password)
        {
            throw new NotImplementedException();
        }
    }
}
