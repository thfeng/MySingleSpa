/*
 * @Author: Tianhao Feng
 * @Date: 2021-03-24 16:47:04
 * @LastEditTime: 2021-03-25 14:47:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \micro-frontend-frame\src\start.js
 */

import { reroute } from "./navigations/reroute";

let started = false;

/**
 * @description: isStarted
 * @param {*}
 * @return {*}
 */
export function isStarted() {
  return started;
}

/**
 * @description: start
 * @param {*}
 * @return {*}
 */
export function start() {
  started = true;
  reroute();
}