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

module.exports = {RetweetsAnalyse}