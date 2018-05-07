using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ScoreboardServer.Models;
using ScoreboardServer.Repositories;

namespace ScoreboardServer.Services
{
    public class PlayersService : IPlayersService
    {
        private readonly IPlayersRepository _repository;

        public PlayersService(IPlayersRepository repository)
        {
            _repository = repository;
        }

        public async Task<Player> GetPlayerById(int id, string userId)
        {
            var team = await _repository.GetById(id);
            if (team == null)
            {
                return null;
            }
            return team.ApplicationUserId == userId ? team : null;
        }

        public async Task<ICollection<Player>> GetAllPlayers(int offset, int limit, string userId)
        {
            var players = await _repository.GetAll(offset, limit);
            var allUsersPlayers = players
                .Where(x => x.ApplicationUserId == userId)
                .ToList();
            return allUsersPlayers;
        }

        public async Task<int> Create(Player player)
        {
            var newId = await _repository.Create(player);
            return newId;
        }

        public async Task<bool> Update(int id, Player updatedPlayer, string userId)
        {
            var existringPlayer = await GetPlayerById(id, userId);
            if (existringPlayer == null)
            {
                return false;
            }
            await _repository.Update(existringPlayer, updatedPlayer);
            return true;
        }

        public async Task<bool> Delete(int id, string userId)
        {
            var existringPlayer = await GetPlayerById(id, userId);
            if (existringPlayer == null)
            {
                return false;
            }
            await _repository.Delete(existringPlayer);
            return true;
        }

        public async Task<ICollection<Player>> GetPlayersByTeamId(int teamId)
        {
            var teamPlayers = await _repository.GetAllByTeamId(teamId);
            return teamPlayers;
        }
    }
}
