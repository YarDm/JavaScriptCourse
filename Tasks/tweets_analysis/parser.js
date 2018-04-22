function TwitParser() {
    let items = [];			//массив элементов твита
    let item = '';			//отдельный элемент твита
    let is_string = false;	//флаг "строка", по умолчанию false

    this.parse = line => {							//метод parse принимает на вход строку из датасета
        for (let i = 0; i < line.length; i++) {		//цикл обходит всю принятую строку
            if (line[i] == ';' && !is_string) {		//если один элемент строки - ";" и флаг строка true
                items.push(item);					//добавляем элемент в массив элементов
                item = '';							//приводим элемент в исходное состояние
            } else if (line[i] == '"') {			//если элемент является двойными ковычками
                is_string = !is_string;				//флаг "строка" вы ставляется в true
                if (i > 0 && line[i - 1] == '"') { // Двойная кавычка превращаются в одинарные
                    item += '"';
                }
            } else {								//если не первое и не второе условие, то
                item += line[i];					//добавляем текущий элемент к элементу твита
            }
        }

        // Если строка символов закончилась с открытой кавычной - значит это перенос, возврщаем null и ждем другу строку
        if (is_string) {
            item += "\n";
            return null;
        }

        // Вставляем последний элемент
        items.push(item);

        // Формируем объект твита
        // Tweet Id;Date;Hour;User Name;Nickname;Bio;Tweet content;Favs;RTs;Latitude;Longitude;Country;Place (as appears on Bio);Profile picture;Followers;Following;Listed;Tweet language (ISO 639-1);Tweet Url
        const twit = {
            id       : items[0],
            date     : items[1],
            hour     : items[2],
            username : items[3],
            nickname : items[4],
            bio      : items[5],
            content  : items[6],
            favs     : items[7],
            rts      : items[8],
            latitude : items[9],
            longitude : items[10],
            country  : items[11],
            place    : items[12],
            picture  : items[13],
            followers : items[14],
            following : items[15],
            listed   : items[16],
            language : items[17],
            url : items[18]
        }

        items = [];
        item = '';

        return twit;			//возвращаем твит как набор распределенный полей
    }
}

module.exports = {TwitParser}