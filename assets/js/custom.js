// Greedy Nav - Responsive Priority Navigation
$(function () {
    // Only run this code once the document is ready

    var $nav = $(".greedy-nav");
    var $btn = $(".greedy-nav button");
    var $vlinks = $(".greedy-nav .visible-links");
    var $hlinks = $(".greedy-nav .hidden-links");
    var $themeToggle = $("#theme-toggle");

    // Don't run if elements don't exist
    if ($nav.length === 0 || $vlinks.length === 0) {
        return;
    }

    var numOfItems = 0;
    var totalSpace = 0;
    var closingTime = 1000;
    var breakWidths = [];

    // Get initial state
    $vlinks
        .children("li:not(:first-child):not(#theme-toggle)")
        .each(function () {
            numOfItems += 1;
            var itemWidth = $(this).outerWidth(true);
            totalSpace += itemWidth;
            breakWidths.push(totalSpace);
        });

    var availableSpace, numOfVisibleItems, requiredSpace, timer;

    function check() {
        // Get current state
        availableSpace = $vlinks.width() - 10; // Buffer of 10px
        numOfVisibleItems = $vlinks.children(
            "li:not(:first-child):not(#theme-toggle):visible"
        ).length;

        // Calculate logo width and toggle width
        var logoWidth = $vlinks.children("li:first-child").outerWidth(true);
        var toggleWidth = $themeToggle.outerWidth(true) || 0; // Default to 0 if not found

        // Adjust available space
        availableSpace = availableSpace - logoWidth - toggleWidth;

        // Nothing to check if no items exist
        if (numOfItems === 0) {
            return;
        }

        // Check if we need to add the toggle button
        if (numOfVisibleItems === 0 && availableSpace < breakWidths[0]) {
            $nav.addClass("has-overflow");
            $btn.css("display", "block");
        } else if (availableSpace > breakWidths[numOfItems - 1]) {
            // Show all items
            $nav.removeClass("has-overflow");
            $btn.css("display", "none");
            $vlinks
                .children("li:not(:first-child):not(#theme-toggle)")
                .css("display", "inline-block");
            $hlinks.children("li").css("display", "none");
        } else {
            // Find which items to show/hide
            $nav.addClass("has-overflow");
            $btn.css("display", "block");

            // Show all items in the visible menu
            $vlinks
                .children("li:not(:first-child):not(#theme-toggle)")
                .css("display", "inline-block");

            // Hide items that don't fit
            for (var i = numOfItems - 1; i >= 0; i--) {
                if (availableSpace < breakWidths[i]) {
                    $vlinks
                        .children("li:not(:first-child):not(#theme-toggle)")
                        .eq(i)
                        .css("display", "none");
                    $hlinks.children("li").eq(i).css("display", "block");
                } else {
                    break;
                }
            }
        }
    }

    // Window listeners
    $(window).on("resize", function () {
        check();
    });

    // Run on page load
    check();

    // Toggle button click handler
    $btn.on("click", function (e) {
        e.preventDefault();
        $nav.toggleClass("open");

        clearTimeout(timer);

        if ($nav.hasClass("open")) {
            $hlinks.css("display", "block");
        } else {
            timer = setTimeout(function () {
                $hlinks.css("display", "none");
            }, closingTime);
        }
    });

    // Close menu when clicking outside
    $(document).on("click", function (e) {
        if (!$(e.target).closest(".greedy-nav").length) {
            $nav.removeClass("open");

            clearTimeout(timer);
            timer = setTimeout(function () {
                $hlinks.css("display", "none");
            }, closingTime);
        }
    });
});
