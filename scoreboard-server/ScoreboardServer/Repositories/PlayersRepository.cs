using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ScoreboardServer.Database;
using ScoreboardServer.Models;

namespace ScoreboardServer.Repositories
{
    public class PlayersRepository : IPlayersRepository
    {
        private readonly DbSet<Player> _players;
        private readonly DbContext _context;

        public PlayersRepository(ApplicationDbContext context)
        {
            _players = context.Players;
            _context = context;
        }

        public async Task<Player> GetById(int id)
        {
            var player = await _players
                .SingleOrDefaultAsync(x => x.Id == id);
            return player;
        }

        public async Task<ICollection<Player>> GetAll(int offset, int limit)
        {
            var players = await _players
                .Skip(offset)
                .Take(limit)
                .ToArrayAsync();
            return players;
        }

        public async Task<int> Create(Player newPlayer)
        {
            var player = await _players.AddAsync(newPlayer);
            await _context.SaveChangesAsync();
            return player.Entity.Id;
        }

        public async Task Update(Player existingPlayer, Player updatedPlayer)
        {
            _players.Update(existingPlayer);
            MapUpdatedValues(existingPlayer, updatedPlayer);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(Player deletedPlayer)
        {
            _players.Remove(deletedPlayer);
            await _context.SaveChangesAsync();
        }

        public async Task<ICollection<Player>> GetAllByTeamId(int teamId)
        {
            var players = await _players
                .Include(x => x.Stats)
                .Where(x => x.TeamId == teamId)
                .OrderBy(x => x.Number)
                .ToArrayAsync();

            return players;
        }

        private static void MapUpdatedValues(Player existingPlayer, Player updatedPlayer)
        {
            existingPlayer.Number = updatedPlayer.Number;
            existingPlayer.Name = updatedPlayer.Name;
            existingPlayer.Surname = updatedPlayer.Surname;
            existingPlayer.PhotoPath = updatedPlayer.PhotoPath;
            existingPlayer.TeamId = updatedPlayer.TeamId;
        }
    }
}
