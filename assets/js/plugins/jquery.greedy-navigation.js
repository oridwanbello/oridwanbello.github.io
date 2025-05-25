/*
* Greedy Navigation
*
* http://codepen.io/lukejacksonn/pen/PwmwWV
*
*/

var $nav = $('#site-nav');
var $btn = $('#site-nav button');
var $vlinks = $('#site-nav .visible-links');
var $hlinks = $('#site-nav .hidden-links');

var breaks = [];

function updateNav() {
  // Get elements that should persist
  var $logoItem = $vlinks.find('.masthead__menu-item--lg');
  var $themeToggle = $vlinks.find('#theme-toggle');
  var $regularItems = $vlinks.children(':not(.masthead__menu-item--lg):not(#theme-toggle)');

  // Calculate available space
  var availableSpace = $nav.width() - $logoItem.outerWidth(true) - $themeToggle.outerWidth(true) - $btn.outerWidth(true) - 30;

  // The visible list is overflowing the nav
  if ($regularItems.outerWidth(true) > availableSpace) {
    // Show the dropdown btn
    $btn.removeClass("hidden");

    while ($regularItems.outerWidth(true) > availableSpace && $regularItems.length > 0) {
      // Record the width of the list
      breaks.push($regularItems.outerWidth(true));

      // Move item to the hidden list
      $regularItems.last().prependTo($hlinks);
      // Update our collection
      $regularItems = $vlinks.children(':not(.masthead__menu-item--lg):not(#theme-toggle)');
    }
  } else {
    // There is space for more items in the nav
    while (breaks.length > 0 && availableSpace > breaks[breaks.length - 1]) {
      // Move the first item from hidden to visible
      $hlinks.children().first().appendTo($vlinks);
      breaks.pop();
    }

    // Hide dropdown btn if hidden list is empty
    if (breaks.length < 1) {
      $btn.addClass('hidden');
      $btn.removeClass('close');
      $hlinks.addClass('hidden');
    }
  }

  // Keep counter updated
  $btn.attr("count", breaks.length);

  // Update masthead height and body padding
  var mastheadHeight = $('.masthead').height();
  $('body').css('padding-top', mastheadHeight + 'px');
  if ($(".author__urls-wrapper button").is(":visible")) {
    $(".sidebar").css("padding-top", "");
  } else {
    $(".sidebar").css("padding-top", mastheadHeight + "px");
  }
}

// Window listeners
$(window).on('resize', function() {
  updateNav();
});
screen.orientation.addEventListener("change", function() {
  updateNav();
});

$btn.on('click', function() {
  $hlinks.toggleClass('hidden');
  $(this).toggleClass('close');
});

updateNav();