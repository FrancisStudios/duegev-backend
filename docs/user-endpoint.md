# User Actions Endpoint 👥

This endpoint is used to perform User Actions such as **create** users, **update** user data and **delete** users.

## 1. Create User

For creating a user your intent will be ``create_user`` 

You can send your query to the ``/api/auth`` endpoint, but be aware your initiating user has to have **recruiter** or **sudo** privileges =>check your received ``UserData.privileges`` field ``Array<string>`` if it has either of the listed privilege. If not, you will receive a **failed query** response upon trying to access this procedure.

```Typescript
type UserCreationQuery = {
    intent: DuegevAPIIntents.CREATE_USER,
    query: {
        username: string,
        password: string,
        session_token: string
    }
}
```
You can select the following parameters for your new user ``username, password, session_token`` any other attempt is **disregarded** or responded with a **failed query**. If you are creating a user via the **Duegev Wiki Frontend ™** the password will be auto generated and you can copy it and share it with your target recruitee.

### Your response will be in the following type

```Typescript
type UserCreationResponse = {
    intent: DuegevAPIIntents,
    message: DuegevAPIResponseMessage,
    data: {
        message: UserCreationErrorMessages | 'created'
    }
}
```

1) **intent:** will echo back the ``create_user`` intent
2) **message:** either **'ok'** or **'fail'**
3) **data.message:** will return the cause of the error or return **'created'** if everything is successful, and new user was created in the database


### UserCreationErrorMessages
You can decypher the issue with your query if you look at the error message you receive.

```Typescript 
enum UserCreationErrorMessages {
    FAULTY_PASSWORD = 'faulty_password',
    FAULTY_USERNAME = 'faulty_username',
    FAULTY_PRIVILEGES = 'faulty_privileges',
    FAULTY_CREDENTIALS = 'faulty_credentials',
}
```

- FAULTY_PASSWORD: the created user must have a password with the length of 8 characters (alphanumeric)
- FAULTY_USERNAME: the username should be at least 3 characters in lenght and also as an alphanumeric value
- FAULTY_PRIVILEGES: your user does not have the 'recruiter' or 'sudo' privilege to create a new user
- FAULTY_CREDENTIALS: your session token is expired, or not correct. Make sure that it's the same one that you get when you authenticated. Or perform a login again, and use your new session token.


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

### A, Send out the following query to the ``/api/auth`` [POST] endpoint

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
            "username":"real username",
            "password":"realpassword as SHA512",
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

**IMPORTANT** You have to send the unmasked ``username`` and ``password`` in the ``currentUserFromLocal`` object as: ``username [string]`` and password ``password [string] [SHA]``

To convert your password string into SHA Encrypted format please refer to the [encryption-endpoint.md](./encryption-endpoint.md) file as plain text passwords **are not accepted**.


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

You can not perform this action unless you are the **webmaster** (a.k.a.: the Protector of the Dynari council)