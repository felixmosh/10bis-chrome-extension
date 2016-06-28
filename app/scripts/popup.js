"use strict";
///<reference path="../../typings/browser.d.ts"/>
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var main_1 = require('./components/main/main');
var configs_1 = require('./commons/configs');
platform_browser_dynamic_1.bootstrap(main_1.MainComponent, [core_1.provide('Configs', { useValue: configs_1.Configs }), http_1.HTTP_PROVIDERS]);

//# sourceMappingURL=popup.js.map
