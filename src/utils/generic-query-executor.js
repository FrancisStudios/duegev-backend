import SQLConnection from "./database/database-connection.js";

const genericQueryExecutor = (SQL_EXPRESSION, PARAMETERS = []) => {
    return new Promise(resolve => {
        let dbConnection = new SQLConnection();
        try {
            dbConnection.makeQuery(SQL_EXPRESSION, PARAMETERS).then((response) => {
                dbConnection.closeConnection();
                resolve({ message: 'ok', data: response });
            });
        } catch (error) {
            resolve({ message: 'fail' });
            throw error;
        }
    });
}

export default genericQueryExecutor;