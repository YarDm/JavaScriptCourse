function WordCountAnalyse() {
    let words = {};					//объект слова, пустой


    function parseWords(ss) {                   //какая-то строка на вход
        const delimeters = " \"\t\n,.:;?!/-+="; //разделители слов
        const url_symbols = ":/.";              //урлы
        const exclude_words = [ "#" ];          //исключения из слов
        let words = [];                         //массив слов
        let ws = 0;                             //счетчик слов
        for (let i = 0; i <= ss.length; i++) {  //пока итератор не больше длины строки
            if (i === ss.length || delimeters.indexOf(ss[i]) >= 0) {    //если итератор равен длине строки или иекущий элемент строки присутствует в разделителях
                if (i > ws) {                                           //если итератор больше счетчика слов
                    let word = ss.substring(ws, i);                     //создаем слово из подстроки начальной строки
                    let is_url = word.startsWith('http') && url_symbols.indexOf(ss[i]) >= 0;    //проверка на урлы: подстрока начинается с хттп и присуутствуют символы урла
                    if (!is_url) {                                      //если урл == false
                        if (exclude_words.indexOf(word) < 0) {          //если не в исключениях
                            words.push(word.toLowerCase());             //добавляем слово в мвссив
                        }
                        ws = i + 1;                                     //увеличиваем счетчик слов
                    }
                } else {
                    ws = i + 1;                                         //увеличиваем счетчик слов
                }
            }
        }
        return words;                                                   //возвращаем список слов
    }

    this.analyse = (twit) => {                          //метод - стрелочная функция принимающая на вход один твит
        for (let word of parseWords(twit.content)) {    //для каждого слова в теле твита
            if (!words[word]) {                         //если слова нет в списке
                words[word] = 0;                        //рейтинг равен 0
            }
            words[word]++;                              //Если слово есть в списке прибавляем частоту
        }
    }

    this.printWords = (count) => {
        let word_array = [];
        for (let word in words) {
            word_array.push(word);
        }

        word_array.sort((w1, w2) => {
            if (words[w1] < words[w2]) return 1;
            if (words[w1] > words[w2]) return -1;
            return 0;
        });

        console.log("");
        console.log(count + " наиболее часто встречающихся слов");
        for (let i = 0; i < count; i++) {
            console.log('  ', words[word_array[i]], '-->', word_array[i]);
        }
    }
}
module.exports = {WordCountAnalyse}