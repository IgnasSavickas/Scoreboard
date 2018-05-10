using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ScoreboardServer.Models;

namespace ScoreboardServer.Services
{
    public interface IGamesService
    {
        Task<Game> GetGameById(int id, string userId);
        Task<ICollection<Game>> GetAllGames(int offset, int limit, string userId);
        Task<int> Create(Game team);
        Task<bool> Update(int id, Game updatedTeam, string userId);
        Task<bool> Delete(int id, string userId);
        Task<int> GetSize(string userId);
        Task<ICollection<Game>> GetGamesByTeamId(int teamId);
    }
}
