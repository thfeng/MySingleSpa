/*
 * @Author: Tianhao Feng
 * @Date: 2021-03-25 15:09:05
 * @LastEditTime: 2021-03-25 15:47:56
 * @Description: 
 * @FilePath: \micro-frontend-frame\src\navigations\event.js
 */

import { reroute } from "./reroute";

const ROUTE_EVENTS = {
  HASH_CHANGE: 'hashchange',
  POP_STATE: 'popstate',
}

export const routeEventsListeningTo = [ROUTE_EVENTS.HASH_CHANGE, ROUTE_EVENTS.POP_STATE];

const urlReroute = () => {
  reroute([], arguments);
};

const capturedEventListeners = {}
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
}

window.removeEventListener = function(eventName, fn) {
  if (routeEventsListeningTo.includes(eventName)) {
    capturedEventListeners[eventName] = capturedEventListeners[eventName].filter(listener => listener !== fn);
  }
  return originalRemoveEventListener.apply(this, arguments);
}

const patchedUpdateState = (state, method) => {
  return function () {
    const beforeUrl = window.location.href;
    state.apply(this, arguments);
    const effectedUrl = window.location.href;

    if (beforeUrl !== effectedUrl) {
      urlReroute(new PopStateEvent(method));
    }
  }
}

window.history.pushState = patchedUpdateState(window.history.pushState, 'pushState');
window.history.replaceState = patchedUpdateState(window.history.replaceState, 'replaceState');