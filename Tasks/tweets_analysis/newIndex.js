'use strict';

// let pa = require('./populateAutors'),
//     printPopulateAuthors = pa.printPopulateAuthors;
// let pr = require('./printRetweets'),
//     printRetwits = pr.printRetwits;
// let ra = require('./retweet'),
//     RetweetsAnalyse = ra.RetweetsAnalyse;
let tp = require('./parser'),
    TwitParser = tp.TwitParser;
let wca = require('./words'),
    WordCountAnalyse = wca.WordCountAnalyse;
// let pl = require('./languages'),
//     printLanguages = pl.printLanguages;




function RetweetsAnalyse() {
    let twits = {};

    //разбиваем строки на слова
    function parseWords(ss) {
        const delimeters = " \"\t\n,.:;?!/-+="; //разделители слов
        const url_symbols = ":/."; //урлы как отдельный элемент
        const exclude_words = [ "#" ];  //исключения
        let words = [];                 //массив слов
        let ws = 0;                     //счетчик слов
        for (let i = 0; i <= ss.length; i++) {                          //для каждого элемента строки
            if (i == ss.length || delimeters.indexOf(ss[i]) >= 0) {     //если счетчик равен длине строки или элемент строки в разделителях
                if (i > ws) {                                           //если счетчик символов больше счетчика слов
                    let word = ss.substring(ws, i);                     //слово - равно подстроке от счетчика слов до счетчика
                    let is_url = word.startsWith('http') && url_symbols.indexOf(ss[i]) >= 0;    //проверка на урл
                    if (!is_url) {                                      //если не урл
                        if (exclude_words.indexOf(word) < 0) {          //если в слове нет исключений
                            words.push(word.toLowerCase());             //в нижний регистр и в массив слов
                        }
                        ws = i + 1;     //счетчик слов счетчик +1
                    }
                } else {
                    ws = i + 1;         //счетчик слов счетчик +1
                }
            }
        }
        return words;       //возвращаем массив слов
    }

    //анализируем количество повторений
    this.analyse = (twit) => {      //стрелочная функция приинимает твит на вход
        for (let word of parseWords(twit.content)) {        //для каждого слова в теле твита
            if (!words[word]) {                             //если слово не встречалось ранее
                words[word] = 0;                            //рейтинг 0
            }
            words[word]++;                                  //добавляем рейтинг
        }
    }

    //выводим данные по словам
    this.printWords = (count) => {
        let word_array = [];
        for (let word in words) {
            word_array.push(word);
        }

        //сортируем полученный массив
        word_array.sort((w1, w2) => {
            if (words[w1] < words[w2]) return 1;
            if (words[w1] > words[w2]) return -1;
            return 0;
        });


        console.log(count + " наиболее часто встречающихся слов");
        for (let i = 0; i < count; i++) {
            console.log('  ', words[word_array[i]], '-->', word_array[i]);
        }
    }
}

const LineByLineReader = require('line-by-line'),			//импортируем модуль, npm install line-by-line
    lr = new LineByLineReader('./input/dataSet.csv');		//реализуем ридер, в параметр датасет с относительным путем

const twits = [];
let line_count = 0;

const twitParser = new TwitParser();
const wordAnalysator = new WordCountAnalyse();

lr.on('error', function (err) {
    console.log('error', err);
});

lr.on('line', function (line) {
    if (line_count > 0) { // Первую строку не обрабатываем (в ней заголовок CSV файла)
        const twit = twitParser.parse(line);
        if (twit) {
            // Обрабытываем твит
            wordAnalysator.analyse(twit);
            twits.push(twit);
        }
    }
    line_count++;
    if (line_count % 5000 == 0) {
        console.log('обработано', line_count, 'строк');
    }
});

lr.on('end', function () {
    // All lines are read, file is closed now.
    main();
});

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

//отображение используемых языков
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

function main() {
    console.log('обработано', line_count, 'строк');
    console.log("");
    console.log('обработано', twits.length, 'твитов');

    wordAnalysator.printWords(10);
    printRetwits(10);
    printPopulateAuthors(10);
    printLanguages(10);
}