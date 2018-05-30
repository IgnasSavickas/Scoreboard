using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using ScoreboardServer.Models;

namespace ScoreboardServer.Services
{
    public class FileUploadService : IFileUploadService
    {
        public async Task<FileUploadResultDto> Upload(IFormFile file)
        {
            if (file == null)
            {
                throw new ArgumentNullException(nameof(file));
            }

            string fileName;
            if (file.Length > 0)
            {
                var filePath = file.FileName.Contains(".xls") ? GetExcelDirectory() : GetImageDirectory();
                fileName = Guid.NewGuid() + file.FileName;
                var fileFullName = Path.Combine(filePath, fileName);
                using (var stream = new FileStream(fileFullName, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
            }
            else
            {
                throw new ArgumentException("File cannot be empty", nameof(file));
            }

            var result = new FileUploadResultDto
            {
                Size = file.Length,
                FileName = fileName
            };
            return result;
        }

        private string GetImageDirectory()
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "images");

            Directory.CreateDirectory(filePath);

            return filePath;
        }

        private string GetExcelDirectory()
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "excel");

            Directory.CreateDirectory(filePath);

            return filePath;
        }
    }
}
