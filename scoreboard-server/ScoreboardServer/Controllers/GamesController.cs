using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using ScoreboardServer.Models;
using ScoreboardServer.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ScoreboardServer.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [Authorize]
    public class GamesController : Controller
    {
        private readonly IGamesService _service;

        public GamesController(IGamesService service)
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
        [ProducesResponseType(typeof(Game), 200)]
        public async Task<IActionResult> GetRange([FromQuery] int offset = 0, [FromQuery] int limit = 10)
        {
            var userId = GetUserId();
            var games = await _service.GetAllGames(offset, limit, userId);
            return Ok(games);
        }

        [AllowAnonymous]
        [HttpGet("public")]
        [ProducesResponseType(typeof(Game), 200)]
        public async Task<IActionResult> GetPublicRange([FromQuery] int offset = 0, [FromQuery] int limit = 10)
        {
            var games = await _service.GetAllGames(offset, limit);
            return Ok(games);
        }

        // GET api/values/5
        [AllowAnonymous]
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Game), 200)]
        public async Task<IActionResult> Get([FromRoute] int id)
        {
            var userId = GetUserId();
            var result = await _service.GetGameById(id, userId);
            if (result == null)
            {
                return NotFound("No game found");
            }
            return Ok(result);
        }

        [HttpGet("size")]
        public async Task<IActionResult> GetSize()
        {
            var userId = GetUserId();
            var size = await _service.GetSize(userId);
            return Ok(size);
        }

        [AllowAnonymous]
        [HttpGet("public/size")]
        public async Task<IActionResult> GetPublicSize()
        {
            var size = await _service.GetSize();
            return Ok(size);
        }

        // POST api/values
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]Game value)
        {
            if (value.HomeTeamId == value.VisitorTeamId)
            {
                return new StatusCodeResult(StatusCodes.Status409Conflict);
            }
            var userId = GetUserId();
            value.ApplicationUserId = userId;
            value.DateCreated = DateTime.Now;
            if (value.Stats != null)
            {
                foreach (var stats in value.Stats)
                {
                    if (stats.Player != null)
                    {
                        stats.Player.ApplicationUserId = userId;
                    }
                }
            }
            var id = await _service.Create(value);
            return Created("/games/" + id, id);
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody]Game value)
        {
            var userId = GetUserId();
            var result = await _service.Update(id, value, userId);
            if (!result)
            {
                return NotFound("No game found");
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
                return NotFound("No game found");
            }
            return Ok();
        }

        [HttpGet("team/{id}")]
        [ProducesResponseType(typeof(Game), 200)]
        public async Task<IActionResult> GetAllByTeamId([FromRoute] int id)
        {
            var teamGames = await _service.GetGamesByTeamId(id);
            return Ok(teamGames);
        }
    }
}
