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
        // check for Jcink's "No Information" placeholder or genuinely empty
        const hasContent = el.querySelector('dd, span, p');
        if (!hasContent) return;
        const text = hasContent.innerText?.trim() ?? '';
        if (text === '' || text === 'No Information') {
            el.remove();
        }
    });
}

// ── SPECIES VISIBILITY ON PROFILE ────────────────────────────────────────────
// Mirrors UCP logic but reads displayed field values, not input values.
function applyProfileSpecies() {
    const species = profileField(34).toLowerCase();

    // hide all sub-field groups first
    document.querySelectorAll('[class*="bm-species-sub"]').forEach(el => {
        el.classList.add('hidden');
    });

    if (species === 'mortal') {
        // hide resonance, perspective, magic section entirely
        document.querySelector('#field_32')?.closest('.bm-field-list__item')?.classList.add('hidden');
        document.querySelector('#field_33')?.closest('.bm-field-list__item')?.classList.add('hidden');
        document.querySelector('.bm-magic-section')?.classList.add('hidden');
        return;
    }

    // show relevant sub-fields
    const map = {
        dragon:  ['dragon'],
        shifter: ['shifter'],
        vampire: ['vampire'],
        fae:     ['fae'],
        hybrid:  ['specify'],
        other:   ['specify'],
    };

    const toShow = map[species] || [];
    toShow.forEach(key => {
        document.querySelectorAll(`.bm-species-sub--${key}`).forEach(el => {
            el.classList.remove('hidden');
        });
    });

    // shifter freeform — only show if form = other
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
// Switches displayed resonance label based on Perspective field value.
// Market perspective: Crown→Apex, Core→Median, Hollow→Nadir
// Resistance perspective: shows Crown/Core/Hollow (default stored values)
function applyProfilePerspective() {
    const perspective = profileField(32).toLowerCase();
    const resonanceEls = document.querySelectorAll('.bm-resonance');

    const marketLabels = {
        crown:  'Apex',
        core:   'Median',
        hollow: 'Nadir',
    };

    const resistanceLabels = {
        crown:  'Crown',
        core:   'Core',
        hollow: 'Hollow',
    };

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
// Populates the .bm-cover__subspecies span with the relevant sub-field value.
function applyProfileSubspecies() {
    const species  = profileField(34).toLowerCase();
    const subEl    = document.querySelector('.bm-cover__subspecies');
    if (!subEl) return;

    let subValue = '';

    switch (species) {
        case 'dragon':
            subValue = profileField(36); // element
            break;
        case 'shifter':
            subValue = profileField(38); // form
            if (subValue.toLowerCase() === 'other') {
                subValue = profileField(39) || subValue;
            }
            break;
        case 'vampire':
            subValue = profileField(40); // bloodline
            break;
        case 'fae':
            subValue = profileField(41); // court
            break;
        case 'hybrid':
        case 'other':
            subValue = profileField(35); // specify
            break;
        default:
            subValue = '';
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
    const target   = document.querySelector('.bm-freeform__overflow');
    if (target && overflow) {
        // field_55 outputs HTML via Jcink, inject it directly
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
    const age  = calculateAge(birthday);
    document.querySelectorAll('age-clip').forEach(clip => clip.innerText = age);
}

// ── OOC PROFILE: pull player data from parent account ────────────────────────
// For character accounts: fetches parent OOC data and injects into
//   .clip-player, .clip-player-alias, .clip-player-pronouns, .clip-player-avatar
// For OOC accounts: reads fields directly from the current profile.
function applyPlayerInfo(accountId) {
    fetch(members)
        .then(r => r.json())
        .then(memberData => {
            fetch(claims)
                .then(r => r.json())
                .then(characterData => {

                    // determine if this is a character account
                    const existing = characterData.filter(c => c.AccountID === accountId)[0];
                    const parentId = existing ? existing.ParentID : accountId;
                    const parent   = memberData.filter(m => m.AccountID === parentId)[0];

                    if (!parent) return;

                    // inject into cover "Filed by" block
                    document.querySelectorAll('.clip-player').forEach(el => {
                        el.innerHTML = initPlayerInfo(parent);
                    });

                    // inject into OOC tab header
                    const aliasEls    = document.querySelectorAll('.clip-player-alias');
                    const pronounsEls = document.querySelectorAll('.clip-player-pronouns');
                    const avatarEls   = document.querySelectorAll('.clip-player-avatar');

                    aliasEls.forEach(el => {
                        el.textContent = capitalize(parent.Member);
                    });

                    pronounsEls.forEach(el => {
                        el.textContent = parent.Pronouns ?? '';
                    });

                    avatarEls.forEach(el => {
                        el.innerHTML = createAvatars('ooc-avatar-img', parentId);
                    });
                });
        });
}

// ── initCharacter ─────────────────────────────────────────────────────────────
// Runs for character accounts (Account Type = character)
function initCharacter(isLocal = false) {
    // remove OOC-only elements
    document.querySelectorAll('.memAccOnly').forEach(el => el.remove());

    // read birthday fields
    const birthday = {
        year:  profileField(18),
        month: profileField(19),
        day:   profileField(20),
    };

    applyAge(birthday);
    applyBirthday(birthday);
    applyProfilePerspective();
    applyProfileSpecies();
    applyProfileMagic();
    applyProfileSubspecies();
    applyFreeformOverflow();
    removeBlankFields();

    // pull player info from parent account
    const accountId = document.querySelector('body').dataset.account
                   ?? document.querySelector('body').id.replace('profile-', '');

    if (!isLocal) {
        applyPlayerInfo(accountId);

        // tracker (if implemented)
        if (typeof FillTracker === 'function') {
            const title = profileField(16) || document.querySelector('.bm-cover__name')?.innerText || '';
            FillTracker(title, trackerParams);
        }
    }
}

// ── initMember ────────────────────────────────────────────────────────────────
// Runs for OOC/member accounts (Account Type = member)
function initMember() {
    // remove character-only elements
    document.querySelectorAll('.charOnly').forEach(el => el.remove());

    // populate the character roster grid
    setRoster();

    // for OOC accounts, player info is their own fields — no fetch needed
    // but we still populate the OOC tab header from the displayed fields
    const alias    = profileField(2);  // Alias (OOC field)
    const pronouns = profileField(3);  // Player Pronouns

    document.querySelectorAll('.clip-player-alias').forEach(el => {
        el.textContent = alias ? capitalize(alias) : '';
    });

    document.querySelectorAll('.clip-player-pronouns').forEach(el => {
        el.textContent = pronouns ?? '';
    });

    // avatar from Jcink avatar system
    const accountId = document.querySelector('body').dataset.account ?? '';
    document.querySelectorAll('.clip-player-avatar').forEach(el => {
        el.innerHTML = createAvatars('ooc-avatar-img', accountId);
    });

    removeBlankFields();
}

// ── initProfile ───────────────────────────────────────────────────────────────
// Entry point — called from scripts.js on pageType === 'Profile'
// Reads Account Type field and branches accordingly.
function initProfile(isLocal = false) {
    const accountType = profileField(1).toLowerCase();

    if (accountType === 'character') {
        initCharacter(isLocal);
    } else {
        initMember();
    }
}

// ── formatProfilePlayer ───────────────────────────────────────────────────────
// Generates the "Filed by" HTML injected into .clip-player on character covers.
// Called by applyPlayerInfo with the parent member data object.
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
// Populates the .profile--roster grid on OOC account profiles.
// Uses the subaccount switcher select to get character list.
function setRoster() {
    const rosterEl = document.querySelector('.profile--roster');
    if (!rosterEl) return;

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