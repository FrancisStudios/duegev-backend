import PerformStandardAuth from "./actions/authenticate-user.action.js"
import UserOps from "./actions/generic-user-ops.action.js";

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
                    UserOps.create(inbound, res);
                    break;

                /* READ */
                case 'authenticate_user':
                    PerformStandardAuth(inbound, res);
                    break;

                case 'get_user_by_id':
                    break;

                case 'get_all_users':
                    break;


                /* UPDATE */
                case 'update_user':
                    UserOps.update(inbound, res);
                    break;

                /*  DELETE */
                case 'delete_user':
                    break;

            }
        });
    }
}