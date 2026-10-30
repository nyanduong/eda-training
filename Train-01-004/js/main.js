$(document).ready(function () {
    currentSlide = "004";
    localStorage.setItem("current-slide", currentSlide);
    disableSwipe = false;

    // Template timing array: opacity for copy, bottom-up for the five column pairs.
    const animations = {
        100: [".title-group"],
        200: [".chart-copy-group", ".legend-group"],
        300: [".pair-one .column-art", ".pair-one .chart-value"],
        400: [".pair-two .column-art", ".pair-two .chart-value"],
        500: [".pair-three .column-art", ".pair-three .chart-value"],
        600: [".pair-four .column-art", ".pair-four .chart-value"],
        700: [".pair-five .column-art", ".pair-five .chart-value"],
        800: [".caption-group"],
    };

    // Wait for local assets and the supplied Roboto fonts before starting the clock.
    const artwork = ["slide-background.jpg", "chart-axes.png", "column-one.png", "column-two.png", "column-three.png", "column-four.png", "column-five.png", "column-six.png", "column-seven.png", "column-eight.png", "column-nine.png", "column-ten.png", "legend-gray.png", "legend-green.png", "nav-logo.png", "nav-home.png", "nav-reference.png", "nav-sitemap.png"];
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
        if (direction === "left") window.goToSlide("005");
        if (direction === "right") window.goToSlide("003");
    });
});
