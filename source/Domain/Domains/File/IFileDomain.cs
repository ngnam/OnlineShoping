using System.Collections.Generic;
using Solution.Model.Models;

namespace Solution.Domain.Domains
{
    public interface IFileDomain
    {
        byte[] Download(string directory, string fileName);

        IEnumerable<FileModel> Save(string directory, IEnumerable<FileModel> files);
    }
}
