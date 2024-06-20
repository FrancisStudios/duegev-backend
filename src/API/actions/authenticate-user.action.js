/**
 * Sorry for the spaghetto mess, this whole backend 
 * was done in a very short UNPAID timeframe, so it's
 * a bit _how you doin'_
 * 
 * =========================================================
 * 
 * The whole idea is if you are successfully authenticated
 * (password/username matches) => creates a session token
 * and stores it into the "session table" (see DB)
 * 
 */

import genericQueryExecutor from "../../utils/generic-query-executor.js";

const PerformStandardAuth = (inbound, res) => {
    const authFailMessage = { intent: inbound.intent, message: 'fail' };
    let authSuccessMessage = {
        intent: inbound.intent,
        message: 'ok',
        data: {
            user: {
                uid: 0,
                auth: {
                    username: '******',
                    password: '******'
                },
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
}

export default PerformStandardAuth;