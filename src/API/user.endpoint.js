import genericQueryExecutor from "../utils/generic-query-executor.js";

export default class DuegevUserEndpoint {
    static initEndpoint(DuegevBackendAPI) {
        DuegevBackendAPI.post('/api/auth', (req, res) => {
            let inbound = {
                intent: req.body.intent,
                payload: req.body.query
            }

            console.log(`Auth endpoint was hit with [${inbound.intent}]`);

            switch (inbound.intent) {

                /* CREATE */
                case 'create_user':
                    break;

                /* READ */
                case 'authenticate_user':
                    const authFailMessage = { intent: inbound.intent, message: 'fail' };
                    let authSuccessMessage = {
                        intent: inbound.intent,
                        message: 'ok',
                        data: {
                            user: {
                                uid: 0,
                                username: '******',
                                password: '******',
                                playerName: '',
                                prefix: '',
                                language: '',
                                profileImg: '',
                                privileges: []
                            },
                            session_token: ''
                        }
                    }

                    const createSessionToken = (length = 128) => {
                        let result = '';
                        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                        const charactersLength = characters.length;
                        let counter = 0;
                        while (counter < length) {
                            result += characters.charAt(Math.floor(Math.random() * charactersLength));
                            counter += 1;
                        }

                        return result;
                    }

                    genericQueryExecutor(
                        'SELECT * FROM users WHERE username=? AND password=? LIMIT 1;',
                        [inbound.payload.username, inbound.payload.password]
                    ).then((dbResponse) => {
                        if (dbResponse.message === 'ok' && dbResponse.data.length !== 0) {
                            authSuccessMessage.data.user.uid = dbResponse.data[0].uid;
                            authSuccessMessage.data.user.playerName = dbResponse.data[0].playerName;
                            authSuccessMessage.data.user.prefix = dbResponse.data[0].prefix;
                            authSuccessMessage.data.user.language = dbResponse.data[0].language;
                            authSuccessMessage.data.user.profileImg = dbResponse.data[0].profileImg;
                            authSuccessMessage.data.user.privileges = JSON.parse(dbResponse.data[0].privileges);

                            genericQueryExecutor('SELECT * FROM sessions WHERE uid=?', [authSuccessMessage.data.user.uid]).then((sessionResponse) => {
                                if (sessionResponse.message === 'ok') {
                                    const newSessionToken = createSessionToken();
                                    authSuccessMessage.data.session_token = newSessionToken;
                                    if (sessionResponse.data.length !== 0) {
                                        genericQueryExecutor('UPDATE `sessions` SET `token`=? WHERE `uid`=?', [newSessionToken, authSuccessMessage.data.user.uid]).then((str) => {
                                            if (str.message === 'ok') res.send(JSON.stringify(authSuccessMessage));
                                            else res.send(JSON.stringify(authFailMessage));
                                        });
                                    } else {
                                        genericQueryExecutor('INSERT INTO `sessions`(`uid`, `token`) VALUES (?, ?)', [authSuccessMessage.data.user.uid, newSessionToken]).then((str) => {
                                            if (str.message === 'ok') res.send(JSON.stringify(authSuccessMessage));
                                            else res.send(JSON.stringify(authFailMessage));
                                        });
                                    }
                                } else res.send(JSON.stringify(authFailMessage));
                            });
                            console.log(`Auth success ${JSON.stringify(authSuccessMessage)}`);
                        } else {
                            res.send(JSON.stringify(authFailMessage));
                        }
                    });


                    /**
                     * 1) Perform login
                     * 2) If login was successful, then send a hash up to the sessions table
                     * 3) Send successful login data (UserData and the session token back to FE)
                     * 4) Every action can be performed with the session token 
                     * 
                     * (of course check if user already has a session token in the DB - update it if so)
                     * logout (or window close) should delete session token on FE - to be discussed further
                     */
                    break;

                case 'get_user_by_id':
                    break;

                case 'get_all_users':
                    break;


                /* UPDATE */
                case 'update_user':
                    break;

                /*  DELETE */
                case 'delete_user':
                    break;

            }
        });
    }
}