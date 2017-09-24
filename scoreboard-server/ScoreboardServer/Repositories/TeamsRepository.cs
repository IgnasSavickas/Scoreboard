using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ScoreboardServer.Database;
using ScoreboardServer.Models;

namespace ScoreboardServer.Repositories
{
    public class TeamsRepository : ITeamsRepository
    {
        private readonly DbSet<Team> _teams;
        private readonly DbContext _context;

        public TeamsRepository(ApplicationDbContext context)
        {
            _teams = context.Teams;
            _context = context;
        }

        public async Task<Team> GetById(int id)
        {
            var team = await _teams.FindAsync(id);
            return team;
        }

        public async Task<ICollection<Team>> GetAll(int offset, int limit)
        {
            var teams = await _teams.Skip(offset).Take(limit).ToArrayAsync();
            return teams;
        }

        public async Task<int> Create(Team newTeam)
        {
            await _teams.AddAsync(newTeam);
            await _context.SaveChangesAsync();
            return newTeam.Id;
        }

        public async Task<Team> Update(Team updatedTeam)
        {
            var existingTeam = await _teams.FirstOrDefaultAsync(x => x.Id == updatedTeam.Id);
            _teams.Update(existingTeam);
            MapUpdatedValues(existingTeam, updatedTeam);
            await _context.SaveChangesAsync();
            return updatedTeam;
        }

        public async Task<bool> Delete(int deletedId)
        {
            var deletedTeam = await _teams.FirstOrDefaultAsync(x => x.Id == deletedId);
            _teams.Remove(deletedTeam);
            await _context.SaveChangesAsync();
            return true;
        }

        private static void MapUpdatedValues(Team existingTeam, Team updatedTeam)
        {
            existingTeam.Name = updatedTeam.Name;
            existingTeam.Points = updatedTeam.Points;
        }
    }
}
