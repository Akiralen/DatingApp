using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class MemberUpdateDTO
    {
        public string introduction{get;set;}
        public string lookingFor{get;set;}
        public string intrests{get;set;}
        public string city{get;set;}
        public string country{get;set;}
    }
}