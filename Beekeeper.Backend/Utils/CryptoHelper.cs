using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using Serilog;


namespace Beekeeper.Backend.Utils
{
    public static class CryptoHelper
    {
        private static readonly char[] Punctuations = "!@#$%^&*()_-+=[{]};:>|./?".ToCharArray();

        // Initialization vector
        private static readonly byte[] Iv = Encoding.UTF8.GetBytes(
            Startup.StaticConfig.GetValue<string>("Crypto:Iv")
        );

        // Symmetric key
        private static readonly byte[] Key = Encoding.UTF8.GetBytes(
            Startup.StaticConfig.GetValue<string>("Crypto:Key"));


        /// <summary>
        /// Generate secure string which could be used for passwords
        /// </summary>
        /// <param name="length"></param>
        /// <param name="numberOfNonAlphanumericCharacters"></param>
        /// <returns></returns>
        /// <exception cref="ArgumentException"></exception>
        public static string Generate(int length, int numberOfNonAlphanumericCharacters)
        {
            if (length < 1 || length > 128)
            {
                throw new ArgumentException(nameof(length));
            }

            if (numberOfNonAlphanumericCharacters > length || numberOfNonAlphanumericCharacters < 0)
            {
                throw new ArgumentException(nameof(numberOfNonAlphanumericCharacters));
            }

            using (var rng = RandomNumberGenerator.Create())
            {
                var byteBuffer = new byte[length];

                rng.GetBytes(byteBuffer);

                var count = 0;
                var characterBuffer = new char[length];

                for (var iter = 0; iter < length; iter++)
                {
                    var i = byteBuffer[iter] % 87;

                    if (i < 10)
                    {
                        characterBuffer[iter] = (char)('0' + i);
                    }
                    else if (i < 36)
                    {
                        characterBuffer[iter] = (char)('A' + i - 10);
                    }
                    else if (i < 62)
                    {
                        characterBuffer[iter] = (char)('a' + i - 36);
                    }
                    else
                    {
                        characterBuffer[iter] = Punctuations[i - 62];
                        count++;
                    }
                }

                if (count >= numberOfNonAlphanumericCharacters)
                {
                    return new string(characterBuffer);
                }

                int j;
                var rand = new Random();

                for (j = 0; j < numberOfNonAlphanumericCharacters - count; j++)
                {
                    int k;
                    do
                    {
                        k = rand.Next(0, length);
                    } while (!char.IsLetterOrDigit(characterBuffer[k]));

                    characterBuffer[k] = Punctuations[rand.Next(0, Punctuations.Length)];
                }

                return new string(characterBuffer);
            }
        }


        /// <summary>
        /// Decrypt encrypted string using aes
        /// </summary>
        /// <param name="encrypted"></param>
        /// <returns></returns>
        public static string Decrypt(string encrypted)
        {
            if (string.IsNullOrEmpty(encrypted))
                return encrypted;

            if (Iv == null || Key == null)
            {
                Log.Error("Failed to decrypt: {@Exception}", "Iv or Key is missing.");
                return null;
            }

            try
            {
                byte[] base64 = Convert.FromBase64String(encrypted);
                string plaintext = null;

                using Aes aesAlg = Aes.Create();
                aesAlg.Key = Key;
                aesAlg.IV = Iv;

                // Create a decryptor to perform the stream transform.
                ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

                // Create the streams used for decryption.
                using (MemoryStream memoryStream = new MemoryStream(base64))
                {
                    using (CryptoStream cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader streamReader = new StreamReader(cryptoStream))
                        {
                            // Read the decrypted bytes from the decrypting stream and
                            // place them in a string.
                            plaintext = streamReader.ReadToEnd();
                        }
                    }
                }

                return plaintext;
            }
            catch (Exception e)
            {
                Log.Error(e, "Encryption failed!");
                return null;
            }
        }

        /// <summary>
        /// Encrypt string using aes
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public static string Encrypt(string input)
        {
            if (string.IsNullOrEmpty(input))
                return input;

            if (Iv == null || Key == null)
            {
                Log.Error("Failed to decrypt: {@Exception}", "Iv or Key is missing.");
                return null;
            }

            try
            {
                byte[] encrypted;

                using (Aes aesAlg = Aes.Create())
                {
                    aesAlg.Key = Key;
                    aesAlg.IV = Iv;

                    // Create an encryptor to perform the stream transform.
                    ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

                    // Create the streams used for encryption.
                    using (MemoryStream memStream = new MemoryStream())
                    {
                        using (CryptoStream cryptoStream =
                            new CryptoStream(memStream, encryptor, CryptoStreamMode.Write))
                        {
                            using (StreamWriter streamWriter = new StreamWriter(cryptoStream))
                            {
                                streamWriter.Write(input);
                            }

                            encrypted = memStream.ToArray();
                        }
                    }
                }

                return Convert.ToBase64String(encrypted);
            }
            catch (Exception e)
            {
                Log.Error(e, "Encryption failed!");
                return null;
            }
        }
    }
}