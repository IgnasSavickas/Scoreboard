using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ScoreboardServer.Models;

namespace ScoreboardServer.Repositories
{
    public interface IGamesRepository
    {
        Task<Game> GetById(int id);
        Task<ICollection<Game>> GetAll(int offset, int limit);
        Task<int> Create(Game newGame);
        Task Update(Game existingGame, Game updatedGame);
        Task Delete(Game deletedGame);
        Task<int> GetSize(string userId);
        Task<ICollection<Game>> GetAllByTeamId(int teamId);
    }
}
