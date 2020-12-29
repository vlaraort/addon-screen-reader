"use strict";

var _react = _interopRequireDefault(require("react"));

var _addons = require("@storybook/addons");

var _components = require("@storybook/components");

var _addonLayout = _interopRequireDefault(require("./components/addonLayout.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ADDON_ID = "screenreader";
var PANEL_ID = "".concat(ADDON_ID, "/panel");

_addons.addons.register(ADDON_ID, function (api) {
  _addons.addons.add(PANEL_ID, {
    type: _addons.types.PANEL,
    title: "Screen Reader",
    render: function render(_ref) {
      var active = _ref.active,
          key = _ref.key;
      return /*#__PURE__*/_react["default"].createElement(_components.AddonPanel, {
        active: active,
        key: key
      }, /*#__PURE__*/_react["default"].createElement(_addonLayout["default"], null));
    }
  });
});