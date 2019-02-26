using System;
using Solution.Model.Enums;

namespace Solution.Model.Entities
{
    public class UserLogEntity
    {
        public string Content { get; set; }

        public DateTime DateTime { get; set; }

        public LogType LogType { get; set; }

        public virtual UserEntity User { get; set; }

        public long UserId { get; set; }

        public long UserLogId { get; set; }
    }
}
