using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ScoreboardServer.Models;

namespace ScoreboardServer.Services
{
    public interface ITeamsService
    {
        Task<Team> GetTeamById(int id);
        Task<ICollection<Team>> GetAllTeams(int offset, int limit);
        Task<int> Create(Team team);
        Task<bool> Update(int id, Team team);
        Task<bool> Delete(int id);
    }
}
