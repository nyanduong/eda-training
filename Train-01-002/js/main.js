$(document).ready(function () {
    // setting slide
    currentSlide = "002";
    localStorage.setItem('current-slide', currentSlide);
    disableSwipe = false;

    // Keep the template's grouped animation array. Columns rise; other content fades.
    const animations = {
        100: [".title-group"],
        200: [".chart-copy-group"],
        300: [".column-one", ".value-one"],
        380: [".column-two", ".value-two"],
        460: [".column-three", ".value-three"],
        540: [".column-four", ".value-four"],
        620: [".column-five", ".value-five"],
        700: [".column-six", ".value-six"],
        780: [".column-seven", ".value-seven"],
        860: [".callout-group"],
    };

    const artwork = ["slide-background.jpg", "callout.png", "reference-panel.png", "reference-close.png", "nav-logo.png", "nav-home.png", "nav-reference.png", "nav-reference-active.png", "nav-sitemap.png", "column-one.png", "column-two.png", "column-three.png", "column-four.png", "column-five.png", "column-six.png", "column-seven.png"];
    const imagesReady = Promise.all(artwork.map((name) => new Promise((resolve) => {
        const image = new Image();
        image.onload = resolve;
        image.onerror = resolve;
        image.src = "images/" + name;
    })));
    // The reference font is inside a hidden dialog: explicitly load it before first open.
    const fontsReady = document.fonts
        ? Promise.all([document.fonts.ready, document.fonts.load('1vw "din-next-reference"')]).catch(() => undefined)
        : Promise.resolve();
    Promise.all([imagesReady, fontsReady]).then(() => {
        for (const [offset, elements] of Object.entries(animations)) {
            setTimeout(() => elements.forEach((selector) => $(selector).addClass("show")), Number(offset));
        }
    });

    // Global.js retains its original popup handlers; add modal state/accessibility here.
    $(".icon-ref").on("touchend click", function (event) {
        event.preventDefault();
        disableSwipe = true;
        $("body").addClass("reference-open");
        $(this).attr("aria-expanded", "true");
        $(".ref-container").attr("aria-hidden", "false");
        $("#main-container").attr("aria-hidden", "true");
        $(".ref-close").toggleClass("pointer-focus", Boolean(event.originalEvent)).trigger("focus");
    });
    $(".ref-close").on("touchend click", function (event) {
        event.preventDefault();
        disableSwipe = false;
        $("body").removeClass("reference-open");
        $(".icon-ref").attr("aria-expanded", "false");
        $(".ref-container").attr("aria-hidden", "true");
        $("#main-container").removeAttr("aria-hidden");
        $(".icon-ref").toggleClass("pointer-focus", Boolean(event.originalEvent)).trigger("focus");
    });
    $("[role='button'][tabindex='0']").on("keydown", function (event) {
        $(this).removeClass("pointer-focus");
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            $(this).trigger("click");
        }
    });
    $(document).on("keydown", function (event) {
        if (!$("body").hasClass("reference-open")) return;
        if (event.key === "Escape") $(".ref-close").trigger("click");
        if (event.key === "Tab") {
            event.preventDefault();
            $(".ref-close").removeClass("pointer-focus").trigger("focus");
        }
    });

    // flow-slide
    var el = document.getElementById('container');
    swipedetect(el, function (swipedir) {
        if (disableSwipe) return;
        if (swipedir == 'left') {
            window.goToSlide("003");
        }
        if (swipedir == 'right') {
            window.goToSlide("001");
        }
    });
});
