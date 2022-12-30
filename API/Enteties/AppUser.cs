using System.ComponentModel.DataAnnotations;
using API.Extensions;
using Microsoft.AspNetCore.Identity;

namespace API.Enteties
{
    public class AppUser
    {
        [Key]
        public int id{get;set;}
        public string username{get;set;}
        public byte[] passwordHash{get;set;}
        public byte[] passwordSalt{get;set;}
        public DateOnly dateOfBirth{get;set;}
        public string knownAs{get;set;}
        public DateTime created {get;set;} = DateTime.UtcNow;
        public DateTime lastActive{get;set;}=DateTime.UtcNow;
        public string gender {get;set;}
        public string introduction{get;set;}
        public string lookingFor{get;set;}
        public string interests{get;set;}
        public string city{get;set;}
        public string country{get;set;}
        public List<Photo> photos{get;set;} = new List<Photo>();
        public int GetAge(){
            return dateOfBirth.CalculateAge();
        }
    }
}