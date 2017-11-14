using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ScoreboardServer.Models;

namespace ScoreboardServer.Services
{
    public interface IPlayersService
    {
        Task<Player> GetPlayerById(int id, string userId);
        Task<ICollection<Player>> GetAllPlayers(int offset, int limit, string userId);
        Task<int> Create(Player player);
        Task<bool> Update(int id, Player updatedPlayer, string userId);
        Task<bool> Delete(int id, string userId);
    }
}
