const User = require("./model/user");
const Post = require("./model/post");

function sendError(res, err) {
    if(err.name === "ValidationError") {
        res.status(400);
    } else {
        res.status(500);
    }
    res.send(err).end();
}

function reset(req, res) {
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
            first: "Test2",
            last: "Testar",
        },
    });
    let user3 = new User({
        username: "test2",
        password: "test2",
        name: {
            first: "Test3",
            last: "Testar",
        },
    });
    let user4 = new User({
        username: "test3",
        password: "test3",
        name: {
            first: "Test4",
            last: "Testar",
        },
    });

    // Setup friends
    user1.friends.push(user2._id);

    Promise.all([Post.remove({}), User.remove({})]).then(() => {
        Promise.all([user1.save(), user2.save(), user3.save(), user4.save()]).then(() => {
            res.json([user1, user2, user3, user4]).end();
        }).catch((err) => {
            console.error(err);
            res.status(500).end();
        });
    }).catch((err) => {
        console.error(err);
        res.status(500).end();
    });
}

function view(req, res) {
    res.sendFile(req.route.path, {root: "views"});
}

function createUser(req, res) {
    let data = req.body;
    let user = new User({
        username: data.username,
        password: data.password,
        name: {
            first: data.firstname,
            last: data.lastname,
        },
    });

    user.save().then(() => {
        res.redirect("/login.html").end();
    }).catch((err) => {
        sendError(res, err);
    });
}

function getUsersByNameQuery(req, res) {
    let query = req.query.q;
    User.byNameQuery(query).then((users) => {
        res.json(users).end();
    }).catch((err) => {
        sendError(res, err);
    });
}

function addFriend(req, res) {
    let friendId = req.body.friendId;
    if(friendId === undefined) {
        res.status(400).end();
        return;
    }
    if(friendId === req.user._id.toString()) {
        res.status(400).send("Can't add yourself as friend").end();
        return;
    }

    req.user.friends.push(friendId);
    req.user.save().then(() => {
        res.end();
    }).catch((err) => {
        sendError(res, err);
    });
}

function getFriends(req, res) {
    let userId = req.query.userId;
    if(userId === undefined) {
        res.status(400).end();
        return;
    }

    User.findById(userId).withFriends().exec().then((user) => {
        res.json(user.friends).end();
    }).catch((err) => {
        sendError(res, err);
    });
}

function getOwnFriends(req, res) {
    User.findById(req.user._id).withFriends().exec().then((user) => {
        res.json(user.friends).end();
    }).catch((err) => {
        sendError(res, err);
    });
}

function createPost(req, res) {
    let userId = req.body.userId;
    let comment = req.body.comment;
    let post = new Post({
        author: req.user._id,
        receiver: userId,
        comment: comment,
    });
    post.save().then(() => {
        res.end();
    }).catch((err) => {
        sendError(res, err);
    });
}

function createOwnPost(req, res) {
    let userId = req.user._id;
    let comment = req.body.comment;
    let post = new Post({
        author: userId,
        receiver: userId,
        comment: comment,
    });
    post.save().then(() => {
        res.end();
    }).catch((err) => {
        sendError(res, err);
    });
}

function getReceivedPosts(req, res) {
    let userId = req.query.userId;
    if(userId === undefined) {
        res.status(400).end();
        return;
    }

    Post.find().receivedBy(userId).withAuthor().exec().then((posts) => {
        res.json(posts).end();
    }).catch((err) => {
        sendError(res, err);
    });
}

function getOwnReceivedPosts(req, res) {
    let userId = req.user._id;
    Post.find().receivedBy(userId).withAuthor().exec().then((posts) => {
        res.json(posts).end();
    }).catch((err) => {
        sendError(res, err);
    });
}

module.exports = {
    reset,
    view,
    createUser,
    getUsersByNameQuery,
    addFriend,
    getFriends,
    getOwnFriends,
    createPost,
    createOwnPost,
    getReceivedPosts,
    getOwnReceivedPosts,
};
