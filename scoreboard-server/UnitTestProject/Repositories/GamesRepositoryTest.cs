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
    public class GamesRepositoryTest : IDisposable
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;

        public GamesRepositoryTest()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase("Database for tests")
                .Options;
        }

        [Fact]
        public async Task GetsGameById()
        {
            using (var context = new ApplicationDbContext(_options))
            {
                context.Games.AddRange(
                    new Game { Id = 1 },
                    new Game { Id = 2 });

                context.SaveChanges();
            }

            using (var context = new ApplicationDbContext(_options))
            {
                var gamesRepository = new GamesRepository(context);

                var game = await gamesRepository.GetById(1);
                var game2 = await gamesRepository.GetById(2);

                Assert.NotNull(game);
                Assert.NotNull(game2);
                Assert.Equal(1, game.Id);
                Assert.Equal(2, game2.Id);

            }
        }

        [Fact]
        public async Task GetsGames()
        {
            using (var context = new ApplicationDbContext(_options))
            {
                context.Games.AddRange(
                    new Game { Id = 1 },
                    new Game { Id = 2 },
                    new Game { Id = 3 });

                context.SaveChanges();
            }

            using (var context = new ApplicationDbContext(_options))
            {
                var gamesRepository = new GamesRepository(context);

                var games = await gamesRepository.GetAll(0, 2);

                Assert.Equal(2, games.Count);
                Assert.NotNull(games.SingleOrDefault(x => x.Id == 1));
                Assert.NotNull(games.SingleOrDefault(x => x.Id == 2));

            }
        }

        [Fact]
        public async Task CreatesGame()
        {
            using (var context = new ApplicationDbContext(_options))
            {
                var gamesRepository = new GamesRepository(context);

                await gamesRepository.Create(new Game { Id = 1 });
            }

            using (var context = new ApplicationDbContext(_options))
            {
                Assert.Equal(1, context.Games.Count());
                Assert.Equal(1, context.Games.Single().Id);
            }
        }

        [Fact]
        public async Task UpdatesGame()
        {
            var dateTime = DateTime.Now;
            var dateTime2 = dateTime + TimeSpan.FromDays(7);

            var mockGames = new List<Game>
            {
                new Game { Id = 1, StartDate = dateTime },
                new Game { Id = 2 },
                new Game { Id = 3 }
            };

            using (var context = new ApplicationDbContext(_options))
            {
                context.Games.AddRange(mockGames);

                context.SaveChanges();
            }

            using (var context = new ApplicationDbContext(_options))
            {
                var gamesRepository = new GamesRepository(context);
                var existingGame = mockGames[0];
                var updatedGame = mockGames[0];
                updatedGame.StartDate = dateTime2;
                await gamesRepository.Update(existingGame, updatedGame);
            }

            using (var context = new ApplicationDbContext(_options))
            {
                Assert.NotNull(context.Games.SingleOrDefault(x => x.Id == 1));
                Assert.Equal(dateTime2, context.Games.Single(x => x.Id == 1).StartDate);
            }
        }

        [Fact]
        public async Task DeletesGame()
        {
            var mockGames = new List<Game>
            {
                new Game { Id = 1 },
                new Game { Id = 2 },
                new Game { Id = 3 }
            };

            using (var context = new ApplicationDbContext(_options))
            {
                context.Games.AddRange(mockGames);

                context.SaveChanges();
            }

            using (var context = new ApplicationDbContext(_options))
            {
                var gamesRepository = new GamesRepository(context);

                var game = mockGames[0];
                await gamesRepository.Delete(game);
            }

            using (var context = new ApplicationDbContext(_options))
            {
                Assert.Equal(2, context.Games.Count());
                Assert.Null(context.Games.SingleOrDefault(x => x.Id == 1));
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
