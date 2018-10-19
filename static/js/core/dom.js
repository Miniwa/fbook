function showError(message) {
    console.error(message);
}

function buildProfileLink(user) {
    let container = $("<div>");

    let linkOptions = {
        href: "/profile.html?id=" + user._id,
    };
    let link = $("<a>", linkOptions);
    link.append($("<h5>", {text: user.name.first + " " + user.name.last}));
    container.append(link);
    return container;
}

function buildPost(post) {
    let container = $("<div>", {class: "fbook-message"});
    container.append(buildProfileLink(post.author));
    container.append($("<p>", {text: post.comment}));
    return container;
}

function buildSearchResult(user, onClick) {
    let container = buildProfileLink(user);
    let buttonOptions = {
        class: "fbook-add-friend btn btn-primary",
        text: "Lägg till vän",
    };

    let button = $("<button>", buttonOptions);
    button.click(onClick);
    container.append(button);
    return container;
}
