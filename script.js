const formSearsh = (document.querySelector('.form-search')),
    inputCitiesFrom = formSearsh.querySelector('.input__cities-from'),
    dropdownCitiesFrom = formSearsh.querySelector('.dropdown__cities-from'),
    inputCitiesTo = formSearsh.querySelector('.input__cities-to'),
    dropdownCitiesTo = formSearsh.querySelector('.dropdown__cities-to'),
    inputDateDepart = formSearsh.querySelector('.input__date-depart');

//Данные 
const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json';  // dataBase/cities.json  - ервер
const proxy = 'https://cors-anywhere.herokuapp.com/';
const API_KEY = 'c84e09dbb5ccdc86c89f1e10b583fff7';
const calendar = 'http://min-prices.aviasales.ru/calendar_preload';




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
        }
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
        }
    });
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


// Вызовы функции
getData(proxy + citiesApi, (data) => {
    city = JSON.parse(data).filter((item) => {
        return item.name;
    });

});
