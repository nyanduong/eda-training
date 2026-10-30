$(document).ready(function () {
    // setting slide
    currentSlide = "003";
    localStorage.setItem('current-slide', currentSlide);
    disableSwipe = false;

    // All slide elements are non-charts: fade them in using the template array.
    const animations = {
        100: [".title-group"],
        250: [".first-card-group"],
        400: [".second-card-group"],
        550: [".illustration-group"],
    };

    const artwork = ["slide-background.jpg", "joint-pain-illustration.png", "card-one-closed.png", "card-one-open.png", "card-two-closed.png", "card-two-open.png", "nav-logo.png", "nav-home.png", "nav-reference.png", "nav-sitemap.png"];
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

    // The two info cards are independent, so both can be open as on PDF page 5.
    function setCardOpen(card, open) {
        card.toggleClass("is-open", open);
        card.find(".card-details").attr("aria-hidden", String(!open));
        const label = card.hasClass("card-one") ? "first" : "second";
        card.find(".info-toggle").attr({
            "aria-expanded": String(open),
            "aria-label": (open ? "Close " : "Show ") + label + " information panel",
        });
    }

    let touchStart = null;
    $(".info-toggle").on("touchstart", function (event) {
        const touch = event.originalEvent.touches[0];
        touchStart = { x: touch.pageX, y: touch.pageY };
    }).on("touchend click", function (event) {
        if (event.type === "touchend") {
            const touch = event.originalEvent.changedTouches[0];
            if (touchStart && (Math.abs(touch.pageX - touchStart.x) > 10 || Math.abs(touch.pageY - touchStart.y) > 10)) return;
        }
        event.preventDefault();
        event.stopPropagation();
        const card = $(this).closest(".info-card");
        setCardOpen(card, !card.hasClass("is-open"));
    });
    $("[role='button'][tabindex='0']").on("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            $(this).trigger("click");
        }
    });
    $(document).on("keydown", function (event) {
        if (event.key === "Escape") {
            $(".info-card.is-open").each(function () { setCardOpen($(this), false); });
        }
    });

    // flow-slide
    var el = document.getElementById('container');
    swipedetect(el, function (swipedir) {
        if (swipedir == 'left') {
            window.goToSlide("004");
        }
        if (swipedir == 'right') {
            window.goToSlide("002");
        }
    });
});
