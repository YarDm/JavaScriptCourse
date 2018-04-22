function printPopulateAuthors(count) {
    const authors = {};
    for (let twit of twits) {
        authors[twit.username] = { nickname : twit.nickname, followers : Number(twit.followers)};
    }

    let authors_array = [];
    for (let username in authors) {
        authors_array.push(username);
    }

    authors_array.sort((a1, a2) => {
        if (authors[a1].followers < authors[a2].followers) return 1;
        if (authors[a1].followers > authors[a2].followers) return -1;
        return 0;
    });

    console.log('');
    console.log(count + " наиболее популярных авторов");
    for (let i = 0; i < count; i++) {
        let author = authors[authors_array[i]];
        console.log('  ', author.followers, 'фолловеров -->', author.nickname);
    }
}
module.exports = {printPopulateAuthors}