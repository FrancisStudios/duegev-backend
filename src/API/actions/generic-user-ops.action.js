/**
 * Generic User Operations Action Book
 * this book contains all the actions
 * that is required for the CRUD ops
 */

import { DuegevEncryptor } from "../../utils/duegev-SHA-encryptor.js";
import genericQueryExecutor from "../../utils/generic-query-executor.js";
import interOperableAuthentication from "./inter-operable-authentication.action.js";
const failMessage = (intent) => ({ intent: intent, message: 'fail' });

const UserOps = {
    create: (inbound, res) => { },

    read: () => { },

    update: (inbound, res) => {
        console.log(`Incoming ${inbound.intent} coming from ${inbound.payload.currentUserFromLocal.data.user.playerName} @ uid::${inbound.payload.currentUserFromLocal.data.user.uid}`)

        const inboundDataMapping = {
            intent: inbound.intent,
            payload: inbound.payload.currentUserFromLocal.data.user
        }


        interOperableAuthentication(inboundDataMapping)
            .then(response => {
                response = JSON.parse(response);
                if (response.message === 'ok') {
                    /* Todo AUTH IS SUCCESSFUL => response.message.ok => update user data => return response to FE (with sessionTokenPly) */
                    const oldUser = inbound.payload.currentUserFromLocal.data.user;
                    const newUser = inbound.payload.newUserDataConstruct;
                    let __updateQuery = { _SQL: '', _params: [] };

                    if ((oldUser.auth.password !== newUser.auth.password) && (newUser.auth.password !== '******')) {
                        newUser.auth.password = DuegevEncryptor.SHA512Encrypt(newUser.auth.password, 'duegevlogin');
                        __updateQuery = {
                            _SQL: 'UPDATE users SET password=?, playerName=?, prefix=?, language=?, profileImg=? WHERE uid=?;',
                            _params: [newUser.auth.password, newUser.playerName, newUser.prefix, newUser.language, newUser.profileImg, oldUser.uid]
                        }
                    } else {
                        __updateQuery = {
                            _SQL: 'UPDATE users SET playerName=?, prefix=?, language=?, profileImg=? WHERE uid=?;',
                            _params: [newUser.playerName, newUser.prefix, newUser.language, newUser.profileImg, oldUser.uid]
                        }
                    }

                    genericQueryExecutor(__updateQuery._SQL, __updateQuery._params)
                        .then(update_response => {
                            if (update_response.message === 'ok') {
                                genericQueryExecutor('SELECT * FROM users WHERE uid=?', [newUser.uid])
                                    .then(assembleReturningUser => {
                                        let changeSuccessMessage = {
                                            intent: inbound.intent,
                                            message: 'ok',
                                            data: {
                                                user: {
                                                    uid: assembleReturningUser.data[0].uid,
                                                    auth: {
                                                        username: '******',
                                                        password: '******'
                                                    },
                                                    playerName: assembleReturningUser.data[0].playerName,
                                                    prefix: assembleReturningUser.data[0].prefix,
                                                    language: assembleReturningUser.data[0].language,
                                                    profileImg: assembleReturningUser.data[0].profileImg,
                                                    privileges: assembleReturningUser.data[0].privileges
                                                },
                                                session_token: response.data.session_token
                                            }
                                        }
                                        res.send(JSON.stringify(changeSuccessMessage));
                                    });
                            } else res.send(failMessage('update_user'));
                        });

                } else res.send(failMessage('update_user'));

            });
    },

    delete: () => { }
}

export default UserOps;