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

        public Task<Team> GetTeamById(int id)
        {
            var team = _repository.GetById(id);
            return team;
        }

        public Task<ICollection<Team>> GetAllTeams(int offset, int limit)
        {
            var teams = _repository.GetAll(offset, limit);
            return teams;
        }

        public Task<int> Create(Team team)
        {
            var newId = _repository.Create(team);
            return newId;
        }

        public Task<Team> Update(Team team)
        {
            var updatedTeam = _repository.Update(team);
            return updatedTeam;
        }

        public Task<bool> Delete(int id)
        {
            var deleted = _repository.Delete(id);
            return deleted;
        }
    }
}
