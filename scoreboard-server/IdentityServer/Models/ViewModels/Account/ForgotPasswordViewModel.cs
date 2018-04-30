using System.ComponentModel.DataAnnotations;

namespace IdentityServer.Models.ViewModels.Account
{
    public class ForgotPasswordViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
