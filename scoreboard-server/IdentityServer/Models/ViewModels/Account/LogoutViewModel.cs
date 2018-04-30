using IdentityServer.Models.InputModels;

namespace IdentityServer.Models.ViewModels.Account
{
    public class LogoutViewModel : LogoutInputModel
    {
        public bool ShowLogoutPrompt { get; set; }
    }
}
