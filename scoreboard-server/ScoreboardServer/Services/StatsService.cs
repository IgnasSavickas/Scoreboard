using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ScoreboardServer.Models;
using ScoreboardServer.Repositories;

namespace ScoreboardServer.Services
{
    public class StatsService : IStatsService
    {
        private readonly IStatsRepository _repository;

        public StatsService(IStatsRepository repository)
        {
            _repository = repository;
        }

        public async Task<Stats> GetStatsById(int id)
        {
            var stats = await _repository.GetById(id);

            return stats;
        }

        public async Task<ICollection<Stats>> GetAllStats(int offset, int limit)
        {
            var stats = await _repository.GetAll(offset, limit);
            var allUsersStats = stats
                .ToList();
            return allUsersStats;
        }

        public async Task<int> Create(Stats stats)
        {
            var newId = await _repository.Create(stats);
            return newId;
        }

        public async Task<bool> Update(int id, Stats updatedStats)
        {
            var existringStats = await GetStatsById(id);
            if (existringStats == null)
            {
                return false;
            }
            await _repository.Update(existringStats, updatedStats);
            return true;
        }

        public async Task<bool> Delete(int id)
        {
            var existringStats = await GetStatsById(id);
            if (existringStats == null)
            {
                return false;
            }
            await _repository.Delete(existringStats);
            return true;
        }
    }
}
