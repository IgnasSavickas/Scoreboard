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

        public async Task<Player> GetPlayerById(int id)
        {
            var team = await _repository.GetById(id);
            return team;
        }

        public async Task<ICollection<Player>> GetAllPlayers(int offset, int limit)
        {
            var players = await _repository.GetAll(offset, limit);
            return players;
        }

        public async Task<int> Create(Player player)
        {
            var newId = await _repository.Create(player);
            return newId;
        }

        public async Task<Player> Update(Player player)
        {
            var updatedPlayer = await _repository.Update(player);
            return updatedPlayer;
        }

        public async Task<bool> Delete(int id)
        {
            var deleted = await _repository.Delete(id);
            return deleted;
        }
    }
}
