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

        public async Task<Team> GetTeamById(int id, string userId)
        {
            var team = await _repository.GetById(id);
            if (team == null)
            {
                return null;
            }
            return team.ApplicationUserId == userId ? team : null;
        }

        public async Task<ICollection<Team>> GetAllTeams(int offset, int limit, string userId)
        {
            var allUsersTeams = await _repository.GetAll(offset, limit, userId);
            return allUsersTeams;
        }

        public async Task<int> GetSize(string userId)
        {
            var size = await _repository.GetSize(userId);
            return size;
        }

        public async Task<int> Create(Team team)
        {
            var newId = await _repository.Create(team);
            return newId;
        }

        public async Task<bool> Update(int id, Team updatedTeam, string userId)
        {
            var existringTeam = await GetTeamById(id, userId);
            if (existringTeam == null)
            {
                return false;
            }
            await _repository.Update(existringTeam, updatedTeam);
            return true;
        }

        public async Task<bool> Delete(int id, string userId)
        {
            var existringTeam = await GetTeamById(id, userId);
            if (existringTeam == null)
            {
                return false;
            }
            await _repository.Delete(existringTeam);
            return true;
        }
    }
}
