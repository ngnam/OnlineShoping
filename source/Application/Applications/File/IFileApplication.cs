using System.Collections.Generic;
using Solution.Model.Models;

namespace Solution.Application.Applications
{
    public interface IFileApplication
    {
        byte[] Bytes(string directory, string fileName);

        IEnumerable<FileModel> Save(string directory, IEnumerable<FileModel> files);
    }
}
