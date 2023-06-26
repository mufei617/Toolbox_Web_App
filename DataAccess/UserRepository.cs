using app.DataAccess;
using app.DTOs;
using app.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace app.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly MyDbContext _DbContext;
        public UserRepository(MyDbContext DbContext)
        {
            _DbContext = DbContext;
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
    }
}
