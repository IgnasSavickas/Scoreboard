using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ScoreboardServer.Models;
using ScoreboardServer.Repositories;

namespace ScoreboardServer.Services
{
    public class TeamsService : ITeamsService
    {
        private readonly ITeamsRepository _repository;

        public TeamsService(ITeamsRepository repository)
        {
            _repository = repository;
        }

        public async Task<Team> GetTeamById(int id)
        {
            var team = await _repository.GetById(id);
            return team;
        }

        public async Task<ICollection<Team>> GetAllTeams(int offset, int limit)
        {
            var teams = await _repository.GetAll(offset, limit);
            return teams;
        }

        public async Task<int> Create(Team team)
        {
            var newId = await _repository.Create(team);
            return newId;
        }

        public async Task<bool> Update(int id, Team updatedTeam)
        {
            var existringTeam = await GetTeamById(id);
            if (existringTeam == null)
            {
                return false;
            }
            await _repository.Update(existringTeam, updatedTeam);
            return true;
        }

        public async Task<bool> Delete(int id)
        {
            var existringTeam = await GetTeamById(id);
            if (existringTeam == null)
            {
                return false;
            }
            await _repository.Delete(existringTeam);
            return true;
        }
    }
}
