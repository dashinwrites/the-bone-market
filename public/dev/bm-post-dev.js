(function () {
  const url = new URL(location.href);
  const isDev = url.searchParams.get("dev") === "1";
  const mount = document.getElementById("bm-post-mount");
  const tmplEl = document.getElementById("bm-post-template");
  if (!mount || !tmplEl) return;

  // Detect either {TOKEN} or <!--|token|-->
  const tplText = tmplEl.textContent;
  const hasBraceTokens = /\{[A-Z0-9_:-]+\}/.test(tplText);
  const hasCommentTokens = /<!--\s*\|[^|]+\|\s*-->/.test(tplText);

  // If not explicitly in dev AND no tokens remain, bail
  if (!isDev && !(hasBraceTokens || hasCommentTokens)) return;

  // Replace {TOKEN} and <!--|token|--> with values from 'data'
  function populate(str, data) {
    // Normalize key lookup (case-insensitive). Try exact, UPPER, lower.
    const get = (k) => {
      if (k in data) return data[k];
      const up = k.toUpperCase();
      if (up in data) return data[up];
      const lo = k.toLowerCase();
      if (lo in data) return data[lo];
      return `{${k}}`; // leave untouched if unknown (helps debugging)
    };

    // 1) {TOKEN}
    str = str.replace(/\{([A-Z0-9_:-]+)\}/gi, (_, k) => get(k));

    // 2) <!--| token |-->  (allow spaces, any case)
    str = str.replace(/<!--\s*\|([^|]+)\|\s*-->/gi, (_, raw) => {
      const k = String(raw).trim();
      return get(k);
    });

    return str;
  }

  async function loadFixtures() {
    try {
      const res = await fetch("./dev/postrow-fixtures.json", { cache: "no-store" });
      if (!res.ok) throw new Error(res.status);
      return await res.json();
    } catch {
      // Inline fallback
      return [{
        POST_ID: "999",
        pid: "999",                 // lower-case for <!--|pid|-->
        AUTHOR_ID: "1",
        AUTHOR_NAME: "lux",
        GROUP_TITLE: "crown",
        POST_COUNT: "1,337",
        JOINED_DATE: "Jan 2024",
        POST_INDEX: "1",
        POST_DATE: "Now-ish",
        POST_ISO: "2025-10-11T19:00:00-06:00",
        FORUM_ID: "1",
        TOPIC_ID: "1556",
        ONLINE_STATUS: "online",
        AVATAR: '<img src="https://picsum.photos/240?random=3" alt="Avatar of lux">',
        POST_BUTTONS: '<a class="macro--button" href="#">edit</a> <a class="macro--button" href="#">quote</a>',
        POST: "<p>Local fallback fixture. Replace me by creating <code>/dev/postrow-fixtures.json</code>.</p>",
        SIGNATURE: "<p><small>signature</small></p>"
      }];
    }
  }

  (async function render() {
    const tpl = tmplEl.textContent.trim();
    const fixtures = await loadFixtures();

    // If you want multiple posts, keep as-is; otherwise use fixtures[0]
    const html = fixtures.map(row => populate(tpl, row)).join("\n");
    mount.innerHTML = html;

    // Mark dev for optional CSS tweaks
    document.documentElement.dataset.dev = "postrow";
  })();
})();
