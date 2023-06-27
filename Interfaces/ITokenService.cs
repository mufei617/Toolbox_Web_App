using app.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace app.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(Users user);

    }
}
