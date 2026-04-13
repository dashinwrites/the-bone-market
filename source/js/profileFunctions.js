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

      // ── LOCK PROFILE HEIGHT ───────────────────────────────────────────────────────
      // Measures the cover tab's natural height and pins all other panels to it
      // via --panel-height. Waits for images to load before measuring.
      function lockProfileHeight() {
        const profile = document.querySelector('.bm-profile');
        const cover = document.querySelector('#tab-cover');
        if (!profile || !cover) return;

        const wasHidden = cover.hidden;
        cover.hidden = false;
        cover.style.visibility = 'hidden';

        const images = [...cover.querySelectorAll('img')];
        const imagePromises = images.map(img =>
          img.complete ? Promise.resolve() :
            new Promise(res => {
              img.addEventListener('load', res, { once: true });
              img.addEventListener('error', res, { once: true });
            })
        );

        Promise.all(imagePromises).then(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              // Measure the full profile height, not just the cover
              const totalHeight = profile.scrollHeight;
              cover.hidden = wasHidden;
              cover.style.visibility = '';

              if (totalHeight > 0) {
                profile.style.setProperty('--panel-height', `${totalHeight}px`);
              }
            });
          });
        });
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

                // Re-measure after async content lands
                lockProfileHeight();
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
      }

      // ── initMember ────────────────────────────────────────────────────────────────
      function initMember() {
        document.querySelectorAll('.bm-profile .charOnly').forEach(el => el.remove());
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
        const accountType = profileField(1).toLowerCase();

        if (accountType === 'member') {
          initMember();
        } else if (accountType === 'character') {
          initCharacter(isLocal);
        }

        const profileEl = document.querySelector('.bm-profile');
        if (profileEl) {
          const bgImg = getComputedStyle(profileEl)
            .getPropertyValue('--profile-bg-img').trim();
          if (bgImg && bgImg !== 'none') {
            document.body.style.setProperty('--profile-bg-img', bgImg);
          }
        }

        // Must run after tab switcher has hidden all panels —
        // tab switcher is in scripts.js which loads after this script,
        // so defer until next task via setTimeout 0
        setTimeout(lockProfileHeight, 0);
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