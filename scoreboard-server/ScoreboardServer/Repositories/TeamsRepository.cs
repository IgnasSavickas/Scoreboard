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
            var team = await _teams
                .Include(x => x.Players)
                .SingleOrDefaultAsync(x => x.Id == id);
            return team;
        }

        public async Task<ICollection<Team>> GetAll(int offset, int limit)
        {
            var teams = await _teams
                .Include(x => x.Players)
                .Skip(offset)
                .Take(limit)
                .ToArrayAsync();
            return teams;
        }

        public async Task<int> Create(Team newTeam)
        {
            var team = await _teams.AddAsync(newTeam);
            await _context.SaveChangesAsync();
            return team.Entity.Id;
        }

        public async Task Update(Team existingTeam, Team updatedTeam)
        {
            _teams.Update(existingTeam);
            MapUpdatedValues(existingTeam, updatedTeam);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(Team deletedTeam)
        {
            _teams.Remove(deletedTeam);
            await _context.SaveChangesAsync();
        }

        private static void MapUpdatedValues(Team existingTeam, Team updatedTeam)
        {
            existingTeam.Name = updatedTeam.Name;
            existingTeam.Points = updatedTeam.Points;
        }
    }
}
