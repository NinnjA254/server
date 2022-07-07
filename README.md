## schema design naming convention
1. model names : PascalCase
1. document/ field names : camelCase

## end point response convention
1. Instead of sending status codes such as 200,403 in res.status, the api responds
    with a res.json in the format:
        {
            status: statusCode,
            message:"",
            data:{//some data}
        }

## front end api abstracting axios conventions.
1. api functions(in the api folder at client) dont have try catch block.
    make sure to use .catch to catch your errors in components that use the functions