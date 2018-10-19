$(document).ready(() => {
    let userId = getUserId();
    updatePosts(userId);

    $(".fbook-post-comment").click(() => {
        if(!$(".fbook-comment-form")[0].checkValidity()) {
            return;
        }

        let comment = $("#comment").val();
        createPost(userId, comment).then(() => {
            $("#comment").val("");
            updatePosts(userId);
        }).catch((err) => {
            console.log("Could not post comment:", err);
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
        console.error("Could not fetch posts:", err);
    });
}

function getUserId() {
    let params = new URLSearchParams(window.location.search);
    return params.get("id");
}
