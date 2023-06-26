using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace app.DataAccess
{
    public class Users
    {
        public int id { get; set; }
        public string username { get; set; }
        public string password_hash { get; set; }
        public int role_id { get; set; }
        public DateTime created_at { get; set; }
        public DateTime? deleted_at { get; set; }
    }
}
