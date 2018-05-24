using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ScoreboardServer.Models;
using ScoreboardServer.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ScoreboardServer.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [Authorize]
    public class PlayersController : Controller
    {
        private readonly IPlayersService _service;

        public PlayersController(IPlayersService service)
        {
            _service = service;
        }

        private string GetUserId()
        {
            string userId = null;
            if (User.Identity.IsAuthenticated)
            {
                userId = User.Claims.First(x => x.Type == "sub").Value;
            }
            return userId;
        }

        // GET: api/values
        [HttpGet]
        [ProducesResponseType(typeof(Player), 200)]
        public async Task<IActionResult> GetRange([FromQuery] int offset = 0, [FromQuery] int limit = 10)
        {
            var userId = GetUserId();
            var players = await _service.GetAllPlayers(offset, limit, userId);
            return Ok(players);
        }

        // GET api/values/5
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Player), 200)]
        public async Task<IActionResult> Get([FromRoute] int id)
        {
            var userId = GetUserId();
            var result = await _service.GetPlayerById(id, userId);
            if (result == null)
            {
                return NotFound("No player found");
            }
            return Ok(result);
        }

        // POST api/values
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]Player value)
        {
            var teamPlayers = await _service.GetPlayersByTeamId(value.TeamId);
            foreach (var teamPlayer in teamPlayers)
            {
                if (teamPlayer.Number == value.Number)
                {
                    return new StatusCodeResult(StatusCodes.Status409Conflict);
                }
            }
            var userId = GetUserId();
            value.ApplicationUserId = userId;
            var id = await _service.Create(value);
            return Created("/players/" + id, id);
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody]Player value)
        {
            var userId = GetUserId();
            var result = await _service.Update(id, value, userId);
            if (!result)
            {
                return NotFound("No player found");
            }
            return Ok();
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();
            var result = await _service.Delete(id, userId);
            if (!result)
            {
                return NotFound("No player found");
            }
            return Ok();
        }

        [AllowAnonymous]
        [HttpGet("team/{id}")]
        [ProducesResponseType(typeof(Player), 200)]
        public async Task<IActionResult> GetAllByTeamId([FromRoute] int id)
        {
            var teamPlayers = await _service.GetPlayersByTeamId(id);
            return Ok(teamPlayers);
        }
    }
}
