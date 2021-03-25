/*
 * @Author: Tianhao Feng
 * @Date: 2021-03-24 13:55:08
 * @LastEditTime: 2021-03-25 14:34:22
 * @Description: 
 * @FilePath: \micro-frontend-frame\rollup.config.js
 */
import serve from 'rollup-plugin-serve';
export default {
  input: './src/index.js',
  output: {
    file: './lib/umd/micro-frontend.js',
    format: 'umd',
    name: 'MicroFrontend',
    sourcemap: true
  },
  plugin: [
    serve({
      openPage: '/index.html',
      port: 3001
    })
  ]
}