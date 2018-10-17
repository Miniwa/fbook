const mongoose = require("mongoose");
const User = require("./src/model/user");
let app = require("./app");
let server;

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

mongoose.connect("mongodb://localhost/fbook").then(() => {
    console.log("Connected to db.");
    console.log("Setting up database");
    setupDatabase().then((ops) => {
        console.log("Database setup:", ops);
        server = app.listen(8000, () => {
            console.log("App listening on %s", server.address().port);
        });
    }).catch((err) => {
        console.error("Could not setup database:", err);
    });
}).catch((err) => {
    console.error("Could not open connection to db:", err);
    shutDown();
});

function setupDatabase() {
    let user1 = new User({
        username: "miniwa",
        password: "test",
        name: {
            first: "Max",
            last: "Byrde",
        },
    });
    let user2 = new User({
        username: "test1",
        password: "test1",
        name: {
            first: "Test",
            last: "Testar",
        },
    });
    let user3 = new User({
        username: "test2",
        password: "test2",
        name: {
            first: "Test",
            last: "Testar",
        },
    });
    let user4 = new User({
        username: "test3",
        password: "test3",
        name: {
            first: "Test",
            last: "Testar",
        },
    });
    return Promise.all([
        User.remove(), user1.save(), user2.save(), user3.save(), user4.save()]);
}

function shutDown() {
    console.log("Shutting down gracefully");
    if(server !== undefined) {
        server.close(() => {
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
}
