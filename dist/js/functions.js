/***** Profile *****/
function formatAesthetics(aesthetics, images) {
    let imageHTML;
    switch (aesthetics) {
        case 'Mosaic':
            imageHTML = `<span class="twoWide"><img src="${images['square-1']}" title="Square #1" alt="Square #1" loading="lazy" /></span>
                <span class="twoWide"><img src="${images['square-2']}" title="Square #2" alt="Square #2" loading="lazy" /></span>
                <span><img src="${images['tall-1']}" title="Tall #1" alt="Tall #1" loading="lazy" /></span>
                <span class="twoWide"><img src="${images['square-3']}" title="Square #3" alt="Square #3" loading="lazy" /></span>
                <span class="twoHigh"><img src="${images['tall-2']}" title="Tall #2" alt="Tall #2" loading="lazy" /></span>
                <span class="threeWide"><img src="${images['wide-1']}" title="Wide #1" alt="Wide #1" loading="lazy" /></span>`;
            break;
        case 'Grid':
            imageHTML = `<span class="twoWide"><img src="${images['wide-1']}" title="Wide #1" alt="Wide #1" loading="lazy" /></span>
                <span class="twoHigh"><img src="${images['tall-1']}" title="Tall #1" alt="Tall #1" loading="lazy" /></span>
                <span><img src="${images['square-1']}" title="Square #1" alt="Square #1" loading="lazy" /></span>
                <span><img src="${images['square-2']}" title="Square #2" alt="Square #2" loading="lazy" /></span>`;
            break;
        case 'Single':
        default:
            imageHTML = `<span><img src="${images['tall-1']}" title="Tall #1" alt="Tall #1" loading="lazy" /></span>`;
            break;
    }
    return imageHTML;
}

function submitMemberData(e) {
    e.innerHTML = 'Submitting...';

    let form = document.querySelector('#ucpcontent form'),
        accountId = document.querySelector('body').dataset.accountId,
        alias = form.querySelector('#field_3_input'),
        pronouns = form.querySelector('#field_4_input'),
        age = form.querySelector('#field_5_input'),
        timezone = form.querySelector('#field_6_input'),
        mature = form.querySelector('#field_7_input'),
        pov = form.querySelector('#field_8_input'),
        tense = form.querySelector('#field_9_input'),
        triggers = form.querySelector('#field_10_input'),
        image = form.querySelector('#field_60_input');

    let sheetData = {
        SubmissionType: `edit-member`,
        Member: getStandardValue(alias),
        Pronouns: getStandardValue(pronouns),
        Age: getValue(age),
        Timezone: getStandardValue(timezone),
        Mature: getSelectText(mature),
        POV: getSelectText(pov),
        Tense: getSelectText(tense),
        Image: getValue(image),
        Triggers: getValue(triggers),
    }

    fetch(members)
        .then((response) => response.json())
        .then((data) => {
            let existing = data.filter(item => item.AccountID === accountId);
            if (existing.length) {
                sheetData.SubmissionType = 'edit-member';
                editMember(existing[0], sheetData);
            } else {
                sheetData.SubmissionType = 'add-member';
                sheetData.AccountID = accountId;
                sheetData.Group = 'writer';
                sheetData.GroupID = '6';

                let staffDiscord = {
                    title: `New Member Data Added: ${capitalize(sheetData.Member, [' ', '-'])}`,
                    text: `No action required at this time.`,
                    hook: claimLogs,
                }

                sendAjax(null, sheetData, staffDiscord);
            }
        });
}
function editMember(existing, data) {
    let original = { ...existing };
    let initialMessage = ``, changeMessage = ``;

    if (data.Alias !== original.Alias) {
        existing.Member = data.Alias;
        if (initialMessage !== '') {
            initialMessage += `\n`;
            changeMessage += `\n`;
        }
        initialMessage += `**Alias:** ${capitalize(original.Member, [' ', '-'])}`;
        changeMessage += `**Alias:** ${capitalize(existing.Member, [' ', '-'])}`;
    }

    if (data.Pronouns !== original.Pronouns) {
        existing.Pronouns = data.Pronouns;
        if (initialMessage !== '') {
            initialMessage += `\n`;
            changeMessage += `\n`;
        }
        initialMessage += `**Pronouns:** ${original.Pronoun}`;
        changeMessage += `**Pronouns:** ${existing.Pronouns}`;
    }

    if (data.Age !== original.Age) {
        existing.Age = data.Age;
        if (initialMessage !== '') {
            initialMessage += `\n`;
            changeMessage += `\n`;
        }
        initialMessage += `**Age:** ${original.Age}`;
        changeMessage += `**Age:** ${existing.Age}`;
    }

    if (data.Timezone !== original.Timezone) {
        existing.Timezone = data.Timezone;
        if (initialMessage !== '') {
            initialMessage += `\n`;
            changeMessage += `\n`;
        }
        initialMessage += `**Timezone:** ${original.Timezone}`;
        changeMessage += `**Timezone:** ${existing.Timezone}`;
    }

    if (data.Mature !== original.Mature) {
        existing.Mature = data.Mature;
        if (initialMessage !== '') {
            initialMessage += `\n`;
            changeMessage += `\n`;
        }
        initialMessage += `**Mature:** ${original.Mature}\n`;
        changeMessage += `**Mature:** ${existing.Mature}\n`;
    }

    if (data.POV !== original.POV) {
        existing.POV = data.POV;
        if (initialMessage !== '') {
            initialMessage += `\n`;
            changeMessage += `\n`;
        }
        initialMessage += `**POV:** ${original.POV}`;
        changeMessage += `**POV:** ${existing.POV}`;
    }

    if (data.Tense !== original.Tense) {
        existing.Tense = data.Tense;
        if (initialMessage !== '') {
            initialMessage += `\n`;
            changeMessage += `\n`;
        }
        initialMessage += `**Tense:** ${original.Tense}`;
        changeMessage += `**Tense:** ${existing.Tense}`;
    }

    if (data.Image !== original.Image) {
        existing.Image = data.Image;
        if (initialMessage !== '') {
            initialMessage += `\n`;
            changeMessage += `\n`;
        }
        initialMessage += `**Image:** <${original.Image}>`;
        changeMessage += `**Image:** <${existing.Image}>`;
    }

    if (data.Triggers !== original.Triggers) {
        existing.Triggers = data.Triggers;
        if (initialMessage !== '') {
            initialMessage += `\n`;
            changeMessage += `\n`;
        }
        initialMessage += `**Triggers:**
        > ${original.Triggers}\n`;
        changeMessage += `**Triggers:**
        > ${existing.Triggers}\n`;
    }

    let staffDiscord = {
        title: `Member Claims Editted: ${capitalize(original.Member, [' ', '-'])}`,
        text: `Initial Values
        ----------
        ${initialMessage}
        
        New Values
        ----------
        ${changeMessage}`,
        hook: claimLogs,
    }

    existing.SubmissionType = data.SubmissionType;

    sendAjax(null, existing, staffDiscord);
}

/****** UserCP/Messages ******/
function cpShift() {
    let imageType = document.querySelector(toggleFields[1]).value,
        account = document.querySelector(toggleFields[0]).value,
        showFields = [],
        hideFields = characterFields
            .concat(defaultImages)
            .concat(gridImages)
            .concat(mosaicImages),
        showHeaders = allHeaders;

    if (account.toLowerCase() == 'character') {
        if (imageType.toLowerCase() === 'grid') {
            showFields = characterFields
                .concat(defaultImages)
                .concat(gridImages);
            hideFields = mosaicImages;
            showHeaders = allHeaders
                .concat(charHeaders);
            document.querySelector(defaultImages[0]).classList.remove('fullWidth');
        } else if (imageType.toLowerCase() === 'mosaic') {
            showFields = characterFields
                .concat(defaultImages)
                .concat(gridImages)
                .concat(mosaicImages);
            hideFields = [];
            showHeaders = allHeaders
                .concat(charHeaders);
            document.querySelector(defaultImages[0]).classList.remove('fullWidth');
        } else {
            showFields = characterFields
                .concat(defaultImages);
            hideFields = gridImages
                .concat(mosaicImages);
            showHeaders = allHeaders
                .concat(charHeaders);
            document.querySelector(defaultImages[0]).classList.add('fullWidth');
        }
    }

    adjustCP(showFields, hideFields, showHeaders);
}
function setUpAesthetics() {
    let aestheticsObj = {
        'tall-1': document.querySelector('#field_68_input').value,
        'tall-2': document.querySelector('#field_69_input').value,
        'wide-1': document.querySelector('#field_70_input').value,
        'wide-2': document.querySelector('#field_71_input').value,
        'square-1': document.querySelector('#field_72_input').value,
        'square-2': document.querySelector('#field_73_input').value,
        'square-3': document.querySelector('#field_74_input').value,
        'square-4': document.querySelector('#field_75_input').value,
    };
    let aesthetics = getSelectText(document.querySelector('#field_67_input'));
    return { aestheticsObj, aesthetics };
}
function ucpAesthetics() {
    let imageObj = setUpAesthetics().aestheticsObj;
    let aesthetics = setUpAesthetics().aesthetics;

    let aestheticsSample = document.querySelector('.ucp--description[data-section="Aesthetics"] .sample');
    if (aestheticsSample) {
        aestheticsSample.classList.add(aesthetics.replace(' ', ''));
        aestheticsSample.innerHTML = formatAesthetics(aesthetics, imageObj);
    }
}
function ucpAvatars() {
    let avatarSample = document.querySelector('.ucp--description[data-section="Images"] .sample');
    let avatarObj = {
        'tall': document.querySelector('#field_65_input').value,
        'wide': document.querySelector('#field_66_input').value,
    }
    let { aesthetics, aestheticsObj } = setUpAesthetics();

    let accType = getSelectText(document.querySelector('#field_1_input'));
    if (avatarSample) {
        let html = `<div><strong>Avatars</strong>
            <div class="avatars">
            ${formatAvatars(avatarObj)}
        </div></div>`;

        if (accType === 'character') {
            html += `<div><strong>Aesthetics</strong>
                <div class="profile--aesthetic ${aesthetics}">
                ${formatAesthetics(aesthetics, aestheticsObj)}
            </div></div>`;
        }

        avatarSample.innerHTML = html;
    }
}
function formatAvatars(images) {
    let imageHTML = `<span class="tall"><img src="${images['tall']}" title="Tall Avatar" alt="Tall Avatar" loading="lazy" /></span>
    <span class="wide"><img src="${images['wide']}" title="Wide Avatar" alt="Wide Avatar" loading="lazy" /></span>`;
    return imageHTML;
}
function createFieldArray(arr, input = false) {
    if (input) {
        return arr.map(item => `#field_${item}_input`);
    }
    return arr.map(item => `#field_${item}`);
}

/****** Members Initialization ******/
function formatMemberRow(type, data, extraFilters = '') {
    let tagList = ``, info = ``, details = ``;

    if (type === 'character') {
        tagList += `${data.character.ageClass} ${data.character.relationshipClass}`;
        info += `<div class="member--stats">
            <span>${data.character.age} years old</span>
            <span>${data.character.pronouns}</span>
            <span>${data.character.species}</span>
            <span>${data.character.resonance}</span>
            <span>${data.writer.alias}</span>
        </div>`;
        details = data.character.overview;
    } else {
        info += `<div class="member--stats">
            <span>${data.writer.pronouns}</span>
            <span>${data.writer.timezone}</span>
        </div>`;
        details = data.writer.triggers;
    }

    return `<div class="members--member grid-item g-${data.universal.groupID} ${data.writer.aliasClass} ${type} ${extraFilters} ${tagList}">
        <div class="member">
            <div class="member--top">
                <img src="${data.universal.imageWide}" loading="lazy" />
            </div>
            <div class="member--main">
                <a href="?showuser=${data.universal.id}">${formatName(data.universal.name, 'b')}</a>
                <div class="member--group">${data.universal.groupName}</div>
                <div class="member--dates">Joined ${data.universal.dates.joined}</div>
                <div class="member--dates">Last seen ${data.universal.dates.lastActive}</div>
            </div>
            ${info}
            <div class="member--overview"><div class="scroll">
                ${details}
            </div></div>
        </div>
        <div class="hidden member--sortable">
            <span class="member--name">${data.universal.name}</span>
            <span class="member--age">${data.character.age ?? ''}</span>
            <span class="member--posts">${data.universal.posts}</span>
            <span class="member--join">${data.universal.dates.joined}</span>
        </div>
    </div>`;
}
function toggleListMenu(e) {
    if (e.closest('.members--menu')) {
        e.closest('.members--menu').classList.toggle('is-open');
    } else if (e.closest('.webpage--menu')) {
        e.closest('.webpage--menu').classList.toggle('is-open');
    }
}