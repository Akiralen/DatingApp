using System.ComponentModel.DataAnnotations.Schema;

namespace API.Enteties
{
    [Table("Photos")]
    public class Photo
    {
        public int id {get;set;}
        public string url{get;set;}
        public bool isMain{get;set;}
        public string publicId{get;set;}
        public int appUserId{get;set;}
        public AppUser appuser{get;set;}
    }
}