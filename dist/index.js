var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var src_exports = {};
__export(src_exports, {
  load: () => load
});
module.exports = __toCommonJS(src_exports);
var import_typedoc2 = require("typedoc");

// src/plugin.ts
var import_typedoc = require("typedoc");
var Plugin = class {
  /**
   * Initializes the plugin.
   * @param typedoc The TypeDoc application.
   */
  initialize(typedoc) {
    this.subscribeToApplicationEvents(typedoc);
  }
  /**
   * Subscribes to events of the application so that the plugin can do its work
   * in the particular doc generation phases.
   * @param typedoc The TypeDoc application.
   */
  subscribeToApplicationEvents(typedoc) {
    typedoc.converter.on(import_typedoc.Converter.EVENT_RESOLVE_BEGIN, (c) => this.onBeginResolve(c));
  }
  onBeginResolve(context) {
    const project = context.project;
    for (const key in project.reflections) {
      const reflection = project.reflections[key];
      if (reflection.comment) {
        reflection.comment.blockTags.forEach(({ tag, content }) => {
          if (tag === "@case") {
            content.forEach((line) => {
              const codeContent = line.text.match(/```\w+\n([\s\S]+)\n```/);
              if (codeContent) {
                line.text = `<div style="display:flex;flex-direction:column;" id="online-run-code-${reflection.id}">
                  <textarea style="display:block;width:100%;height:150px;text-align:left;resize:none;font-size:14px;margin-bottom:10px;border: 1px solid var(--color-accent);border-radius:0.8rem;padding:10px;box-sizing:border-box;color:var(--color-text);">${codeContent[1]}</textarea>
                  <button style="background-color: #00a8e6;color: #fff;border:none;height:36px;width:80px;text-align:center;line-height:36px;border-radius:0.4rem;cursor: pointer;" onclick="execute_javascript('online-run-code-${reflection.id}', this)">Run</button>
                  <div class="code-result" style="border: 1px solid var(--color-accent);border-radius:0.8rem;padding:10px 15px;box-sizing:border-box;margin-top:10px;display:none;"></div>
                </div>`;
              }
            });
          }
        });
      }
    }
  }
};

// src/index.tsx
var fs = require("fs");
var path = require("path");
function load(pluginHost) {
  const app = pluginHost.owner;
  new Plugin().initialize(app);
  app.renderer.hooks.on("body.end", () => {
    const jsContent = fs.readFileSync(path.join(__dirname, "./runCode.js"), "utf-8");
    return /* @__PURE__ */ import_typedoc2.JSX.createElement(import_typedoc2.JSX.Fragment, null, /* @__PURE__ */ import_typedoc2.JSX.createElement("script", { src: "https://bw-1253274769.cos.ap-beijing.myqcloud.com/bitcoinjs-browser.js", async: true }), /* @__PURE__ */ import_typedoc2.JSX.createElement("script", null, jsContent));
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  load
});
