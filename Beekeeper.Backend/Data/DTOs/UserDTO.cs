using System;

namespace Beekeeper.Backend.Data
{
    public class UserDTO
    {
        public Guid Id { get; set; }

        public string UserName { get; set; }

        public string Email { get; set; }

        public bool EmailConfirmed { get; set; }

        public string DisplayName { get; set; }
    }
}