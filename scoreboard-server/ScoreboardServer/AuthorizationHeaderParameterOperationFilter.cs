using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Authorization;
using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace ScoreboardServer
{
    public class AuthorizationHeaderParameterOperationFilter : IOperationFilter
    {
        public void Apply(Operation operation, OperationFilterContext context)
        {
            var filterPipeline = context.ApiDescription.ActionDescriptor.FilterDescriptors;
            var isAuthorized = filterPipeline.Select(filterInfo => filterInfo.Filter).Any(filter => filter is AuthorizeFilter);
            var allowAnonymous = filterPipeline.Select(filterInfo => filterInfo.Filter).Any(filter => filter is IAllowAnonymousFilter);

            if (isAuthorized && !allowAnonymous)
            {
                if (operation.Parameters == null)
                    operation.Parameters = new List<IParameter>();

                operation.Parameters.Add(new NonBodyParameter
                {
                    Name = "Authorization",
                    In = "header",
                    Description = "access token",
                    Required = true,
                    Type = "string",
                    Default = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik5EZEZNa1U1UmtReVF6WkROelpHTlRkQ05UYzFSREl4TlRNMU5UZ3lOemd6T1RBelF6aERSQSJ9.eyJpc3MiOiJodHRwczovL3Nhdmlja2FzLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJCUmNiUnpxTU1xZHBoMmI5M3FqQXh2M1RjUGlNbzNxY0BjbGllbnRzIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo2NTI1OCIsImlhdCI6MTUwOTQ3NjIwNywiZXhwIjoxNTA5NTYyNjA3LCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.FFL_ABvvFYBtoPbwEPh87IizW1H-Tl-uialfgtsBMEehmNWFVkRX9sBdDjzO-WoPOFDxCSQ_DbW1LDeqlyH4QtBsbnDiI7jM3Wya9LVV0Hy0N2C5iO8s0cXsHVW30E1NPXPe3FbY4V2qJ1ueH1Dbs4QVafkstNycTz0yQ_TqFdPZav6gxEhntYcX0JFQKQ-LW1L-iW3fXKhOZdhpqHUx9eziMBpwjFlNz7gbcvctzON9sG3mfCuriJt_ZcxtVo8aBG7zmYs0S6AVuqKdPLUomRSFCszPyM4zLRZ2RNp5ORpSMDmiIm6VfFqNwSehiorW3nOD8bHZY5jH-sZRy7v97Q"
                });
            }
        }
    }
}
