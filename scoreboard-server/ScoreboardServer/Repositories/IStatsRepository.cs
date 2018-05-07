using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ScoreboardServer.Models;

namespace ScoreboardServer.Repositories
{
    public interface IStatsRepository
    {
        Task<Stats> GetById(int id);
        Task<ICollection<Stats>> GetAll(int offset, int limit);
        Task<int> Create(Stats newStats);
        Task Update(Stats existingStats, Stats updatedStats);
        Task Delete(Stats deletedStats);
    }
}
