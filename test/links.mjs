// Whether a link on the web resolves, for the link checks of test/entry-point.e2e.test.mjs. Our own hosts are strict:
// any answer but 2xx (after redirects) is a broken link. An outside host (GitHub, the npm registry, ...) that answers
// 5xx or 429 is asked again, after RETRY_WAITS; if it still does, the link is a note, not a failure: a passing hiccup
// of someone else's server says nothing about our pages. Any other answer of an outside host (404, ...) is broken.

/** The hosts whose pages are ours: strict, never retried. A subdomain counts as the host. */
export const OWN_HOSTS = ["lernapps.net"];

/** The waits before the second and the third request to an outside host that answers 5xx or 429. */
export const RETRY_WAITS = [2_000, 5_000];

/** An answer that may pass: the server's trouble (5xx) or too many requests (429). */
export const transient = (status) => status >= 500 || status === 429;

/** Whether a URL is on an outside host, not one of `own`. */
export function outside(url, own = OWN_HOSTS) {
  const host = new URL(url).hostname;
  return !own.some((name) => host === name || host.endsWith(`.${name}`));
}

const pause = (ms) => new Promise((done) => setTimeout(done, ms));

/**
 * Fetches a link: { result: "ok" }, { result: "broken", why } or { result: "note", why }.
 * Options: `own` (the strict hosts), `waits` (the retries' waits), `sleep` (a test passes one that does not wait).
 */
export async function fetchLink(url, { own = OWN_HOSTS, waits = RETRY_WAITS, sleep = pause } = {}) {
  const retry = outside(url, own);
  for (let attempt = 0; ; attempt++) {
    let status;
    try {
      const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(30_000) });
      await response.body?.cancel();
      // A page that needs a GitHub account, such as a new issue from a form, sends a visitor to its sign-in page.
      if (response.ok || response.url.startsWith("https://github.com/login?")) return { result: "ok" };
      status = response.status;
    } catch (error) {
      return { result: "broken", why: `cannot be fetched (${error.cause?.code ?? error.message})` };
    }
    if (!retry || !transient(status)) return { result: "broken", why: `answers ${status}` };
    if (attempt >= waits.length) {
      return { result: "note", why: `answers ${status}, ${attempt + 1} times (an outside host: a note, not a failure)` };
    }
    await sleep(waits[attempt]);
  }
}
