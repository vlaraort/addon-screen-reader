"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = start;
exports.stop = stop;

var _querySelectorShadowDom = require("query-selector-shadow-dom");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var isRunning = false;
var focusList = [];
var focusIndex = 0;
var mappings = {
  a: "link",
  button: "button",
  h1: "heading",
  h2: "heading",
  h3: "heading",
  h4: "heading",
  h5: "heading",
  p: "paragraph",
  html: "page",
  img: "image"
};
var storyDocument;

function computeAccessibleName(element) {
  var content = element.textContent.trim();

  if (element.getAttribute("aria-label")) {
    return element.getAttribute("aria-label");
  } else if (element.getAttribute("alt")) {
    return element.getAttribute("alt");
  }

  return content;
}

var announcers = {
  page: function page(element) {
    var title = element.querySelector("title").textContent;
    say("Page ".concat(title));
  },
  link: function link(element) {
    say("Link, ".concat(computeAccessibleName(element), ". To follow the link, press Enter key."));
  },
  button: function button(element) {
    say("Button, ".concat(computeAccessibleName(element), ". To press the button, press Space key."));
  },
  heading: function heading(element) {
    var level = element.getAttribute("aria-level") || element.tagName[1];
    say("Heading level ".concat(level, ", ").concat(computeAccessibleName(element)));
  },
  paragraph: function paragraph(element) {
    say(element.textContent);
  },
  image: function image(element) {
    say("Image, ".concat(computeAccessibleName(element)));
  },
  "default": function _default(element) {
    say("".concat(element.tagName, " element: ").concat(computeAccessibleName(element)));
  }
};

function addStyles() {
  var styleElement = storyDocument.createElement("style");
  styleElement.textContent = "[tabindex=\"-1\"] {\n\t\t\toutline: none;;\n\t\t}\n\t\t[data-sr-current] {\n\t\t\toutline: 5px rgba( 0, 0, 0, .7 ) solid !important;\n\t\t}\n\t\thtml[data-sr-current] {\n\t\t\toutline-offset: -5px;\n\t\t}";
  storyDocument.head.appendChild(styleElement);
}

function say(speech, callback) {
  var text = new SpeechSynthesisUtterance(speech);

  if (callback) {
    text.onend = callback;
  }

  speechSynthesis.cancel();
  speechSynthesis.speak(text);
  dispatchTextChanged(speech);
}

function dispatchTextChanged(text) {
  var evt = new CustomEvent('screen-reader-text-changed', {
    detail: {
      text: text
    }
  });
  window.dispatchEvent(evt);
}

function computeRole(element) {
  var name = element.tagName.toLowerCase();

  if (element.getAttribute("role")) {
    return element.getAttribute("role");
  }

  return mappings[name] || "default";
}

function announceElement(element) {
  var role = computeRole(element);

  if (announcers[role]) {
    announcers[role](element);
  } else {
    announcers["default"](element);
  }
}

function isReadableElement(element) {
  var styles = getComputedStyle(element);

  if (styles.visibility === "hidden" || styles.display === "none") {
    return false;
  }

  if (hasDirectText(element)) {
    return true;
  } //   focusable custom elements


  if (element.tabIndex !== -1) {
    return true;
  }

  console.log(element.focus, element);
  return false;
} // Returns true if the element has a non-empty text outside of it's children


function hasDirectText(node) {
  var text = [].reduce.call(node.childNodes, function (a, b) {
    return a + (b.nodeType === 3 ? b.textContent : "");
  }, "");
  return !!text.trim();
}

function createFocusList() {
  var _focusList;

  // console.log(querySelectorAllDeep("html, body >:not( [aria-hidden=true] )", storyDocument))
  // debugger;
  (_focusList = focusList).push.apply(_focusList, _toConsumableArray((0, _querySelectorShadowDom.querySelectorAllDeep)("body, #root >:not( [aria-hidden=true] )", storyDocument)));

  focusList = focusList.filter(function (element) {
    return isReadableElement(element);
  });
  focusList.forEach(function (element) {
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
  var last = (0, _querySelectorShadowDom.querySelectorDeep)("[data-sr-current]", storyDocument);

  if (last) {
    last.removeAttribute("data-sr-current");
  }

  if (typeof offset !== "number") {
    focusIndex = focusList.findIndex(function (element) {
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
  say("Screen reader on", function () {
    moveFocus(getActiveElement());
    isRunning = true;
  });
}

function stop() {
  var current = (0, _querySelectorShadowDom.querySelectorDeep)("[data-sr-current]", storyDocument);

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
    setTimeout(function () {
      moveFocus(storyDocument.activeElement);
    }, 0);
  }
}