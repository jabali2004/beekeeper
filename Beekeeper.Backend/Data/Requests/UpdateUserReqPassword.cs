using System.ComponentModel.DataAnnotations;

namespace Beekeeper.Backend.Data.Requests
{
    public class UpdateUserPasswordReq
    {
        [Required(ErrorMessage = "Old Password is required")]
        public string OldPassword { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
    }
}