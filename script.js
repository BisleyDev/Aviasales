const formSearsh = (document.querySelector('.form-search')),
    inputCitiesFrom = formSearsh.querySelector('.input__cities-from'),
    dropdownCitiesFrom = formSearsh.querySelector('.dropdown__cities-from'),
    inputCitiesTo = formSearsh.querySelector('.input__cities-to'),
    dropdownCitiesTo = formSearsh.querySelector('.dropdown__cities-to'),
    inputDateDepart = formSearsh.querySelector('.input__date-depart');

//Данные 

// dataBase/cities.json  - сервер  http://api.travelpayouts.com/data/ru/cities.json
const citiesApi = 'dataBase/cities.json',  
    proxy = 'https://cors-anywhere.herokuapp.com/',
    API_KEY = 'c84e09dbb5ccdc86c89f1e10b583fff7',
    calendar = 'http://min-prices.aviasales.ru/calendar_preload';




let city = [];


// Ф-ция получения данных с сервера
const getData = (url, callback) => {
    const request = new XMLHttpRequest();

    request.open('GET', url); // получение запроса

    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;

        if (request.status === 200) {
            callback(request.response);
        } else {
            console.error(request.status);
        };
    });

    request.send();
};




const showCity = (input, list) => {
    //Очищаем перед поиском строку
    list.textContent = '';

    //убрать подсказку при пустой строке
    if (input.value !== '') {
        const filterCity = city.filter((item) => {
            const fixItem = item.name.toLowerCase();
            return fixItem.includes(input.value.toLowerCase());
        });

        // Полученный список при вводе в поисковике создаем его
        filterCity.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item.name;
            list.append(li)
        });
    };
};

const downList = (city, list) => {
    //выбрать из списка подсказки кликом
    list.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName.toLowerCase() === 'li') {
            city.value = target.textContent;
            list.textContent = '';
        };
    });
};

const renderCheapDay = (cheapTicket) => {
    console.log(cheapTicket);
};

const renderCheapYear = (cheapTickets) => {
    console.log(cheapTickets);
};


const renderCheap = (data, date) => {
    const cheapTicketYear = JSON.parse(data).best_prices;

    
    const cheapTicketDay = cheapTicketYear.filter((item) => {
        return item.depart_date === date;

    });



    renderCheapDay(cheapTicketDay);
    renderCheapYear(cheapTicketYear);
};

//Обработчики событий
inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom);
    downList(inputCitiesFrom, dropdownCitiesFrom);
});
inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo);
    downList(inputCitiesTo, dropdownCitiesTo);
});

formSearsh.addEventListener('submit', (event) => {
    event.preventDefault()

    const cityFrom = city.find((item) => {
        return inputCitiesFrom.value === item.name
    });
    
    const cityTo = city.find((item) => {
        return inputCitiesTo.value === item.name
    });

    const formData = {
        from: cityFrom.code,
        to: cityTo.code,
        when: inputDateDepart.value,
    };

/*     'https://support.travelpayouts.com/hc/ru/articles/203972143-API-
    %D0%BA%D0%B0%D0%BB%D0%B5%D0%BD%D0%B4%D0%B0%D1%80%D1%8F-%D1%86%D0%B5%D0%BD'  откуда взяты Api*/
    // requestData - запись по новой(интерполяция) и ниже в старой форме
    const requestData = `?depart_date=${formData.when}&origin=${formData.from}&destination=${formData.to}&one_way=true&token=`;



    const requestData2 = '?depart_date=' + formData.when +
    '&origin=' + formData.from +
    '&destination=' + formData.to +
    '&one_way=true&token=' + API_KEY;

    getData(proxy + calendar + requestData, (response) => {
        renderCheap(response, formData.when);
    });
})


// Вызовы функции  (если с сервера то (proxy + citiesApi))


getData(citiesApi, (data) => {
    city = JSON.parse(data).filter(item => item.name)    
});



/* getData(proxy + citiesApi, (data) => {
    city = JSON.parse(data).filter((item) => {
        return item.name;
    });
}); */
