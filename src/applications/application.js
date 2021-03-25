/*
 * @Author: Tianhao Feng
 * @Date: 2021-03-24 16:46:47
 * @LastEditTime: 2021-03-25 11:48:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \micro-frontend-frame\src\applications\application.js
 */

import { APP_STATUS, shouldBeActivated } from "./launcher";
import { reroute } from "../navigations/reroute";

const apps = [];

/**
 * @description: registerApplication
 * @param {*} appName
 * @param {*} loadApp
 * @param {*} activateWhen
 * @param {*} customProps
 * @return {*}
 */
export function registerApplication(appName, loadApp, activateWhen, customProps) {
  apps.push({appName, loadApp, activateWhen, customProps, status: APP_STATUS.NOT_LOADED});

  reroute();
}

export function getAppsChange() {
  const appsToUmount = [];
  const appsToLoad = [];
  const appsToMount = [];

  apps.forEach(app => {
    const appShouldBeActivated = shouldBeActivated(app);
    switch(app.status) {
      case APP_STATUS.NOT_LOADED:
      case APP_STATUS.LOADING_RESOURCE:
        if(appShouldBeActivated) {
          appsToLoad.push(app);
        }
        break;
      case APP_STATUS.NOT_BOOTSTRAPPED:
      case APP_STATUS.BOOTSTRAPPED:
      case APP_STATUS.NOT_MOUNTED:
        if(appShouldBeActivated) {
          appsToMount.push(app);
        }
        break;
      case APP_STATUS.MOUNTED:
        if(!appShouldBeActivated) {
          appsToUmount.push(app);
        }
        break;
      case APP_STATUS.UMOUNT:
        appsToUmount.push(app);
        break;
      default:
    }
  });

  return { appsToLoad, appsToMount, appsToUmount};
}