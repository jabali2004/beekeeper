using System;
using System.Collections.Generic;

namespace Beekeeper.Backend.Data.DTOs
{
    public class WorkerDTO
    {
        public string Id { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }

        public string LoginKey { get; set; }

        public string Address { get; set; }

        public bool Online { get; set; } = false;
        public bool Disabled { get; set; } = false;

        public List<WorkerConnectionDTO> Connections { get; set; }
        
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}