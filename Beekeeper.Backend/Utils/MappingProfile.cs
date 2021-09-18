using AutoMapper;
using Beekeeper.Backend.Data.DTOs;
using Beekeeper.Backend.Data.Requests;
using Beekeeper.Backend.Models;

namespace Beekeeper.Backend.Utils
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Add as many of these lines as you need to map your objects
            CreateMap<ApplicationUser, UserDTO>();

            // Worker
            CreateMap<Worker, WorkerDTO>();

            CreateMap<CreateWorkerReq, Worker>();
            CreateMap<UpdateWorkerReq, Worker>();

            // WorkerConnection
            CreateMap<WorkerConnection, WorkerConnectionDTO>();
        }
    }
}