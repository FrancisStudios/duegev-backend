/**
 * Generic User Operations Action Book
 * this book contains all the actions
 * that is required for the CRUD ops
 */

import DuegevAPIConstants from "../../constants.js";
import { DuegevEncryptor } from "../../utils/duegev-SHA-encryptor.js";
import genericQueryExecutor from "../../utils/generic-query-executor.js";
import interOperableAuthentication from "./inter-operable-authentication.action.js";
const failMessage = (intent) => ({ intent: intent, message: 'fail' });

const UserOps = {

    /* CREATE USER */
    create: (inbound, res) => {
        const userCreationErrorMessages = {
            FAULTY_PASSWORD: 'faulty_password',
            FAULTY_USERNAME: 'faulty_username',
            FAULTY_PRIVILEGES: 'faulty_privileges',
            FAULTY_CREDENTIALS: 'faulty_credentials',
        }

        const response = {
            intent: inbound.intent,
            message: '',
            data: {
                message: ''
            }
        }

        const sendFailMessage = (userCreationMessage) => {
            response.message = 'fail'
            response.data.message = userCreationMessage;
            res.send(JSON.stringify(response));
        }

        const _initiatorSessionToken = inbound.payload.session_token;
        const _targetUsername = inbound.payload.username;
        const _targetPassword = inbound.payload.password;

        /* Warning this method be Y**dev if-else spaghetto feeling - not my finest work but works */
        /* Should be simplified later if the app is in full prod use! Don't forget Francis        */
        if (_initiatorSessionToken) {
            genericQueryExecutor('SELECT * FROM sessions WHERE token=?', [_initiatorSessionToken])
                .then((tokenOwner) => {
                    if (tokenOwner.message === 'ok' && (tokenOwner.data[0].uid && tokenOwner.data[0].id)) {
                        genericQueryExecutor('SELECT * FROM users WHERE uid=?', [tokenOwner.data[0].uid])
                            .then((tokenOwnerUserData) => {
                                if (tokenOwnerUserData.message === 'ok') {
                                    if (
                                        JSON.parse(tokenOwnerUserData.data[0].privileges).includes('sudo') ||
                                        JSON.parse(tokenOwnerUserData.data[0].privileges).includes('recruiter')
                                    ) {
                                        if (_targetUsername.length >= 3) {
                                            if (_targetPassword.length >= 8) {
                                                genericQueryExecutor(
                                                    'INSERT INTO users (username, password, playerName, prefix, language, profileImg, privileges) VALUES (?, ?, ?, ?, ?, ?, ?)',
                                                    [
                                                        _targetUsername,
                                                        DuegevEncryptor.SHA512Encrypt(_targetPassword, DuegevAPIConstants.GENERIC_DUEGEV_SHA),
                                                        DuegevAPIConstants.user.DEFAULT_PLAYERNAME,
                                                        DuegevAPIConstants.user.DEFAULT_PREFIX,
                                                        DuegevAPIConstants.user.DEFAULT_LANGUAGE,
                                                        DuegevAPIConstants.user.DEFAULT_PROFILE_IMG,
                                                        JSON.stringify(DuegevAPIConstants.user.DEFAULT_PRIVILEGES)
                                                    ]
                                                )
                                                    .then((userCreationResult) => {
                                                        if (userCreationResult.message === 'ok') {
                                                            console.log('@@@ User Creation Successful @@@');
                                                            console.log(`Initiator ${tokenOwnerUserData.data[0].username} with uid=${tokenOwnerUserData.data[0].uid}`);

                                                            response.message = 'ok';
                                                            response.data.message = 'created';
                                                            res.send(JSON.stringify(response));
                                                        } else sendFailMessage(userCreationErrorMessages.FAULTY_CREDENTIALS);
                                                    });
                                            } else sendFailMessage(userCreationErrorMessages.FAULTY_PASSWORD);
                                        } else sendFailMessage(userCreationErrorMessages.FAULTY_USERNAME);

                                    } else sendFailMessage(userCreationErrorMessages.FAULTY_PRIVILEGES);
                                } else sendFailMessage(userCreationErrorMessages.FAULTY_CREDENTIALS)
                            });
                    } else sendFailMessage(userCreationErrorMessages.FAULTY_CREDENTIALS);
                });
        } else sendFailMessage(userCreationErrorMessages.FAULTY_CREDENTIALS);
    },

    read: () => { },

    /* UPDATE USER */
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

    /* DELETE USER */
    delete: () => {
        /* This will not be possible through the API due to safety concerns :P */
    }
}

export default UserOps;