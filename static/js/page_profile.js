$(document).ready(() => {
    let userId = getUserId();
    updatePosts(userId);

    $(".fbook-post-comment").click((event) => {
        event.preventDefault();
        if(!$(".fbook-comment-form")[0].checkValidity()) {
            return;
        }

        let comment = $("#comment").val();
        createPost(userId, comment).then(() => {
            $("#comment").val("");
            updatePosts(userId);
        }).catch((err) => {
            showError("Could not post comment.");
        });
    });
});

function updatePosts(userId) {
    $(".fbook-messages").empty();
    getReceivedPosts(userId).then((posts) => {
        $.each(posts, (i, post) => {
            $(".fbook-messages").append(buildPost(post));
        });
    }).catch((err) => {
        showError("Could not fetch posts.");
    });
}

function getUserId() {
    let params = new URLSearchParams(window.location.search);
    let id = params.get("id");
    if(id === null) {
        showError("No userid detected.");
        throw new Error("No user id detected.");
    }
    return id;
}
