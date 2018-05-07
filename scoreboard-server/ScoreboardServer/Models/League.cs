using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScoreboardServer.Models
{
    public class League
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public bool Public { get; set; }
    }
}
