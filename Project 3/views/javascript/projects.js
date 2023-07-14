let isMoving = false;
let isClicking = false;
let isIn = false;

const projects = [...document.getElementsByClassName("project")];
const deskTop = document.getElementById("desktop");

const projectMovementMechanic = (e) => {
  const pointerX = e.clientX;
  const pointerY = e.clientY;
  if (
    isMoving == true &&
    isClicking == true &&
    projects.some((i) => i == e.target)
  ) {
    e.target.style.left = `${pointerX - e.target.offsetWidth / 2}px`;
    e.target.style.top = `${pointerY - e.target.offsetHeight / 2}px`;

    // e.target.style.left = `${e.target.offsetLeft + e.mouseMove}px`;
    // e.target.style.top = `${pointerY - e.target.offsetHeight / 2}px`;
  }
};

// Projects Event Listeners
projects.forEach((prj) => {
  prj.addEventListener("mousedown", (e) => {
    isClicking = true;
    e.preventDefault();
    projectMovementMechanic(e);
  });
  prj.addEventListener("mouseenter", () => {
    isIn = true;
  });
  prj.addEventListener("mouseleave", () => {
    isIn = false;
  });
  prj.addEventListener("dblclick", (e) => {
    const browser = document.getElementById("browser");
    browser.style.display = "flex";
  });
  prj.addEventListener("contextmenu", (e) => {
    const options = document.getElementById("options");
    options.style.display = "flex";
    if (e.target.offsetLeft <= window.innerWidth / 2) {
      options.style.left = `${e.target.offsetLeft + e.target.offsetWidth}px`;
    } else {
      options.style.left = `${e.target.offsetLeft - options.offsetWidth}px`;
    }
    if (e.target.offsetTop <= window.innerHeight / 2) {
      options.style.top = `${e.target.offsetTop}px`;
    } else {
      options.style.top = `${
        e.target.offsetTop + e.target.offsetWidth - options.offsetHeight
      }px`;
    }
  });
});

//Window Event Listener

window.addEventListener("mousemove", (e) => {
  isMoving = true;

  projectMovementMechanic(e);
});

window.addEventListener("mouseup", (e) => {
  isClicking = false;
});

window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

window.addEventListener("mousedown", (e) => {
  const options = document.getElementById("options");
  if (e.target != options && e.target.parentElement != options) {
    options.style.display = "none";
  }
});

//Options Event Adjustments
const openOption = document.getElementById("open");
openOption.addEventListener("click", (e) => {
  const browser = document.getElementById("browser");
  browser.style.display = "flex";
});

//Browser - Close Button Event Listener
const closeButton = document.getElementById("close");

closeButton.addEventListener("click", (e) => {
  const browser = document.getElementById("browser");
  browser.style.display = "none";
});

//Browser - Link Event Listeners
const link = document.getElementById("link");
link.addEventListener("focus", (e) => {
  e.target.select();
});

//---- Loading Screen ------
const projectViewsAnimation = () => {
  const loading = document.getElementsByClassName("loading")[0];

  const duration = parseFloat(
    window.getComputedStyle(loading).getPropertyValue("animation-duration")
  );

  const welcome = document.getElementById("welcome");

  welcomeLetters = welcome.textContent.split("");
  welcome.textContent = "";

  setTimeout(() => {
    welcomingAnimation();
  }, duration * 1000);

  let counter = 0;
  const welcomingAnimation = () => {
    const interval = setInterval(() => {
      if (counter < welcomeLetters.length) {
        const span = document.createElement("span");
        span.textContent = welcomeLetters[counter];
        if (welcomeLetters[counter] == "" || welcomeLetters[counter] == " ") {
          span.classList.add("space");
        }
        span.classList.add("letter");
        welcome.appendChild(span);
        // welcome.textContent += welcomeLetters[counter];
        counter++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          document.getElementById("loadingScreen").style.display = "none";
        }, 1500);
      }
    }, 120);
  };
};

// projectViewsAnimation();
