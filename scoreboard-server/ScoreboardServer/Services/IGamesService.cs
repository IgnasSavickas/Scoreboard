using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ScoreboardServer.Models;

namespace ScoreboardServer.Services
{
    public interface IGamesService
    {
        Task<Game> GetGameById(int id);
        Task<ICollection<Game>> GetAllGames(int offset, int limit);
        Task<int> Create(Game team);
        Task<bool> Update(int id, Game updatedTeam);
        Task<bool> Delete(int id);
    }
}
