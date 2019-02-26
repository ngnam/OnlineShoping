using System.Collections.Generic;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Solution.Application.Applications;
using Solution.CrossCutting.AspNetCore.Attributes;
using Solution.CrossCutting.AspNetCore.Extensions;
using Solution.Model.Models;

namespace Solution.Web.App
{
    [ApiController]
    [RouteController]
    public class FileServiceController : ControllerBase
    {
        public FileServiceController(IHostingEnvironment environment, IFileApplication fileApplication)
        {
            Environment = environment;
            FileApplication = fileApplication;
            Directory = Path.Combine(Environment.ContentRootPath, "Files");
        }

        private string Directory { get; }

        private IHostingEnvironment Environment { get; }

        private IFileApplication FileApplication { get; }

        [HttpGet]
        [RouteAction]
        public IActionResult Download(string fileName)
        {
            new FileExtensionContentTypeProvider().TryGetContentType(fileName, out var contentType);
            var bytes = FileApplication.Bytes(Directory, fileName);

            return File(bytes, contentType, fileName);
        }

        [DisableRequestSizeLimit]
        [HttpPost]
        [RouteAction]
        public IEnumerable<FileModel> Upload()
        {
            return FileApplication.Save(Directory, Request.Files());
        }
    }
}
