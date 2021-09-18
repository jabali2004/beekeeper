using System;

namespace Beekeeper.Backend.Data.DTOs
{
    public class WorkerConnectionDTO
    {
        public string Id { get; set; }

        public WorkerDTO Worker { get; set; }

        public string Address { get; set; }
        public bool Failed { get; set; } = false;

        public DateTime ConnectedAt { get; set; }
    }
}