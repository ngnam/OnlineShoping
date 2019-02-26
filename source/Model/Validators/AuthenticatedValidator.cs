using FluentValidation;
using Solution.CrossCutting.Utils.Resources;
using Solution.Model.Models;

namespace Solution.Model.Validators
{
    public sealed class AuthenticatedValidator : Validator<AuthenticatedModel>
    {
        public AuthenticatedValidator() : base(Texts.AuthenticationInvalid)
        {
            RuleFor(x => x).NotNull();
            RuleFor(x => x.UserId).GreaterThan(0);
        }
    }
}
