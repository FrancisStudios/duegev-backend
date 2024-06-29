# Label Type

Labels are stored and served in the following type definition:

```Typescript
type Label = {
    lid: number,            /* Label Unique ID */
    uid: number,            /* Owner ID */   
    label: string,          /* Label text content */
    description: string     /* Label description */
}
```

**description** is only visible in the label editor menu from the Duegev Wiki Frontend application


## Label query and response

When constructing a query you will send this data towards the backend
```Typescript
type LabelQuery = {
    intent: DuegevAPIIntents
    query?: {               /* Only at [create/update/delete] intents */
        session_token: string,
        uid: number,
        label: string,
        description: string,
        lid?: number
    }
}
```

And the backend will respond with the following data type

```Typescript
type LabelQueryResponse = {
    intent: DuegevAPIIntents,
    message: DuegevAPIResponseMessage,
    data: Array<Label> | LabelQueryError
}
```

## LabelQueryError messages
These are the error messages that you can receive when trying to create, modify, delete any label.

```Typescript
enum LabelQueryError {
    INVALID_SESSION_TOKEN = 'invalid_session_token',
    INSUFFICIENT_PRIVILEGES = 'insufficient_privileges',
    INTERNAL_ERROR = 'internal_error',
    LABEL_ALREADY_EXISTS = 'label_already_exists',
    FAULTY_LABEL = 'faulty_label'
}
```

- INVALID_SESSION_TOKEN: your session token is expired or invalid
- INSUFFICIENT_PRIVILEGES: your user doesn't have the ``add_labels`` privilege
- LABEL_ALREADY_EXISTS: Label already exists in DB
- FAULTY_LABEL: Labels must be at least 3 characters in length.
- INTERNAL_ERROR: Miscellanious server error. Please try logging out and logging in or reach out to the webmaster
