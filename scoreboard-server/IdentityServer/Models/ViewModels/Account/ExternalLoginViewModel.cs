using System.ComponentModel.DataAnnotations;

namespace IdentityServer.Models.ViewModels.Account
{
    public class ExternalLoginViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
