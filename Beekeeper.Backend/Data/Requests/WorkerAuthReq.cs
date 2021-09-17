using System.ComponentModel.DataAnnotations;

namespace Beekeeper.Backend.Data.Requests
{
    public class WorkerAuthReq
    {
        [Required(ErrorMessage = "Id is required")]
        public string Id { get; set; }

        [Required(ErrorMessage = "LoginKey is required")]
        public string LoginKey { get; set; }
    }
}