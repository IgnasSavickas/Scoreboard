using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScoreboardServer.Models
{
    public class Team
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Points { get; set; }
    }
}
