using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScoreboardServer.Models
{
    public class Game
    {
        public int Id { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string PeriodTime { get; set; }
        public int Periods { get; set; }
        //public int HomeTeamId { get; set; }
        public Team HomeTeam { get; set; }
        //public int VisitorTeamId { get; set; }
        public Team VisitorTeam { get; set; }
        public string ApplicationUserId { get; set; }
    }
}
