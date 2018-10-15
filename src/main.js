let app = require("./app");

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

let server = app.listen(8000, () => {
    let port = server.address().port;
    console.log("App listening on port %s", port);
});

function shutDown() {
    console.log("Shutting down gracefully");
    server.close(() => {
        process.exit(0);
    });
}
