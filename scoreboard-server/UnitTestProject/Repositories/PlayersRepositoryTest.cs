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
    public class PlayersRepositoryTest : IDisposable
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;

        public PlayersRepositoryTest()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase("Database for tests")
                .Options;
        }

        [Fact]
        public async Task GetsPlayerById()
        {
            using (var context = new ApplicationDbContext(_options))
            {
                context.Players.AddRange(
                    new Player { Id = 1 },
                    new Player { Id = 2 });

                context.SaveChanges();
            }

            using (var context = new ApplicationDbContext(_options))
            {
                var playersRepository = new PlayersRepository(context);

                var player = await playersRepository.GetById(1);
                var player2 = await playersRepository.GetById(2);

                Assert.NotNull(player);
                Assert.NotNull(player2);
                Assert.Equal(1, player.Id);
                Assert.Equal(2, player2.Id);

            }
        }

        [Fact]
        public async Task GetsPlayers()
        {
            using (var context = new ApplicationDbContext(_options))
            {
                context.Players.AddRange(
                    new Player { Id = 1 },
                    new Player { Id = 2 },
                    new Player { Id = 3 });

                context.SaveChanges();
            }

            using (var context = new ApplicationDbContext(_options))
            {
                var playersRepository = new PlayersRepository(context);

                var players = await playersRepository.GetAll(0, 2);

                Assert.Equal(2, players.Count);
                Assert.NotNull(players.SingleOrDefault(x => x.Id == 1));
                Assert.NotNull(players.SingleOrDefault(x => x.Id == 2));

            }
        }

        [Fact]
        public async Task CreatesPlayer()
        {
            using (var context = new ApplicationDbContext(_options))
            {
                var playersRepository = new PlayersRepository(context);

                await playersRepository.Create(new Player { Id = 1 });
            }

            using (var context = new ApplicationDbContext(_options))
            {
                Assert.Equal(1, context.Players.Count());
                Assert.Equal(1, context.Players.Single().Id);
            }
        }

        [Fact]
        public async Task UpdatesPlayer()
        {
            var playerName = "Player";
            var playerName2 = "Player1";

            var mockPlayers = new List<Player>
            {
                new Player { Id = 1, Name = playerName },
                new Player { Id = 2 },
                new Player { Id = 3 }
            };

            using (var context = new ApplicationDbContext(_options))
            {
                context.Players.AddRange(mockPlayers);

                context.SaveChanges();
            }

            using (var context = new ApplicationDbContext(_options))
            {
                var playersRepository = new PlayersRepository(context);
                var existingPlayer = mockPlayers[0];
                var updatedPlayer = mockPlayers[0];
                updatedPlayer.Name = playerName2;
                await playersRepository.Update(existingPlayer, updatedPlayer);
            }

            using (var context = new ApplicationDbContext(_options))
            {
                Assert.NotNull(context.Players.SingleOrDefault(x => x.Id == 1));
                Assert.Equal(playerName2, context.Players.Single(x => x.Id == 1).Name);
            }
        }

        [Fact]
        public async Task DeletesPlayer()
        {
            var mockPlayers = new List<Player>
            {
                new Player { Id = 1 },
                new Player { Id = 2 },
                new Player { Id = 3 }
            };

            using (var context = new ApplicationDbContext(_options))
            {
                context.Players.AddRange(mockPlayers);

                context.SaveChanges();
            }

            using (var context = new ApplicationDbContext(_options))
            {
                var playersRepository = new PlayersRepository(context);

                var player = mockPlayers[0];
                await playersRepository.Delete(player);
            }

            using (var context = new ApplicationDbContext(_options))
            {
                Assert.Equal(2, context.Players.Count());
                Assert.Null(context.Players.SingleOrDefault(x => x.Id == 1));
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
