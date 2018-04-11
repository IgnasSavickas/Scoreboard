using System.ComponentModel.DataAnnotations;

namespace IdentityServerWithAspNetIdentity.Models.ViewModels.Account
{
    public class ForgotPasswordViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
