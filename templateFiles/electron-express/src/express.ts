import path from 'path';
import express from 'express'
let _app: ReturnType<typeof express> | undefined = undefined;
export const createApp = () => {
  if (typeof _app === 'undefined') {
    // Create app here | DO NOT CALL .listen()!!
    const app = express();
    app.use(express.static(path.resolve(__dirname, 'static'))) // see webpack main config
    app.get('/', (rq, rs) => rs.send({
      success: true, message: 'Hello, World!'
    }))
    _app = app;
  }
  return _app;
}
export default createApp
