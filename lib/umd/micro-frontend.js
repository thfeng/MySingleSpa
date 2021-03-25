(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MicroFrontend = {}));
}(this, (function (exports) { 'use strict';

  /*
   * @Author: Tianhao Feng
   * @Date: 2021-03-25 10:27:29
   * @LastEditTime: 2021-03-25 11:36:13
   * @LastEditors: Please set LastEditors
   * @Description: In User Settings Edit
   * @FilePath: \micro-frontend-frame\src\applications\launcher.js
   */

  const APP_STATUS = {
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
  };

  function shouldBeActivated(app) {
    return app.status !== APP_STATUS.SKIP_BECAUSE_BROKEN && app.activateWhen(window.location);
  }

  /*
   * @Author: Tianhao Feng
   * @Date: 2021-03-24 16:46:47
   * @LastEditTime: 2021-03-25 11:48:48
   * @LastEditors: Please set LastEditors
   * @Description: In User Settings Edit
   * @FilePath: \micro-frontend-frame\src\applications\application.js
   */

  const apps = [];

  /**
   * @description: registerApplication
   * @param {*} appName
   * @param {*} loadApp
   * @param {*} activateWhen
   * @param {*} customProps
   * @return {*}
   */
  function registerApplication(appName, loadApp, activateWhen, customProps) {
    apps.push({appName, loadApp, activateWhen, customProps, status: APP_STATUS.NOT_LOADED});

    reroute();
  }

  function getAppsChange() {
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
      }
    });

    return { appsToLoad, appsToMount, appsToUmount};
  }

  /*
   * @Author: Tianhao Feng
   * @Date: 2021-03-25 13:53:21
   * @LastEditTime: 2021-03-25 14:01:45
   * @Description: 
   * @FilePath: \micro-frontend-frame\src\lifecycles\bootstrap.js
   */
  async function toBootstrapPromise(app) {
    if (app.status !== APP_STATUS.NOT_BOOTSTRAPPED) {
      return app;
    }

    app.status = APP_STATUS.BOOTSTRAPPED;
    await app.bootstrap(app.customProps);
    app.status = APP_STATUS.NOT_MOUNTED;
    return app;
  }

  /*
   * @Author: Tianhao Feng
   * @Date: 2021-03-25 11:52:56
   * @LastEditTime: 2021-03-25 14:52:46
   * @Description: 
   * @FilePath: \micro-frontend-frame\src\lifecycles\load.js
   */

  function flattenArray(fns) {
    fns = Array.isArray(fns) ? fns: [fns];
    return (props) => fns.reduce((promise, fn) => promise.then(() => fn(props)), Promise.resolve());
  }

  async function toLoadPromise(app) {
    if (app.onLoadingPromise) {
      return app.onLoadingPromise;
    }

    return (app.onLoadingPromise = Promise.resolve().then(async () => {
      app.status = APP_STATUS.LOADING_RESOURCE;
      const { bootstrap, mount, umount } = await app.loadApp(app.customProps);
      app.status = APP_STATUS.NOT_BOOTSTRAPPED;
      app.bootstrap = flattenArray(bootstrap);
      app.mount = mount;
      app.umount = umount;
      delete app.onLoadingPromise;
      return app;
    }));
  }

  /*
   * @Author: Tianhao Feng
   * @Date: 2021-03-25 13:53:47
   * @LastEditTime: 2021-03-25 14:03:09
   * @Description: 
   * @FilePath: \micro-frontend-frame\src\lifecycles\mount.js
   */
  async function toMountPromise(app) {
    if (app.status !== APP_STATUS.NOT_MOUNTED) {
      return app;
    }

    app.status = APP_STATUS.MOUNTING;
    await app.mount(app.customProps);
    app.status = APP_STATUS.MOUNTED;
    return app;
  }

  /*
   * @Author: Tianhao Feng
   * @Date: 2021-03-25 13:47:28
   * @LastEditTime: 2021-03-25 13:49:24
   * @Description: 
   * @FilePath: \micro-frontend-frame\src\lifecycles\umount.js
   */
  async function toUmountPromise(app) {
    if (app.status !== APP_STATUS.MOUNTED) {
      return app;
    }
    app.status = APP_STATUS.UMOUNT;
    await app.umount(app.customProps);
    app.status = APP_STATUS.NOT_MOUNTED;
    return app;
  }

  /*
   * @Author: Tianhao Feng
   * @Date: 2021-03-24 16:47:04
   * @LastEditTime: 2021-03-25 14:47:59
   * @LastEditors: Please set LastEditors
   * @Description: In User Settings Edit
   * @FilePath: \micro-frontend-frame\src\start.js
   */

  let started = false;

  /**
   * @description: isStarted
   * @param {*}
   * @return {*}
   */
  function isStarted() {
    return started;
  }

  /**
   * @description: start
   * @param {*}
   * @return {*}
   */
  function start() {
    started = true;
    reroute();
  }

  /*
   * @Author: Tianhao Feng
   * @Date: 2021-03-25 11:06:05
   * @LastEditTime: 2021-03-25 15:57:47
   * @Description: 
   * @FilePath: \micro-frontend-frame\src\navigations\reroute.js
   */

  function reroute() {

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
      await Promise.all(appsToLoad.map(toLoadPromise));
    }
    async function performAppChange() {
      appsToUmount.map(toUmountPromise);

      appsToLoad.map(async app => {
        app = await toLoadPromise(app);
        app = await toBootstrapPromise(app);
        return await toMountPromise(app);
      });

      appsToMount.map(async app => {
        app = await toBootstrapPromise(app);
        return toMountPromise(app);
      });
    }}

  /*
   * @Author: Tianhao Feng
   * @Date: 2021-03-25 15:09:05
   * @LastEditTime: 2021-03-25 15:47:56
   * @Description: 
   * @FilePath: \micro-frontend-frame\src\navigations\event.js
   */

  const ROUTE_EVENTS = {
    HASH_CHANGE: 'hashchange',
    POP_STATE: 'popstate',
  };

  const routeEventsListeningTo = [ROUTE_EVENTS.HASH_CHANGE, ROUTE_EVENTS.POP_STATE];

  const urlReroute = () => {
    reroute([], arguments);
  };

  const capturedEventListeners = {};
  capturedEventListeners[ROUTE_EVENTS.HASH_CHANGE] = [];
  capturedEventListeners[ROUTE_EVENTS.POP_STATE] = [];

  window.addEventListener(ROUTE_EVENTS.HASH_CHANGE, urlReroute);
  window.addEventListener(ROUTE_EVENTS.POP_STATE, urlReroute);

  const originalRemoveEventListener = window.removeEventListener;
  const originalAddEventListener = window.addEventListener;

  window.addEventListener = function(eventName, fn) {
    if (routeEventsListeningTo.includes(eventName) && !capturedEventListeners[eventName].some(listener => listener === fn)) {
      capturedEventListeners[eventName].push(fn);
      return;
    }
    return originalAddEventListener.apply(this, arguments);
  };

  window.removeEventListener = function(eventName, fn) {
    if (routeEventsListeningTo.includes(eventName)) {
      capturedEventListeners[eventName] = capturedEventListeners[eventName].filter(listener => listener !== fn);
    }
    return originalRemoveEventListener.apply(this, arguments);
  };

  const patchedUpdateState = (state, method) => {
    return function () {
      const beforeUrl = window.location.href;
      state.apply(this, arguments);
      const effectedUrl = window.location.href;

      if (beforeUrl !== effectedUrl) {
        urlReroute(new PopStateEvent(method));
      }
    }
  };

  window.history.pushState = patchedUpdateState(window.history.pushState, 'pushState');
  window.history.replaceState = patchedUpdateState(window.history.replaceState, 'replaceState');

  exports.registerApplication = registerApplication;
  exports.start = start;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=micro-frontend.js.map
