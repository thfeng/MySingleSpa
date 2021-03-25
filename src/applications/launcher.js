/*
 * @Author: Tianhao Feng
 * @Date: 2021-03-25 10:27:29
 * @LastEditTime: 2021-03-25 11:36:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \micro-frontend-frame\src\applications\launcher.js
 */

export const APP_STATUS = {
  NOT_LOADED: 'NOT_LOADED',
  LOADING_RESOURCE: 'LOADING_RESOURCE',
  NOT_BOOTSTRAPPED: 'NOT_BOOTSTRAPPED',
  BOOTSTRAPPED: 'BOOTSTRAPPED',
  NOT_MOUNTED: 'NOT_MOUNTED',
  MOUNTING: 'MOUNTING',
  MOUNTED: 'MOUNTED',
  UPDATING: 'UPDATING',
  UMOUNT: 'UMOUNT',
  DESTROYED: 'DESTROYED',
  LOAD_ERROR: 'LOAD_ERROR',
  SKIP_BECAUSE_BROKEN: 'SKIP_BECAUSE_BROKEN'
}

export function isActivated(app) {
  return app.status == APP_STATUS.MOUNTED;
}

export function shouldBeActivated(app) {
  return app.status !== APP_STATUS.SKIP_BECAUSE_BROKEN && app.activateWhen(window.location);
}