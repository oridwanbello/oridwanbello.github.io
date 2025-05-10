---
layout: default
title: Test Page
author_profile: false
redirect_from:
    - /test/
    - /test.html
    - /test.md
---

<style>
    .custom-feature-section {
    margin-bottom: 2em;
    padding: 1em;
    /* For desktop: constrain width and center */
    max-width: 1140px; /* Adjust as needed, e.g., 960px, 1200px */
    margin-left: auto;
    margin-right: auto;
    }

    .custom-feature__item {
    display: flex;
    flex-direction: column; /* Mobile: vertical layout */
    border: none; /* Remove visible border from the main rectangle */
    border-radius: 50px;
    overflow: hidden;
    background-color: rgba(153, 204, 0, 0.10); /* Transparent version of #99cc00 (e.g., 15% opacity) */
    }

    .custom-feature__item--img {
    flex-shrink: 0;
    display: flex; /* Added to help center the image if it's smaller than its container */
    justify-content: center; /* Center image horizontally */
    align-items: center; /* Center image vertically */
    padding: 1em; /* Add some padding around the image if desired */
    }

    .custom-feature__item--img img {
    width: 100%;
    height: auto;
    max-width: 280px; /* INCREASED: Max size of the image for responsiveness */
    display: block;
    object-fit: cover; /* Ensures the image covers the area, might crop */
    border-radius: 50%; /* Make the image round */
    aspect-ratio: 1 / 1; /* Ensure the space for the image is square for a perfect circle */
    }

    .custom-feature__item--desc {
    padding: 1.5em;
    display: flex;
    flex-direction: column;
    }

    .custom-feature__item--desc h3 {
    margin-top: 0;
    font-size: 1.5em; /* Adjust as needed, or use theme variables if available */
    color: #009a00; /* New color for "Financial Advisor" */
    }

    .custom-feature__item--desc p {
    margin-bottom: 1em;
    flex-grow: 1; /* Allows paragraph to take available space */
    color: var(--text-color-light, #555); /* Use theme's lighter text color */
    }

    .custom-feature__item--desc .btn {
    margin-top: 1em; /* Space above button */
    align-self: flex-start; /* Align button to the start */
    background-color: #009a00; /* New background color for "Learn more" button */
    color: #ffffff !important; /* New text color for "Learn more" button, !important to override theme styles if necessary */
    border-color: #009a00; /* Match border color to background */
    }

    /* Ensure hover styles for the button are also adjusted if needed */
    .custom-feature__item--desc .btn:hover {
        background-color: #007a00; /* Darker shade for hover, adjust as needed */
        border-color: #007a00;
        color: #ffffff !important;
    }

    /* Desktop view: Apply for screens wider than 'small' breakpoint (typically 600px) */
    @media (min-width: 600px) { /* Matches $small breakpoint from _sass/_themes.scss */
    .custom-feature__item {
        flex-direction: row; /* Desktop: horizontal layout */
        align-items: center; /* Align items vertically in desktop view */
    }

    .custom-feature__item--img {
        width: 40%; /* UPDATED: Define a responsive width for the image container */
        padding: 1.5em; /* Adjust padding for desktop if needed */
        /* flex-shrink: 0; is good to prevent shrinking if space is tight */
    }

    .custom-feature__item--img img {
        /* max-width is inherited (280px), width: 100% makes it fill its container up to max-width */
        /* height: 100%; REMOVED to rely on aspect-ratio for correct height */
    }

    .custom-feature__item--desc {
        width: 60%; /* UPDATED: Adjust text content width for desktop to complement image container */
        justify-content: center; /* Vertically center content if desired */
    }
    }
</style>

<section class="custom-feature-section">
  <div class="custom-feature__item">
    <div class="custom-feature__item--img">
      <!-- Replace with your image path. Place the image in /assets/images/ -->
      <img src="{{ '/images/profile.jpg' | relative_url }}" alt="Financial Advisory">
    </div>
    <div class="custom-feature__item--desc">
      <h3>Financial Advisory</h3>
      <p>Unlock the full potential of your agricultural business with our support. From capacity development to fundraising support, we will help you grow, thrive, and succeed. Unlock the full potential of your agricultural business with our support. From capacity development to fundraising support, we will help you grow, thrive, and succeed.</p>
      <!-- Replace with your desired link -->
      <a href="#" class="btn btn--primary">Learn more</a>
    </div>
  </div>
</section>
