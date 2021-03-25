/*
 * @Author: Tianhao Feng
 * @Date: 2021-03-25 11:52:56
 * @LastEditTime: 2021-03-25 14:52:46
 * @Description: 
 * @FilePath: \micro-frontend-frame\src\lifecycles\load.js
 */
import { APP_STATUS } from "../applications/launcher";

function flattenArray(fns) {
  fns = Array.isArray(fns) ? fns: [fns];
  return (props) => fns.reduce((promise, fn) => promise.then(() => fn(props)), Promise.resolve());
}

export async function toLoadPromise(app) {
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
