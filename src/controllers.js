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
        res.end();
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
    if(friendId === req.user._id) {
        res.status(400).send("Can't add yourself as friend").end();
        return;
    }
    if(friendId in req.user.friends) {
        res.status(400).send("Can't add friends multiple times.").end();
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
