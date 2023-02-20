namespace API.DTOs
{
    public class UserDTO
    {
        public string username {get;set;}
        public string token {set;get;}
        public string mainPhotoURL{get;set;}
        public string knownAs { get; set; }
    }
}