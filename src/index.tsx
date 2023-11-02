import { Application, JSX } from "typedoc";
import { Plugin } from "./plugin";
import fs = require("fs");
import path = require("path");
export function load(pluginHost: Application) {
  const app = pluginHost.owner;
  new Plugin().initialize(app);
  app.renderer.hooks.on("body.end", () => {
    const jsContent = fs.readFileSync(path.join(__dirname, "./runCode.js"), "utf-8");
    return (
      <>
        <script src="https://bw-1253274769.cos.ap-beijing.myqcloud.com/bitcoinjs-browser.js" async></script>
        <script>{jsContent}</script>
      </>
    );
  });
}
