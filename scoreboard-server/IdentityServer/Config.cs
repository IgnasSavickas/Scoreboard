// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

using IdentityServer4;
using IdentityServer4.Models;
using System.Collections.Generic;
using System.Security.Claims;

namespace IdentityServer
{
    public class Config
    {
        // scopes define the resources in your system
        public static IEnumerable<IdentityResource> GetIdentityResources()
        {
            return new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
            };
        }

        public static IEnumerable<ApiResource> GetApiResources()
        {
            return new List<ApiResource>
            {
                new ApiResource("scoreboardapi", "Scoreboard API")
            };
        }

        // clients want to access resources (aka scopes)
        public static IEnumerable<Client> GetClients()
        {
            // client credentials client
            return new List<Client>
            {
                new Client
                {
                    ClientId = "ng",
                    ClientName = "Scoreboard",
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowAccessTokensViaBrowser = true,
                    RequireConsent = true,

                    RedirectUris = { "http://localhost:4200/callback" },
                    PostLogoutRedirectUris = { "http://localhost:4200/home" },
                    AllowedCorsOrigins = { "http://localhost:4200", "http://localhost" },

                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        "scoreboardapi"
                    }
                },

                new Client
                {
                    ClientId = "swaggerui",
                    ClientName = "Scoreboard Swagger UI",
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowAccessTokensViaBrowser = true,

                    RedirectUris = { "http://localhost:5001/swagger/oauth2-redirect.html" },
                    PostLogoutRedirectUris = { "http://localhost:5000/swagger" },
                    AllowedCorsOrigins = { "http://localhost:5001" },

                    AllowedScopes =
                    {
                        "scoreboardapi"
                    }
                },

                new Client
                {
                    ClientId = "windowsform",
                    ClientName = "Scoreboard Windows Form",
                    AllowedGrantTypes = GrantTypes.Code,
                    RequireConsent = false,

                    ClientSecrets =
                    {
                        new Secret("windowsformsecret".Sha256())
                    },

                    RedirectUris = { "http://localhost:5000/oauth20_desktop" },

                    AllowedScopes =
                    {
                        "scoreboardapi"
                    },

                    AllowOfflineAccess = true
                }
            };
        }
    }
}