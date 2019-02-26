using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace Solution.CrossCutting.MysqlDB.Context
{
    public abstract class MySqlContext : IMySqlContext
    {
        protected MySqlContext(string connectionString)
        {
            Database = new DbContext(option).Database.
        }
        public DbContext Database { get; }
    }
}
