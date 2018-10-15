const mongo = require("mongodb");

class Repository {
    constructor(host, port, dbName) {
        this.host = host;
        this.port = port;
        this.dbName = dbName;
    }

    connect() {
        let dbName = this.dbName;
        return new Promise((resolve, reject) => {
            let url = "mongodb://" + this.host + ":" + this.port;
            let mongoClient = new mongo.MongoClient(url);
            mongoClient.connect((err, client) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                resolve(client.db(dbName));
            });
        });
    }
}

module.exports = {
    Repository,
};
