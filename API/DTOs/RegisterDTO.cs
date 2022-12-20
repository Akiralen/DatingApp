using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDTO
    {
        [Required(ErrorMessage = "Username is required")]
        [MinLength(4)]
        public string username{get;set;}
        [Required(ErrorMessage = "Password is reqired")]
        [MinLength(8,ErrorMessage = "Password too short")]
        public string password{get;set;}
    }
}