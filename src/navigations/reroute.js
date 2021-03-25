/*
 * @Author: Tianhao Feng
 * @Date: 2021-03-25 11:06:05
 * @LastEditTime: 2021-03-25 15:57:47
 * @Description: 
 * @FilePath: \micro-frontend-frame\src\navigations\reroute.js
 */

import { getAppsChange } from "../applications/application";
import { toBootstrapPromise } from "../lifecycles/bootstrap";
import { toLoadPromise } from "../lifecycles/load";
import { toMountPromise } from "../lifecycles/mount";
import { toUmountPromise } from "../lifecycles/umount";
import { isStarted } from "../start";

export function reroute() {

  // Get apps list expect to load
  // Get apps list expect to mount
  // Get apps list expect to umount
  const { appsToLoad, appsToMount, appsToUmount } = getAppsChange();
  console.log('reroute:', appsToLoad, appsToMount, appsToUmount);

  if (isStarted()) {
    console.log('app start');
    return performAppChange();
  } else {
    console.log('app register');
    return loadApps();
  }

  async function loadApps() {
    const apps = await Promise.all(appsToLoad.map(toLoadPromise));
  };

  async function performAppChange() {
    const umountPromises = appsToUmount.map(toUmountPromise);

    appsToLoad.map(async app => {
      app = await toLoadPromise(app);
      app = await toBootstrapPromise(app);
      return await toMountPromise(app);
    });

    appsToMount.map(async app => {
      app = await toBootstrapPromise(app);
      return toMountPromise(app);
    });
  };
}