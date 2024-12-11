"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logout = exports.checkAuth = exports.login = exports.register = exports.getToken = void 0;

var _api = _interopRequireDefault(require("../api"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getToken = function getToken() {
  return localStorage.getItem("token");
};

exports.getToken = getToken;

var setToken = function setToken(token) {
  return localStorage.setItem("token", token);
};

var removeToken = function removeToken() {
  return localStorage.removeItem("token");
};

var register = function register(email, username, password) {
  var response;
  return regeneratorRuntime.async(function register$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_api["default"].post("/auth/register", {
            email: email,
            username: username,
            password: password
          }));

        case 3:
          response = _context.sent;
          return _context.abrupt("return", response.data);

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error("Error during registration:", _context.t0);
          throw _context.t0;

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.register = register;

var login = function login(email, password) {
  var response, token;
  return regeneratorRuntime.async(function login$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_api["default"].post("/auth/login", {
            email: email,
            password: password
          }));

        case 3:
          response = _context2.sent;
          token = response.data.token;
          setToken(token);
          return _context2.abrupt("return", response.data);

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          console.error("Error during login:", _context2.t0);
          throw _context2.t0;

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.login = login;

var checkAuth = function checkAuth() {
  var token, response;
  return regeneratorRuntime.async(function checkAuth$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          token = getToken();

          if (token) {
            _context3.next = 4;
            break;
          }

          throw new Error("No token found");

        case 4:
          _context3.next = 6;
          return regeneratorRuntime.awrap(_api["default"].get("/auth/check", {
            headers: {
              Authorization: "Bearer ".concat(token)
            }
          }));

        case 6:
          response = _context3.sent;
          return _context3.abrupt("return", response.data);

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          console.error("Error during authentication check:", _context3.t0);
          throw _context3.t0;

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.checkAuth = checkAuth;

var logout = function logout() {
  removeToken();
};

exports.logout = logout;