## Skill QuestX
**Skill QuestX** it’s about cultivating meaningful, long-lasting careers. Our comprehensive approach combines rigorous technical instruction with immersive hands-on labs, real-world projects, and personalized mentorship. This blend ensures learners gain both theoretical knowledge and practical experience, setting them apart in the competitive IT sector.

-----------------------------------------------------------------------------------

## Used Technologies
| Technology            | Description                                                                    | Version (Used/Recommended) | Official Documentation / Source                                                      |
| --------------------- | ------------------------------------------------------------------------------ | ------------ | ------------------------------------------------------------------------------------ |
| **HTML5**             | Standard markup language used to create the structure of web pages.            | HTML5        | [MDN Web Docs - HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)             |
| **CSS3**              | Stylesheet language used to design and layout HTML elements.                   | CSS3         | [MDN Web Docs - CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)               |
| **Bootstrap**         | CSS framework for building responsive, mobile-first web interfaces quickly.    | v5.3.x       | [Bootstrap Official Website](https://getbootstrap.com)                               |
| **JavaScript (ES6+)** | Client-side scripting language used for DOM manipulation and user interaction. | ECMAScript 2022+ (ES6 and beyond) | [MDN Web Docs - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) |

-----------------------------------------------------------------------------------

## Features (Developed In JS)

### Custom Website JavaScript – Feature & Behavior Overview
> This JavaScript file is responsible for providing dynamic interactivity, user experience enhancements, and front-end security measures for a multi-section, responsive website. Below is a full explanation of what it includes, why it's used, and how each part contributes to the overall functionality.

### 1. Scroll Restoration & Page Positioning

```angular2html
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
document.documentElement.scrollTop = 0;
document.body.scrollTop = 0;
```
> Prevents browser from auto-scrolling to the last position on reload.
> 
> Ensures user always starts at the top of the page on navigation or refresh.

-----------------------------------------------------------------------------------

### 2. Hamburger Menu Toggle

```angular2html
const toggler = document.querySelector(".custom-toggler");
    toggler.addEventListener("click", function () {
    this.classList.toggle("open");
});
```
> Enables the opening/closing animation for a hamburger icon.
> 
> Used in responsive/mobile navigation menus.

-----------------------------------------------------------------------------------

### 3. Bootstrap Carousel Auto-Play

```angular2html
new bootstrap.Carousel(document.querySelector(id), {
    interval: 3000,
    wrap: true,
    pause: false
});
```
> `Autoplay` multiple Bootstrap carousel components.
> 
> `interval`: 3000ms and no pause on hover.
    
-----------------------------------------------------------------------------------

### 4.  Disable Right Click and Developer Tools Shortcuts

```angular2html
document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("keydown", function (e) {
    // Block keys like F12, Ctrl+Shift+I, Ctrl+U, Cmd+Opt+I, etc.
});
```
> Prevents users from right-clicking or opening DevTools using keyboard shortcuts.
>
> Adds a basic level of content protection on front-end.

-----------------------------------------------------------------------------------

### 5. DevTools Detection (Advanced Security)

```angular2html
const element = new Image();
Object.defineProperty(element, 'id', {
    get: function () {
        window.location.replace("about:blank");
    }
});
```
> Detects when DevTools is inspecting the DOM.
>
> Redirects users if such behavior is detected.
    
-----------------------------------------------------------------------------------

### 6. Scroll-to-Top Button

```angular2html
window.onscroll = function() { scrollFunction(); };
scrollToTopButton.addEventListener("click", function () {
    document.documentElement.scrollTop = 0;
});
```
> Displays a button when user scrolls down.
>
> On click, scrolls smoothly to the top of the page.

-----------------------------------------------------------------------------------

####  Notes - :

### 1. renderCourses()
> To dynamically generate and display course cards on the page based on the current pagination index (courseSectionCount) and the number of cards per screen size.

#### How It Works:
* Uses cardsPerPage() function to determine how many course cards to show (based on screen width).
* Calculates which courses to display from the courseData[] array.
* Dynamically creates and inserts HTML elements into the DOM.
* Updates navigation arrows based on current page index.

####  Why It's Important:
* Makes the course section responsive without relying on plugins.
* Keeps the DOM lightweight by only rendering visible elements.
* Provides pagination functionality for large data sets.

### 2. leftCoursesArrowClick() and rightCoursesArrowClick()
> These two functions handle carousel navigation (left/right) for the course cards.

#### How They Work:
* leftCoursesArrowClick() decreases courseSectionCount if it’s above 0 and calls renderCourses() again to re-render.
* rightCoursesArrowClick() increases courseSectionCount if it’s below the max pages allowed based on current screen size.

#### Why They're Useful:
* Allow users to navigate through more courses without overloading the page.
* Work alongside renderCourses() to simulate a pagination-based carousel.
* Adaptive to screen size (cards per page change on resize).

### 3. window.addEventListener("resize", () => { ... });
> To re-render the course section when the window size changes.

#### How It Works:
* When screen is resized, it resets courseSectionCount to 0.
* Calls renderCourses() to adapt the layout to new card-per-page logic.

#### Why It Matters:
* Ensures consistent layout and avoids layout-breaking bugs on screen resize.
* Maintains responsive design for desktop ↔ tablet ↔ mobile transitions.

### 4. loadSetSectionImg(type, text, index)
> To update the image and text in the "What Sets Us Apart" section based on selected feature.

#### What It Does:
* Changes image source and heading text.
* Highlights the active feature card.
* Adds hero/fade-out animation effects for smooth transitions.
* Updates the index (setSectionCount) to track current item.
* Updates left/right arrow states (active/inactive visuals).

#### Why Use This:
* Makes the feature section visually engaging.
* Encourages interaction and showcases differentiators dynamically.
* Saves DOM space by showing one image/text at a time.

### 5. leftSetSectionArrowClick() and rightSetSectionArrowClick()
> Allow users to navigate left/right through the “Sets Us Apart” feature cards.

#### Logic:
* Adjusts setSectionCount index on click.
* Updates arrow images based on current position (grayed out at start/end).
* Calls loadSetSectionImg() with new index to update the view.

#### Why It's Useful:
* Adds controlled, sequential interactivity.
* Helps emphasize one feature at a time (good for marketing).

### 6. document.querySelectorAll('.nav-link[href^="#"]').forEach(link => { ... });
> To handle smooth scrolling to sections and highlight the active navbar link on click.

####  What It Does:
* Overrides default anchor behavior.
* Smoothly scrolls to the target section.
* Accounts for different header offset on mobile/desktop.
* Adds active class to clicked nav link and removes from others.
* Collapses navbar and resets hamburger icon (for mobile).

#### Benefits: 
* Improves navigation usability and accessibility.
* Offers smooth experience on SPA-style one-page websites.
* Maintains visual clarity with active-state feedback.

### 7. window.addEventListener("scroll", () => { ... });
> To dynamically update the active navbar link based on the scroll position (scroll spy behavior).

#### How It Works:
* Listens to scroll events.
* Checks current scroll position and matches it to a section ID.
* Highlights the corresponding nav link as active.
* Includes a check to highlight the last section if you're at the bottom of the page.

#### Why It's Essential:
* Helps users track where they are on the page.
* Improves usability, especially in long-scrolling sites.
* Creates a polished, professional feel.

-----------------------------------------------------------------------------------
### Summary Table

| Function                                                     | Role                              | Benefit                          |
| ------------------------------------------------------------ | --------------------------------- | -------------------------------- |
| `renderCourses()`                                            | Render dynamic course cards       | Lightweight, responsive carousel |
| `leftCoursesArrowClick()` / `rightCoursesArrowClick()`       | Navigate course cards             | Allows paginated viewing         |
| `resize` listener                                            | Re-renders courses on resize      | Responsive support               |
| `loadSetSectionImg()`                                        | Show selected "set apart" feature | Dynamic & animated content       |
| `leftSetSectionArrowClick()` / `rightSetSectionArrowClick()` | Navigate feature section          | Sequential browsing              |
| `nav-link click handler`                                     | Smooth scroll to section          | Usability and polish             |
| `scroll listener`                                            | Active nav update on scroll       | UX clarity and navigation aid    |

-----------------------------------------------------------------------------------

#### Stop uploading files to GitHub

> git rm --cached server/.env (same like required path)
> 
> git commit -m "Stop tracking server/.env"
> 
> git push