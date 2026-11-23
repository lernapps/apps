import { expect, test } from "vite-plus/test";
import { feedback, isValid } from "./Kurztest.ts";

const options = [
  { text: "spitz", correct: false, info: "Spitz ist kleiner als 90°." },
  { text: "stumpf", correct: true, info: "120° liegt zwischen 90° und 180°." },
];

test("a right option gets the right text with its info, a wrong one the wrong text with its info", () => {
  expect(feedback(options, 1, "Richtig.", "Nicht richtig.")).toEqual({
    right: true,
    text: "Richtig. 120° liegt zwischen 90° und 180°.",
  });
  expect(feedback(options, 0, "Richtig.", "Nicht richtig.")).toEqual({
    right: false,
    text: "Nicht richtig. Spitz ist kleiner als 90°.",
  });
});

test("no option chosen gives no feedback; exactly one right option is valid", () => {
  expect(feedback(options, 5, "Richtig.", "Nicht richtig.")).toEqual({ right: false, text: "" });
  expect(isValid(options)).toBe(true);
  expect(isValid([options[0]!, options[0]!])).toBe(false);
});
