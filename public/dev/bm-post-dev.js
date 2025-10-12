(function () {
  // Run dev harness when ?dev=1 OR when tokens visibly remain
  const url = new URL(location.href);
  const isDev = url.searchParams.get("dev") === "1";
  const mount = document.getElementById("bm-post-mount");
  const tmplEl = document.getElementById("bm-post-template");

  if (!mount || !tmplEl) return;

  // If we’re on JCink, tokens won’t contain curly braces—so bail.
  // Locally, tokens still look like {TOKEN}, so we render fixtures.
  const tokensRemain = tmplEl.textContent.includes("{POST_ID}");

  if (!isDev && !tokensRemain) return;

  // Tiny helper: replace {TOKEN} with values
  function populate(str, data) {
    // Replace any {KEY} globally; ignore missing keys
    return str.replace(/\{([A-Z0-9_]+)\}/g, (_, k) => (k in data ? data[k] : `{${k}}`));
  }

  // Load fixtures (no network: inline fallback)
  async function loadFixtures() {
    try {
      const res = await fetch("./dev/postrow-fixtures.json", { cache: "no-store" });
      if (!res.ok) throw new Error(res.status);
      return await res.json();
    } catch {
      // inline fallback if you don’t want a separate file
      return [{
        POST_ID:"999", AUTHOR_ID:"1", AUTHOR_NAME:"lux", GROUP_TITLE:"crown",
        POST_COUNT:"1,337", JOINED_DATE:"Jan 2024", POST_INDEX:"1",
        POST_DATE:"Now-ish", POST_ISO:"2025-10-11T19:00:00-06:00",
        FORUM_ID:"1", TOPIC_ID:"1556", ONLINE_STATUS:"online",
        AVATAR:'<img src="https://picsum.photos/240?random=3" alt="Avatar of lux">',
        POST_BUTTONS:'<a class="macro--button" href="#">edit</a> <a class="macro--button" href="#">quote</a>',
        POST:"<p>Local fallback fixture. Replace me by creating <code>/dev/postrow-fixtures.json</code>.</p>",
        SIGNATURE:"<p><small>signature</small></p>"
      }];
    }
  }

  (async function render() {
    const tpl = tmplEl.textContent.trim();
    const fixtures = await loadFixtures();
    const html = fixtures.map(row => populate(tpl, row)).join("\n");
    mount.innerHTML = html;

    // Quality-of-life: mark dev
    document.documentElement.dataset.dev = "postrow";
  })();
})();
