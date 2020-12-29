"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _querySelectorShadowDom = require("query-selector-shadow-dom");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ScreenReader = /*#__PURE__*/function () {
  function ScreenReader() {
    _classCallCheck(this, ScreenReader);

    this.isRunning = false;
    this.focusList = [];
    this.focusIndex = 0;
    this.voiceEnabled = false;
    this.textEnabled = false;
    this.mappings = {
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
    this.storyDocument;
  }

  _createClass(ScreenReader, [{
    key: "generateAnnouncers",
    value: function generateAnnouncers() {
      this.announcers = {
        page: function page(element) {
          var title = element.querySelector("title").textContent;
          this.say("Page ".concat(title));
        },
        link: function link(element) {
          this.say("Link, ".concat(this.computeAccessibleName(element), ". To follow the link, press Enter key."));
        },
        button: function button(element) {
          this.say("Button, ".concat(this.computeAccessibleName(element), ". To press the button, press Space key."));
        },
        heading: function heading(element) {
          var level = element.getAttribute("aria-level") || element.tagName[1];
          this.say("Heading level ".concat(level, ", ").concat(this.computeAccessibleName(element)));
        },
        paragraph: function paragraph(element) {
          this.say(element.textContent);
        },
        image: function image(element) {
          this.say("Image, ".concat(this.computeAccessibleName(element)));
        },
        "default": function _default(element) {
          this.say("".concat(element.tagName, " element: ").concat(this.computeAccessibleName(element)));
        }
      };
    }
  }, {
    key: "computeAccessibleName",
    value: function computeAccessibleName(element) {
      var content = element.textContent.trim();

      if (element.getAttribute("aria-label")) {
        return element.getAttribute("aria-label");
      } else if (element.getAttribute("alt")) {
        return element.getAttribute("alt");
      }

      return content;
    }
  }, {
    key: "addStyles",
    value: function addStyles() {
      var styleElement = this.storyDocument.createElement("style");
      styleElement.textContent = "[tabindex=\"-1\"] {\n                  outline: none;;\n              }\n              [data-sr-current] {\n                  outline: 5px rgba( 0, 0, 0, .7 ) solid !important;\n              }\n              html[data-sr-current] {\n                  outline-offset: -5px;\n              }";
      this.storyDocument.head.appendChild(styleElement);
    }
  }, {
    key: "say",
    value: function say(speech, callback) {
      debugger;

      if (this.voiceEnabled) {
        var text = new SpeechSynthesisUtterance(speech);

        if (callback) {
          text.onend = callback;
        }

        speechSynthesis.cancel();
        speechSynthesis.speak(text);
      }

      if (this.textEnabled) {
        this.dispatchTextChanged(speech);
      }
    }
  }, {
    key: "dispatchTextChanged",
    value: function dispatchTextChanged(text) {
      var evt = new CustomEvent("screen-reader-text-changed", {
        detail: {
          text: text
        }
      });
      window.dispatchEvent(evt);
    }
  }, {
    key: "computeRole",
    value: function computeRole(element) {
      var name = element.tagName.toLowerCase();

      if (element.getAttribute("role")) {
        return element.getAttribute("role");
      }

      return this.mappings[name] || "default";
    }
  }, {
    key: "announceElement",
    value: function announceElement(element) {
      var role = this.computeRole(element);

      if (this.announcers[role]) {
        this.announcers[role].call(this, element);
      } else {
        this.announcers["default"].call(this, element);
      }
    }
  }, {
    key: "isReadableElement",
    value: function isReadableElement(element) {
      var styles = getComputedStyle(element);

      if (styles.visibility === "hidden" || styles.display === "none") {
        return false;
      }

      if (this.hasDirectText(element)) {
        return true;
      } //   focusable custom elements


      if (element.tabIndex !== -1) {
        return true;
      }

      return false;
    } // Returns true if the element has a non-empty text outside of it's children

  }, {
    key: "hasDirectText",
    value: function hasDirectText(node) {
      var text = [].reduce.call(node.childNodes, function (a, b) {
        return a + (b.nodeType === 3 ? b.textContent : "");
      }, "");
      return !!text.trim();
    }
  }, {
    key: "createFocusList",
    value: function createFocusList() {
      var _this$focusList,
          _this = this;

      (_this$focusList = this.focusList).push.apply(_this$focusList, _toConsumableArray((0, _querySelectorShadowDom.querySelectorAllDeep)("body, #root >:not( [aria-hidden=true] )", this.storyDocument)));

      this.focusList = this.focusList.filter(function (element) {
        return _this.isReadableElement(element);
      });
      this.focusList.forEach(function (element) {
        element.setAttribute("tabindex", element.tabIndex);
      });
    }
  }, {
    key: "getActiveElement",
    value: function getActiveElement() {
      //   debugger;
      //   if (
      //     storyDocument.activeElement &&
      //     storyDocument.activeElement !== storyDocument.body
      //   ) {
      //     return storyDocument.activeElement;
      //   }
      return this.focusList[0];
    }
  }, {
    key: "focus",
    value: function focus(element) {
      if (element === this.storyDocument.body) {
        element = this.storyDocument.documentElement;
      }

      element.setAttribute("data-sr-current", true);
      element.focus();
      this.announceElement(element);
    }
  }, {
    key: "moveFocus",
    value: function moveFocus(offset) {
      var last = (0, _querySelectorShadowDom.querySelectorDeep)("[data-sr-current]", this.storyDocument);

      if (last) {
        last.removeAttribute("data-sr-current");
      }

      if (typeof offset !== "number") {
        this.focusIndex = this.focusList.findIndex(function (element) {
          return element === offset;
        });
        return this.focus(offset);
      }

      this.focusIndex = this.focusIndex + offset;

      if (this.focusIndex < 0) {
        this.focusIndex = this.focusList.length - 1;
      } else if (this.focusIndex > this.focusList.length - 1) {
        this.focusIndex = 0;
      }

      this.focus(this.focusList[this.focusIndex]);
    }
  }, {
    key: "start",
    value: function start() {
      this.storyDocument = document.querySelector("iframe").contentWindow.document;
      this.addStyles();
      this.generateAnnouncers();
      this.createFocusList();
      this.storyDocument.addEventListener("keydown", this.keyDownHandler.bind(this));
      this.moveFocus(this.getActiveElement());
      this.isRunning = true;
      this.say("Screen reader on");
    }
  }, {
    key: "stop",
    value: function stop() {
      var current = (0, _querySelectorShadowDom.querySelectorDeep)("[data-sr-current]", this.storyDocument);

      if (current) {
        current.removeAttribute("data-sr-current");
      }

      this.focusIndex = 0;
      this.isRunning = false;
      this.say("Screen reader off");
    }
  }, {
    key: "keyDownHandler",
    value: function keyDownHandler(evt) {
      var _this2 = this;

      console.log('keyDownHandler');
      debugger;

      if (!this.isRunning) {
        return false;
      }

      if (evt.altKey && evt.keyCode === 9) {
        evt.preventDefault();
        this.moveFocus(evt.shiftKey ? -1 : 1);
      } else if (evt.keyCode === 9) {
        setTimeout(function () {
          _this2.moveFocus(_this2.storyDocument.activeElement);
        }, 0);
      }
    }
  }]);

  return ScreenReader;
}();

exports["default"] = ScreenReader;