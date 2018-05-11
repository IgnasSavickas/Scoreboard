using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ScoreboardServer.Database;
using ScoreboardServer.Models;
using ScoreboardServer.Repositories;
using Xunit;

namespace UnitTestProject.Repositories
{
    public class TeamsRepositoryTest : IDisposable
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;

        public TeamsRepositoryTest()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase("Database for tests")
                .Options;
        }

        [Fact]
        public async Task GetsTeamById()
        {
            using (var context = new ApplicationDbContext(_options))
            {
                context.Teams.AddRange(
                    new Team { Id = 1 },
                    new Team { Id = 2 });

                context.SaveChanges();
            }

            using (var context = new ApplicationDbContext(_options))
            {
                var teamsRepository = new TeamsRepository(context);

                var team = await teamsRepository.GetById(1);
                var team2 = await teamsRepository.GetById(2);

                Assert.NotNull(team);
                Assert.NotNull(team2);
                Assert.Equal(1, team.Id);
                Assert.Equal(2, team2.Id);

            }
        }

        [Fact]
        public async Task GetsTeams()
        {
            using (var context = new ApplicationDbContext(_options))
            {
                context.Teams.AddRange(
                    new Team { Id = 1 },
                    new Team { Id = 2 },
                    new Team { Id = 3 });

                context.SaveChanges();
            }

            using (var context = new ApplicationDbContext(_options))
            {
                var teamsRepository = new TeamsRepository(context);

                var teams = await teamsRepository.GetAll(0, 2, null);

                Assert.Equal(2, teams.Count);
                Assert.NotNull(teams.SingleOrDefault(x => x.Id == 1));
                Assert.NotNull(teams.SingleOrDefault(x => x.Id == 2));

            }
        }

        [Fact]
        public async Task GetsTeamsSize()
        {
            using (var context = new ApplicationDbContext(_options))
            {
                context.Teams.AddRange(
                    new Team { Id = 1 },
                    new Team { Id = 2 },
                    new Team { Id = 3 });

                context.SaveChanges();
            }

            using (var context = new ApplicationDbContext(_options))
            {
                var teamsRepository = new TeamsRepository(context);

                var teamsSize = await teamsRepository.GetSize(null);

                Assert.Equal(3, teamsSize);
            }
        }

        [Fact]
        public async Task CreatesTeam()
        {
            using (var context = new ApplicationDbContext(_options))
            {
                var teamsRepository = new TeamsRepository(context);

                await teamsRepository.Create(new Team { Id = 1 });
            }

            using (var context = new ApplicationDbContext(_options))
            {
                Assert.Equal(1, context.Teams.Count());
                Assert.Equal(1, context.Teams.Single().Id);
            }
        }

        [Fact]
        public async Task UpdatesTeam()
        {
            var teamName = "Team";
            var teamName2 = "Team1";

            var mockTeams = new List<Team>
            {
                new Team { Id = 1, Name = teamName },
                new Team { Id = 2 },
                new Team { Id = 3 }
            };

            using (var context = new ApplicationDbContext(_options))
            {
                context.Teams.AddRange(mockTeams);

                context.SaveChanges();
            }

            using (var context = new ApplicationDbContext(_options))
            {
                var teamsRepository = new TeamsRepository(context);
                var existingTeam = mockTeams[0];
                var updatedTeam = mockTeams[0];
                updatedTeam.Name = teamName2;
                await teamsRepository.Update(existingTeam, updatedTeam);
            }

            using (var context = new ApplicationDbContext(_options))
            {
                Assert.NotNull(context.Teams.SingleOrDefault(x => x.Id == 1));
                Assert.Equal(teamName2, context.Teams.Single(x => x.Id == 1).Name);
            }
        }

        [Fact]
        public async Task DeletesTeam()
        {
            var mockTeams = new List<Team>
            {
                new Team { Id = 1 },
                new Team { Id = 2 },
                new Team { Id = 3 }
            };

            using (var context = new ApplicationDbContext(_options))
            {
                context.Teams.AddRange(mockTeams);

                context.SaveChanges();
            }

            using (var context = new ApplicationDbContext(_options))
            {
                var teamsRepository = new TeamsRepository(context);

                var team = mockTeams[0];
                await teamsRepository.Delete(team);
            }

            using (var context = new ApplicationDbContext(_options))
            {
                Assert.Equal(2, context.Teams.Count());
                Assert.Null(context.Teams.SingleOrDefault(x => x.Id == 1));
            }
        }

        public void Dispose()
        {
            using (var context = new ApplicationDbContext(_options))
            {
                context.Database.EnsureDeleted();
            }
        }
    }
}
