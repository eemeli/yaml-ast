"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Node2 = _interopRequireDefault(require("./Node"));

var _Range = _interopRequireDefault(require("./Range"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return _get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PlainValue =
/*#__PURE__*/
function (_Node) {
  _inherits(PlainValue, _Node);

  function PlainValue() {
    _classCallCheck(this, PlainValue);

    return _possibleConstructorReturn(this, (PlainValue.__proto__ || Object.getPrototypeOf(PlainValue)).apply(this, arguments));
  }

  _createClass(PlainValue, [{
    key: "parseBlockValue",
    value: function parseBlockValue(start) {
      var _context = this.context,
          indent = _context.indent,
          inFlow = _context.inFlow,
          src = _context.src;
      var offset = start;

      for (var ch = src[offset]; ch === '\n'; ch = src[offset]) {
        offset += 1;
        if (_Node2.default.atDocumentBoundary(src, offset)) break;

        var end = _Node2.default.endOfBlockIndent(src, indent, offset);

        if (end === null) break;
        offset = PlainValue.endOfLine(src, end, inFlow);
      }

      if (this.valueRange.isEmpty) this.valueRange.start = start;
      this.valueRange.end = offset;
      return offset;
    }
    /**
     * Parses a plain value from the source
     *
     * Accepted forms are:
     * ```
     * #comment
     *
     * first line
     *
     * first line #comment
     *
     * first line
     * block
     * lines
     *
     * #comment
     * block
     * lines
     * ```
     * where block lines are empty or have an indent level greater than `indent`.
     *
     * @param {ParseContext} context
     * @param {number} start - Index of first character
     * @returns {number} - Index of the character after this scalar, may be `\n`
     */

  }, {
    key: "parse",
    value: function parse(context, start) {
      this.context = context;
      var inFlow = context.inFlow,
          src = context.src;
      var offset = start;
      var ch = src[offset];

      if (ch && ch !== '#' && ch !== '\n') {
        offset = PlainValue.endOfLine(src, start, inFlow);
      }

      this.valueRange = new _Range.default(start, offset);
      offset = _Node2.default.endOfWhiteSpace(src, offset);
      offset = this.parseComment(offset);

      if (!this.hasComment || this.valueRange.isEmpty) {
        offset = this.parseBlockValue(offset);
      }

      return offset;
    }
  }, {
    key: "rawValue",
    // a plain value must not contain leading or trailing white space characters
    get: function get() {
      return _get(PlainValue.prototype.__proto__ || Object.getPrototypeOf(PlainValue.prototype), "rawValue", this).trim();
    }
  }], [{
    key: "endOfLine",
    value: function endOfLine(src, start, inFlow) {
      var ch = src[start];
      var offset = start;

      while (ch && ch !== '\n') {
        if (inFlow && (ch === '[' || ch === ']' || ch === '{' || ch === '}' || ch === ',')) break;
        var next = src[offset + 1];
        if (ch === ':' && (next === '\n' || next === '\t' || next === ' ' || next === ',')) break;
        if ((ch === ' ' || ch === '\t') && next === '#') break;
        offset += 1;
        ch = next;
      }

      return offset;
    }
  }]);

  return PlainValue;
}(_Node2.default);

exports.default = PlainValue;