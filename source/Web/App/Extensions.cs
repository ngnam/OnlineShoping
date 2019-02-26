using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Solution.CrossCutting.DependencyInjection;
using Solution.Infrastructure.Database;
using System;

namespace Solution.Web.App
{
    public static class Extensions
    {
        public static void AddDependencyInjectionCustom(this IServiceCollection services, IConfiguration configuration)
        {
            DependencyInjector.RegisterServices(services);
            DependencyInjector.AddDbContext<DatabaseContext>(configuration.GetConnectionString(nameof(DatabaseContext)));
        }
    }
}
