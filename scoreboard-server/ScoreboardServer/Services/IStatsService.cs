using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ScoreboardServer.Models;

namespace ScoreboardServer.Services
{
    public interface IStatsService
    {
        Task<Stats> GetStatsById(int id);
        Task<ICollection<Stats>> GetAllStats(int offset, int limit);
        Task<int> Create(Stats stats);
        Task<bool> Update(int id, Stats updatedStats);
        Task<bool> Delete(int id);
    }
}
