using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BeekeeperBackend.Data
{
    public class UserDTO
    {
        public Guid Id {  get; set; }

        public string UserName {  get; set; }

        public string Email {  get; set; }

        public bool EmailConfirmed {  get; set; }

        public string DisplayName { get; set; }
    }
}
