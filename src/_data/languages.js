// The languages of the site, German first: German is at the root (/apps/…), every other language below its
// code (/apps/en/…), the same address within each tree. `t` are the texts (de.js, en.js).
import de from "./de.js";
import en from "./en.js";

export default [
  { code: "de", root: "", t: de },
  { code: "en", root: "en/", t: en },
];
