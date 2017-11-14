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
                .SingleAsync(x => x.Id == id);
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

        private static void MapUpdatedValues(Player existingPlayer, Player updatedPlayer)
        {
            existingPlayer.Number = updatedPlayer.Number;
            existingPlayer.Name = updatedPlayer.Name;
            existingPlayer.Surname = updatedPlayer.Surname;
            existingPlayer.Fgm = updatedPlayer.Fgm;
            existingPlayer.Fga = updatedPlayer.Fga;
            existingPlayer.Ftm = updatedPlayer.Ftm;
            existingPlayer.Fta = updatedPlayer.Fta;
            existingPlayer.Fgm3 = updatedPlayer.Fgm3;
            existingPlayer.Fga3 = updatedPlayer.Fga3;
            existingPlayer.Fg = updatedPlayer.Fg;
            existingPlayer.Ft = updatedPlayer.Ft;
            existingPlayer.Fg3 = updatedPlayer.Fg3;
            existingPlayer.Pf = updatedPlayer.Pf;
            existingPlayer.Reb = updatedPlayer.Reb;
            existingPlayer.Ast = updatedPlayer.Ast;
            existingPlayer.Stl = updatedPlayer.Stl;
            existingPlayer.Blk = updatedPlayer.Blk;
            existingPlayer.To = updatedPlayer.To;
            existingPlayer.TeamId = updatedPlayer.TeamId;
        }
    }
}
