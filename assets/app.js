// App page: thanks, use and feedback with one click each, the referral wave, and a gentle reminder
// after coming back from the app (platform design D5 ch-feedback, D7, D8).
//
// Rules (KD-18): only explicit clicks are counted, as totals; no cookies, no browser storage, no
// identifier; the request carries the app, the event and, if present, the referral wave, nothing else.
// Without a counter (data-counter empty), or if it cannot be reached, everything here steps aside quietly.
const thanks = document.querySelector("[data-thanks]");
const counter = thanks?.dataset.counter;

if (thanks && counter) {
  const app = thanks.dataset.app;
  const waveParam = new URLSearchParams(location.search).get("welle") ?? "";
  const wave = /^[a-z0-9-]{1,32}$/.test(waveParam) ? waveParam : null;
  const waveBanner = document.querySelector("[data-wave]");
  const recorded = thanks.querySelector("[data-recorded]");
  const reminder = document.querySelector("[data-reminder]");

  const stepAside = () => {
    thanks.hidden = true;
    if (waveBanner) waveBanner.hidden = true;
    if (reminder) reminder.hidden = true;
  };

  const send = (event) =>
    fetch(counter, {
      method: "POST",
      // text/plain keeps this a simple request: no CORS preflight.
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(wave ? { app, event, welle: wave } : { app, event }),
      credentials: "omit",
      referrerPolicy: "no-referrer",
      cache: "no-store",
      keepalive: true,
    }).then((res) => {
      if (!res.ok) throw new Error(res.status);
    });

  thanks.hidden = false;
  if (wave && waveBanner) waveBanner.hidden = false;

  document.querySelectorAll("[data-count]").forEach((button) => {
    button.addEventListener("click", async () => {
      const group = button.closest("[data-count-group]");
      const buttons = group ? [...group.querySelectorAll("[data-count]")] : [button];
      buttons.forEach((b) => (b.disabled = true));
      try {
        await send(button.dataset.count);
      } catch {
        stepAside();
        return;
      }
      button.setAttribute("aria-pressed", "true");
      if (button.dataset.done) button.textContent = button.dataset.done;
      else if (recorded) recorded.textContent = recorded.dataset.text;
      if (reminder) reminder.hidden = true;
    });
  });

  // After the app was opened in another tab and this tab is visible again, remind once, gently.
  let leftForApp = false;
  let reminded = false;
  document.querySelector("[data-open]")?.addEventListener("click", () => (leftForApp = true));
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible" || !leftForApp || reminded || !reminder) return;
    reminded = true;
    reminder.hidden = false;
  });
  reminder?.querySelector("a")?.addEventListener("click", () => (reminder.hidden = true));
}
