if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
// Only scroll to top on actual page load, not on every script execution
window.addEventListener('load', function() {
    // Only scroll to top if it's a fresh page load (not back/forward navigation)
    if (performance.navigation.type === performance.navigation.TYPE_NAVIGATE) {
        window.scrollTo(0, 0);
    }
});
// Toggle "open" class on hamburger click
document.addEventListener("DOMContentLoaded", function () {
    const toggler = document.querySelector(".custom-toggler");
    toggler.addEventListener("click", function () {
        this.classList.toggle("open");
    });
    // Optional: Auto-play carousel with custom timing
    ['#carouselExampleIndicators', '#carouselExampleSetSectionIndicators'].forEach(id => {
        new bootstrap.Carousel(document.querySelector(id), {
            interval: 3000,
            wrap: true,
            pause: false
        });
    });
    loadSetSectionImg('instructors', 'Certified Instructors & Mentors', 0);
    renderCourses();
    document.getElementById("currentYear").textContent = String(new Date().getFullYear());

    // Disable right-click
    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    });

    // Disable keyboard shortcuts for inspect, save, view source, print, etc.
    document.addEventListener("keydown", function (e) {
        // F12
        if (e.key === "F12") {
            e.preventDefault();
            return false;
        }

        // Ctrl+Shift+I/J/C/U | Ctrl+U/S/P
        if (
            (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
            (e.ctrlKey && ['U', 'S', 'P'].includes(e.key.toUpperCase()))
        ) {
            e.preventDefault();
            return false;
        }

        // Cmd+Option+I on macOS
        if (e.metaKey && e.altKey && e.key.toUpperCase() === 'I') {
            e.preventDefault();
            return false;
        }

        // Cmd+U, Cmd+S, Cmd+P (macOS)
        if (e.metaKey && ['U', 'S', 'P'].includes(e.key.toUpperCase())) {
            e.preventDefault();
            return false;
        }
    });
});

// Get the button
let scrollToTopButton = document.getElementById("scrollToTop");

// Improved scroll function with throttling for better mobile performance
let scrollTimeout;
window.addEventListener('scroll', function() {
    // Throttle scroll events for better performance
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(function() {
            scrollFunction();
            scrollTimeout = null;
        }, 16); // ~60fps
    }
});

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopButton.style.display = "block";
        scrollToTopButton.style.opacity = "1";
    } else {
        scrollToTopButton.style.display = "none";
        scrollToTopButton.style.opacity = "0";
    }
}

// When the user clicks on the button, scroll to the top of the document
// When the user clicks on the button, scroll to the top of the document
scrollToTopButton.addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
//this is for navbar
let disableScrollHighlight = false;
document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        // Disable scroll highlight temporarily
        disableScrollHighlight = true;
        setTimeout(() => disableScrollHighlight = false, 1000); // Adjust if needed

        // Remove active from all and add to clicked
        document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
        this.classList.add("active");

        const targetId = this.getAttribute("href").slice(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const offset = window.innerWidth < 992 ? 220 : 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
        // Collapse the menu if open
        const navbarCollapse = document.getElementById("navbarNav");
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
            bsCollapse.hide();
        }
        // hamburger icon reset
        const toggler = document.querySelector('.custom-toggler');
        if (toggler.classList.contains('open')) {
            toggler.classList.remove('open');
        }
    });
});

// Improved scroll highlight with throttling
let highlightTimeout;
window.addEventListener("scroll", () => {
    if (disableScrollHighlight) return;

    // Throttle for better mobile performance
    if (!highlightTimeout) {
        highlightTimeout = setTimeout(() => {
            updateScrollHighlight();
            highlightTimeout = null;
        }, 50);
    }
});

function updateScrollHighlight() {
    const offset = window.innerWidth < 768 ? 60 : 85; // Better mobile offset
    const navSections = [
        'whoWeAreSection',
        'courseSection',
        'corporateSection',
        'careerSection',
        'footerSection'
    ];

    const links = document.querySelectorAll(".nav-link");
    let currentId = "";
    let scrollPosition = window.scrollY + offset + 1;

    // Check each navigation section
    navSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;

            if (scrollPosition >= top && scrollPosition < bottom) {
                currentId = sectionId;
            }
        }
    });

    // Handle case when at bottom of page
    const isAtBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 10);
    if (isAtBottom) {
        currentId = navSections[navSections.length - 1];
    }

    // Update active nav link
    links.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentId}`) {
            link.classList.add("active");
        }
    });
}


//this is for set section
let setSectionCount = 0;
let data = {
    "instructors": "Certified Instructors & Mentors",
    "projects": "Real-World Projects",
    "support": "Resume & Interview Support",
    "placements": "Job Placement Assistance"
};
let changesetSectionLeftImage = document.querySelector("#setSectionLeftArrow");
let changesetSectionRightImage = document.querySelector("#setSectionRightArrow");
function loadSetSectionImg(type, text, index) {
    const img = document.querySelector("#loadSetsSectionImg");
    const setImgText = document.querySelector("#setImgText");
    const targetCard = document.querySelector(`#${type}`);
    const allCards = document.querySelectorAll(".set-card");

    // Remove all card highlights
    allCards.forEach(el => el.classList.remove("set-card-active"));
    targetCard.classList.add("set-card-active");

    // Animate image fade-out
    img.classList.remove("hero");
    img.classList.add("fade-out");

    // Wait for fade-out to complete before changing image and fading back in
    setTimeout(() => {
        img.src = `./assets/images/sets-us-apart/${type}.svg`;
        img.classList.remove("fade-out");
        img.classList.add("hero");
    }, 100); // Slightly less than the animation duration

    // Set heading text
    setImgText.innerText = text;

    // Update counter and arrows
    setSectionCount = index;
    changesetSectionLeftImage.src = index === 0 ? "./assets/images/icons/left-arrow.svg" : "./assets/images/icons/left-arrow-o.svg";
    changesetSectionRightImage.src = index === 3 ? "./assets/images/icons/right-arrow.svg" : "./assets/images/icons/right-arrow-o.svg";
}
function leftSetSectionArrowClick() {
    if (setSectionCount > 0) {
        setSectionCount -= 1;
        changesetSectionRightImage.src = "./assets/images/icons/right-arrow-o.svg";
        changesetSectionLeftImage.src = setSectionCount === 0 ? "./assets/images/icons/left-arrow.svg" : "./assets/images/icons/left-arrow-o.svg";
        loadSetSectionImg(Object.keys(data)[setSectionCount], Object.values(data)[setSectionCount], setSectionCount);
    }
}
function rightSetSectionArrowClick() {
    if (setSectionCount < 3) {
        setSectionCount += 1;
        changesetSectionLeftImage.src = "./assets/images/icons/left-arrow-o.svg";
        changesetSectionRightImage.src = setSectionCount === 3 ? "./assets/images/icons/right-arrow.svg" : "./assets/images/icons/right-arrow-o.svg";
        loadSetSectionImg(Object.keys(data)[setSectionCount], Object.values(data)[setSectionCount], setSectionCount);
    }
}

//this is for course section
let courseSectionCount = 0;
let courseData = [
    {
        type: "Cloud & DevOps",
        text: "AWS, Azure, Terraform, Docker, Kubernetes (With Linux / Windows)",
        img: "./assets/images/courses/cloud.svg"
    },
    {
        type: "Software Development",
        text: "Full Stack - MEAN, MERN, Java, Python",
        img: "./assets/images/courses/software-development.svg"
    },
    {
        type: "Data & Analytics",
        text: "Data Science, Power BI, AI/ML",
        img: "./assets/images/courses/data-analysis.svg"
    },
    {
        type: "Service Management",
        text: "ServiceNow, ITIL, Incident Management",
        img: "./assets/images/courses/service-management.svg"
    },
    {
        type: "ERP & CRM",
        text: "Salesforce, SAP FICO/MM/ABAP/HANA/COP",
        img: "./assets/images/courses/erp-crm.svg"
    },
    {
        type: "Automation & QA",
        text: "Selenium, JMeter, Test Automation",
        img: "./assets/images/courses/automation.svg"
    }
]
let leftCourseArrow = document.querySelector("#courseLeftArrow");
let rightCourseArrow = document.querySelector("#courseRightArrow");
const cardsPerPage = () => {
    if (window.innerWidth >= 992) return 3; // Large (lg)
    if (window.innerWidth >= 768) return 2; // Medium (md)
    return 1; // Small (sm)
};

function renderCourses() {
    const container = document.getElementById("courseCardsContainer");
    if (!container) return;

    // Fade out container
    container.style.opacity = "0";

    setTimeout(() => {
        container.innerHTML = "";

        const count = cardsPerPage();
        const start = courseSectionCount * count;
        const end = start + count;
        const visibleCourses = courseData.slice(start, end);

        visibleCourses.forEach((course) => {
            const col = document.createElement("div");
            col.className = `col-12 col-md-6 col-lg-4`;

            const card = document.createElement("div");
            card.className = "course-card h-100";

            card.innerHTML = `
                <img src="${course.img}" alt="${course.type}" />
                <h5 class="fw-bold">${course.type}</h5>
                <p class="mb-0 small text-start">${course.text}</p>
            `;

            col.appendChild(card);
            container.appendChild(col);
        });

        // Fade back in container
        container.style.opacity = "1";

        // Update arrows
        if (leftCourseArrow) {
            leftCourseArrow.src = courseSectionCount === 0
                ? "./assets/images/icons/left-arrow.svg"
                : "./assets/images/icons/left-arrow-o.svg";
        }

        const totalPages = Math.ceil(courseData.length / count);
        if (rightCourseArrow) {
            rightCourseArrow.src = courseSectionCount >= totalPages - 1
                ? "./assets/images/icons/right-arrow.svg"
                : "./assets/images/icons/right-arrow-o.svg";
        }
    }, 300);
}

function leftCoursesArrowClick() {
    if (courseSectionCount > 0) {
        courseSectionCount--;
        renderCourses();
    }
}

function rightCoursesArrowClick() {
    const maxPages = Math.ceil(courseData.length / cardsPerPage()) - 1;
    if (courseSectionCount < maxPages) {
        courseSectionCount++;
        renderCourses();
    }
}

// Add to your JavaScript file
function handleKeyPress(event, callback) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        callback();
    }
}

// Add event listeners
document.getElementById('setSectionLeftArrow').addEventListener('keydown', (e) => {
    handleKeyPress(e, leftSetSectionArrowClick);
});

// Improved resize handling with debouncing
let resizeTimeout;
let lastWidth = window.innerWidth;

window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.innerWidth !== lastWidth) {
            lastWidth = window.innerWidth;
            courseSectionCount = 0;
            renderCourses();
        }
    }, 250); // Debounce resize events
});

// Add CSS to prevent viewport jumping on mobile
const style = document.createElement('style');
style.textContent = `
    /* Prevent mobile viewport jumping */
    html {
        scroll-behavior: smooth;
    }
    
    body {
        overflow-x: hidden;
    }
    
    /* Improve form input behavior on mobile */
    @media (max-width: 767px) {
        input, textarea, select {
            font-size: 16px !important; /* Prevents zoom on iOS */
            transform: translateZ(0); /* Force hardware acceleration */
        }
        
        .form-control:focus {
            transform: translateZ(0);
        }
    }
    
    /* Smooth scroll for all scroll operations */
    * {
        scroll-behavior: smooth;
    }
`;
document.head.appendChild(style);


// submit form
const form = document.getElementById("contactForm");
form.addEventListener("submit", function(event) {
    event.preventDefault();
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const textarea = document.getElementById("message");
    const message = textarea.value.trim();
    const name = firstName + " " + lastName;
    submitForm(name, email, message, phone);
});

function submitForm(name, email, message, phone) {
    const data = {
        name: name,
        email: email,
        message: message,
        phone: phone
    };
    const disableSubmitButton = document.getElementById("submitForm");
    disableSubmitButton.disabled = true;
    // loading
    showToast("Please wait...");
    fetch("http://localhost:3000/contact", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => response.text())
        .then(res => {
            form.reset();
            disableSubmitButton.disabled = false;
            // Success message
            showToast("Form submitted successfully!");
            return res;
        })
        .catch(error => {
            console.error("Error:", error)
            // Error message
            disableSubmitButton.disabled = false;
            showToast(error);
        });
}
function showToast(message, duration = 3000) {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.classList.add("toast-message");
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, duration);
}
