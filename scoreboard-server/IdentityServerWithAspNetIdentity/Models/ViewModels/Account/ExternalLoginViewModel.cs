using System.ComponentModel.DataAnnotations;

namespace IdentityServerWithAspNetIdentity.Models.ViewModels.Account
{
    public class ExternalLoginViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
