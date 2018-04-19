using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
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

        // GET api/values/5
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

        // POST api/values
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]Game value)
        {
            var userId = GetUserId();
            value.ApplicationUserId = userId;
            value.DateCreated = DateTime.Now;
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
    }
}
