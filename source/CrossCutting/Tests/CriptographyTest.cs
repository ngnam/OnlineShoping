using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Solution.CrossCutting.DependencyInjection;
using Solution.CrossCutting.Security;

namespace Solution.CrossCutting.Tests
{
    [TestClass]
    public class CriptographyTest
    {
        public CriptographyTest()
        {
            Criptography = DependencyInjector.GetService<ICriptography>();
            Criptography.SetKey(Guid.NewGuid().ToString());
        }

        private ICriptography Criptography { get; }

        [TestMethod]
        public void CriptographyEncryptDecrypt()
        {
            const string text = nameof(Criptography);
            var encrypted = Criptography.Encrypt(text);
            var decrypted = Criptography.Decrypt(encrypted);

            Assert.AreEqual(text, decrypted);
        }
    }
}
