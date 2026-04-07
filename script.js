/* =============================================
   IT 223 – Web Resume | script.js
   Charianne Q. Abecia | Full Stack Developer
   =============================================
   VANILLA JS FEATURES IMPLEMENTED (3 required):
     1. Prompt-based personalization  (ask visitor name → display on page)
     2. Fetch + load/display JSON data (projects loaded from resume.json)
     3. Show/Hide toggle              ("View More" extra projects)
     4. Basic form validation         (contact form required fields)
     5. createElement / appendChild  (dynamic project cards built & appended)
     6. Simple skill search/filter    (search input filters skill tags)

   JQUERY FEATURES IMPLEMENTED (2 required):
     1. Dark mode toggle              (toggleClass, attr, text)
     2. Hire Me popup                 (show/hide, on('click'), addClass/removeClass)
     3. Skill bars animation          (show/hide, addClass for animated fills)
     4. Greeting banner close         (hide, on('click'))
     5. Project filter buttons        (on('click'), toggleClass, show/hide logic)
     6. Nav active highlight          (on('click'), addClass/removeClass)
   ============================================= */

/* ================================================================
   VANILLA JAVASCRIPT SECTION
   ================================================================ */

/* ---- JS FEATURE 1: Prompt-based Personalization ----
   Ask the visitor their name and display a greeting on the page. */
(function promptVisitor() {
  // Small delay so the page renders first
  setTimeout(function () {
    var name = prompt("👋 Welcome! What's your name? (Press Cancel to skip)");

    if (name && name.trim() !== "") {
      var sanitized = name.trim().replace(/[<>]/g, ""); // basic XSS guard
      var banner = document.getElementById("greeting-banner");
      var greetText = document.getElementById("greeting-text");

      // DOM manipulation with getElementById (JS requirement)
      greetText.textContent =
        "Hello, " + sanitized + "! Thanks for visiting Alex's resume. 🚀";

      banner.classList.remove("hidden");
    }
  }, 600);
})();

/* ---- JS FEATURE 2: Close greeting banner (pure JS DOM event) ---- */
var closeGreetingBtn = document.getElementById("close-greeting");
if (closeGreetingBtn) {
  closeGreetingBtn.addEventListener("click", function () {
    document.getElementById("greeting-banner").classList.add("hidden");
  });
}

/* ---- JS FEATURE 3: Fetch + Load/Display JSON Data (createElement + appendChild) ----
   Fetches resume.json and dynamically builds and appends project cards to the DOM. */
function buildProjectCard(project) {
  // createElement (JS requirement)
  var card = document.createElement("div");
  card.className = "project-card";
  card.setAttribute("data-type", project.type);

  var typeTag = document.createElement("span");
  typeTag.className = "project-tag-type";
  typeTag.textContent = project.type.toUpperCase();

  var title = document.createElement("h3");
  title.textContent = project.title;

  var desc = document.createElement("p");
  desc.textContent = project.description;

  var stackDiv = document.createElement("div");
  stackDiv.className = "project-stack";
  project.stack.forEach(function (tech) {
    var s = document.createElement("span");
    s.textContent = tech;
    stackDiv.appendChild(s); // appendChild (JS requirement)
  });

  var links = document.createElement("div");
  links.className = "project-links";

  var ghLink = document.createElement("a");
  ghLink.href = project.github;
  ghLink.textContent = "GitHub";
  ghLink.target = "_blank";
  ghLink.rel = "noopener noreferrer";

  var liveLink = document.createElement("a");
  liveLink.href = project.live;
  liveLink.textContent = "Live Demo";
  liveLink.target = "_blank";
  liveLink.rel = "noopener noreferrer";

  links.appendChild(ghLink);
  links.appendChild(liveLink);

  // appendChild chain into card
  card.appendChild(typeTag);
  card.appendChild(title);
  card.appendChild(desc);
  card.appendChild(stackDiv);
  card.appendChild(links);

  return card;
}

function loadProjects() {
  fetch("data/resume.json")
    .then(function (response) {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then(function (data) {
      var mainGrid = document.getElementById("projects-grid");
      var extraGrid = document.getElementById("extra-projects");

      data.projects.forEach(function (project) {
        var card = buildProjectCard(project);

        if (project.extra) {
          extraGrid.appendChild(card); // appendChild (JS requirement)
        } else {
          mainGrid.appendChild(card);
        }
      });
    })
    .catch(function (err) {
      // Fallback: show a message if fetch fails (e.g. opened via file://)
      console.warn("Fetch failed (try a local server). Error:", err);
      loadProjectsFallback();
    });
}

/* Fallback if file:// protocol blocks fetch */
function loadProjectsFallback() {
  var fallback = [
    {
      id: 1,
      title: "ShopEasy E-Commerce Platform",
      description:
        "A full-stack e-commerce web app with product listing, cart, user authentication, and Stripe payment integration.",
      type: "web",
      stack: ["React", "Node.js", "MongoDB"],
      github: "#",
      live: "#",
      extra: false,
    },
    {
      id: 2,
      title: "TaskFlow Project Manager",
      description:
        "A Kanban-style project management tool with drag-and-drop boards and real-time notifications.",
      type: "web",
      stack: ["Vue.js", "Express", "PostgreSQL"],
      github: "#",
      live: "#",
      extra: false,
    },
    {
      id: 3,
      title: "FitTrack Mobile App",
      description:
        "A React Native fitness tracking application with workout logging and custom meal planner.",
      type: "mobile",
      stack: ["React Native", "Firebase"],
      github: "#",
      live: "#",
      extra: false,
    },
    {
      id: 4,
      title: "Bank Dashboard UI Kit",
      description:
        "A comprehensive Figma design system and UI kit for banking applications.",
      type: "ui",
      stack: ["Figma", "Design Tokens"],
      github: "#",
      live: "#",
      extra: false,
    },
    {
      id: 5,
      title: "Weather Forecast PWA",
      description:
        "A progressive web application with real-time weather data and offline capability.",
      type: "web",
      stack: ["HTML5", "CSS3", "JavaScript"],
      github: "#",
      live: "#",
      extra: true,
    },
    {
      id: 6,
      title: "EventHub Event App",
      description:
        "A cross-platform mobile app for discovering local events and booking tickets.",
      type: "mobile",
      stack: ["Flutter", "Firebase"],
      github: "#",
      live: "#",
      extra: true,
    },
  ];

  var mainGrid = document.getElementById("projects-grid");
  var extraGrid = document.getElementById("extra-projects");

  fallback.forEach(function (project) {
    var card = buildProjectCard(project);
    if (project.extra) {
      extraGrid.appendChild(card);
    } else {
      mainGrid.appendChild(card);
    }
  });
}

loadProjects();

/* ---- JS FEATURE 4: Show/Hide Toggle — "View More Projects" button ---- */
var viewMoreBtn = document.getElementById("view-more-btn");
var extraProjects = document.getElementById("extra-projects");
var isExpanded = false;

if (viewMoreBtn) {
  viewMoreBtn.addEventListener("click", function () {
    isExpanded = !isExpanded; // condition (JS requirement)

    if (isExpanded) {
      extraProjects.classList.remove("hidden");
      viewMoreBtn.textContent = "Show Less ▲";
    } else {
      extraProjects.classList.add("hidden");
      viewMoreBtn.textContent = "View More Projects ▼";
    }
  });
}

/* ---- JS FEATURE 5: Contact Form Validation with clear feedback ---- */
var contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // querySelector usage (JS requirement)
    var fnameInput = document.querySelector("#fname");
    var femailInput = document.querySelector("#femail");
    var fmessageInput = document.querySelector("#fmessage");

    var fnameError = document.getElementById("fname-error");
    var femailError = document.getElementById("femail-error");
    var fmessageError = document.getElementById("fmessage-error");
    var successMsg = document.getElementById("form-success");

    var valid = true;

    // Clear previous errors
    [fnameInput, femailInput, fmessageInput].forEach(function (el) {
      el.classList.remove("error");
    });
    fnameError.textContent = "";
    femailError.textContent = "";
    fmessageError.textContent = "";
    successMsg.classList.add("hidden");

    // Validate name
    if (fnameInput.value.trim() === "") {
      fnameError.textContent = "Full name is required.";
      fnameInput.classList.add("error");
      valid = false;
    }

    // Validate email format (condition JS requirement)
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (femailInput.value.trim() === "") {
      femailError.textContent = "Email address is required.";
      femailInput.classList.add("error");
      valid = false;
    } else if (!emailRegex.test(femailInput.value.trim())) {
      femailError.textContent = "Please enter a valid email address.";
      femailInput.classList.add("error");
      valid = false;
    }

    // Validate message
    if (fmessageInput.value.trim() === "") {
      fmessageError.textContent = "Message cannot be empty.";
      fmessageInput.classList.add("error");
      valid = false;
    }

    if (valid) {
      // DOM manipulation: update success message content
      var sendLabel = document.getElementById("send-label");
      sendLabel.textContent = "Sending… ⏳";

      setTimeout(function () {
        successMsg.classList.remove("hidden");
        contactForm.reset();
        sendLabel.textContent = "Send Message ✉️";
      }, 1200);
    }
  });
}

/* ---- JS FEATURE 6: Skill Search / Filter ---- */
var skillSearch = document.getElementById("skill-search");

if (skillSearch) {
  skillSearch.addEventListener("input", function () {
    var query = this.value.toLowerCase().trim();

    // querySelector (JS requirement)
    var allTags = document.querySelectorAll(".skill-tag");

    allTags.forEach(function (tag) {
      var skillName = tag.getAttribute("data-skill").toLowerCase();
      var labelText = tag.textContent.toLowerCase();

      // condition (JS requirement)
      if (
        query === "" ||
        skillName.includes(query) ||
        labelText.includes(query)
      ) {
        tag.classList.remove("dimmed");
      } else {
        tag.classList.add("dimmed");
      }
    });
  });
}

/* ================================================================
   JQUERY SECTION — wrapped in $(document).ready (jQuery requirement)
   ================================================================ */
$(document).ready(function () {
  /* ---- JQUERY FEATURE 1: Dark Mode Toggle ----
     Uses: toggleClass(), text(), attr() */
  $("#dark-mode-toggle").on("click", function () {
    // on('click') — jQuery requirement
    $("body").toggleClass("dark"); // toggleClass() — jQuery method

    var isDark = $("body").hasClass("dark");
    $("#dark-icon").text(isDark ? "☀️" : "🌙"); // text() — jQuery method
    $(this).attr(
      "title",
      isDark // attr() — jQuery method
        ? "Switch to light mode"
        : "Toggle dark mode",
    );
  });

  /* ---- JQUERY FEATURE 2: Hire Me Popup ----
     Uses: show(), hide(), on('click'), addClass(), removeClass() */
  $("#hire-me-btn").on("click", function (e) {
    // on('click') — jQuery requirement
    e.preventDefault();
    $("#hire-popup").removeClass("hidden").show(); // removeClass() + show() — jQuery methods
    $("#hire-overlay").removeClass("hidden").show();
  });

  function closeHirePopup() {
    $("#hire-popup").hide().addClass("hidden"); // hide() + addClass() — jQuery methods
    $("#hire-overlay").hide().addClass("hidden");
  }

  $("#close-hire-popup").on("click", closeHirePopup);
  $("#hire-overlay").on("click", closeHirePopup);

  $("#popup-contact-link").on("click", function () {
    closeHirePopup();
  });

  /* ---- JQUERY FEATURE 3: Animated Skill Bars ----
     Uses: show(), hide(), toggle(), addClass() */
  $("#show-skill-bars").on("click", function () {
    // on('click') — jQuery requirement
    var $bars = $("#skill-bars");
    var $btn = $(this);

    $bars.toggle(); // toggle() — jQuery method

    // Animate fills when shown
    if ($bars.is(":visible")) {
      $btn.text("📊 Hide Skill Levels");
      $(".skill-bar-fill").each(function () {
        var targetWidth = $(this).data("width") + "%";
        $(this).css("width", targetWidth); // triggers CSS transition
      });
    } else {
      $btn.text("📊 Show Skill Levels");
      $(".skill-bar-fill").css("width", "0");
    }
  });

  /* ---- JQUERY FEATURE 4: Project Filter Buttons ----
     Uses: on('click'), addClass(), removeClass(), show(), hide() */
  $(document).on("click", ".filter-btn", function () {
    // on('click') — jQuery requirement
    var filter = $(this).data("filter");

    // Update active state
    $(".filter-btn").removeClass("active"); // removeClass() — jQuery method
    $(this).addClass("active"); // addClass() — jQuery method

    // Filter cards
    if (filter === "all") {
      $(".project-card").removeClass("filtered-out");
    } else {
      $(".project-card").each(function () {
        var cardType = $(this).data("type");
        if (cardType === filter) {
          $(this).removeClass("filtered-out");
        } else {
          $(this).addClass("filtered-out");
        }
      });
    }
  });

  /* ---- JQUERY FEATURE 5: Nav link highlight on click ----
     Uses: on('click'), addClass(), removeClass() */
  $(".nav-links a").on("click", function () {
    // on('click') — jQuery requirement
    $(".nav-links a").removeClass("nav-active"); // removeClass() — jQuery method
    $(this).addClass("nav-active"); // addClass() — jQuery method
  });

  /* ---- JQUERY FEATURE 6: Append greeting to hero on banner close ----
     Uses: on('click'), append(), html() */
  $("#close-greeting").on("click", function () {
    // on('click') — jQuery requirement
    var visitorName = $("#greeting-text").html(); // html() — jQuery method
    // Extract first name if greeting text was set
    var match = visitorName.match(/Hello, ([^!]+)!/);
    if (match) {
      var visName = match[1];
      // Append a small welcome note to the hero section
      var note = $("<p>")
        .addClass("hero-label")
        .css({ "margin-top": "8px", color: "var(--clr-accent)" })
        .text("👀 " + visName + " is viewing this resume");

      // Only append once
      if ($("#visitor-note").length === 0) {
        note.attr("id", "visitor-note");
        $(".hero-badges").after(note); // jQuery DOM append
      }
    }
  });
}); // end $(document).ready
