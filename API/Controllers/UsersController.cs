using API.DTOs;
using API.Enteties;
using API.Extensions;
using API.Helpers;
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
        public async Task<ActionResult<PagedList<AppUser>>> GetUsers([FromQuery] UserParams userParams)
        {
            var currentUser = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            userParams.currentUsername = currentUser.username;

            if (string.IsNullOrEmpty(userParams.gender))
            {
                userParams.gender = currentUser.gender == "male" ? "female" : "male";
            }
            var users = await _userRepository.GetMembersAsync(userParams);

            Response.AddPaginationHeader(new PaginationHeader(users.currentPage, users.pageSize
                , users.totalCount, users.totalPages));


            return Ok(users);
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

            if (await _userRepository.SaveAllAsync())
            {
                return CreatedAtAction(nameof(GetUser),
                    new { username = user.username },
                    _mapper.Map<PhotoDTO>(photo));
            }

            return BadRequest("Unable to add photo");
        }
        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            if (user == null) return NotFound("User not found");

            var photo = user.photos.FirstOrDefault(x => x.id == photoId);

            if (photo == null) return NotFound("Photo not found");

            if (photo.isMain) return BadRequest("This photo is already main");

            var oldMain = user.photos.FirstOrDefault(x => x.isMain);
            if (oldMain != null) oldMain.isMain = false;
            photo.isMain = true;

            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Unable to set main photo");
        }
        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            var photo = user.photos.FirstOrDefault(x => x.id == photoId);

            if (photo == null) return NotFound();

            if (photo.isMain) return BadRequest("Unable to delete main photo");

            if (photo.publicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.publicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            user.photos.Remove(photo);
            if (await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Problem deleting");
        }
    }
}