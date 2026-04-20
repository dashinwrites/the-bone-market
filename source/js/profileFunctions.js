// ── PROFILE INITIALIZATION ───────────────────────────────────────────────────
// These functions run on pageType === 'Profile'
// They replace the previous initCharacter / initMember / initProfile functions.
//
// Field ID reference (display values read from DOM):
//   field_1  = Account Type        field_32 = Perspective
//   field_16 = Full Name           field_33 = Resonance
//   field_18 = Birth Year          field_34 = Species
//   field_19 = Birth Month         field_35 = Species (specify)
//   field_20 = Birth Day           field_36 = Dragon Element
//   field_22 = Gender              field_37 = Dragon Form Preference
//   field_27 = Occupation          field_38 = Shifter Form
//   field_28 = Face Claim          field_39 = Shifter Form (specify)
//   field_33 = Resonance           field_40 = Vampire Bloodline
//   field_34 = Species             field_41 = Fae Court
//   field_42 = Magic Access        field_43 = Magic Type & Source
//   field_44 = Notable Abilities   field_45 = Limitations & Weaknesses
//   field_46 = Pack/Coven/Kin      field_52 = Quick Facts
//   field_53 = Overview            field_54 = Freeform
//   field_55 = Freeform Overflow   field_56 = Plot Hooks
//   field_57 = Not Interested      field_58 = Relationships
//   field_59 = Content Warnings
// ─────────────────────────────────────────────────────────────────────────────

// ── HELPER: read a displayed profile field value ──────────────────────────────
function profileField(id) {
  const el = document.querySelector(`#field_${id}`);
  if (!el) return '';
  const text = el.innerText.trim();
  return (text === 'No Information' || text === '') ? '' : text;
}

// ── HELPER: hide a profile field row if empty ─────────────────────────────────
function cleanProfileField(id) {
  const row = document.querySelector(`#field_${id}`);
  if (!row) return;
  const value = profileField(id);
  if (!value) {
    row.closest('.bm-field-list__item, .bm-cover__field, .bm-ooc__field')?.classList.add('hidden');
  }
}

// ── HELPER: remove blank optional fields across whole profile ─────────────────
function removeBlankFields() {
  document.querySelectorAll('.optional').forEach(el => {
    const hasContent = el.querySelector('dd, span, p');
    if (!hasContent) return;
    const text = hasContent.innerText?.trim() ?? '';
    if (text === '' || text === 'No Information') {
      el.remove();
    }
  });
}

// ── SPECIES VISIBILITY ON PROFILE ────────────────────────────────────────────
function applyProfileSpecies() {
  const species = profileField(34).toLowerCase();

  document.querySelectorAll('[class*="bm-species-sub"]').forEach(el => {
    el.classList.add('hidden');
  });

  if (species === 'mortal') {
    document.querySelector('#field_32')?.closest('.bm-field-list__item')?.classList.add('hidden');
    document.querySelector('#field_33')?.closest('.bm-field-list__item')?.classList.add('hidden');
    document.querySelector('.bm-magic-section')?.classList.add('hidden');
    return;
  }

  const map = {
    dragon: ['dragon'],
    shifter: ['shifter'],
    vampire: ['vampire'],
    fae: ['fae'],
    hybrid: ['specify'],
    other: ['specify'],
  };

  const toShow = map[species] || [];
  toShow.forEach(key => {
    document.querySelectorAll(`.bm-species-sub--${key}`).forEach(el => {
      el.classList.remove('hidden');
    });
  });

  if (species === 'shifter') {
    const shifterForm = profileField(38).toLowerCase();
    if (shifterForm !== 'other') {
      document.querySelectorAll('.bm-species-sub--shifter-specify').forEach(el => {
        el.classList.add('hidden');
      });
    }
  }
}

// ── MAGIC VISIBILITY ON PROFILE ───────────────────────────────────────────────
function applyProfileMagic() {
  const magic = profileField(42).toLowerCase();
  if (magic !== 'yes') {
    document.querySelectorAll('.bm-magic-sub').forEach(el => {
      el.closest('.bm-field-list__item')?.classList.add('hidden');
    });
  }
}

// ── PERSPECTIVE / RESONANCE LABEL TOGGLE ─────────────────────────────────────
function applyProfilePerspective() {
  const perspective = profileField(32).toLowerCase();
  const resonanceEls = document.querySelectorAll('.bm-resonance');

  const marketLabels = { crown: 'Apex', core: 'Median', hollow: 'Nadir' };
  const resistanceLabels = { crown: 'Crown', core: 'Core', hollow: 'Hollow' };

  resonanceEls.forEach(el => {
    const raw = el.dataset.resonance?.toLowerCase() ?? '';
    if (perspective === 'market') {
      el.textContent = marketLabels[raw] ?? el.textContent;
    } else {
      el.textContent = resistanceLabels[raw] ?? el.textContent;
    }
  });
}

// ── COVER: SUBSPECIES INLINE LABEL ───────────────────────────────────────────
function applyProfileSubspecies() {
  const species = profileField(34).toLowerCase();
  const subEl = document.querySelector('.bm-cover__subspecies');
  if (!subEl) return;

  let subValue = '';
  switch (species) {
    case 'dragon': subValue = profileField(36); break;
    case 'shifter':
      subValue = profileField(38);
      if (subValue.toLowerCase() === 'other') subValue = profileField(39) || subValue;
      break;
    case 'vampire': subValue = profileField(40); break;
    case 'fae': subValue = profileField(41); break;
    case 'hybrid':
    case 'other': subValue = profileField(35); break;
    default: subValue = '';
  }

  if (subValue) {
    subEl.textContent = subValue;
    subEl.classList.remove('hidden');
  } else {
    subEl.classList.add('hidden');
  }
}

// ── FREEFORM OVERFLOW ─────────────────────────────────────────────────────────
function applyFreeformOverflow() {
  const overflow = profileField(55);
  const target = document.querySelector('.bm-freeform__overflow');
  if (target && overflow) {
    const raw = document.querySelector('#field_55');
    if (raw) target.innerHTML = raw.innerHTML;
  }
}

// ── BIRTHDAY DISPLAY ──────────────────────────────────────────────────────────
function applyBirthday(birthday) {
  const clips = document.querySelectorAll('birthday-clip');
  if (!clips.length) return;

  let display = '';
  if (parseInt(birthday.year) < 0) {
    display = `${birthday.month} ${birthday.day}, ${Math.abs(parseInt(birthday.year))} BC`;
  } else {
    display = `${birthday.month} ${birthday.day}, ${birthday.year}`;
  }

  clips.forEach(clip => clip.innerText = display);
}

// ── AGE DISPLAY ───────────────────────────────────────────────────────────────
function applyAge(birthday) {
  const age = calculateAge(birthday);
  document.querySelectorAll('age-clip').forEach(clip => clip.innerText = age);
}

// ── OOC PROFILE: pull player data from parent account ────────────────────────
function applyPlayerInfo(accountId) {
  fetch(members)
    .then(r => r.json())
    .then(memberData => {
      fetch(claims)
        .then(r => r.json())
        .then(characterData => {

          const existing = characterData.filter(c => c.AccountID === accountId)[0];
          const parentId = existing ? existing.ParentID : accountId;
          const parent = memberData.filter(m => m.AccountID === parentId)[0];

          if (!parent) return;

          document.querySelectorAll('.clip-player').forEach(el => {
            el.innerHTML = initPlayerInfo(parent);
          });

          document.querySelectorAll('.clip-player-alias').forEach(el => {
            el.textContent = capitalize(parent.Member);
          });

          document.querySelectorAll('.clip-player-pronouns').forEach(el => {
            el.textContent = parent.Pronouns ?? '';
          });

          document.querySelectorAll('.clip-player-avatar').forEach(el => {
            el.innerHTML = createAvatars('ooc-avatar-img', parentId);
          });
        });
    });
}

// ── initCharacter ─────────────────────────────────────────────────────────────
function initCharacter(isLocal = false) {
  document.querySelectorAll('.memAccOnly').forEach(el => el.remove());

  const birthday = {
    year: profileField(18),
    month: profileField(19),
    day: profileField(20),
  };

  applyAge(birthday);
  applyBirthday(birthday);
  applyProfilePerspective();
  applyProfileSpecies();
  applyProfileMagic();
  applyProfileSubspecies();
  applyFreeformOverflow();
  removeBlankFields();

  const accountId = document.querySelector('body').dataset.account
    ?? document.querySelector('body').id.replace('profile-', '');

  if (!isLocal) {
    applyPlayerInfo(accountId);

    if (typeof FillTracker === 'function') {
      const title = profileField(16) || document.querySelector('.bm-cover__name')?.innerText || '';
      FillTracker(title, trackerParams);
    }
  }

  // defer until scripts.js has loaded so splitName is available
  setTimeout(() => {
    applyCoverLayout();
    applyCoverName();
  }, 0);
}

// ── initMember ────────────────────────────────────────────────────────────────
function initMember() {
  document.querySelectorAll('.bm-profile .charOnly').forEach(el => el.remove());

  // alias the subaccounts select as showuser so setRoster() can find it
  const subSelect = document.querySelector('#account-switch #subaccounts_menu select')
    ?? document.querySelector('#subaccounts_menu select')
    ?? document.querySelector('select[name="sub_id"]');
  if (subSelect) subSelect.setAttribute('name', 'showuser');

  setRoster();

  const alias = profileField(2);
  const pronouns = profileField(3);

  document.querySelectorAll('.clip-player-alias').forEach(el => {
    el.textContent = alias ? capitalize(alias) : '';
  });

  document.querySelectorAll('.clip-player-pronouns').forEach(el => {
    el.textContent = pronouns ?? '';
  });

  const accountId = document.querySelector('body').dataset.account ?? '';
  document.querySelectorAll('.clip-player-avatar').forEach(el => {
    el.innerHTML = createAvatars('ooc-avatar-img', accountId);
  });

  removeBlankFields();
}

// ── initProfile ───────────────────────────────────────────────────────────────
function initProfile(isLocal = false) {
  const profileEl = document.querySelector('.bm-profile');

  //read account type from class eg type-Member or type-Character
  const typeClass = [...profileEl.classList]
    .find(c => c.startsWith('type-'));
  const accountType = typeClass ? typeClass.replace('type-', '').toLowerCase() : '';

  if (accountType === 'member') {
    initMember();
  } else if (accountType === 'character') {
    initCharacter(isLocal);
  }

  if (profileEl) {
    const bgImg = getComputedStyle(profileEl)
      .getPropertyValue('--profile-bg-img').trim();
    if (bgImg && bgImg !== 'none') {
      document.body.style.setProperty('--profile-bg-img', bgImg);
    }
  }
}

// ── initPlayerInfo ────────────────────────────────────────────────────────────
function initPlayerInfo(parent = null) {
  if (parent) {
    return `<span class="bm-cover__filed-alias">${capitalize(parent.Member)}</span>
                  <span class="bm-cover__filed-sep">·</span>
                  <span class="bm-cover__filed-pronouns">${parent.Pronouns ?? ''}</span>
                  <span class="bm-cover__filed-sep">·</span>
                  <span class="bm-cover__filed-tz">${parent.Timezone ?? ''}</span>`;
  }
  return `<span class="bm-cover__filed-pending">claims pending</span>`;
}

// ── setRoster ─────────────────────────────────────────────────────────────────
function setRoster() {
  const rosterEl = document.querySelector('.profile--roster');
  if (!rosterEl) return;

  if (!window.location.hostname.includes('jcink.net')) {
    if (typeof setRosterLocal === 'function') setRosterLocal();
    return;
  }

  const subSelect = document.querySelector('#account-switch #subaccounts_menu select')
    ?? document.querySelector('#subaccounts_menu select')
    ?? document.querySelector('select[name="sub_id]');
  if (subSelect) subSelect.setAttribute('name', 'showuser');

  const alphaChars = Alpha(document.querySelectorAll('select[name=showuser] option'));

  alphaChars.forEach(character => {
    const imageDiv = createAvatars('switch--image', character.account);
    const html = `<a class="switch--block" href="?showuser=${character.account}">
              ${imageDiv}
              <span class="switch--name">${formatName(capitalize(character.character))}</span>
          </a>`;
    rosterEl.insertAdjacentHTML('beforeend', html);
  });
}

// ── COVER LAYOUT ─────────────────────────────────────────────────────────────
function applyCoverLayout() {
  const coverEl = document.querySelector('.bm-cover');
  if (!coverEl) return;

  const isLocal = !window.location.hostname.includes('jcink.net');

  const layout = (isLocal ? 'mosaic' : (profileField('XX') || 'solo')).toLowerCase().trim();
  coverEl.dataset.layout = layout;

  const layoutImageCount = {
    solo: 1, diptych: 2, triptych: 3, quad: 4,
    feature: 3, strip: 4, mosaic: 6, gallery: 8, expanded: 10
  };

  const needed = layoutImageCount[layout] ?? 1;

  // inject fake images locally
  if (isLocal) {
    const fakeSrcs = [
      'https://i.pinimg.com/736x/3c/60/dc/3c60dc38456d825f76f28cf4efd5b7b1.jpg',
      'https://i.postimg.cc/1zG7xc0n/image.png',
      'https://i.pinimg.com/736x/ff/0e/ad/ff0eadd3040f257ddf4287b764f8cd6d.jpg',
      'https://i.pinimg.com/736x/8a/88/69/8a8869ae98784ba657810521349c7925.jpg',
      'https://i.pinimg.com/1200x/90/58/d4/9058d4033b536c948e861e76d38c0c23.jpg',
      'https://i.pinimg.com/736x/fe/4d/01/fe4d018227094077378283291af55107.jpg',
      'https://i.pinimg.com/736x/b4/13/a1/b413a1a83d2294a8ce8d73d06d90c5c2.jpg',
      'https://i.pinimg.com/736x/9c/82/0f/9c820f9b2afd284dc47b7b4281861047.jpg',
      'https://files.jcink.net/uploads2/idolsandichor//av-52.png?1763675174',
      'https://i.pinimg.com/736x/82/6e/76/826e76b932b901fe47541a7ea29c100c.jpg',
    ];
    coverEl.querySelectorAll('.bm-cover__img-cell').forEach((cell, i) => {
      if (i < needed && fakeSrcs[i]) {
        cell.querySelector('img').src = fakeSrcs[i];
        cell.hidden = false;
      } else {
        cell.hidden = true;
      }
    });
    return;
  }
  // on Jcink: hide cells with empty src or beyond layout count
coverEl.querySelectorAll('.bm-cover__img-cell').forEach((cell, i) => {
  const src = cell.querySelector('img')?.getAttribute('src')?.trim() ?? '';
  cell.hidden = !src || i >= needed;
});
}

// ── COVER: split name into fn/ln spans ────────────────────────────────────────
function applyCoverName() {
  const nameEl = document.querySelector('.bm-cover__name');
  if (!nameEl || nameEl.dataset.nameSplit) return;

  const raw = nameEl.textContent.trim();
  const parts = raw.split(' ');
  if (parts.length < 2) {
    nameEl.innerHTML = `<span class="fn">${raw}</span>`;
  } else {
    const last = parts.pop();
    const first = parts.join(' ');
    nameEl.innerHTML = `<span class="fn">${first}</span><strong class="ln">${last}</strong>`;
  }
  nameEl.dataset.nameSplit = '1';
}