using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ScoreboardServer.Models;
using ScoreboardServer.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ScoreboardServer.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [Authorize]
    public class TeamsController : Controller
    {
        private readonly ITeamsService _service;

        public TeamsController(ITeamsService service)
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
        [ProducesResponseType(typeof(Team), 200)]
        public async Task<IActionResult> GetRange([FromQuery] int offset = 0, [FromQuery] int limit = 10)
        {
            var userId = GetUserId();
            var teams = await _service.GetAllTeams(offset, limit, userId);
            return Ok(teams);
        }

        // GET api/values/5
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Team), 200)]
        public async Task<IActionResult> Get([FromRoute] int id)
        {
            var userId = GetUserId();
            var result = await _service.GetTeamById(id, userId);
            if (result == null)
            {
                return NotFound("No team found");
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

        // POST api/values
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]Team value)
        {
            var userId = GetUserId();
            value.ApplicationUserId = userId;
            if (value.Players != null)
            {
                foreach (var player in value.Players)
                {
                    player.ApplicationUserId = userId;
                }
            }
            var id = await _service.Create(value);
            return Created("/teams/" + id, id);
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody]Team value)
        {
            var userId = GetUserId();
            var result = await _service.Update(id, value, userId);
            if (!result)
            {
                return NotFound("No team found");
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
                return NotFound("No team found");
            }
            return Ok();
        }
    }
}
