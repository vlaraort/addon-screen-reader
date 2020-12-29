import { querySelectorAllDeep, querySelectorDeep } from 'query-selector-shadow-dom';

function computeAccessibleName(element) {
  const content = element.textContent.trim();

  if (element.getAttribute('aria-label')) {
    return element.getAttribute('aria-label');
  }
  if (element.getAttribute('alt')) {
    return element.getAttribute('alt');
  }

  return content;
}

function dispatchTextChanged(text) {
  const evt = new CustomEvent('screen-reader-text-changed', {
    detail: { text },
  });
  window.dispatchEvent(evt);
}

export default class ScreenReader {
  constructor() {
    this.isRunning = false;
    this.focusList = [];
    this.focusIndex = 0;
    this.voiceEnabled = false;
    this.textEnabled = false;

    this.mappings = {
      a: 'link',
      button: 'button',
      h1: 'heading',
      h2: 'heading',
      h3: 'heading',
      h4: 'heading',
      h5: 'heading',
      p: 'paragraph',
      html: 'page',
      img: 'image',
    };

    this.storyDocument = {};
  }

  generateAnnouncers() {
    this.announcers = {
      page(element) {
        const title = element.querySelector('title').textContent;

        this.say(`Page ${title}`);
      },

      link(element) {
        this.say(`Link, ${computeAccessibleName(element)}. To follow the link, press Enter key.`);
      },

      button(element) {
        this.say(
          `Button, ${computeAccessibleName(element)}. To press the button, press Space key.`,
        );
      },

      heading(element) {
        const level = element.getAttribute('aria-level') || element.tagName[1];

        this.say(`Heading level ${level}, ${computeAccessibleName(element)}`);
      },

      paragraph(element) {
        this.say(element.textContent);
      },

      image(element) {
        this.say(`Image, ${computeAccessibleName(element)}`);
      },

      default(element) {
        this.say(`${element.tagName} element: ${computeAccessibleName(element)}`);
      },
    };
  }

  addStyles() {
    const styleElement = this.storyDocument.createElement('style');

    styleElement.textContent = `[tabindex="-1"] {
                  outline: none;;
              }
              [data-sr-current] {
                  outline: 5px rgba( 0, 0, 0, .7 ) solid !important;
              }
              html[data-sr-current] {
                  outline-offset: -5px;
              }`;

    this.storyDocument.head.appendChild(styleElement);
  }

  say(speech, callback) {
    if (this.voiceEnabled) {
      const text = new SpeechSynthesisUtterance(speech);

      if (callback) {
        text.onend = callback;
      }

      speechSynthesis.cancel();
      speechSynthesis.speak(text);
    }
    if (this.textEnabled) {
      dispatchTextChanged(speech);
    }
  }

  computeRole(element) {
    const name = element.tagName.toLowerCase();

    if (element.getAttribute('role')) {
      return element.getAttribute('role');
    }

    return this.mappings[name] || 'default';
  }

  announceElement(element) {
    const role = this.computeRole(element);
    if (this.announcers[role]) {
      this.announcers[role].call(this, element);
    } else {
      this.announcers.default.call(this, element);
    }
  }

  isReadableElement(element) {
    const styles = getComputedStyle(element);
    if (styles.visibility === 'hidden' || styles.display === 'none') {
      return false;
    }

    if (this.hasDirectText(element)) {
      return true;
    }

    //   focusable custom elements
    if (element.tabIndex !== -1) {
      return true;
    }

    return false;
  }

  // Returns true if the element has a non-empty text outside of it's children
  // eslint-disable-next-line class-methods-use-this
  hasDirectText(node) {
    const text = [].reduce.call(
      node.childNodes,
      (a, b) => a + (b.nodeType === 3 ? b.textContent : ''),
      '',
    );
    return !!text.trim();
  }

  createFocusList() {
    this.focusList.push(
      ...querySelectorAllDeep('body, #root >:not( [aria-hidden=true] )', this.storyDocument),
    );
    this.focusList = this.focusList.filter(element => this.isReadableElement(element));

    this.focusList.forEach(element => {
      element.setAttribute('tabindex', element.tabIndex);
    });
  }

  getActiveElement() {
    return this.focusList[0];
  }

  focus(element) {
    element.setAttribute('data-sr-current', true);
    element.focus();

    this.announceElement(element);
  }

  moveFocus(offset) {
    const last = querySelectorDeep('[data-sr-current]', this.storyDocument);

    if (last) {
      last.removeAttribute('data-sr-current');
    }

    if (typeof offset !== 'number') {
      this.focusIndex = this.focusList.findIndex(element => element === offset);

      return this.focus(offset);
    }

    this.focusIndex += offset;

    if (this.focusIndex < 0) {
      this.focusIndex = this.focusList.length - 1;
    } else if (this.focusIndex > this.focusList.length - 1) {
      this.focusIndex = 0;
    }

    return this.focus(this.focusList[this.focusIndex]);
  }

  start() {
    this.storyDocument = document.querySelector('iframe').contentWindow.document;

    this.addStyles();
    this.generateAnnouncers();
    this.createFocusList();

    this.storyDocument.addEventListener('keydown', this.keyDownHandler.bind(this));
    this.moveFocus(this.getActiveElement());

    this.isRunning = true;
    this.say('Screen reader on');
  }

  stop() {
    const current = querySelectorDeep('[data-sr-current]', this.storyDocument);

    if (current) {
      current.removeAttribute('data-sr-current');
    }

    this.focusIndex = 0;
    this.isRunning = false;

    this.say('Screen reader off');
  }

  keyDownHandler(evt) {
    if (!this.isRunning) {
      return undefined;
    }

    if (evt.altKey && evt.keyCode === 9) {
      evt.preventDefault();

      this.moveFocus(evt.shiftKey ? -1 : 1);
    } else if (evt.keyCode === 9) {
      setTimeout(() => {
        this.moveFocus(this.storyDocument.activeElement);
      }, 0);
    }
  }
}
