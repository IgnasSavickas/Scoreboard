using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScoreboardServer.Models
{
    public class Player
    {
        public int Id { get; set; }
        public int Number { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string PhotoPath { get; set; }
        public int TeamId { get; set; }
        public List<Stats> Stats { get; set; }
        public string ApplicationUserId { get; set; }
    }
}
