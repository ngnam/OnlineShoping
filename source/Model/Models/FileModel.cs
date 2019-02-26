namespace Solution.Model.Models
{
    public class FileModel
    {
        public byte[] Bytes { get; set; }

        public string ContentType { get; set; }

        public string FileName { get; set; }

        public long Length { get; set; }

        public string Name { get; set; }
    }
}
