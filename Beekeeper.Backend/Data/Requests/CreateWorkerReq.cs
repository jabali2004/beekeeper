namespace Beekeeper.Backend.Data.Requests
{
    public class CreateWorkerReq
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string LoginKey { get; set; }
        public string Address { get; set; }

        public bool Disabled { get; set; } = false;
    }
}