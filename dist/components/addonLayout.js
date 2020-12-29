"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _screenReader = _interopRequireDefault(require("../screen-reader/screenReader.js"));

var _reactToggleComponent = require("react-toggle-component");

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  font-size: 18px;\n  border-radius: 10px;\n  border: 2px solid blue;\n  padding: 10px;\n  margin: 16px 8px;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  display: grid;\n  grid-auto-flow: column;\n  grid-auto-columns: min-content;\n  white-space: nowrap;\n  align-items: center;\n  cursor: pointer;\n  margin: 16px 8px;\n  font-size: 18px;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Label = _styledComponents["default"].label(_templateObject());

var TextContent = _styledComponents["default"].p(_templateObject2());

var AddonLayout = /*#__PURE__*/function (_Component) {
  _inherits(AddonLayout, _Component);

  var _super = _createSuper(AddonLayout);

  function AddonLayout(props) {
    var _this;

    _classCallCheck(this, AddonLayout);

    _this = _super.call(this, props);
    _this.state = {
      enabledScreenReader: props.enabledScreenReader ? props.enabledScreenReader : false,
      screenReaderText: "",
      voice: false,
      text: false,
      screenReaderStatus: false
    };
    _this.handleCheckboxChange = _this.handleCheckboxChange.bind(_assertThisInitialized(_this));
    _this.handleTextToggleChange = _this.handleTextToggleChange.bind(_assertThisInitialized(_this));
    _this.handleVoiceToggleChange = _this.handleVoiceToggleChange.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(AddonLayout, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      window.addEventListener("screen-reader-text-changed", this.handleTextChange.bind(this));
      this.storybookIframe = document.getElementById("storybook-preview-iframe");
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener("screen-reader-text-changed", this.handleTextChange);
    }
  }, {
    key: "handleTextChange",
    value: function handleTextChange(evt) {
      var text = evt.detail.text;
      this.setState({
        screenReaderText: text
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(Label, {
        htmlFor: "toggle-voice"
      }, /*#__PURE__*/_react["default"].createElement(_reactToggleComponent.Toggle, {
        name: "toggle-voice",
        onToggle: this.handleVoiceToggleChange
      }), "Voice Reader"), /*#__PURE__*/_react["default"].createElement(Label, {
        htmlFor: "toggle-text"
      }, /*#__PURE__*/_react["default"].createElement(_reactToggleComponent.Toggle, {
        name: "toggle-text",
        onToggle: this.handleTextToggleChange
      }), "Text Reader"), /*#__PURE__*/_react["default"].createElement(TextContent, {
        hidden: !this.state.text
      }, this.state.screenReaderText));
    }
  }, {
    key: "handleCheckboxChange",
    value: function handleCheckboxChange() {
      this.setState({
        enabledScreenReader: !this.state.enabledScreenReader
      });
      start();
    }
  }, {
    key: "handleVoiceToggleChange",
    value: function () {
      var _handleVoiceToggleChange = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ev) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.setState({
                  voice: ev.currentTarget.checked
                });

              case 2:
                this.updateReaderStatus();

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function handleVoiceToggleChange(_x) {
        return _handleVoiceToggleChange.apply(this, arguments);
      }

      return handleVoiceToggleChange;
    }()
  }, {
    key: "handleTextToggleChange",
    value: function () {
      var _handleTextToggleChange = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ev) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.setState({
                  text: ev.currentTarget.checked
                });

              case 2:
                this.updateReaderStatus();

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function handleTextToggleChange(_x2) {
        return _handleTextToggleChange.apply(this, arguments);
      }

      return handleTextToggleChange;
    }()
  }, {
    key: "updateReaderOutput",
    value: function () {
      var _updateReaderOutput = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                // if (this.state.screenReaderStatus) {
                this.screenReader.voiceEnabled = this.state.voice;
                this.screenReader.textEnabled = this.state.text; //     debugger;
                // }

              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function updateReaderOutput() {
        return _updateReaderOutput.apply(this, arguments);
      }

      return updateReaderOutput;
    }()
  }, {
    key: "updateReaderStatus",
    value: function () {
      var _updateReaderStatus = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(!this.state.screenReaderStatus && (this.state.voice || this.state.text))) {
                  _context4.next = 8;
                  break;
                }

                _context4.next = 3;
                return this.setState({
                  screenReaderStatus: true
                });

              case 3:
                this.screenReader = new _screenReader["default"]();
                this.updateReaderOutput();
                this.screenReader.start();
                _context4.next = 16;
                break;

              case 8:
                if (!( // Stop reader
                this.state.screenReaderStatus && !this.state.voice && !this.state.text)) {
                  _context4.next = 15;
                  break;
                }

                _context4.next = 11;
                return this.setState({
                  screenReaderStatus: false
                });

              case 11:
                this.screenReader = null; //   As we mutate the of the story, the safest way to stop is to rerender everything again;

                this.storybookIframe.contentWindow.location.reload();
                _context4.next = 16;
                break;

              case 15:
                this.updateReaderOutput();

              case 16:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function updateReaderStatus() {
        return _updateReaderStatus.apply(this, arguments);
      }

      return updateReaderStatus;
    }()
  }]);

  return AddonLayout;
}(_react.Component);

exports["default"] = AddonLayout;