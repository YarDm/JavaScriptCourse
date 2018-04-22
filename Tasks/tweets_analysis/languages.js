function printLanguages(count) {
    const langs = {};                       //пустой объект языков
    for (let twit of twits) {               //для каждого твита из свиска
        if (!langs[twit.language]) {        //
            langs[twit.language] = { twitCount : 0, retwitCount : 0};
        }
        if (twit.content.startsWith("RT @")) {
            langs[twit.language].retwitCount++;
        } else {
            langs[twit.language].twitCount++;
        }
    }

    let langs_array = [];
    for (let lang in langs) {
        langs_array.push(lang);
    }

    langs_array.sort((l1, l2) => {
        if (langs[l1].twitCount < langs[l2].twitCount) return 1;
        if (langs[l1].twitCount > langs[l2].twitCount) return -1;
        return 0;
    });

    console.log("");
    console.log(count + " стран-производителей твитов");
    for (let i = 0; i < count; i++) {
        let lang = langs[langs_array[i]];
        console.log('  ', lang.twitCount, 'твитов -->', langs_array[i]);
    }

    langs_array.sort((l1, l2) => {
        if (langs[l1].retwitCount < langs[l2].retwitCount) return 1;
        if (langs[l1].retwitCount > langs[l2].retwitCount) return -1;
        return 0;
    });

    console.log("");
    console.log(count + " стран-потребителей твитов");
    for (let i = 0; i < count; i++) {
        let lang = langs[langs_array[i]];
        console.log('  ', lang.retwitCount, 'ретвитов -->', langs_array[i]);
    }
}
module.exports  = {printLanguages}