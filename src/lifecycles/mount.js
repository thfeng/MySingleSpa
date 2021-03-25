import { APP_STATUS } from "../applications/launcher";

/*
 * @Author: Tianhao Feng
 * @Date: 2021-03-25 13:53:47
 * @LastEditTime: 2021-03-25 14:03:09
 * @Description: 
 * @FilePath: \micro-frontend-frame\src\lifecycles\mount.js
 */
export async function toMountPromise(app) {
  if (app.status !== APP_STATUS.NOT_MOUNTED) {
    return app;
  }

  app.status = APP_STATUS.MOUNTING;
  await app.mount(app.customProps);
  app.status = APP_STATUS.MOUNTED;
  return app;
}