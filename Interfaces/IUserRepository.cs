using System.Collections.Generic;
using System.Threading.Tasks;
using app.DTOs;

namespace app.Interfaces
{
    public interface IUserRepository
    {
        public Task<bool> UserExists(string username);
        public Task<IEnumerable<UserDto>> GetAllUsers();
        public Task<UserDto> GetUserById(int id);
        public Task<UserDto> getUserInfo(string username, string password);
    }
}