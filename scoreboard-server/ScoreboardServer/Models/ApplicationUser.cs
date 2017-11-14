using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace ScoreboardServer.Models
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class ApplicationUser : IdentityUser
    {
        public List<Game> Games { get; set; }
        public List<Team> Teams { get; set; }
        public List<Player> Players { get; set; }
    }
}
