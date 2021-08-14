using System.ComponentModel.DataAnnotations;

namespace BeekeeperBackend.Data
{
    public class LoginReq
    {
        [Required(ErrorMessage = "User Name is required")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
    }
}