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

function getFriends() {
    return $.get({
        url: "http://localhost:8000/getFriends",
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

function getOwnReceivedPosts() {
    return $.get({
        url: "http://localhost:8000/getOwnReceivedPosts",
    });
}
