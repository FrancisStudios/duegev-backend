/**
 * Generic User Operations Action Book
 * this book contains all the actions
 * that is required for the CRUD ops
 */

import interOperableAuthentication from "./inter-operable-authentication.action.js";

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
                res.send(response);

                /* Todo AUTH IS SUCCESSFUL => response.message.ok => update user data => return response to FE (with sessionTokenPly) */
            });
    },

    delete: () => { }
}

export default UserOps;