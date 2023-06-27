using System;

namespace app.DTOs
{
    public class LoginDto
    {
        public int id { get; set; }
        public string username { get; set; }
        public int role_id { get; set; }
        public string role_name { get; set; }
        public DateTime expired_at { get; set; }
        public string token { get; set; }
    }
}
