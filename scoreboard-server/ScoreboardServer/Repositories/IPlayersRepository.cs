using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ScoreboardServer.Models;

namespace ScoreboardServer.Repositories
{
    public interface IPlayersRepository
    {
        Task<Player> GetById(int id);
        Task<ICollection<Player>> GetAll(int offset, int limit);
        Task<int> Create(Player newPlayer);
        Task Update(Player existringPlayer, Player updatedPlayer);
        Task Delete(Player deletedPlayer);
    }
}
