# Authentication 🔐

Authentication is one of the most important aspect of a web application. So to be able to execute any user or user-role specific intents (e.g.: create, modify, delete articles; add new users, upload images, etc) you have to send an authentication intent first.

## 1. Authentication intent:

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

### A, And if the authentication was **successful** you will get the following response

```Typescript
type UserAuthenticationResponse = {
    intent: DuegevAPIIntents, /* Echoes intent back */
    message: DuegevAPIResponseMessage.OK,
    data?: {                  /* If failed, no data */
        user: UserData
        session_token: SHA512String
    } 
}
```

The message can be ``'ok'`` or ``'fail'``. You can check the enum in the following file [api-response-messages.md](./enums/api-response-messages.md) at the first point. 

So for a successful login scenario you would receive a response like this:
```JSON
{
    "intent": "authenticate_user",
    "message":"ok",
    "data":{
        "user": {
            "uid":1,
            "username":"**masked**",
            "password":"**masked**",
            "playerName":"Midas",
            "prefix":"King",
            "language":"dn",
            "profileImg":"base64",
            "privileges":["recruiter", "cartographer"]
        },
        "session_token": "$6b234d..."
    }
}

```

**IMPORTANT:** username and password is masked in the UserData you get a session token back, that you can send in your further query payloads (to create, update, delete data)

### B, If your login was unsuccessful you get the following response

```Javascript
{ 
    intent: inbound.intent, 
    message: 'fail' 
}
```

It echoes the inbound intent backwards ``authenticate_user`` and the message is **'fail'** - this is the kind of message you can expect from this endpoint in case of failed queries.


## 2. After successful authentications:

After you authenticate an user successfully, you will get back the ``user data`` and the ``'session_token'`` these are the important parts you have to save locally to maintain a session.

You will need to use the ``'session_token'`` in your payload to be able to perform authenticated actions. For next steps go back to the [README.md file in the root folder](../README.md) and you will be able to explore more API endpoints. 

```Typescript
export type UserAuthenticationResponse = {
    intent: DuegevAPIIntents,
    message: DuegevAPIResponseMessage,
    data?: {    /* If failed, no UD */
        user: UserData
        session_token: SHA512String
    }
}
```