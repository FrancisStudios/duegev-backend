# Label Endpoint 🏷️

From this document you will gain understanding of how to operate with labels in the Duegev Wiki Ecosystem.

### Endpoint path ``/api/label`` method ``POST``

## 1, Create Labels

## 2, Read Labels
Reading labels is the easiest way of interacting with the label endpoint.

You will send out a request query like this:
```Typescript
type LabelQuery = {
    intent: DuegevAPIIntents
    query?: {               /* Only at [create/update/delete] intents */
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