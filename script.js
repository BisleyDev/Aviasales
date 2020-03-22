const formSearsh = (document.querySelector('.form-search')),
    inputCitiesFrom = formSearsh.querySelector('.input__cities-from'),
    dropdownCitiesFrom = formSearsh.querySelector('.dropdown__cities-from'),
    inputCitiesTo = formSearsh.querySelector('.input__cities-to'),
    dropdownCitiesTo = formSearsh.querySelector('.dropdown__cities-to'),
    inputDateDepart = formSearsh.querySelector('.input__date-depart'),
    cheapestTicket = document.getElementById('cheapest-ticket'),
    otherCheapTickets = document.getElementById('other-cheap-tickets');

//Данные 

// dataBase/cities.json  - сервер  http://api.travelpayouts.com/data/ru/cities.json
const citiesApi = 'dataBase/cities.json',  
    proxy = 'https://cors-anywhere.herokuapp.com/',
    API_KEY = 'c84e09dbb5ccdc86c89f1e10b583fff7',
	calendar = 'http://min-prices.aviasales.ru/calendar_preload',
	MAX_COUNT = 10;




let city = [];


// Ф-ция получения данных с сервера
const getData = (url, callback, reject = console.error) => {
    const request = new XMLHttpRequest();

    request.open('GET', url); // получение запроса

    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;

        if (request.status === 200) {
            callback(request.response);
        } else {
            reject(request.status);
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
            return fixItem.startsWith(input.value.toLowerCase());
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

const getNameCity = (code) => {
	const objCity = city.find((item) => item.code === code);
	return objCity.name;
};

const getDate = (date) => {
	return new Date(date).toLocaleDateString('ru', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}


const getChanges = (num) => {
	if (num) {
		return num === 1 ? 'С одной пересадкой' : 'С двумя пересадками';
	} else {
		return 'Без пересадок';
	}
};

const getLinkAviasales = (data) => {
	let link = 'https://www.aviasales.ru/search/';

	link += data.origin;

	const date = new Date(data.depart_date);

	const day = date.getDate();
	link += day < 10 ? '0' + day : day;

	const month = date.getMonth() + 1;
	link += month < 10 ? '0' + month : month;

	link += data.destination;
	link += 1;                                // к-ство пасажиров
	console.log(link);
	return link;
}


// Генерация карточек
const cteateCard = (data) => {
    const ticket = document.createElement('article');  //создание блока article
    ticket.classList.add('ticket');                    // const ticket - наложили класс ticket записаный в style.css

    let deep = '';
    
    if (data) {
        deep = `
            <h3 class="agent">${data.gate}</h3>
            <div class="ticket__wrapper">
            	<div class="left-side">
            		<a href="${getLinkAviasales(data)} " class="button button__buy">Купить
            			за ${data.value}₽</a>
            	</div>
            	<div class="right-side">
            		<div class="block-left">
            			<div class="city__from">Вылет из города
            				<span class="city__name">${getNameCity(data.origin)}</span>
            			</div>
            			<div class="date">${getDate(data.depart_date)}</div>
            		</div>

            		<div class="block-right">
            			<div class="changes">${getChanges(data.number_of_changes)}</div>
            			<div class="city__to">Город назначения:
            				<span class="city__name">${getNameCity(data.destination)}</span>
            			</div>
            		</div>
            	</div>
            </div> 
        `;
    } else {
        deep = '<h3>На текущую дату билетов не нашел!</h3>'
    }

    ticket.insertAdjacentHTML('afterbegin', deep);
    return ticket;
};

const renderCheapDay = (cheapTicket) => {
	cheapestTicket.style.display = 'block';
	cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';    // очищает предыдущий поиск в найдешевых билетах

	const ticket = cteateCard(cheapTicket[0]);
	
	cheapestTicket.append(ticket);
};

const renderCheapYear = (cheapTickets) => {
	otherCheapTickets.style.display = 'block';  
	otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>'; // очищает предыдущий поиск в остальных

    cheapTickets.sort((a, b) => {
        if (a.value > b.value) {
          return 1;
        }
        if (a.value < b.value) {
          return -1;
        }
        return 0;
	  });
	  
	for (let i = 0; i < cheapTickets.length && i < MAX_COUNT; i++) {
		const ticket = cteateCard(cheapTickets[i])
		otherCheapTickets.append(ticket)
	}
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
	event.preventDefault();
	

    const cityFrom = city.find((item) => {
        return inputCitiesFrom.value === item.name
    });
    
    const cityTo = city.find((item) => {
        return inputCitiesTo.value === item.name
    });

    const formData = {
        from: cityFrom,
        to: cityTo,
        when: inputDateDepart.value,
    };

    if (formData.from && formData.to) {

        /* 'https://support.travelpayouts.com/hc/ru/articles/203972143-API-
        %D0%BA%D0%B0%D0%BB%D0%B5%D0%BD%D0%B4%D0%B0%D1%80%D1%8F-%D1%86%D0%B5%D0%BD'  откуда взяты Api*/
        // requestData - запись по новой(интерполяция) 
        const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true&token=`;

		getData(calendar + requestData,
			(data) => {
			renderCheap(data, formData.when);
			},
			(error) => {
				alert('В этом направлении нет рейсов');
				console.error('Ошибка', error)
       });
    } else {
        alert('Введите корректное название города!')
    }
});


// Вызовы функции  (если с сервера то (proxy + citiesApi))


getData(citiesApi, (data) => {
    city = JSON.parse(data).filter(item => item.name && item.destination && item.origin);
    
    city.sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        // a должно быть равным b
        return 0;
      });

});



/* getData(proxy + citiesApi, (data) => {
    city = JSON.parse(data).filter((item) => {
        return item.name;
    });
}); */