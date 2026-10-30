$(document).ready(function () {
    // Capture the slide that opened the map before setting this slide's ID.
    const validContentSlide = /^00[1-5]$/;
    const storedCurrent = localStorage.getItem("current-slide");
    const storedPrevious = localStorage.getItem("prev-slide");
    const returnSlide = validContentSlide.test(storedCurrent) ? storedCurrent :
        validContentSlide.test(storedPrevious) ? storedPrevious : "005";
    localStorage.setItem("prev-slide", returnSlide);
    currentSlide = "006";
    localStorage.setItem("current-slide", currentSlide);
    disableSwipe = false;

    // Non-chart artwork and labels fade together using the template array.
    const animations = {
        100: [".item-001-group"],
        200: [".item-002-group"],
        300: [".item-003-group"],
        400: [".item-004-group"],
        500: [".item-005-group"],
    };
    const artwork = ["slide-background.jpg", "sitemap-item-001.png", "sitemap-item-002.png", "sitemap-item-003.png", "sitemap-item-004.png", "sitemap-item-005.png", "nav-logo.png", "nav-home.png", "nav-reference.png", "nav-sitemap.png"];
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

    // Explicit touch handling works with the template's swipe preventDefault.
    // A drag across an item remains a swipe, rather than opening that item.
    let touchStart = null;
    let lastTouch = 0;
    $(".sitemap-item, .icon-sitemap").on("touchstart", function (event) {
        const touch = event.originalEvent.touches[0];
        touchStart = { x: touch.pageX, y: touch.pageY };
    });
    function activate(event, slideId) {
        if (event.type === "touchend") {
            const touch = event.originalEvent.changedTouches[0];
            if (touchStart && (Math.abs(touch.pageX - touchStart.x) > 10 || Math.abs(touch.pageY - touchStart.y) > 10)) return;
            lastTouch = Date.now();
        }
        event.preventDefault();
        event.stopPropagation();
        if (event.type === "click" && Date.now() - lastTouch < 600) return;
        window.goToSlide(slideId);
    }
    $(".sitemap-item").on("touchend click", function (event) {
        activate(event, $(this).attr("data-slide"));
    }).on("keydown", function (event) {
        if (event.key === " ") {
            event.preventDefault();
            $(this).trigger("click");
        }
    });
    // The active sitemap icon toggles back to the presentation, using the
    // existing goToSlide API for both Browser and Veeva players.
    $(".icon-sitemap").off("touchend click").on("touchend click", function (event) {
        activate(event, returnSlide);
    });
    $("[role='button'][tabindex='0']").on("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            $(this).trigger("click");
        }
    });
    $(document).on("keydown", function (event) {
        if (event.key === "Escape") window.goToSlide(returnSlide);
    });
    swipedetect(document.getElementById("container"), function (direction) {
        if (direction === "right") window.goToSlide(returnSlide);
    });
});
