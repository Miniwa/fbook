const User = require("./model/user");
const Post = require("./model/post");

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
        res.status(500).send(err).end();
    });
}

function getUsersByNameQuery(req, res) {
    let query = req.query.q;
    User.byNameQuery(query).then((users) => {
        res.json(users).end();
    }).catch((err) => {
        res.status(500).send(err).end();
    });
}

function addFriend(req, res) {
    let friendId = req.body.friendId;
    if(friendId === req.user._id) {
        res.status(500).send("Can't add yourself as friend").end();
        return;
    }
    if(friendId in req.user.friends) {
        res.status(500).send("Can't add friends multiple times.").end();
        return;
    }

    req.user.friends.push(friendId);
    req.user.save().then(() => {
        res.end();
    }).catch((err) => {
        res.status(500).send(err).end();
    });
}

function getFriends(req, res) {
    User.findById(req.user._id).withFriends().exec().then((user) => {
        res.json(user.friends).end();
    }).catch((err) => {
        res.status(500).send(err).end();
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
        res.status(500).send(err).end();
    });
}

function getReceivedPosts(req, res) {
    let userId = req.query.userId;
    Post.find().receivedBy(userId).withAuthor().exec().then((posts) => {
        res.json(posts).end();
    }).catch((err) => {
        res.status(500).send(err).end();
    });
}

function getOwnReceivedPosts(req, res) {
    let userId = req.user._id;
    Post.find().receivedBy(userId).withAuthor().exec().then((posts) => {
        res.json(posts).end();
    }).catch((err) => {
        res.status(500).send(err).end();
    });
}

module.exports = {
    view,
    createUser,
    getUsersByNameQuery,
    addFriend,
    getFriends,
    createOwnPost,
    getReceivedPosts,
    getOwnReceivedPosts,
};
