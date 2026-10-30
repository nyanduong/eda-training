$(document).ready(function () {
    // setting slide
    currentSlide = "001";
    localStorage.setItem('current-slide', currentSlide);
    disableSwipe = false;

    // Non-chart elements fade in, grouped using the template's animation array.
    // First group starts at 100 ms, once fonts and artwork are ready.
    const animations = {
        100: [".title-group"],
        250: [".copy-group"],
        400: [".product-group"],
    };

    const artwork = [
        "images/slide-background.jpg",
        "images/crux-product.png",
        "images/nav-logo.png",
        "images/nav-home.png",
        "images/nav-reference.png",
        "images/nav-sitemap.png",
    ];

    const imagesReady = Promise.all(artwork.map((src) => new Promise((resolve) => {
        const image = new Image();
        image.onload = resolve;
        image.onerror = resolve;
        image.src = src;
    })));

    Promise.all([imagesReady, document.fonts ? document.fonts.ready : Promise.resolve()])
        .then(() => {
            for (const [offset, elements] of Object.entries(animations)) {
                setTimeout(() => elements.forEach((selector) => $(selector).addClass("show")), Number(offset));
            }
        });

    // Reuse the existing touch/click handlers for keyboard access.
    $("#menu [role='button'][tabindex='0']").on("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            $(this).trigger("click");
        }
    });

    // flow-slide
    var el = document.getElementById('container');
    swipedetect(el, function (swipedir) {
        if (swipedir == 'left') {
            window.goToSlide("002");
        }
        if (swipedir == 'right') {
            // disableSwipe = true;
        }
    });
});
