using System.Linq;
using Beekeeper.Backend.Models;
using HotChocolate;

namespace Beekeeper.Backend.Utils
{
    public class Query
    {
        public IQueryable<Worker> GetWorkers([Service] BeekeeperContext context)
        {
            return context.Workers;
        }

        public IQueryable<WorkerConnection> GetWorkerConnections([Service] BeekeeperContext context)
        {
            return context.WorkerConnections;
        }
    }
}