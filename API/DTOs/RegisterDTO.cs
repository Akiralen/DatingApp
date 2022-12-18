using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDTO
    {
        [Required]
        [MinLength(4)]
        public string username{get;set;}
        [Required]
        [MinLength(4)]
        public string password{get;set;}
    }
}