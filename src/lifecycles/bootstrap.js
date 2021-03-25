import { APP_STATUS } from "../applications/launcher";

/*
 * @Author: Tianhao Feng
 * @Date: 2021-03-25 13:53:21
 * @LastEditTime: 2021-03-25 14:01:45
 * @Description: 
 * @FilePath: \micro-frontend-frame\src\lifecycles\bootstrap.js
 */
export async function toBootstrapPromise(app) {
  if (app.status !== APP_STATUS.NOT_BOOTSTRAPPED) {
    return app;
  }

  app.status = APP_STATUS.BOOTSTRAPPED;
  await app.bootstrap(app.customProps);
  app.status = APP_STATUS.NOT_MOUNTED;
  return app;
}