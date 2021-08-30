using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Beekeeper.Backend.Models
{
    public class Worker
    {
        public Guid Id { get; set; }

        [Required]
        [Column(TypeName = "varchar(256)")]
        public string Name { get; set; }

        [Column(TypeName = "varchar(256)")] public string Description { get; set; }

        [Required]
        [Column(TypeName = "varchar(256)")]
        public string LoginKey { get; set; }

        [Column(TypeName = "varchar(256)")] public string Address { get; set; }

        public bool Online { get; set; } = false;
        public bool Disabled { get; set; } = false;

        public List<WorkerConnection> WorkerConnections { get; set; }
    }
}