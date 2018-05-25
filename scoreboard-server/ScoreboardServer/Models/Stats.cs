using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScoreboardServer.Models
{
    public class Stats
    {
        public int Id { get; set; }
        public int Fgm { get; set; }
        public int Fga { get; set; }
        public int Ftm { get; set; }
        public int Fta { get; set; }
        public int Fgm3 { get; set; }
        public int Fga3 { get; set; }
        public double Fg { get; set; }
        public double Ft { get; set; }
        public double Fg3 { get; set; }
        public int Pf { get; set; }
        public int Reb { get; set; }
        public int Ast { get; set; }
        public int Stl { get; set; }
        public int Blk { get; set; }
        public int To { get; set; }
        public int GameId { get; set; }
        public Game Game { get; set; }
        public int PlayerId { get; set; }
        public Player Player { get; set; }
    }
}
