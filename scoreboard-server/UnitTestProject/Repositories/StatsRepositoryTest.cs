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
    public class StatsRepositoryTest : IDisposable
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;

        public StatsRepositoryTest()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase("Database for tests")
                .Options;
        }

        [Fact]
        public async Task GetsStatsById()
        {
            using (var context = new ApplicationDbContext(_options))
            {
                context.Stats.AddRange(
                    new Stats { Id = 1 },
                    new Stats { Id = 2 });

                context.SaveChanges();
            }

            using (var context = new ApplicationDbContext(_options))
            {
                var statsRepository = new StatsRepository(context);

                var stats = await statsRepository.GetById(1);
                var stats2 = await statsRepository.GetById(2);

                Assert.NotNull(stats);
                Assert.NotNull(stats2);
                Assert.Equal(1, stats.Id);
                Assert.Equal(2, stats2.Id);

            }
        }

        [Fact]
        public async Task GetsStats()
        {
            using (var context = new ApplicationDbContext(_options))
            {
                context.Stats.AddRange(
                    new Stats { Id = 1 },
                    new Stats { Id = 2 },
                    new Stats { Id = 3 });

                context.SaveChanges();
            }

            using (var context = new ApplicationDbContext(_options))
            {
                var statsRepository = new StatsRepository(context);

                var stats = await statsRepository.GetAll(0, 2);

                Assert.Equal(2, stats.Count);
                Assert.NotNull(stats.SingleOrDefault(x => x.Id == 1));
                Assert.NotNull(stats.SingleOrDefault(x => x.Id == 2));

            }
        }

        [Fact]
        public async Task CreatesStats()
        {
            using (var context = new ApplicationDbContext(_options))
            {
                var statsRepository = new StatsRepository(context);

                await statsRepository.Create(new Stats { Id = 1 });
            }

            using (var context = new ApplicationDbContext(_options))
            {
                Assert.Equal(1, context.Stats.Count());
                Assert.Equal(1, context.Stats.Single().Id);
            }
        }

        [Fact]
        public async Task UpdatesStats()
        {
            var statsPf = 2;
            var statsPf2 = 4;

            var mockStats = new List<Stats>
            {
                new Stats { Id = 1, Pf = statsPf },
                new Stats { Id = 2 },
                new Stats { Id = 3 }
            };

            using (var context = new ApplicationDbContext(_options))
            {
                context.Stats.AddRange(mockStats);

                context.SaveChanges();
            }

            using (var context = new ApplicationDbContext(_options))
            {
                var statsRepository = new StatsRepository(context);
                var existingStats = mockStats[0];
                var updatedStats = mockStats[0];
                updatedStats.Pf = statsPf2;
                await statsRepository.Update(existingStats, updatedStats);
            }

            using (var context = new ApplicationDbContext(_options))
            {
                Assert.NotNull(context.Stats.SingleOrDefault(x => x.Id == 1));
                Assert.Equal(statsPf2, context.Stats.Single(x => x.Id == 1).Pf);
            }
        }

        [Fact]
        public async Task DeletesStats()
        {
            var mockStats = new List<Stats>
            {
                new Stats { Id = 1 },
                new Stats { Id = 2 },
                new Stats { Id = 3 }
            };

            using (var context = new ApplicationDbContext(_options))
            {
                context.Stats.AddRange(mockStats);

                context.SaveChanges();
            }

            using (var context = new ApplicationDbContext(_options))
            {
                var statsRepository = new StatsRepository(context);

                var stats = mockStats[0];
                await statsRepository.Delete(stats);
            }

            using (var context = new ApplicationDbContext(_options))
            {
                Assert.Equal(2, context.Stats.Count());
                Assert.Null(context.Stats.SingleOrDefault(x => x.Id == 1));
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
