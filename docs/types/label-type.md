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
