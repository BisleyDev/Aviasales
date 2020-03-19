const formSearsh = (document.querySelector('.form-search')),
    inputCitiesFrom = formSearsh.querySelector('.input__cities-from'),
    dropdownCitiesFrom = formSearsh.querySelector('.dropdown__cities-from'),
    inputCitiesTo = formSearsh.querySelector('.input__cities-to'),
    dropdownCitiesTo = formSearsh.querySelector('.dropdown__cities-to'),
    inputDateDepart = formSearsh.querySelector('.input__date-depart');


const city = ['Москва', 'Санкт-Петербург', 'Минск', 'Караганда', 'Челябинск',
    'Керчь', 'Волгоград', 'Днепр', 'Екатеринбург', 'Одесса', 'Шимкен',
    'Киев', 'Харьков', 'Львов', 'Сумы', 'Николаев',];



const showCity = (input, list) => {
    //Очищаем перед поиском строку
    list.textContent = '';

    //убрать подсказку при пустой строке
    if (input.value !== '') {

        const filterCity = city.filter((item) => {
            const fixItem = item.toLocaleLowerCase();

            return fixItem.includes(input.value.toLocaleLowerCase());
        });

        // Полученный список при вводе в поисковике создаем его
        filterCity.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item;
            list.append(li)
        });
    };
};


inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom);
});

//выбрать из списка подсказки кликом
dropdownCitiesFrom.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'li') {
        inputCitiesFrom.value = target.textContent;
        dropdownCitiesFrom.textContent = '';
    }
});





