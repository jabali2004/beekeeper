using System;

namespace Beekeeper.Backend.Data.Requests
{
    public class UpdateWorkerReq
    {
        public string Id { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
        // public string LoginKey { get; set; }
        public string Address { get; set; }

        public bool Disabled { get; set; } = false;
    }
}