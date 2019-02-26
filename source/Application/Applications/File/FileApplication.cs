using System.Collections.Generic;
using Solution.Domain.Domains;
using Solution.Model.Models;

namespace Solution.Application.Applications
{
    public sealed class FileApplication : IFileApplication
    {
        public FileApplication(IFileDomain fileDomain)
        {
            FileDomain = fileDomain;
        }

        private IFileDomain FileDomain { get; }

        public byte[] Bytes(string directory, string fileName)
        {
            return FileDomain.Download(directory, fileName);
        }

        public IEnumerable<FileModel> Save(string directory, IEnumerable<FileModel> files)
        {
            return FileDomain.Save(directory, files);
        }
    }
}
