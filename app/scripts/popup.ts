///<reference path="../../typings/browser.d.ts"/>
import { bootstrap }    from '@angular/platform-browser-dynamic';
import {provide} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {MainComponent} from './components/main/main';
import {Configs} from './commons/configs';

bootstrap(MainComponent, [provide('Configs', {useValue: Configs}), HTTP_PROVIDERS]);
