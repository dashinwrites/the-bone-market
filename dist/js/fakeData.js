let accounts = [];

const characterProfile = {
    accountId: '3',
    type: 'character',
    groupName: 'orbit',
    birthday: { year: '1992', month: 'April', day: '10' },
    fields: {
        1: 'character',
        2: 'Alias',
        3: 'they/them',
        6: 'Fade to Black',
        7: 'Graphic',
        8: 'Uncensored',
        9: 'EST',
        10: 'Present Tense',
        11: 'Third Person',
        12: 'Weekly',
        13: 'Weekly',
        14: 'No specific triggers listed.',
        15: 'Flexible',
        16: 'Aurelian Viremont',
        17: 'Aure',
        18: '1992',
        19: 'April',
        20: '10',
        21: 'he/him',
        22: 'Cis Man',
        23: 'Bisexual',
        24: 'Biromantic',
        25: 'Bonded',
        26: 'Name here',
        27: 'Syndicate Broker',
        28: 'Anton Thiemke',
        29: '30s',
        30: `6'1"`,
        31: 'Tall, broad-shouldered. A burn scar runs from the left wrist to elbow.',
        32: 'Resistance',
        33: 'Crown',
        34: 'Dragon',
        36: 'Fire',
        37: 'Human-primary',
        42: 'Yes',
        43: 'Flame-weaving, innate draconic',
        44: 'Sustained high-temperature flame. Partial transformation.',
        45: 'Cold environments reduce power significantly.',
        46: 'House Cendris',
        52: '<p>Born in the lower catacombs.</p><p>Former title: The Unmarked Flame.</p>',
        53: 'Brief personality and history summary goes here.',
        56: '<p>Allies and rivals within the Market.</p><p>Characters navigating moral gray areas.</p>',
        57: '<p>Purely romantic plots.</p>',
        58: '<tag-rel data-type="lover"><a href="#">Name</a></tag-rel> — short description of dynamic.',
        59: 'body horror, grief',
        60: 'https://example.com',
        68: 'https://i.pinimg.com/736x/3c/60/dc/3c60dc38456d825f76f28cf4efd5b7b1.jpg',
        69: 'https://i.postimg.cc/1zG7xc0n/image.png',
        70: 'https://i.pinimg.com/736x/ff/0e/ad/ff0eadd3040f257ddf4287b764f8cd6d.jpg',
        71: 'https://i.pinimg.com/736x/8a/88/69/8a8869ae98784ba657810521349c7925.jpg',
        72: 'https://i.pinimg.com/1200x/90/58/d4/9058d4033b536c948e861e76d38c0c23.jpg',
        73: 'https://i.pinimg.com/736x/fe/4d/01/fe4d018227094077378283291af55107.jpg',
    }
};

const memberProfile = {
    accountId: '1',
    type: 'member',
    birthday: { year: '', month: '', day: '' },
    fields: {
        1: 'member',
        2: 'Dashin',
        3: 'she/her',
        6: 'Explicit',
        7: 'Graphic',
        8: 'Uncensored',
        9: 'EST',
        10: 'Past Tense',
        11: 'Third Person',
        12: 'Weekly',
        13: 'Weekly',
        14: 'No specific triggers.',
        15: 'Flexible',
    }
};

// ── INJECT FAKE PROFILE DATA INTO DOM ────────────────────────────────────────
// Creates hidden #field_N elements that profileField() can read locally.
// Only runs in local dev — on Jcink, real field elements are output by the CMS.
function injectFakeProfileData(profile) {
    // inject account type and group class onto bm-profile
    const profileEl = document.querySelector('.bm-profile');
    

    // create a hidden container for field elements
    let container = document.querySelector('#fake-fields');
    if (!container) {
        container = document.createElement('div');
        container.id = 'fake-fields';
        container.style.display = 'none';
        document.body.appendChild(container);
    }

    // inject each field as a div with the correct ID
    Object.entries(profile.fields).forEach(([id, value]) => {
        let el = document.querySelector(`#field_${id}`);
        if (!el) {
            el = document.createElement('div');
            el.id = `field_${id}`;
            container.appendChild(el);
        }
        el.innerHTML = value;
    });

    // inject image src values into mosaic cells directly
    // since those are in src attributes not text content
    const mosaicFields = { 68: 'a', 69: 'b', 70: 'c', 71: 'd', 72: 'e', 73: 'f' };
    Object.entries(mosaicFields).forEach(([fieldId, cell]) => {
        const img = document.querySelector(`.bm-mosaic__cell--${cell} img`);
        const val = profile.fields[fieldId];
        if (img && val) img.src = val;
    });
}

function setRosterLocal() {
  const rosterEl = document.querySelector('.profile--roster');
  if (!rosterEl) return;

  const fakeChars = [
    { id: '002', name: 'Aurelian Viremont' },
    { id: '003', name: 'Ren Jiayi' },
    { id: '004', name: 'Zhao Fanxing' },
  ];

  fakeChars.forEach(char => {
    const imageDiv = createAvatars('switch--image', char.id);
    const html = `<a class="switch--block" href="?showuser=${char.id}">
      ${imageDiv}
      <span class="switch--name">${formatName(capitalize(char.name))}</span>
    </a>`;
    rosterEl.insertAdjacentHTML('beforeend', html);
  });
}