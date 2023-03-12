namespace API.Helpers
{
    public class UserParams
    {
        private const int maxPageSize = 50;
        public int pageNumber { get; set; } = 1;
        private int _pageSize = 10;
        public int pageSize
        {
            get => _pageSize;
            set => _pageSize = (value > maxPageSize) ? maxPageSize : value;
        }

        public string currentUsername { get; set; }
        public string gender { get; set; }
        public int minAge { get; set; } = 18;
        public int maxAge { get; set; } = 100;
        public string orderBy { get; set; } = "lastActive";

    }
}