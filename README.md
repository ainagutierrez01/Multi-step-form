# Frontend Mentor - Multi-step form solution

This is a solution to the [Multi-step form challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/multistep-form-YVAnSdqQBJ).

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- Complete each step of the sequence
- Go back to a previous step to update their selections
- See a summary of their selections on the final step and confirm their order
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page
- Receive form validation messages if:
  - A field has been missed
  - The email address is not formatted correctly
  - A step is submitted, but no selection has been made

### Screenshot

<img width="1088" height="624" alt="image" src="https://github.com/user-attachments/assets/731367a8-836b-4cf3-8372-a4cab9b523de" />


### Links

- Solution URL: [GitHub repo](https://github.com/YOUR_USERNAME/YOUR_REPO)
- Live Site URL: [GitHub Pages](https://YOUR_USERNAME.github.io/YOUR_REPO)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox / CSS Grid
- Mobile-first workflow
- Vanilla JavaScript (no frameworks/build tools)

### What I learned

The step navigation is driven entirely by toggling the `hidden` attribute on `fieldset` elements, with a small gotcha: any CSS rule like `.step { display: flex; }` overrides the native `hidden` behavior, since `[hidden]` only sets `display: none` at the lowest specificity. The fix is to explicitly reinstate it:

```css
.step {
  display: flex;
}

.step[hidden] {
  display: none;
}
```

I also used `:has()` to style a custom checkbox/radio card purely in CSS, without needing JS to toggle a "selected" class:

```css
.plan:has(.plan__input:checked) {
  border-color: var(--purple-600);
  background-color: var(--blue-50);
}
```

### Continued development

Areas I'd like to keep working on:

- Adding animated transitions between steps (currently an instant swap)
- Persisting form state to `localStorage` so a refresh doesn't lose progress
- Expanding keyboard navigation/focus management for the multi-step flow (e.g. moving focus to the new step's heading on navigation)

## Author

- Frontend Mentor - [@ainagutierrez01](https://www.frontendmentor.io/profile/ainagutierrez01)
