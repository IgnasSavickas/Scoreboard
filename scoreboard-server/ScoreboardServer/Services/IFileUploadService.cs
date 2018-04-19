using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using ScoreboardServer.Models;

namespace ScoreboardServer.Services
{
    public interface IFileUploadService
    {
        Task<FileUploadResultDto> Upload(IFormFile file);
    }
}
