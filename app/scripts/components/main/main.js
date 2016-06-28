"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var user_1 = require('../../services/user');
var chrome_1 = require('../../services/chrome');
var MainComponent = (function () {
    function MainComponent(userService) {
        this.userService = userService;
        this.isLoaded = false;
        this.isLoggedIn = false;
    }
    MainComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userService.isLoggedIn()
            .then(function (cookie) { return _this.userService.getUserData(cookie); })
            .then(function (user) {
            _this.user = user;
            _this.isLoggedIn = true;
            _this.isLoaded = true;
        });
    };
    MainComponent.prototype.isUserLoggedIn = function () {
        return this.isLoggedIn;
    };
    MainComponent = __decorate([
        core_1.Component({
            selector: 'main',
            templateUrl: 'scripts/components/main/main.html',
            providers: [user_1.UserService, chrome_1.ChromeService]
        }), 
        __metadata('design:paramtypes', [user_1.UserService])
    ], MainComponent);
    return MainComponent;
}());
exports.MainComponent = MainComponent;

//# sourceMappingURL=main.js.map
