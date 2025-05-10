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
    // ...existing styles...

    .custom-feature-section {
    margin-bottom: 2em;
    padding: 1em;
    }

    .custom-feature__item {
    display: flex;
    flex-direction: column; /* Mobile: vertical layout */
    border: 1px solid var(--border-color, #e0e0e0); /* Use theme's border color or a fallback */
    border-radius: 4px;
    overflow: hidden;
    background-color: var(--background-color, #fff); /* Use theme's background or a fallback */
    }

    .custom-feature__item--img {
    flex-shrink: 0;
    }

    .custom-feature__item--img img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover; /* Ensures the image covers the area, might crop */
    }

    .custom-feature__item--desc {
    padding: 1.5em;
    display: flex;
    flex-direction: column;
    }

    .custom-feature__item--desc h3 {
    margin-top: 0;
    font-size: 1.5em; /* Adjust as needed, or use theme variables if available */
    color: var(--text-color, #333); /* Use theme's text color */
    }

    .custom-feature__item--desc p {
    margin-bottom: 1em;
    flex-grow: 1; /* Allows paragraph to take available space */
    color: var(--text-color-light, #555); /* Use theme's lighter text color */
    }

    .custom-feature__item--desc .btn {
    margin-top: 1em; /* Space above button */
    align-self: flex-start; /* Align button to the start */
    }

    /* Desktop view: Apply for screens wider than 'small' breakpoint (typically 600px) */
    @media (min-width: 600px) { /* Matches $small breakpoint from _sass/_themes.scss */
    .custom-feature__item {
        flex-direction: row; /* Desktop: horizontal layout */
    }

    .custom-feature__item--img {
        width: 40%; /* Adjust image width for desktop */
        max-height: 300px; /* Optional: constrain image height */
    }

    .custom-feature__item--img img {
        height: 100%; /* Make image fill the container height */
    }

    .custom-feature__item--desc {
        width: 60%; /* Adjust text content width for desktop */
        justify-content: center; /* Vertically center content if desired */
    }
    }
</style>

// ...existing content...

<section class="custom-feature-section">
  <div class="custom-feature__item">
    <div class="custom-feature__item--img">
      <!-- Replace with your image path. Place the image in /assets/images/ -->
      <img src="{{ '/assets/images/placeholder-image.jpg' | relative_url }}" alt="Financial Advisory">
    </div>
    <div class="custom-feature__item--desc">
      <h3>Financial Advisory</h3>
      <p>Unlock the full potential of your agricultural business with our support. From capacity development to fundraising support, we will help you grow, thrive, and succeed.</p>
      <!-- Replace with your desired link -->
      <a href="#" class="btn btn--primary">Learn more</a>
    </div>
  </div>
</section>

// ...rest of your content...
