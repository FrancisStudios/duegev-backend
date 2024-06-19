# Authentication 🔐

Authentication is one of the most important aspect of a web application. So to be able to execute any user or user-role specific intents (e.g.: create, modify, delete articles; add new users, upload images, etc) you have to send an authentication intent first.

## Authentication intent:

You can authenticate via the following endpoint

``<backend IP address>/api/login``

It expects an HTTP **POST** request in the following format:

```Typescript
type UserAuthenticationQuery = {
    intent: DuegevAPIIntents.AUTHENTICATE_USER,
    query: AuthenticationKeys
}
```

AuthenticationKeys type can be found in [user-data.types.md](./types/user-data.types.md) as the first point.

So your request JSON would look something like this when trying to authenticate:
```JSON
{
    "intent": "authenticate_user",
    "query": {
        "username": "John Doe",
        "password": "6$45ae8fk2341..."
    }
}
```

And if the authentication was **successful** you will get the following response
