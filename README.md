# DÛGEV WIKI BACKEND 🔌

This is the documentation handbook for the **Duegev Wiki Backend** service. 
``Note: this is an intranet application, so you can not access without access to our own internet service (VPN auth mandatory)``

### Written by Francis Studios (intellectual rights reserved)
by Dynar Software Technologies Inc. ⚙️

## How to use this handbook 📖
This file contains the table of contents, so you can start from here. You will find links to the JSON contract scenarios.


## Table of contents 📋

1) Authentication Steps 🔐 [authentication.md](./docs/authentication.md)
2) User Actions Endpoint 👥 [user-endpoint.md](./docs/user-endpoint.md) _via this endpoint you are allowed to create, read, update, delete users (with the right privileges on your initiator user's table)_ 
3) Label Actions Endpoint 🏷️ [label-endpoint.md](./docs/label-endpoint.md) via this endpoint you can CRUD labels

## API Paths 🛣️
You can access the following paths on this API
- ``@/`` [ROOT] this will return a test response - you can check your connection 
- ``@/api/auth`` this path is for user operations (login, CRUD users)
- ``@/api/label`` this path is for label operations
- ``@/api/article`` this path is for article ops
- ``@/api/map`` this path is for the Duegev map
- ``@/api/time`` this path is for the in-game time (Discord bot soon)

## Intents 🫳
Via ``intents`` you can communicate your intent towards the API as a path can serve multiple operations (usually Create, Read, Update, Delete)

```Typescript
enum DuegevAPIIntents {
    AUTHENTICATE_USER = 'authenticate_user',
    CREATE_USER = 'create_user',
    GET_USER_BY_ID = 'get_user_by_id',
    GET_ALL_USERS = 'get_all_users',
    UPDATE_USER = 'update_user',
    DELTE_USER = 'delete_user',
    GET_ALL_LABELS = 'get_all_labels',
    CREATE_LABEL = 'create_label',
    DELETE_LABEL = 'delete_label',
    UPDATE_LABEL = 'update_label'
}
```

Every query should communicate an intent from the enum above.

## Definitions 💬

Type definitions and enums can be found in [docs/enums](./docs/enums) and in [docs/types](./docs/types) but usually the endpoint description files will contain references to the corresponding datatypes. 


#### Documentation was created by [github.com/francisstudios](https://github.com/francisstudios) 🖊️

This document was created for our role-playing community's wiki app. If you are in the community, and you have VPN access and right credentials to our intranet && our servers (if not yet, please reach out to ``@francis`` for details) you can freely use this API to create your own frontend, and or other applications to help you interact with the wiki, best suitable for your needs.

This documentation should cover all the basics on how to interact with the backend from your app. The whole data transfer is based on simplistic JSON contracts _(see table of contents above)_ and all available in a really simple REST API. 