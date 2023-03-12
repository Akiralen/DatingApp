using API.DTOs;
using API.Enteties;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public UserRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;

        }

        public async Task<MemberDTO> GetMemberByNameAsync(string username)
        {
            return await _context.Users
                .Where(x => x.username == username)
                .ProjectTo<MemberDTO>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();

        }

        public async Task<PagedList<MemberDTO>> GetMembersAsync(UserParams userParams)
        {
            var query = _context.Users.AsQueryable();

            query = query.Where(user => user.username != userParams.currentUsername);
            if (userParams.gender != "any" || userParams.gender == null)
                query = query.Where(user => user.gender == userParams.gender);

            var minDOB = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.maxAge - 1));
            var maxDOB = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.minAge));
            query = query.Where(user => user.dateOfBirth >= minDOB && user.dateOfBirth <= maxDOB);

            query = userParams.orderBy switch
            {
                "name" => query.OrderBy(u => u.knownAs),
                "name_d" => query.OrderByDescending(u => u.knownAs),
                "age_d" => query.OrderBy(u => u.dateOfBirth),
                "age" => query.OrderByDescending(u => u.dateOfBirth),
                _ => query.OrderByDescending(u => u.lastActive)
            };

            return await PagedList<MemberDTO>.CreateAsync(
                query.AsNoTracking().ProjectTo<MemberDTO>(_mapper.ConfigurationProvider),
                userParams.pageNumber,
                userParams.pageSize
            );

        }

        public async Task<AppUser> GetUserByIDAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _context.Users
                .Include(p => p.photos)
                .SingleOrDefaultAsync(x => x.username == username);
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _context.Users
                .Include(p => p.photos)
                .ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }
    }
}