// Logic of the short self-test on a recap page: a question with options, immediate feedback, no "Prüfen" and no
// score. It is not an exercise of the app, it only shows learners whether they can do it. Pure functions.
export type Option = { text: string; correct: boolean; info: string };

/** The feedback for the chosen option: whether it is right and the text to show. */
export function feedback(
  options: Option[],
  index: number,
  right: string,
  wrong: string,
): { right: boolean; text: string } {
  const chosen = options[index];
  if (!chosen) return { right: false, text: "" };
  return { right: chosen.correct, text: `${chosen.correct ? right : wrong} ${chosen.info}` };
}

/** Whether exactly one option is right (a test with none or two right options is a content mistake). */
export function isValid(options: Option[]): boolean {
  return options.filter((o) => o.correct).length === 1;
}
