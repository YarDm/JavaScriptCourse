function printRetwits(count) {
    twits.sort((t1, t2) => {
        let rt1 = Number(t1.rts);
        let rt2 = Number(t2.rts);
        if (rt1 < rt2) return 1;
        if (rt1 > rt2) return -1;
        return 0;
    });

    console.log('');
    console.log(count + " наиболее популярных твитов");
    for (let i = 0; i < count; i++) {
        const twit = twits[i];
        console.log('');
        console.log('  Автор', twit.nickname);
        console.log('  Содержимое', twit.content);
        console.log('  ', twit.rts, 'ретвитов');
    }
}
module.exports = {printRetwits}