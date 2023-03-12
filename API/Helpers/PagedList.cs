using Microsoft.EntityFrameworkCore;

namespace API.Helpers
{
    public class PagedList<T> : List<T>
    {
        public PagedList(IEnumerable<T> items, int count, int pageNumber, int size)
        {
            currentPage = pageNumber;
            totalPages = (int)Math.Ceiling(count / (double)size);
            pageSize = size;
            totalCount = count;
            AddRange(items);
        }

        public int currentPage { get; set; }
        public int totalPages { get; set; }
        public int pageSize { get; set; }
        public int totalCount { get; set; }

        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source,
            int pageNumber, int size)
        {
            var count = await source.CountAsync();
            var items = await source.Skip((pageNumber - 1) * size).Take(size).ToListAsync();
            return new PagedList<T>(items,count,pageNumber,size);
        }
    }
}