using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ScoreboardServer.Models;
using ScoreboardServer.Services;

namespace ScoreboardServer.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [Authorize]
    public class FileUploadController : Controller
    {
        private readonly IFileUploadService _fileUploadService;

        public FileUploadController(IFileUploadService fileUploadService)
        {
            _fileUploadService = fileUploadService;
        }

        [HttpPost]
        [ProducesResponseType(typeof(FileUploadResultDto), 200)]
        public async Task<IActionResult> Post(IFormFile file)
        {
            var result = await _fileUploadService.Upload(file);

            return Ok(result);
        }
    }
}