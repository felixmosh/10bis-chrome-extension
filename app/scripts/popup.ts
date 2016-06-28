///<reference path="../../node_modules/angular2/typings/browser.d.ts"/>
import {bootstrap}    from 'angular2/platform/browser';
import {provide} from 'angular2/core';
import {MainComponent} from './components/main/main';
import {Configs} from './commons/configs';

bootstrap(MainComponent, [provide('Configs', {useValue: Configs})]);
