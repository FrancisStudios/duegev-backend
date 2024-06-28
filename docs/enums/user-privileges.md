# User Privileges

The users can have the following privileges (one or many)

```Typescript
enum UserPrivileges {
    PLAYER = 'player',
    EDITOR = 'editor',
    TIME_MGMT = 'time_management',
    ADD_LABELS = 'add_labels',
    UPDATE_MAP = 'update_map',
    USER_MGMT = 'user_management',
    RECRUITER = 'recruiter',
    SUDO = 'sudo'
}
```

1) PLAYER: _minimum privilege, can sign in, read and like articles_
2) EDITOR: _extension of PLAYER. Can create, update and delete his/her articles_
3) TIME_MGMT: _can set new game year_
4) ADD_LABELS: _can create, update, delete his/her labels that can be used to tag articles_
5) UPDATE_MAP: _can upload new map (Shambre's privilege)_
6) USER_MGMT: _can udpate/delete every user (Administratoral privilege)_
7) RECRUITER: _can create (invite) new users_
8) SUDO: _can do all of the above (Francis's privilege)_


Actions:

- sign in
- read articles
- like
- create articles
- update articles
- delete articles
- set new year
- manage labels
- manage maps
- manage users
- add new user