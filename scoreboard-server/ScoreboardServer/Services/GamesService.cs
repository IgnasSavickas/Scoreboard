using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ScoreboardServer.Models;
using ScoreboardServer.Repositories;

namespace ScoreboardServer.Services
{
    public class GamesService : IGamesService
    {
        private readonly IGamesRepository _repository;

        public GamesService(IGamesRepository repository)
        {
            _repository = repository;
        }

        public async Task<Game> GetGameById(int id)
        {
            var game = await _repository.GetById(id);
            return game;
        }

        public async Task<ICollection<Game>> GetAllGames(int offset, int limit)
        {
            var games = await _repository.GetAll(offset, limit);
            return games;
        }

        public async Task<int> Create(Game team)
        {
            var newId = await _repository.Create(team);
            return newId;
        }

        public async Task<bool> Update(int id, Game updatedGame)
        {
            var existringGame = await GetGameById(id);
            if (existringGame == null)
            {
                return false;
            }
            await _repository.Update(existringGame, updatedGame);
            return true;
        }

        public async Task<bool> Delete(int id)
        {
            var existringGame = await GetGameById(id);
            if (existringGame == null)
            {
                return false;
            }
            await _repository.Delete(existringGame);
            return true;
        }
    }
}
