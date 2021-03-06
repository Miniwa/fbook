const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../src/model/user");
const Post = require("../src/model/post");
let USER1_ID;
let USER2_ID;

chai.use(chaiHttp);

function login() {
    let agent = chai.request.agent(app);
    return agent.post("/auth")
        .type("form")
        .send({
            username: "miniwa",
            password: "test",
        }).then((res) => {
            res.should.have.status(200);
            return agent;
        });
}

describe("Backend", () => {
    before((done) => {
        mongoose.connect("mongodb://localhost/test").then(() => {
            done();
        }).catch((err) => {
            console.error(err);
            done();
        });
    });

    beforeEach((done) => {
        let user1 = new User({
            username: "miniwa",
            password: "test",
            name: {
                first: "Max",
                last: "Byrde",
            },
        });
        USER1_ID = user1._id.toString();

        let user2 = new User({
            username: "test1",
            password: "test",
            name: {
                first: "Test",
                last: "Testar",
            },
        });
        USER2_ID = user2._id.toString();

        Promise.all([Post.remove({}), User.remove({})]).then(() => {
            Promise.all([user1.save(), user2.save()]).then(() => {
                done();
            }).catch((err) => {
                console.error(err);
                done();
            });
        }).catch((err) => {
            console.error(err);
            done();
        });
    });

    describe("GET /login.html", () => {
        it("should return 200", (done) => {
            chai.request(app)
                .get("/login.html")
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe("GET /signup.html", () => {
        it("should return 200", (done) => {
            chai.request(app)
                .get("/signup.html")
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe("POST /user", () => {
        it("should create user", (done) => {
            chai.request(app)
                .post("/user")
                .type("form")
                .send({
                    username: "mini",
                    password: "test",
                    firstname: "max",
                    lastname: "byrde",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    User.byUsername("mini").then((user) => {
                        user.username.should.eq("mini");
                        user.password.should.eq("test");
                        user.name.first.should.eq("max");
                        user.name.last.should.eq("byrde");
                        done();
                    }).catch((err) => {
                        console.error(err);
                        done();
                    });
                });
        });

        it("should return 400 on missing parameters", (done) => {
            chai.request(app)
                .post("/user")
                .send({
                    username: "mini",
                    firstname: "max",
                    lastname: "byrde",
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });

    describe("POST /auth", () => {
        it("should redirect to index on success", (done) => {
            let agent = chai.request.agent(app);
            agent.post("/auth")
                .type("form")
                .send({
                    username: "miniwa",
                    password: "test",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.have.cookie("connect.sid");
                    res.should.redirectTo("/");
                });
        });

        it("should redirect to login on failure", (done) => {
            chai.request(app)
                .post("/auth")
                .type("form")
                .send({
                    username: "mini",
                    password: "asd",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.redirectTo("/login.html?failed=true");
                    done();
                });
        });
    });

    describe("GET /logout", () => {
        it("should log the user out", (done) => {
            let agent = chai.request.agent(app);
            login(agent).then(() => {
                agent.get("/logout")
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.not.have.cookie("connect.sid");
                        res.should.redirectTo("/login.html");
                        done();
                    });
            });
        });
    });

    describe("GET /", () => {
        it("should return 200", (done) => {
            chai.request(app).get("/").end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });
    });

    describe("GET /search.html", () => {
        it("should return 200", (done) => {
            chai.request(app).get("/search.html").end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });
    });

    describe("GET /profile.html", () => {
        it("should return 200", (done) => {
            chai.request(app).get("/profile.html").end((err, res) => {
                res.should.have.status(200);
                done();
            });
        });
    });

    describe("GET /user/search", () => {
        it("should return all users if no query", (done) => {
            login().then((agent) => {
                agent.get("/user/search").end((err, res) => {
                    res.should.have.status(200);
                    res.body.length.should.eq(2);
                    done();
                });
            });
        });

        it("should filter by query if query included", (done) => {
            login().then((agent) => {
                agent.get("/user/search")
                    .query({
                        q: "test",
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.length.should.eq(1);
                        done();
                    });
            });
        });
    });

    describe("POST /addFriend", () => {
        it("should add user to friendlist", (done) => {
            login().then((agent) => {
                agent.post("/addFriend")
                    .type("form")
                    .send({
                        friendId: USER2_ID,
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        User.findOne().byUsername("miniwa").withFriends()
                            .exec().then((user) => {
                                user.friends.length.should.eq(1);
                                done();
                            });
                    });
            });
        });

        it("should return 400 if missing parameter", (done) => {
            login().then((agent) => {
                agent.post("/addFriend")
                    .type("form")
                    .end((err, res) => {
                        res.should.have.status(400);
                        done();
                    });
            });
        });

        it("should return 400 if attempting to add self", (done) => {
            login().then((agent) => {
                agent.post("/addFriend")
                    .type("form")
                    .send({
                        friendId: USER1_ID,
                    })
                    .end((err, res) => {
                        res.should.have.status(400);
                        done();
                    });
            });
        });
    });

    describe("/GET getFriends", () => {
        it("should return friends for a user", (done) => {
            User.findById(USER1_ID).then((user) => {
                user.friends.push(USER2_ID);
                user.save().then(() => {
                    login().then((agent) => {
                        agent.get("/getFriends")
                            .query({
                                "userId": USER1_ID,
                            })
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.length.should.eq(1);
                                done();
                            });
                    });
                }).catch((err) => {
                    console.error(err);
                });
            });
        });

        it("should return 400 on missing parameters", (done) => {
            login().then((agent) => {
                agent.get("/getFriends")
                    .end((err, res) => {
                        res.should.have.status(400);
                        done();
                    });
            });
        });
    });

    describe("/GET getOwnFriends", () => {
        it("should return friends for logged in user", (done) => {
            User.findById(USER1_ID).then((user) => {
                user.friends.push(USER2_ID);
                user.save().then(() => {
                    login().then((agent) => {
                        agent.get("/getOwnFriends")
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.length.should.eq(1);
                                done();
                            });
                    });
                }).catch((err) => {
                    console.error(err);
                });
            });
        });
    });

    describe("GET /getReceivedPosts", () => {
        it("should return posts received", (done) => {
            let post = new Post({
                author: USER2_ID,
                receiver: USER1_ID,
                comment: "hello",
            });
            post.save().then(() => {
                login().then((agent) => {
                    agent.get("/getReceivedPosts")
                        .query({
                            userId: USER1_ID,
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.length.should.eq(1);
                            res.body[0].receiver.should.eq(USER1_ID);
                            res.body[0].author.username.should.eq("test1");
                            res.body[0].comment.should.eq("hello");
                            done();
                        });
                }).catch((err) => {
                    console.error(err);
                    done();
                });
            }).catch((err) => {
                console.error(err);
                done();
            });
        });

        it("should return 400 on missing parameters", (done) => {
            login().then((agent) => {
                agent.get("/getReceivedPosts")
                    .end((err, res) => {
                        res.should.have.status(400);
                        done();
                    });
            });
        });
    });

    describe("GET /getOwnReceivedPosts", () => {
        it("should return posts received by self", (done) => {
            let post = new Post({
                author: USER2_ID,
                receiver: USER1_ID,
                comment: "hello",
            });
            post.save().then(() => {
                login().then((agent) => {
                    agent.get("/getOwnReceivedPosts")
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.length.should.eq(1);
                            res.body[0].receiver.should.eq(USER1_ID);
                            res.body[0].author.username.should.eq("test1");
                            res.body[0].comment.should.eq("hello");
                            done();
                        });
                }).catch((err) => {
                    console.error(err);
                    done();
                });
            }).catch((err) => {
                console.error(err);
                done();
            });
        });
    });

    describe("/POST createPost", () => {
        it("should create a new post", (done) => {
            login().then((agent) => {
                agent.post("/createPost")
                    .type("form")
                    .send({
                        userId: USER2_ID,
                        comment: "comment",
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        Post.find().receivedBy(USER2_ID).exec().then((posts) => {
                            posts.length.should.eq(1);
                            posts[0].receiver.toString().should.eq(USER2_ID);
                            posts[0].author.toString().should.eq(USER1_ID);
                            done();
                        });
                    });
            });
        });
    });

    describe("/POST createOwnPost", () => {
        it("should create a new post received by self", (done) => {
            login().then((agent) => {
                agent.post("/createOwnPost")
                    .type("form")
                    .send({
                        comment: "comment",
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        Post.find().receivedBy(USER1_ID).exec().then((posts) => {
                            posts.length.should.eq(1);
                            posts[0].receiver.toString().should.eq(USER1_ID);
                            posts[0].author.toString().should.eq(USER1_ID);
                            done();
                        });
                    });
            });
        });
    });
});
