using System;
using System.Collections.Generic;
using System.IO;
using Solution.Model.Models;

namespace Solution.Domain.Domains
{
    public sealed class FileDomain : IFileDomain
    {
        public byte[] Download(string directory, string fileName)
        {
            return File.ReadAllBytes(GetFilePath(directory, fileName));
        }

        public IEnumerable<FileModel> Save(string directory, IEnumerable<FileModel> files)
        {
            Directory.CreateDirectory(directory);

            foreach (var file in files)
            {
                file.FileName = Guid.NewGuid() + Path.GetExtension(file.FileName);

                using (var fs = new FileStream(GetFilePath(directory, file.FileName), FileMode.Create))
                {
                    fs.Write(file.Bytes);
                }

                file.Bytes = null;
            }

            return files;
        }

        private static string GetFilePath(string directory, string fileName)
        {
            return Path.Combine(directory, fileName);
        }
    }
}
