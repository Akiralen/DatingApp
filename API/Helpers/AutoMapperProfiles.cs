using API.DTOs;
using API.Enteties;
using API.Extensions;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser,MemberDTO>()
                .ForMember(dest=>dest.photoURL,
                    opt=>opt.MapFrom(src=>src.photos.FirstOrDefault(x=>x.isMain).url))
                    .ForMember(dest=>dest.age,opt=>opt.MapFrom(src=>src.dateOfBirth.CalculateAge()));
            CreateMap<Photo,PhotoDTO>();
            CreateMap<MemberUpdateDTO, AppUser>();
        }
            
    }
}