using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace app.Entities
{
   public class Videos
{
    public IFormFile InputFilePath { get; set; } // 使用IFormFile来接收上传的文件
    public string OutputFilePath { get; set; }
}
}