using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Pomelo.EntityFrameworkCore.MySql;

namespace Solution.CrossCutting.MysqlDB.Context
{
    public interface IMySqlContext
    {
        DbContext Database { get; }
    }
}
