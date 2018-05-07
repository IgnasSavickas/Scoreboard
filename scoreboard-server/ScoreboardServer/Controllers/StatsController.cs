using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ScoreboardServer.Models;
using ScoreboardServer.Services;

namespace ScoreboardServer.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class StatsController : Controller
    {
        private readonly IStatsService _service;

        public StatsController(IStatsService service)
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
        [ProducesResponseType(typeof(Stats), 200)]
        public async Task<IActionResult> GetRange([FromQuery] int offset = 0, [FromQuery] int limit = 10)
        {
            var userId = GetUserId();
            var stats = await _service.GetAllStats(offset, limit);
            return Ok(stats);
        }

        // GET api/values/5
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Stats), 200)]
        public async Task<IActionResult> Get([FromRoute] int id)
        {
            var userId = GetUserId();
            var result = await _service.GetStatsById(id);
            if (result == null)
            {
                return NotFound("No stats found");
            }
            return Ok(result);
        }

        // POST api/values
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]Stats value)
        {
            var userId = GetUserId();
            var id = await _service.Create(value);
            return Created("/stats/" + id, id);
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody]Stats value)
        {
            var userId = GetUserId();
            var result = await _service.Update(id, value);
            if (!result)
            {
                return NotFound("No stats found");
            }
            return Ok();
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetUserId();
            var result = await _service.Delete(id);
            if (!result)
            {
                return NotFound("No stats found");
            }
            return Ok();
        }
    }
}
