$(document).ready(function () {
    currentSlide = "005";
    localStorage.setItem("current-slide", currentSlide);
    disableSwipe = false;

    // Page 7 contains non-chart elements: opacity only, using the template array.
    const animations = {
        100: [".hero-group"],
        250: [".card-one-group"],
        400: [".card-two-group"],
        550: [".card-three-group"],
    };

    const artwork = ["slide-background.jpg", "couple-hero.png", "card-one.png", "card-two.png", "card-three.png", "nav-logo.png", "nav-home.png", "nav-reference.png", "nav-sitemap.png"];
    const imagesReady = Promise.all(artwork.map((name) => new Promise((resolve) => {
        const image = new Image();
        image.onload = resolve;
        image.onerror = resolve;
        image.src = "images/" + name;
    })));
    Promise.all([imagesReady, document.fonts ? document.fonts.ready : Promise.resolve()]).then(() => {
        for (const [offset, elements] of Object.entries(animations)) {
            setTimeout(() => elements.forEach((selector) => $(selector).addClass("show")), Number(offset));
        }
    });

    $("[role='button'][tabindex='0']").on("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            $(this).trigger("click");
        }
    });

    swipedetect(document.getElementById("container"), function (direction) {
        if (direction === "left") window.goToSlide("006");
        if (direction === "right") window.goToSlide("004");
    });
});
