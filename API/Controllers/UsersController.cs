using System.ComponentModel;
using System.Security.Claims;
using API.DTOs;
using API.Enteties;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseAPIController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            _photoService = photoService;
            _mapper = mapper;
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            var users = await _userRepository.GetMembersAsync();

            var usersToReturn = _mapper.Map<IEnumerable<MemberDTO>>(users);

            return Ok(usersToReturn);
        }

        // [HttpGet("{id}")]
        // public async Task<ActionResult<AppUser>> GetUser(int id)
        // {
        //     return await __userRepository.GetUserByIDAsync(id);
        // }
        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDTO>> GetUser(string username)
        {
            var user = await _userRepository.GetMemberByNameAsync(username);

            return _mapper.Map<MemberDTO>(user);
        }
        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDTO memberUpdateDTO)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            if (user == null) return NotFound();

            _mapper.Map(memberUpdateDTO, user);
            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update database");
        }
        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDTO>> AddPhoto(IFormFile file)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            if (user == null) return NotFound();

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                url = result.SecureUrl.AbsoluteUri,
                publicId = result.PublicId
            };
            if (user.photos.Count == 0) photo.isMain = true;

            user.photos.Add(photo);

            if(await _userRepository.SaveAllAsync()) return _mapper.Map<PhotoDTO>(photo);

            return BadRequest("Unable to add photo");
        }
    }
}