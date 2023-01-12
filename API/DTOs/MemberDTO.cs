namespace API.DTOs
{
    public class MemberDTO
    {
        public int id { get; set; }
        public string username { get; set; }
        public string photoURL { get; set; }
        public int age { get; set; }
        public string knownAs { get; set; }
        public DateTime created { get; set; }
        public DateTime lastActive { get; set; }
        public string gender { get; set; }
        public string introduction { get; set; }
        public string lookingFor { get; set; }
        public string intrests { get; set; }
        public string city { get; set; }
        public string country { get; set; }
        public List<PhotoDTO> photos { get; set; }

    }
}