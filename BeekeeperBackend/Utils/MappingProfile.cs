using AutoMapper;
using BeekeeperBackend.Data;
using BeekeeperBackend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BeekeeperBackend.Utils
{
    public class MappingProfile: Profile
    {
        public MappingProfile()
        {
            // Add as many of these lines as you need to map your objects
            CreateMap<ApplicationUser, UserDTO>();
        }
    }
}
