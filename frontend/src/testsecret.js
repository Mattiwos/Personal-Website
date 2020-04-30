
exports.__esModule = true;
//http://192.168.42.81:3000
//
// eslint-disable-next-line
var App;
(function (App) {
    var Secret = /** @class */ (function () {
        function Secret() {
        }
        Secret.prototype.getLocalhost = function () {
            return "http://localhost:8080";
        };
        Secret.prototype.getIP = function () {
            return "http://192.168.1.7:8080/";
        };
        return Secret;
    }());
    App.Secret = Secret;
})(App = exports.App || (exports.App = {}));
