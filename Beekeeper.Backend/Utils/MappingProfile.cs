using System.Collections.Generic;
using AutoMapper;
using Beekeeper.Backend.Data.DTOs;
using Beekeeper.Backend.Models;

namespace Beekeeper.Backend.Utils
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Add as many of these lines as you need to map your objects
            CreateMap<ApplicationUser, UserDTO>();

            // Worker and WorkerConnection
            CreateMap<Worker, WorkerDTO>();
            CreateMap<WorkerConnection, WorkerConnectionDTO>();

            CreateMap<List<Worker>, List<Worker>>();
            CreateMap<List<WorkerConnection>, List<WorkerConnectionDTO>>();
        }
    }
}