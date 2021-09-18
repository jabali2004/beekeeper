using System.Linq;
using AutoMapper;
using Beekeeper.Backend.Models;
using HotChocolate;
using HotChocolate.Types;

namespace Beekeeper.Backend.Utils
{
    public class Query
    {
        private readonly IMapper _mapper;

        public Query(IMapper mapper)
        {
            _mapper = mapper;
        }

        [UseOffsetPaging]
        [HotChocolate.Data.UseFiltering]
        [HotChocolate.Data.UseSorting]
        public IQueryable<Worker> GetWorkers([Service] BeekeeperContext context)
        {
            return context.Workers;
        }

        [UseOffsetPaging]
        [HotChocolate.Data.UseFiltering]
        [HotChocolate.Data.UseSorting]
        public IQueryable<WorkerConnection> GetWorkerConnections([Service] BeekeeperContext context)
        {
            return context.WorkerConnections;
        }
    }
}