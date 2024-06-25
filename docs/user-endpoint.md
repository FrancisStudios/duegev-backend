# User Actions Endpoint 👥

This endpoint is used to perform User Actions such as **create** users, **update** user data and **delete** users.

## 1. Create User

## 2. Read User(s)

## 3. Update User

You can only update the user you are logged in with. With this you can modify the user data [consult the second paragraph in user-data.types.md](./types/user-data.types.md) where you can see what each of the fields mean in ``UserData``

```Typescript
export type UserData = {
    uid: number
    auth: AuthenticationKeys,
    playerName: string,
    prefix: string,
    language: ValidLanguages,
    profileImg: string,
    privileges: Array<UserPrivileges>
}
```

### A, Send out the following query to the ``/api/user`` [POST] endpoint

```Typescript
type UserDataChangeQuery = {
    intent: DuegevAPIIntents.UPDATE_USER,
    query: {
        currentUserFromLocal: UserAuthenticationResponse,
        newUserDataConstruct: UserData
    }
}
```

- Where your ``intent <string>`` is **'update_user'**
- **query.currentUserFromLocal** the locally saved UserData [user-data.types.md](./types/user-data.types.md) with the latest session token. 
```JSON 

/* UserAuthenticationResponse as query.currentUserFromLocal */
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

As type definition:

```Typescript 
type UserAuthenticationResponse = {
    intent: DuegevAPIIntents,
    message: DuegevAPIResponseMessage,
    data?: {    /* If failed, no UD */
        user: UserData
        session_token: SHA512String
    }
}
```

- **query.newUserDataConstruct** your untouched UserData [user-data.types.md](./types/user-data.types.md) - **be aware that privileges, and uid can not be changed**

### B, You will receive the following response from the API when the user change is successful.

You will receive a ``UserAuthenticationResponse`` message with the updated values. Now you can authenticate again, with the new values

```JSON 
{
    "intent": "update_user",
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

## 4. Delete User