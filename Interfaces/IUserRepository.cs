using System.Collections.Generic;
using System.Threading.Tasks;
using app.DataAccess;
using app.DTOs;

namespace app.Interfaces
{
    public interface IUserRepository
    {
        public Task<bool> UserExists(string username);
        public Task<IEnumerable<UserDto>> GetAllUsers();
        public Task<UserDto> GetUserById(int id);
        public Task<Users> getUserInfo(string username, string password);
        public Task<Users> changeUsername(UpdateDTO updateDTO);
        public Task<Users> changePassword(UpdateDTO updateDTO);


    }
}