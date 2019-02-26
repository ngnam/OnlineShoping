using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.DependencyInjection;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Solution.Application.Applications;
using Solution.CrossCutting.Logging;
using Solution.CrossCutting.Security;
using Solution.Domain.Domains;
using Solution.Infrastructure.Database;
using System;

namespace Solution.CrossCutting.DependencyInjection
{
    public static class DependencyInjector
    {
        private static IServiceCollection Services { get; set; }

        public static void AddDbContext<T>(string connectionString) where T : DbContext
        {
            Services.AddDbContextPool<T>(options => options.UseMySql(connectionString, mySqlOptions =>
            {
                mySqlOptions.ServerVersion(new Version(5, 7, 17), ServerType.MariaDb); // replace with your Server Version and Type
            }));
            var context = GetService<T>();
            context.Database.EnsureCreated();
            context.Database.Migrate();
        }

        public static void AddDbContextInMemoryDatabase<T>() where T : DbContext
        {
            Services.AddDbContextPool<T>(options => options.UseInMemoryDatabase(typeof(T).Name));
            GetService<T>().Database.EnsureCreated();
        }

        public static T GetService<T>()
        {
            Services = Services ?? RegisterServices();
            return Services.BuildServiceProvider().GetService<T>();
        }

        public static IServiceCollection RegisterServices()
        {
            return RegisterServices(new ServiceCollection());
        }

        public static IServiceCollection RegisterServices(IServiceCollection services)
        {
            Services = services;
            Registers();
            return Services;
        }

        private static void Registers()
        {
            // Solution.Application.Applications
            Services.AddScoped<IAuthenticationApplication, AuthenticationApplication>();
            Services.AddScoped<IFileApplication, FileApplication>();
            Services.AddScoped<IUserApplication, UserApplication>();

            // Solution.CrossCutting
            Services.AddScoped<ICriptography, Criptography>();
            Services.AddScoped<IHash, Hash>();
            Services.AddScoped<IJsonWebToken, JsonWebToken>();
            Services.AddScoped<ILogger, Logger>();

            // Solution.Domain.Domains
            Services.AddScoped<IAuthenticationDomain, AuthenticationDomain>();
            Services.AddScoped<IFileDomain, FileDomain>();
            Services.AddScoped<IUserDomain, UserDomain>();
            Services.AddScoped<IUserLogDomain, UserLogDomain>();
            Services.AddScoped<IUserLogFactory, UserLogFactory>();

            // Solution.Infrastructure.Database
            Services.AddScoped<IDatabaseUnitOfWork, DatabaseUnitOfWork>();
            Services.AddScoped<IUserLogRepository, UserLogRepository>();
            Services.AddScoped<IUserRepository, UserRepository>();
        }
    }
}
