export function FooterCta() {
  return (
    <section className="border-t border-white/10">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10 lg:px-12">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
          <h2 className="max-w-3xl font-serif text-4xl text-white sm:text-5xl">
            Give every startup idea a sharper first move.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
            COMET AGENT brings research, strategy, content, development, and
            pitch planning together in one premium execution flow.
          </p>

          <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
            <p>COMET AGENT</p>
            <div className="flex flex-wrap gap-4">
              <span>Prompt Box</span>
              <span>Workflow Animation</span>
              <span>Export to Markdown</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
