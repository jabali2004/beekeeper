using System.ComponentModel.DataAnnotations;

namespace Beekeeper.Backend.Data.Requests
{
    public class UpdateUserPasswordReq
    {
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
    }
}