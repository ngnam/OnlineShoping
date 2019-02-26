using System.Collections.Generic;
using System.IO;
using Microsoft.AspNetCore.Http;
using Solution.Model.Models;

namespace Solution.CrossCutting.AspNetCore.Extensions
{
    public static class HttpRequestExtensions
    {
        public static IList<FileModel> Files(this HttpRequest request)
        {
            var files = new List<FileModel>();

            foreach (var formFile in request.Form.Files)
            {
                var file = new FileModel
                {
                    ContentType = formFile.ContentType,
                    FileName = formFile.FileName,
                    Length = formFile.Length,
                    Name = formFile.Name
                };

                using (var ms = new MemoryStream())
                {
                    formFile.CopyTo(ms);
                    file.Bytes = ms.ToArray();
                }

                files.Add(file);
            }

            return files;
        }
    }
}
