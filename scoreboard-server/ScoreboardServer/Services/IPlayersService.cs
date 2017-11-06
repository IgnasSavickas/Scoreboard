using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ScoreboardServer.Models;

namespace ScoreboardServer.Services
{
    public interface IPlayersService
    {
        Task<Player> GetPlayerById(int id);
        Task<ICollection<Player>> GetAllPlayers(int offset, int limit);
        Task<int> Create(Player player);
        Task<bool> Update(int id, Player updatedPlayer);
        Task<bool> Delete(int id);
    }
}
