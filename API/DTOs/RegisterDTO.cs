using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDTO
    {
        [Required]
        [MinLength(4)]
        public string username { get; set; }
        [Required] public string knownAs { get; set; }
        [Required] public string gender { get; set; }
        [Required] public DateOnly? dateOfBirth { get; set; }
        [Required] public string city { get; set; }
        [Required] public string country { get; set; }
        [Required]
        [MinLength(8)]
        public string password { get; set; }
    }
}