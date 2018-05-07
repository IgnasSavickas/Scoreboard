using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ScoreboardServer.Database;
using ScoreboardServer.Models;

namespace ScoreboardServer.Repositories
{
    public class StatsRepository : IStatsRepository
    {
        private readonly DbSet<Stats> _stats;
        private readonly DbContext _context;

        public StatsRepository(ApplicationDbContext context)
        {
            _stats = context.Stats;
            _context = context;
        }

        public async Task<Stats> GetById(int id)
        {
            var game = await _stats
                .FirstOrDefaultAsync(x => x.Id == id);
            return game;
        }

        public async Task<ICollection<Stats>> GetAll(int offset, int limit)
        {

            var stats = await _stats
                .Skip(offset)
                .Take(limit)
                .ToArrayAsync();
            return stats;
        }

        public async Task<int> Create(Stats newStats)
        {
            var game = await _stats.AddAsync(newStats);
            await _context.SaveChangesAsync();
            return game.Entity.Id;
        }

        public async Task Update(Stats existingStats, Stats updatedStats)
        {
            _stats.Update(existingStats);
            MapUpdatedValues(existingStats, updatedStats);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(Stats deletedStats)
        {
            _stats.Remove(deletedStats);
            await _context.SaveChangesAsync();
        }

        private static void MapUpdatedValues(Stats existingStats, Stats updatedStats)
        {
            existingStats.Fgm = updatedStats.Fgm;
            existingStats.Fga = updatedStats.Fga;
            existingStats.Ftm = updatedStats.Ftm;
            existingStats.Fta = updatedStats.Fta;
            existingStats.Fgm3 = updatedStats.Fgm3;
            existingStats.Fga3 = updatedStats.Fga3;
            existingStats.Fg = updatedStats.Fg;
            existingStats.Ft = updatedStats.Ft;
            existingStats.Fg3 = updatedStats.Fg3;
            existingStats.Pf = updatedStats.Pf;
            existingStats.Reb = updatedStats.Reb;
            existingStats.Ast = updatedStats.Ast;
            existingStats.Stl = updatedStats.Stl;
            existingStats.Blk = updatedStats.Blk;
            existingStats.To = updatedStats.To;
        }
    }
}
