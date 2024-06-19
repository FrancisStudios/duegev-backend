# API Response Messages

## 1. Query execution success/fail

```Typescript
/* These are the responses you can get in 'message' field */
export enum DuegevAPIResponseMessage {
    OK = 'ok', /* Query could be properly excuted */
    FAIL = 'fail' /* Invalid query */
}
```

If query fails, it responds with message: **fail** if the the backend response is positive it responsd siwht message: **ok**