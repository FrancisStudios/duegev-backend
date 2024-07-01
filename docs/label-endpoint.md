# Label Endpoint 🏷️

From this document you will gain understanding of how to operate with labels in the Duegev Wiki Ecosystem.

### Endpoint path ``/api/label`` method ``POST``

## 1, Create Labels

Creating labels require your ``session_token`` and your ``uid``. Please note that you have to have ``ADD_LABELS = 'add_labels'`` privileges on your user to be able to perform this action.

For more information on privileges check [user-privileges.md](./enums/user-privileges.md)

### First you have to send a ``create_label`` intent query to the endpoint

```Typescript
type LabelQuery = {
    intent: DuegevAPIIntents.CREATE_LABEL /* create_label */
    query: {              
        session_token: string,
        uid: number,
        label: string,
        description: string,
        lid?: number
    }
}
```

And in the query section you have to send your ``session_token``, ``uid`` for auth purposes, and ``label``, ``description`` for the label data. The field ``lid`` is only used for listings, do not send it in the query - if so, it will be ignored, since **LIDs are generated** automatically.

### Will receive a response

#### A, Success

```JSON
{
        "intent": "create_label",              /* ECHO */
        "message": "ok",
        "data": "{label: xy, description: xy}" /* ECHO */
}
```

You got the **label data** and the **intent** echoed back, and the ok message. If you get this response, your label is saved in the database!

#### B, Fail
If you get any other response (with ``message: fail``) you can look at the received data field.

The data field will indicate the cause of the error:

```Javascript
{
    INVALID_SESSION_TOKEN: 'invalid_session_token',
    INSUFFICIENT_PRIVILEGES: 'insufficient_privileges',
    INTERNAL_ERROR: 'internal_error',
    LABEL_ALREADY_EXISTS: 'label_already_exists',
    FAULTY_LABEL: 'faulty_label'
}
```

- INVALID_SESSION_TOKEN: your session token is expired or invalid
- INSUFFICIENT_PRIVILEGES: your user doesn't have the ``add_labels`` privilege
- LABEL_ALREADY_EXISTS: Label already exists in DB
- FAULTY_LABEL: Labels must be at least 3 characters in length.
- INTERNAL_ERROR: Miscellanious server error. Please try logging out and logging in or reach out to the webmaster

For further details please consult the [label-type.md](./types/label-type.md) handbook.

## 2, Read Labels
Reading labels is the easiest way of interacting with the label endpoint.

You will send out a request query like this:
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
So your request JSON will look something like this: 

```JSON
{ "intent": "get_all_labels" }
```
**IMPORTANT:** for reading labels, you can only get all of them in an array of Label (please check [label-type.md](./types/label-type.md) for more details)

Your response will look like this:
```Typescript
type LabelQueryResponse = {
    intent: DuegevAPIIntents,
    message: DuegevAPIResponseMessage,
    data: Array<Label>
}
```

- intent: echoes back request intent
- message: [DuegevAPIResponseMessage](./enums/api-response-messages.md)
- data: Array of [Label](./types/label-type.md)

## 3, Update Labels

## 4, Delete Labels

Deleting labels will require your query to made in the following type

```Typescript
type LabelQuery = {
    intent: DuegevAPIIntents.DELETE_LABEL /* delete_label */
    query: {              
        session_token: string,
        uid?: number,
        label?: string,
        description?: string,
        lid: number
    }
}
```

Where your important data will be the ``intent``, the ``query.session_token`` for your authentication (user must have ``add_labels`` privileges to be able to execute this query), and the ``query.lid`` for identifying the label to delete. All other data is ignored in the delete intent query.


### A, Success Response

### B, Error Response

You get the same error messages as when you fire the ``create_labels`` intent:

- INVALID_SESSION_TOKEN: 'invalid_session_token' => your session_token is expired or incorrect, or the query.lid is missing or incorrect,