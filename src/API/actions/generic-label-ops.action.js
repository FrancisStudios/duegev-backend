import genericQueryExecutor from "../../utils/generic-query-executor.js";

const generalFaultyMessage = (intent) => ({ intent: intent, message: 'fail' });

const GenericLabelOps = {
    create: () => { },

    read: (inbound, res) => {
        genericQueryExecutor('SELECT * FROM labels', [])
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

    delete: () => { }
}

export default GenericLabelOps;