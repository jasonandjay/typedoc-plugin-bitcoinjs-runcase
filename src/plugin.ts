import { Application, Context, Converter } from "typedoc";
export class Plugin {
  /**
   * Initializes the plugin.
   * @param typedoc The TypeDoc application.
   */
  initialize(typedoc: Readonly<Application>): void {
    this.subscribeToApplicationEvents(typedoc);
  }

  /**
   * Subscribes to events of the application so that the plugin can do its work
   * in the particular doc generation phases.
   * @param typedoc The TypeDoc application.
   */
  private subscribeToApplicationEvents(typedoc: Readonly<Application>): void {
    typedoc.converter.on(Converter.EVENT_RESOLVE_BEGIN, (c: Readonly<Context>) => this.onBeginResolve(c));
  }
  private onBeginResolve(context: Context) {
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
}
