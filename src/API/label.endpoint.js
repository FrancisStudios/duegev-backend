import GenericLabelOps from "./actions/generic-label-ops.action.js";

export default class DuegevLabelEndpoint {
    static initEndpoint(DuegevBackendAPI) {
        DuegevBackendAPI.post('/api/label', (req, res) => {
            let inbound = {
                intent: req.body.intent,
                payload: req.body.query
            }

            console.log(`Label endpoint was hit with [${inbound.intent}]`);

            switch (inbound.intent) {

                /* CREATE */
                case 'create_label':
                    GenericLabelOps.create(inbound, res);
                    break;

                /* READ */
                case 'get_all_labels':
                    GenericLabelOps.read(inbound, res);
                    break;

                /* UPDATE */
                case 'update_label':
                    break;

                /*  DELETE */
                case 'delete_label':
                    GenericLabelOps.delete(inbound, res);
                    break;

            }
        });
    }
}