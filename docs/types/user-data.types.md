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


## 2. User Data

User data contains the following fields

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

- uid: User ID - unique number representing the user
- auth: look at the authentication keys in **section 1.**
- playerName: player's in-game name
- prefix: player's name prefix (eg. King, Dr., Lord, Mr.) - if not applies live it an **empty string**
- language: an enum value for default language (en, hu, dn) - consult the [languages documentation](../enums/languages.md) for valid inputs.
- profileImg: profile picture in base64 format
- privileges: It's a value that only the webmaster (Francis) can modify. The option is not exposed to any other users. 