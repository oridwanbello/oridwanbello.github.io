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
var $siteTitle = $('#site-nav .site-title');
var $themeToggle = $('#theme-toggle');

var breaks = [];

function updateNav() {
  var availableSpace = $nav.width()
                      - $siteTitle.outerWidth(true)
                      - $themeToggle.outerWidth(true)
                      - $btn.outerWidth(true)
                      - 20; // Safety margin

  var numOfVisibleItems = $vlinks.children().length;
  var numOfItems = numOfVisibleItems + $hlinks.children().length;

  // The visible list is overflowing the nav
  if($vlinks.outerWidth(true) > availableSpace) {
    // Record the width of the list
    breaks.push($vlinks.outerWidth(true));

    // Move item to the hidden list
    $vlinks.children().last().prependTo($hlinks);
    numOfVisibleItems -= 1;

    // Show the dropdown btn
    if($hlinks.children().length > 0) {
      $btn.removeClass('hidden');
    }

  // The visible list is not overflowing
  } else {
    // There is space for more items in the nav
    if(availableSpace > breaks[breaks.length-1]) {
      // Move the item to the visible list
      $hlinks.children().first().appendTo($vlinks);
      breaks.pop();
    }

    // Hide the dropdown btn if hidden list is empty
    if(breaks.length < 1) {
      $btn.addClass('hidden');
      $hlinks.addClass('hidden');
    }
  }

  // Recur if the visible list is still overflowing the nav
  if($vlinks.outerWidth(true) > availableSpace) {
    updateNav();
  }

  // Update counter on button
  $btn.attr('count', numOfItems - numOfVisibleItems);

  // Update masthead height and body padding
  var mastheadHeight = $('.masthead').height();
  $('body').css('padding-top', mastheadHeight + 'px');
  if($(".author__urls-wrapper button").is(":visible")) {
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

// Initialize
updateNav();