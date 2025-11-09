let pageType = document.querySelector('body').id;
let pageClasses = document.querySelector('body').classList;

/********** Login **********/
if(pageType === 'Login') {
    let textNodes = getAllTextNodes(document.querySelector('main'));
    textNodes.forEach(node => {
        const paragraph = document.createElement('p');
        node.after(paragraph);
        paragraph.appendChild(node);
    });
    $("main > p").nextUntil("div.tableborder").andSelf().wrapAll(`<div class="textNodes"></div>`);
    $(`input[name="UserName"]`).attr('placeholder','Username');
    $(`input[name="PassWord"]`).attr('placeholder','Password');
}

/********** Registration **********/
if(pageType === 'Reg') {
    let textNodes = getAllTextNodes(document.querySelector('.tablepad > table > tbody > tr:first-child > td:last-child fieldset:first-child'));
    if(textNodes) {
        textNodes.forEach(node => {
            const paragraph = document.createElement('p');
            node.after(paragraph);
            paragraph.appendChild(node);
        });
    }
    inputWrap(`label[for="agree_cbox"] input[name="read_tos"]`);
    inputWrap(`fieldset input[name="allow_admin_mail"]`);
    inputWrap(`fieldset input[name="allow_member_mail"]`);
    fancyBoxes();
    if(document.querySelector('input[name="agree"][type="checkbox"]')) {
        $('input[name="agree"][type="checkbox"]').wrap('<label class="input-wrap tos"></label>');
        $('.input-wrap.tos').append('<div class="fancy-input checkbox"><i class="fa-solid fa-check"></i></div> <p>I agree to the terms of this registration, <b>I am at least 18 years of age,</b> and wish to proceed.</p>');
    }
}

/********** Topic View **********/
if(pageType === 'ST') {
    let descript = $('.topic-desc').html();
    if (descript != undefined) {
        var newDescript = descript.replace(", ", "");
        $('.topic-desc').html(newDescript);
    }
    
    //input clean up
    document.querySelector('#qr_open .tablepad').innerHTML = document.querySelector('#qr_open .tablepad').innerHTML.replace('|', '');
    let textNodes = getAllTextNodes(document.querySelector('#qr_open .tablepad'));
    textNodes.forEach(node => {
        const paragraph = document.createElement('p');
        node.after(paragraph);
        paragraph.appendChild(node);
        paragraph.innerText = paragraph.innerText.replace(`|`, ``).trim();
    });
    document.querySelectorAll(`#qr_open input[type="checkbox"]`).forEach(input => inputWrap(input));
    document.querySelectorAll('#qr_open .input-wrap').forEach(label => {
        label.querySelector('input').insertAdjacentHTML('afterend', `<div class="fancy-input checkbox">x</div>`);
    });
    $('#qr_open .tablepad > input').wrapAll('<div class="qr_buttons"></div>');
}

/********** Topic View **********/
if(pageType === 'Post') {
    let textNodes = getAllTextNodes(document.querySelector('#post-options .pformright'));
    if(textNodes) {
        textNodes.forEach(node => {
            const paragraph = document.createElement('p');
            node.after(paragraph);
            paragraph.appendChild(node);
        });
    }
    inputWrap(`input[name="enableemo"]`, 'br');
    inputWrap(`input[name="enablesig"]`, 'br');
    inputWrap(`input[name="enabletrack"]`, 'br');
    document.querySelectorAll('input[name="iconid"]').forEach(icon => {
        inputWrap(icon, `input`, 'radio');
    });
    fancyBoxes();
}

/********** User CP & Messages **********/
if(pageType === 'UserCP' || pageType === 'Msg') {
    /* Remove on Jcink; leave present on local */
    document.querySelector('#ucpmenu').innerHTML = `<div class="sticky"><b>Account</b>
    <div class="menu-section">
    <a href="./user-edit.html">Edit Profile</a>
    <a href="./user-avatar.html">Update Avatar</a>
    <a href="./user-accounts.html">Sub-accounts</a>
    <a href="./user-name.html">Edit Username</a>
    <a href="./user-pass.html">Change Password</a>
    <a href="./user-email.html">Update Email</a>
    </div>
    <b class="is-closed">Messages</b>
    <div class="menu-section">
    <a href="./user-inbox.html">Inbox</a>
    <a href="./user-message.html">Send Message</a>
    <a href="./user-viewmessage.html">View Message</a>
    </div>
    <b class="is-closed">Tracking</b>
    <div class="menu-section">
    <a href="./user-alerts.html">Alerts</a>
    <a href="./user-forums.html">Forums</a>
    <a href="./user-forum-none.html">Forums (None Tracked)</a>
    <a href="./user-topics.html">Topics</a>
    <a href="./user-topics-none.html">Topics (None Tracked)</a>
    </div>
    <b class="is-closed">Settings</b>
    <div class="menu-section">
    <a href="./user-boardset.html">Board</a>
    <a href="./user-alertset.html">Alerts</a>
    <a href="./user-emailset.html">Emails</a>
    </div>
    </div>`;

    /* Uncomment on Jcink; leave commented on local
    document.querySelector('#ucpmenu').innerHTML = `<div class="sticky"><b>Account</b>
    <div class="menu-section">
    <a href="?act=UserCP&CODE=01">Edit Profile</a>
    <a href="?act=UserCP&CODE=24">Update Avatar</a>
    <a href="?act=UserCP&CODE=54">Sub-accounts</a>
    <a href="?act=UserCP&CODE=52">Edit Username</a>
    <a href="?act=UserCP&CODE=28">Change Password</a>
    <a href="?act=UserCP&CODE=08">Update Email</a>
    </div>
    <b class="is-closed">Messages</b>
    <div class="menu-section">
    <a href="?act=Msg&CODE=01">Inbox</a>
    <a href="?act=Msg&CODE=04">Send Message</a>
    </div>
    <b class="is-closed">Tracking</b>
    <div class="menu-section">
    <a href="?act=UserCP&CODE=alerts">Alerts</a>
    <a href="?act=UserCP&CODE=50">Forums</a>
    <a href="?act=UserCP&CODE=26">Topics</a>
    </div>
    <b class="is-closed">Settings</b>
    <div class="menu-section">
    <a href="?act=UserCP&CODE=04">Board</a>
    <a href="?act=UserCP&CODE=alerts_settings">Alerts</a>
    <a href="?act=UserCP&CODE=02">Emails</a></div></div>`;
    */

    //subaccounts
    if($('body.code-54').length > 0) {
        document.querySelectorAll('input[name="sub_ids[]"]').forEach(input => {
            inputWrap(input);
        });
        fancyBoxes();
    }

    //alerts
    if($('body.code-alerts').length > 0) {
        document.querySelectorAll('input[name="alert_id[]"]').forEach(input => {
            inputWrap(input);
        });
        fancyBoxes();
    }

    //forum and topic subscriptions
    if (pageClasses.contains('code-50') || pageClasses.contains('code-26')) {
        document.querySelectorAll('.tableborder > table > tbody > tr').forEach(row => {
            if(row.querySelectorAll('th, td').length === 1) {
                row.classList.add('ucp--header', 'pformstrip');
            }
        });

        if(pageClasses.contains('code-26')) {
            document.querySelectorAll(`.tableborder input[type="checkbox"]`).forEach(input => inputWrap(input));
            fancyBoxes();
        }
    }
    
    //board settings
    if (pageClasses.contains('code-04')) {
        inputWrap(document.querySelector(`input[name="DST"]`));
        fancyBoxes();
    }
    
    //alert settings
    if (pageClasses.contains('code-alerts_settings') || pageClasses.contains('code-02')) {
        document.querySelectorAll(`input[type="checkbox"]`).forEach(input => inputWrap(input));
        fancyBoxes();
    }
}

/********** Store **********/
if(pageType === 'store') {
    /* Remove on Jcink; leave present on local */
    document.querySelector('#ucpmenu').innerHTML = `<div class="sticky"><b>Shop</b>
    <div class="menu-section">
    <a href="./store.html">Home</a>
    <a href="./store-category.html">Category</a>
    </div>
    <b>Personal</b>
    <div class="menu-section">
    <a href="./store-inventory.html">Inventory</a>
    <a href="./store-sendmoney.html">Send Money</a>
    <a href="./store-senditem.html">Send Item</a>
    </div>
    <b class="is-closed staffOnly">Staff</b>
    <div class="menu-section">
    <a href="./store-fine.html" class="staffOnly">Fine</a>
    <a href="./store-editpoints.html" class="staffOnly">Edit Points</a>
    <a href="./store-editpoints-screen2.html" class="staffOnly">Edit Points (Page 2)</a>
    <a href="./store-edititems.html" class="staffOnly">Edit Inventory</a>
    <a href="./store-edititems-screen2.html" class="staffOnly">Edit Inventory (Page 2)</a>
    </div>
    </div>`;

    /* Uncomment on Jcink; leave commented on local
    document.querySelector('#ucpmenu').innerHTML = `<div class="sticky"><b>Shop</b>
    <div class="menu-section">
    <a href="?act=store&code=shop&category=1">Manually</a>
    <a href="?act=store&code=shop&category=2">Add</a>
    <a href="?act=store&code=shop&category=3">Categories</a>
    </div>
    <b>Personal</b>
    <div class="menu-section">
    <a href="?act=store&CODE=inventory">Inventory</a>
    <a href="?act=store&code=donate_money">Send Money</a>
    <a href="?act=store&code=donate_item">Send Item</a>
    </div>
    <b class="is-closed staffOnly">Staff</b>
    <div class="menu-section">
    <a href="?act=store&code=fine" class="staffOnly">Fine</a>
    <a href="?act=store&code=edit_points" class="staffOnly">Edit Points</a>
    <a href="?act=store&code=edit_inventory" class="staffOnly">Edit Inventory</a></div></div>`;
    */
}

// Sidebar Toggle
(() => {
  const body = document.body;
  const btn  = document.getElementById('sidebar-toggle');
  const pane = document.getElementById('sidebar');
  const scrim= document.getElementById('sidebar-scrim');
  const closeBtn = document.querySelector('#sidebar .sidebar-close');

  if (!btn || !pane || !scrim) return;

  const STORAGE_KEY = 'sidebarOpen';
  const qsFocusable = [
    'a[href]','button:not([disabled])','input:not([disabled])',
    'select:not([disabled])','textarea:not([disabled])','[tabindex]:not([tabindex="-1"])'
  ].join(',');

  function focusFirst() {
    const first = pane.querySelector(qsFocusable) || pane;
    first.focus({ preventScroll: true });
  }

  function setState(open, { skipFocus = false } = {}) {
  if (open) {
    pane.hidden = false;
    scrim.hidden = false;
    // next frame -> animate in
    requestAnimationFrame(() => {
      body.dataset.sidebar = 'open';
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
      if (!skipFocus) {
        const first = pane.querySelector(qsFocusable) || pane;
        first.focus({ preventScroll: true });
      }
    });
    return;
  }

  // animate out
  body.dataset.sidebar = 'closed';
  try { localStorage.setItem(STORAGE_KEY, '0'); } catch {}
  if (!skipFocus) btn.focus({ preventScroll: true });

  // hide AFTER the slide finishes
  const DONE_MS = 340; // a hair > CSS duration
  let done = false;

  const onEnd = (e) => {
    if (e.propertyName !== 'transform') return; // only after the slide
    if (done) return;
    done = true;
    pane.hidden = true;
    scrim.hidden = true;
    pane.removeEventListener('transitionend', onEnd);
  };

  pane.addEventListener('transitionend', onEnd);

  // safety: if transitionend doesn’t fire (tab switch, etc)
  setTimeout(() => { if (!done) onEnd({ propertyName: 'transform' }); }, DONE_MS);
}

  function toggle() {
    const open = body.dataset.sidebar !== 'open';
    setState(open);
  }

  // restore previous state (default: closed)
  try {
  if (localStorage.getItem(STORAGE_KEY) === '1') {
    // reopen visually but skip autofocus on page load
    setState(true, { skipFocus: true });
  } else {
    setState(false, { skipFocus: true });
  }
} catch {
  setState(false, { skipFocus: true });
}

  // events
  btn.addEventListener('click', toggle);
  scrim.addEventListener('click', () => setState(false));
  closeBtn?.addEventListener('click', () => setState(false));

  // ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && body.dataset.sidebar === 'open') {
      e.preventDefault();
      setState(false);
    }
  });

  // optional: basic focus containment when open
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || body.dataset.sidebar !== 'open') return;
    const nodes = Array.from(pane.querySelectorAll(qsFocusable));
    if (!nodes.length) return;
    const first = nodes[0], last = nodes[nodes.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
  });
})();

// Alert Dot
(function () {
  function parseCount(raw) {
    if (!raw) return 0;
    // handles "(3)", "3", "  3 new", empty, etc.
    const m = String(raw).match(/(\d+)/);
    return m ? Math.max(0, parseInt(m[1], 10)) : 0;
  }

  const pmEl = document.querySelector('#leftbar .icon--pm');
  const alEl = document.querySelector('#leftbar .icon--alerts');

  if (pmEl) {
    const pmCount = parseCount(pmEl.getAttribute('data-count-pm'));
    pmEl.classList.toggle('has-new', pmCount > 0);
    // (optional a11y) append to aria-label if present
    if (pmEl.ariaLabel && pmCount > 0) {
      pmEl.ariaLabel = `${pmEl.ariaLabel} (${pmCount} new)`;
    }
  }

  if (alEl) {
    const alCount = parseCount(alEl.getAttribute('data-count-alerts'));
    alEl.classList.toggle('has-new', alCount > 0);
    if (alEl.ariaLabel && alCount > 0) {
      alEl.ariaLabel = `${alEl.ariaLabel} (${alCount} new)`;
    }
  }
})();


// Main Profile Tabs (defensive)
(() => {
  /* ---------- tiny utils ---------- */
  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  function moveBar(bar, btn, container) {
    if (!bar || !btn || !container) return;
    const br = btn.getBoundingClientRect();
    const cr = container.getBoundingClientRect();
    const left = (br.left - cr.left) + container.scrollLeft;
    bar.style.inlineSize = `${br.width}px`;
    bar.style.transform  = `translateX(${left}px)`;
  }

  /* =================================
     TOP-LEVEL TABS (uses aria-controls)
     ================================= */
  const tabsWrap = $('.bm-tabs');
  const tabs     = $$('.bm-tab', tabsWrap);
  const panels   = $$('.bm-panel'); // global panels are fine
  const bar      = $('.bm-tab__active-bar', tabsWrap);

  // If there are no tabs on this page, do nothing.
  if (!tabsWrap || tabs.length === 0 || panels.length === 0) return;

  // Map friendly hash aliases -> actual panel IDs
  const HASH_TO_PANEL = {
    cover: 'tab-cover',
    basic: 'tab-basics', basics: 'tab-basics',
    cheats: 'tab-cheats', cheatsheet: 'tab-cheats',
    freeform: 'tab-freeform',
    plotting: 'tab-plotting',
    ooc: 'tab-ooc'
  };

  function activateTop(panelId, { pushHash = true } = {}) {
    // buttons
    tabs.forEach(btn => {
      const target = btn.getAttribute('aria-controls');
      const on = (target === panelId);
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    // panels
    panels.forEach(p => (p.hidden = p.id !== panelId));
    // bar
    const activeBtn = tabs.find(b => b.getAttribute('aria-controls') === panelId);
    moveBar(bar, activeBtn, tabsWrap);

    // hash
    if (pushHash) {
      const alias =
        Object.entries(HASH_TO_PANEL).find(([, v]) => v === panelId)?.[0] || 'cover';
      const sub =
        panelId === 'tab-plotting'
          ? ($('.bm-subtab[aria-selected="true"]')?.dataset.hash || 'interested')
          : null;
      history.replaceState(null, '', `#${alias}${sub ? `/${sub}` : ''}`);
    }
  }

  /* ===============================
     SUBTABS (Plotting) — optional
     =============================== */
  const plotRoot  = $('#tab-plotting');
  const subWrap   = plotRoot ? $('.bm-subtabs', plotRoot) : null;
  const subtabs   = subWrap ? $$('.bm-subtab', subWrap) : [];
  const subbar    = subWrap ? $('.bm-subtab__active-bar', subWrap) : null;
  const subpanels = plotRoot ? $$('.bm-subpanel', plotRoot) : [];

  function activateSub(subId, { pushHash = true } = {}) {
    if (!subtabs.length || !subpanels.length) return;
    // buttons
    subtabs.forEach(btn => {
      const target = btn.getAttribute('aria-controls'); // e.g. "sub-interested"
      const on = target === subId;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    // panels
    subpanels.forEach(p => (p.hidden = p.id !== subId));
    // bar
    const activeBtn = subtabs.find(b => b.getAttribute('aria-controls') === subId);
    moveBar(subbar, activeBtn, subWrap);

    if (pushHash) {
      const topAlias = 'plotting';
      const subAlias = activeBtn?.dataset.hash || subId.replace(/^sub-/, '');
      history.replaceState(null, '', `#${topAlias}/${subAlias}`);
    }
  }

  /* ===============================
     ROUTER (hash -> state)
     =============================== */
  function routeFromHash() {
    const raw = (location.hash || '#cover').slice(1);
    const [topAlias, subAlias] = raw.split('/');
    const topId = HASH_TO_PANEL[topAlias] || 'tab-cover';

    activateTop(topId, { pushHash: false });

    if (topId === 'tab-plotting' && subtabs.length) {
      const targetSub =
        subtabs.find(b => (b.dataset.hash || b.getAttribute('aria-controls').replace(/^sub-/,''))
                          === (subAlias || 'interested')) || subtabs[0];
      if (targetSub) activateSub(targetSub.getAttribute('aria-controls'), { pushHash: false });
    }
  }

  /* ===============================
     EVENTS (only bind what exists)
     =============================== */
  tabs.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const pid = btn.getAttribute('aria-controls');
      if (pid) activateTop(pid);
    });
  });

  if (subtabs.length) {
    subtabs.forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const sid = btn.getAttribute('aria-controls');
        if (sid) activateSub(sid);
        activateTop('tab-plotting');
      });
    });
  }

  addEventListener('resize', () => {
    moveBar(bar, $('.bm-tab[aria-selected="true"]', tabsWrap), tabsWrap);
    moveBar(subbar, $('.bm-subtab[aria-selected="true"]', subWrap), subWrap);
  }, { passive: true });

  addEventListener('hashchange', routeFromHash, { passive: true });

  // initial mount
  if (document.readyState === 'complete') {
    routeFromHash();
    moveBar(bar, $('.bm-tab[aria-selected="true"]', tabsWrap), tabsWrap);
    moveBar(subbar, $('.bm-subtab[aria-selected="true"]', subWrap), subWrap);
  } else {
    addEventListener('load', () => {
      routeFromHash();
      moveBar(bar, $('.bm-tab[aria-selected="true"]', tabsWrap), tabsWrap);
      moveBar(subbar, $('.bm-subtab[aria-selected="true"]', subWrap), subWrap);
    }, { once: true });
  }
})();


// clipboard

document.addEventListener("click", async (e) => {
  const link = e.target.closest(".permalink");
  if (!link) return; // only handle clicks on .copy-link elements
  e.preventDefault();

  const urlToCopy = link.dataset.copy || link.href;

  try {
    await navigator.clipboard.writeText(urlToCopy);
    console.log("Copied to clipboard:", urlToCopy);
    // optional: show a little feedback
    link.textContent = "copied!";
    setTimeout(() => link.textContent = "permalink", 1500);
  } catch (err) {
    console.error("Failed to copy:", err);
    alert("Could not copy link, please try again.");
  }
});


// mini profile carousel
(function(){
  function setupCarousel(root){
    const track = root.querySelector('.mini-track');
    if(!track) return;

    const cards = [...track.querySelectorAll('.mini-card')];
    const dots  = [...root.querySelectorAll('.mini-dot')];
    const prev  = root.querySelector('.mini-btn.prev');
    const next  = root.querySelector('.mini-btn.next');

    let i = 0;

    const setIndex = (n) => {
      i = (n + cards.length) % cards.length;
      track.style.setProperty('--i', i);
      dots.forEach((d, idx) => {
        const active = idx === i;
        d.classList.toggle('is-active', active);
        d.setAttribute('aria-selected', String(active));
      });
    };

    prev?.addEventListener('click', () => setIndex(i - 1));
    next?.addEventListener('click', () => setIndex(i + 1));

    dots.forEach((dot, idx) => dot.addEventListener('click', () => setIndex(idx)));

    // Keyboard: left/right arrows when focus is within the aside
    root.addEventListener('keydown', (e) => {
      if(e.key === 'ArrowLeft'){ e.preventDefault(); setIndex(i - 1); }
      if(e.key === 'ArrowRight'){ e.preventDefault(); setIndex(i + 1); }
    });

    // Basic swipe (optional, lightweight)
    let sx = null;
    track.addEventListener('pointerdown', (e)=>{ sx = e.clientX; });
    track.addEventListener('pointerup', (e)=>{
      if(sx == null) return;
      const dx = e.clientX - sx;
      if(Math.abs(dx) > 40) setIndex(i + (dx < 0 ? 1 : -1));
      sx = null;
    });

    setIndex(0);
  }

  document.querySelectorAll('.bm-post__aside[data-mini="carousel"]').forEach(setupCarousel);
})();

// First/last split
(function () {
  const PARTICLES = new Set(["van","von","de","del","della","de la","de-la","di","da","du","bin","al","ibn"]);
  const SUFFIXES  = new Set(["jr.","sr.","jr","sr","ii","iii","iv","v"]);

  const splitName = (raw) => {
    let s = (raw || "").replace(/\s+/g, " ").trim();
    if (!s) return { first: "", last: "" };
    const parts = s.split(" ");
    if (parts.length === 1) return { first: s, last: "" };

    let suffix = "";
    const lastLower = parts[parts.length - 1].toLowerCase().replace(/\.$/,"");
    if (SUFFIXES.has(lastLower)) suffix = " " + parts.pop();

    let last = parts.pop();

    if (parts.length) {
      const prev = parts[parts.length - 1];
      const prev2 = parts.length > 1 ? (parts[parts.length - 2] + " " + prev).toLowerCase() : "";
      const prev1lower = prev.toLowerCase();
      if (PARTICLES.has(prev2)) last = parts.splice(parts.length - 2, 2).join(" ") + " " + last;
      else if (PARTICLES.has(prev1lower)) last = parts.pop() + " " + last;
    }
    return { first: parts.join(" "), last: last + suffix };
  };

  const processAnchor = (a) => {
    if (!a || a.dataset.nameSplit === "1" || a.querySelector(".fn,.ln")) return;
    const { first, last } = splitName(a.textContent);
    a.innerHTML = last
      ? `<span class="fn">${first}</span> <strong class="ln">${last}</strong>`
      : `<span class="fn">${first}</span>`;
    a.dataset.nameSplit = "1";
  };

  const processAll = () => {
    document.querySelectorAll(".bm-post__author > a").forEach(processAnchor);
  };

  const startObserver = () => {
    // narrow this to your post container if you have one (faster):
    const root = document.querySelector("#postlist, .tableborder, body");
    if (!root) return;

    // initial pass
    processAll();

    // watch for harness re-renders
    const mo = new MutationObserver((mutations) => {
      let touched = false;
      for (const m of mutations) {
        if (m.type === "childList") {
          // new anchors
          m.addedNodes.forEach(node => {
            if (node.nodeType !== 1) return;
            if (node.matches?.(".bm-post__author > a")) processAnchor(node);
            node.querySelectorAll?.(".bm-post__author > a").forEach(processAnchor);
          });
          touched = true;
        } else if (m.type === "characterData") {
          // text changed under the anchor (harness rewrote textContent)
          const a = m.target.parentElement?.closest?.(".bm-post__author > a");
          if (a) { a.dataset.nameSplit = ""; processAnchor(a); }
          touched = true;
        }
      }
      // safety: if many small changes happen, one more sweep
      if (touched) processAll();
    });

    mo.observe(root, {
      subtree: true,
      childList: true,
      characterData: true
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startObserver);
  } else {
    startObserver();
  }
})();


/******** "by" cleanout ********/
document.querySelectorAll('#recent-topics tr').forEach(tr => {
  const info = tr.querySelector('.recent-topics-info');
  if (!info) return;
  const titleA  = info.querySelector('a:nth-of-type(1)');
  const authorA = info.querySelector('a:nth-of-type(2)');
  if (!titleA) return;

  // rebuild left cell: title (line 1) + by author (line 2)
  const titleHTML  = `<span class="rt-title">${titleA.outerHTML}</span>`;
  const authorHTML = authorA ? `<span class="rt-author">${authorA.outerHTML}</span>` : "";
  info.innerHTML = `${titleHTML}<br>${authorHTML}`;
});

/* spoiler toggle */
document.querySelectorAll('.spoiler-inline').forEach(spoiler => {
  spoiler.addEventListener('click', () => {
    spoiler.classList.toggle('is-open');
  });
});

/* move recent topics */
const recentTopics = document.getElementById('recent-topics');
const bmRecent = document.getElementById('bm-recent');

if (recentTopics && bmRecent) {
  bmRecent.appendChild(recentTopics);
}