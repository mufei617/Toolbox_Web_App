using app.Interfaces;
using app.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace app.Extentions
{
    public static class ApplicationServiceExtenstions
    {
        public static IServiceCollection AddApplicationService(this IServiceCollection services, IConfiguration config
        )
        {
           
            services.AddCors();
            services.AddScoped<ITokenService, TokenService>();
            return services;
        }
    }
}
