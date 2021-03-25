import { APP_STATUS } from "../applications/launcher";

/*
 * @Author: Tianhao Feng
 * @Date: 2021-03-25 13:47:28
 * @LastEditTime: 2021-03-25 13:49:24
 * @Description: 
 * @FilePath: \micro-frontend-frame\src\lifecycles\umount.js
 */
export async function toUmountPromise(app) {
  if (app.status !== APP_STATUS.MOUNTED) {
    return app;
  }
  app.status = APP_STATUS.UMOUNT;
  await app.umount(app.customProps);
  app.status = APP_STATUS.NOT_MOUNTED;
  return app;
}