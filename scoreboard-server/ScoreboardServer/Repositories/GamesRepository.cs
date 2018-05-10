using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ScoreboardServer.Database;
using ScoreboardServer.Models;

namespace ScoreboardServer.Repositories
{
    public class GamesRepository : IGamesRepository
    {
        private readonly DbSet<Game> _games;
        private readonly DbContext _context;

        public GamesRepository(ApplicationDbContext context)
        {
            _games = context.Games;
            _context = context;
        }

        public async Task<Game> GetById(int id)
        {
            var game = await _games
                .Include(x => x.HomeTeam)
                .Include(x => x.VisitorTeam)
                .FirstOrDefaultAsync(x => x.Id == id);
            return game;
        }

        public async Task<ICollection<Game>> GetAll(int offset, int limit)
        {

            var games = await _games
                .Include(x => x.HomeTeam)
                .Include(x => x.VisitorTeam)
                .Skip(offset)
                .Take(limit)
                .ToArrayAsync();
            return games;
        }

        public async Task<int> Create(Game newGame)
        {
            var game = await _games.AddAsync(newGame);
            await _context.SaveChangesAsync();
            return game.Entity.Id;
        }

        public async Task Update(Game existingGame, Game updatedGame)
        {
            _games.Update(existingGame);
            MapUpdatedValues(existingGame, updatedGame);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(Game deletedGame)
        {
            _games.Remove(deletedGame);
            await _context.SaveChangesAsync();
        }

        public async Task<int> GetSize(string userId)
        {
            var size = await _games
                .Where(x => x.ApplicationUserId == userId)
                .CountAsync();
            return size;
        }

        public async Task<ICollection<Game>> GetAllByTeamId(int teamId)
        {
            var games = await _games
                .Include(x => x.HomeTeam)
                .Include(x => x.VisitorTeam)
                .Where(x => x.HomeTeamId == teamId || x.VisitorTeamId == teamId)
                .ToArrayAsync();

            return games;
        }

        private static void MapUpdatedValues(Game existingGame, Game updatedGame)
        {
            existingGame.StartDate = updatedGame.StartDate;
            existingGame.EndDate = updatedGame.EndDate;
            existingGame.PeriodTime = updatedGame.PeriodTime;
            existingGame.Periods = updatedGame.Periods;
            existingGame.HomePoints = updatedGame.HomePoints;
            existingGame.VisitorPoints = updatedGame.VisitorPoints;
            //existingGame.HomeTeamId = updatedGame.HomeTeamId;
            //existingGame.VisitorTeamId = updatedGame.VisitorTeamId;
        }
    }
}
