import {
  querySelectorAllDeep,
  querySelectorDeep,
} from "query-selector-shadow-dom";

let isRunning = false;
let focusList = [];
let focusIndex = 0;

const mappings = {
  a: "link",
  button: "button",
  h1: "heading",
  h2: "heading",
  h3: "heading",
  h4: "heading",
  h5: "heading",
  p: "paragraph",
  html: "page",
  img: "image",
};

let storyDocument;

function computeAccessibleName(element) {
  const content = element.textContent.trim();

  if (element.getAttribute("aria-label")) {
    return element.getAttribute("aria-label");
  } else if (element.getAttribute("alt")) {
    return element.getAttribute("alt");
  }

  return content;
}

const announcers = {
  page(element) {
    const title = element.querySelector("title").textContent;

    say(`Page ${title}`);
  },

  link(element) {
    say(
      `Link, ${computeAccessibleName(
        element
      )}. To follow the link, press Enter key.`
    );
  },

  button(element) {
    say(
      `Button, ${computeAccessibleName(
        element
      )}. To press the button, press Space key.`
    );
  },

  heading(element) {
    const level = element.getAttribute("aria-level") || element.tagName[1];

    say(`Heading level ${level}, ${computeAccessibleName(element)}`);
  },

  paragraph(element) {
    say(element.textContent);
  },

  image(element) {
    say(`Image, ${computeAccessibleName(element)}`);
  },

  default(element) {
    say(`${element.tagName} element: ${computeAccessibleName(element)}`);
  },
};

function addStyles() {
  const styleElement = storyDocument.createElement("style");

  styleElement.textContent = `[tabindex="-1"] {
			outline: none;;
		}
		[data-sr-current] {
			outline: 5px rgba( 0, 0, 0, .7 ) solid !important;
		}
		html[data-sr-current] {
			outline-offset: -5px;
		}`;

  storyDocument.head.appendChild(styleElement);
}

function say(speech, callback) {
  const text = new SpeechSynthesisUtterance(speech);

  if (callback) {
    text.onend = callback;
  }

  speechSynthesis.cancel();
  speechSynthesis.speak(text);
  dispatchTextChanged(speech) 
}

function dispatchTextChanged(text) {
    var evt = new CustomEvent('screen-reader-text-changed', { detail: { text } });
    window.dispatchEvent(evt);
}

function computeRole(element) {
  const name = element.tagName.toLowerCase();

  if (element.getAttribute("role")) {
    return element.getAttribute("role");
  }

  return mappings[name] || "default";
}

function announceElement(element) {
  const role = computeRole(element);

  if (announcers[role]) {
    announcers[role](element);
  } else {
    announcers.default(element);
  }
}

function isReadableElement(element) {
  const styles = getComputedStyle(element);
  if (styles.visibility === "hidden" || styles.display === "none") {
    return false;
  }

  if (hasDirectText(element)) {
    return true;
  }

//   focusable custom elements
  if (element.tabIndex !== -1) {
    return true;
  }

  console.log(element.focus, element);
  return false;
}

// Returns true if the element has a non-empty text outside of it's children
function hasDirectText(node) {
  const text = [].reduce.call(
    node.childNodes,
    function (a, b) {
      return a + (b.nodeType === 3 ? b.textContent : "");
    },
    ""
  );
  return !!text.trim();
}

function createFocusList() {
  // console.log(querySelectorAllDeep("html, body >:not( [aria-hidden=true] )", storyDocument))
  // debugger;
  focusList.push(
    ...querySelectorAllDeep(
      "body, #root >:not( [aria-hidden=true] )",
      storyDocument
    )
  );
  focusList = focusList.filter((element) => {
    return isReadableElement(element);
  });

  focusList.forEach((element) => {
    element.setAttribute("tabindex", element.tabIndex);
  });
}

function getActiveElement() {
  //   debugger;
  //   if (
  //     storyDocument.activeElement &&
  //     storyDocument.activeElement !== storyDocument.body
  //   ) {
  //     return storyDocument.activeElement;
  //   }
  return focusList[0];
}

function focus(element) {
  if (element === storyDocument.body) {
    element = storyDocument.documentElement;
  }

  element.setAttribute("data-sr-current", true);
  element.focus();

  announceElement(element);
}

function moveFocus(offset) {
  const last = querySelectorDeep("[data-sr-current]", storyDocument);

  if (last) {
    last.removeAttribute("data-sr-current");
  }

  if (typeof offset !== "number") {
    focusIndex = focusList.findIndex((element) => {
      return element === offset;
    });

    return focus(offset);
  }

  focusIndex = focusIndex + offset;

  if (focusIndex < 0) {
    focusIndex = focusList.length - 1;
  } else if (focusIndex > focusList.length - 1) {
    focusIndex = 0;
  }

  focus(focusList[focusIndex]);
}

function start() {
  storyDocument = document.querySelector("iframe").contentWindow.document;

  addStyles();
  createFocusList();

  storyDocument.addEventListener("keydown", keyDownHandler);

  say("Screen reader on", () => {
    moveFocus(getActiveElement());

    isRunning = true;
  });
}

function stop() {
  const current = querySelectorDeep("[data-sr-current]", storyDocument);

  if (current) {
    current.removeAttribute("data-sr-current");
  }

  focusIndex = 0;
  isRunning = false;

  say("Screen reader off");
}

function keyDownHandler(evt) {
  if (!isRunning) {
    return false;
  }

  if (evt.altKey && evt.keyCode === 9) {
    evt.preventDefault();

    moveFocus(evt.shiftKey ? -1 : 1);
  } else if (evt.keyCode === 9) {
    setTimeout(() => {
      moveFocus(storyDocument.activeElement);
    }, 0);
  }
}

export { start, stop };
