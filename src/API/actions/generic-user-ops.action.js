/**
 * Generic User Operations Action Book
 * this book contains all the actions
 * that is required for the CRUD ops
 */

import genericQueryExecutor from "../../utils/generic-query-executor.js";
import interOperableAuthentication from "./inter-operable-authentication.action.js";
const failMessage = (intent) => ({ intent: intent, message: 'fail' });

const UserOps = {
    create: () => { },

    read: () => { },

    update: (inbound, res) => {
        console.log(`Incoming ${inbound.intent} coming from ${inbound.payload.currentUserFromLocal.data.user.playerName} @ uid::${inbound.payload.currentUserFromLocal.data.user.uid}`)

        const inboundDataMapping = {
            intent: inbound.intent,
            payload: inbound.payload.currentUserFromLocal.data.user
        }


        interOperableAuthentication(inboundDataMapping)
            .then(response => {
                if (response.message === 'ok') {
                    /* Todo AUTH IS SUCCESSFUL => response.message.ok => update user data => return response to FE (with sessionTokenPly) */
                    genericQueryExecutor("", [])
                        .then((update_response => {

                        }));
                } else res.send(failMessage(update_user));

            });
    },

    delete: () => { }
}

export default UserOps;