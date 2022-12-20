using System.ComponentModel.DataAnnotations;

namespace API.Enteties
{
    public class AppUser
    {
        [Key]
        public int id{get;set;}
        public string username{get;set;}
        public byte[] passwordHash{get;set;}
        public byte[] passwordSalt{get;set;}

    }
}