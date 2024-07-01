import DuegevAPIConstants from "../../constants.js";
import genericQueryExecutor from "../../utils/generic-query-executor.js";

const generalFaultyMessage = (intent) => ({ intent: intent, message: 'fail' });
const labelResponseErrorMessages = {
    INVALID_SESSION_TOKEN: 'invalid_session_token',
    INSUFFICIENT_PRIVILEGES: 'insufficient_privileges',
    INTERNAL_ERROR: 'internal_error',
    LABEL_ALREADY_EXISTS: 'label_already_exists',
    FAULTY_LABEL: 'faulty_label'
}

const createErrorResponseMessage = (res, intent, labelResponseErrorMessage) => {
    const LabelQueryResponse = {
        intent: intent,
        message: DuegevAPIConstants.API_MESSAGES.FAIL,
        data: labelResponseErrorMessage
    }
    res.send(JSON.stringify(LabelQueryResponse));
}

const GenericLabelOps = {
    create: async (inbound, res) => {
        const userHasLabelPrivileges = (user) => {
            return (
                user.privileges.includes(DuegevAPIConstants.PRIVILEGES.ADD_LABELS) ||
                user.privileges.includes(DuegevAPIConstants.PRIVILEGES.SUDO)
            );
        }

        if (inbound.payload.label.length >= 3) {
            let userByUid;
            const userBySessionToken = await genericQueryExecutor('SELECT * FROM sessions WHERE token=?;', [inbound.payload.session_token]);
            if (userBySessionToken.data[0].uid) userByUid = await genericQueryExecutor('SELECT * FROM users WHERE uid=?', [userBySessionToken.data[0].uid]);
            const allPreviousLabels = await genericQueryExecutor('SELECT label FROM labels;', []);
            let previousLabels = allPreviousLabels.data.map(lobj => lobj.label);

            if (!previousLabels.includes(inbound.payload.label)) {
                if (userByUid && (inbound.payload.uid === userBySessionToken.data[0].uid)) {
                    if (userHasLabelPrivileges(userByUid.data[0])) {
                        const labelWrite = await genericQueryExecutor(
                            'INSERT INTO labels (uid, label, description) VALUES (?,?,?)',
                            [
                                inbound.payload.uid,
                                inbound.payload.label,
                                inbound.payload.description
                            ]
                        );

                        if (labelWrite.message === DuegevAPIConstants.API_MESSAGES.OK) {

                            console.log(`>> New label created by ${userByUid.data[0].playerName} with uid: ${userBySessionToken.data[0].uid}`);

                            const successResponse = {
                                intent: inbound.intent,
                                message: DuegevAPIConstants.API_MESSAGES.OK,
                                data: [{ label: inbound.payload.label, description: inbound.payload.description }]
                            };
                            res.send(JSON.stringify(successResponse));

                        } else createErrorResponseMessage(res, inbound.intent, labelResponseErrorMessages.INTERNAL_ERROR);
                    } else createErrorResponseMessage(res, inbound.intent, labelResponseErrorMessages.INSUFFICIENT_PRIVILEGES);
                } else createErrorResponseMessage(res, inbound.intent, labelResponseErrorMessages.INVALID_SESSION_TOKEN);
            } else createErrorResponseMessage(res, inbound.intent, labelResponseErrorMessages.LABEL_ALREADY_EXISTS);
        } else createErrorResponseMessage(res, inbound.intent, labelResponseErrorMessages.FAULTY_LABEL);
    },

    read: (inbound, res) => {
        genericQueryExecutor('SELECT * FROM labels WHERE label <> ""', [])
            .then((labelResponse) => {
                if (labelResponse.message === 'ok') {
                    const _APIResponse = {
                        intent: inbound.intent,
                        message: labelResponse.message,
                        data: labelResponse.data
                    }

                    console.log('>> Requested All Labels');
                    res.send(JSON.stringify(_APIResponse));

                } else res.send(JSON.stringify(generalFaultyMessage(inbound.intent)));
            });
    },

    update: () => { },

    delete: async (inbound, res) => {
        if (inbound.payload.session_token && inbound.payload.lid) {
            const uidBySessionId = await genericQueryExecutor('SELECT uid FROM sessions WHERE token=?', [inbound.payload.session_token]);
            const userBySIDUID = await genericQueryExecutor('SELECT * FROM users WHERE uid=?', [uidBySessionId.data[0].uid]);

            const userPrivileges = JSON.parse(JSON.stringify(userBySIDUID.data[0].privileges));

            if (userPrivileges.includes(DuegevAPIConstants.PRIVILEGES.ADD_LABELS)) {
                const del = await genericQueryExecutor('UPDATE labels SET label="", uid=0, description="" label WHERE lid=?', [inbound.payload.lid]);
                if (del.message === DuegevAPIConstants.API_MESSAGES.OK) {
                    const _APIResponse = {
                        intent: inbound.intent,
                        message: del.message,
                    }
                    console.log(`>> ${userBySIDUID.data[0].username} deleted label with LID: ${inbound.payload.lid}`);
                    res.send(JSON.stringify(_APIResponse));
                } else createErrorResponseMessage(res, labelResponseErrorMessages.INTERNAL_ERROR)
            } else createErrorResponseMessage(res, labelResponseErrorMessages.INSUFFICIENT_PRIVILEGES);
        } else createErrorResponseMessage(res, labelResponseErrorMessages.INVALID_SESSION_TOKEN);
    }
}

export default GenericLabelOps;