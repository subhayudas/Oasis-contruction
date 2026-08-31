/**
 * The question is the header.
 *
 * On a phone there is no room for a title bar above a question, and there is
 * no need for one: the question *is* what the screen is about. So each step
 * opens with it, at h2 size, and the sub-line underneath does the reassuring.
 */
export function StepHeader({ question, hint }: { question: string; hint?: string }) {
  return (
    <header>
      <h2 className="text-ink text-[clamp(1.375rem,4.6vw,1.625rem)] leading-[1.2] font-[700] tracking-[-0.02em]">
        {question}
      </h2>
      {hint ? <p className="u-body mt-2.5 text-[0.9375rem]">{hint}</p> : null}
    </header>
  );
}
