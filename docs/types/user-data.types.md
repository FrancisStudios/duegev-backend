# user-data types

## 1. AuthenticationKeys

Authentication keys are the login credentials. Two strings basically: username and password.

```Typescript
type AuthenticationKeys = {
    username: string,
    password: SHA512String
}
```

So your example json would look like this 
```JSON
{
    "username": "John Doe",
    "password": "6$45ae8fk2341..."
}
```