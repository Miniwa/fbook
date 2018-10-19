function searchUsers(query) {
    return $.get({
        url: "http://localhost:8000/user/search",
        data: {
            q: query,
        },
    });
}

function addFriend(id) {
    return $.post({
        url: "http://localhost:8000/addFriend",
        data: {
            friendId: id,
        },
    });
}

function getFriends(userId) {
    return $.get({
        url: "http://localhost:8000/getFriends",
        data: {
            userId: userId,
        },
    });
}

function getOwnFriends() {
    return $.get({
        url: "http://localhost:8000/getOwnFriends",
    });
}

function createPost(userId, comment) {
    return $.post({
        url: "http://localhost:8000/createPost",
        data: {
            userId: userId,
            comment: comment,
        },
    });
}

function createOwnPost(comment) {
    return $.post({
        url: "http://localhost:8000/createOwnPost",
        data: {
            comment: comment,
        },
    });
}

function getReceivedPosts(userId) {
    return $.get({
        url: "http://localhost:8000/getReceivedPosts",
        data: {
            userId: userId,
        },
    });
}

function getOwnReceivedPosts() {
    return $.get({
        url: "http://localhost:8000/getOwnReceivedPosts",
    });
}
