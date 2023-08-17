using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace app.DTOs
{
    public class UpdateDTO
    {
         public int id { get; set; }
        public string oldUsername { get; set; }
        public string newUsername { get; set; }
        public string oldPassword { get; set; }
        public string newPassword { get; set; }

    }
}