export default class DuegevUserEndpoint {
    static initEndpoint(DuegevBackendAPI) {
        DuegevBackendAPI.post('/api/auth', (req, res) => {
            let inbound = {
                intent: req.body.intent,
                payload: req.body.payload
            }

            console.log(`endpoint hit with ${inbound}`)

            switch (inbound.intent) {

                /* CREATE */
                case 'create_user':
                    break;

                /* READ */
                case 'authenticate_user':
                    console.log(inbound.payload);
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