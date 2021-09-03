using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Beekeeper.Backend.Models
{
    public class WorkerConnection
    {
        public Guid Id { get; set; }

        [Required] public Worker Worker { get; set; }

        [Column(TypeName = "varchar(256)")] public string Address { get; set; }

        public bool Failed { get; set; } = false;

        public DateTime ConnectedAt { get; set; }
    }
}