using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ScoreboardServer.Models;

namespace ScoreboardServer.Services
{
    public interface ITeamsService
    {
        Task<Team> GetTeamById(int id, string userId);
        Task<ICollection<Team>> GetAllTeams(int offset, int limit, string userId);
        Task<int> GetSize(string userId);
        Task<int> Create(Team team);
        Task<bool> Update(int id, Team updatedTeam, string userId);
        Task<bool> Delete(int id, string userId);
    }
}
