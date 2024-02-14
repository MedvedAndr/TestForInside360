//	Дефолтные настроки подсчета результата игры
default_settings = {
	left_coast: 9,
	right_coast: 0
};

//	Переменная для блокировки некоторых действий пока плывет лодка
go_boat_status = true;

//	Функция загрузки списки лидела и отрисовка таблицы
function upload_results()
{
	//	Данные, отправляемые на сервер
	json_data = {
		ajax: 'get_liders'
	};
	
	//	Завершить работу скрипта на сервере
	if(typeof get_liders !== 'undefined')
	{
		get_liders.abort();
	}
	
	//	Формирование запроса на сервер для получения списка лидеров
	get_liders = new XMLHttpRequest();
	get_liders.open('POST', 'ajax.php');
	get_liders.setRequestHeader('Content-type', 'application/json');
	
	get_liders.send(JSON.stringify(json_data));
	
	get_liders.onload = function()
	{
		//	Проверка статуса сервера и вывод ошибки в консоль, если не было ответа от сервера
		if(get_liders.status != 200)
		{
			console.log(get_liders.status);
			return;
		}
		
		//	Парсим полученый JSON-массив
		data = JSON.parse(get_liders.response).data;
		
		//	Отрисовка таблицы
		if(data.length > 0)
		{
			table = '';
			data.forEach(function(a, b)
			{
				table	+=	'<tr>';
				table	+=		'<td class="center">'+ (b + 1) +'</td>';
				table	+=		'<td>'+ a.user_name +'</td>';
				table	+=		'<td class="center">'+ a.victories +'</td>';
				table	+=		'<td class="center">'+ a.losses +'</td>';
				table	+=		'<td class="center">'+ a.percent +'</td>';
				table	+=	'</tr>';
			});
		}
		else
		{
			table = '<tr><td class="center" colspan="5">Результаты не найдены</td></tr>';
		}
		
		//	Добавить таблицу на страницу
		document.querySelector('#results tbody').innerHTML = '';
		document.querySelector('#results tbody').innerHTML = table;
	};
}

//	Функция отправки данных на сервер, для добавления результата игры в БД
//		status - статус игры (победа или поражение)
//		user_name - имя пользователя
//		text - текст для всплывающего сообщения о победе или проигрыше
function send_data(status, user_name, text)
{
	//	Запоминаем объект для отображения сообщения после игры и выводим сообщение
	message_window = document.querySelector('#end_window');
	message_window.querySelector('.field_body').innerHTML = text;
	message_window.style.display = 'flex';
	document.getElementById('background').style.display = 'block';
	//	Статус загрузки для таблицы
	document.querySelector('#results tbody').innerHTML = '<tr><td class="center" colspan="5">Загрузка...</td></tr>';
	
	//	Данные, отправляемые на сервер
	json_data = {
		ajax: 'send_query',
		status: status,
		user_name: user_name
	};
	
	//	Завершить работу скрипта на сервере
	if(typeof send_game_status !== 'undefined')
	{
		send_game_status.abort();
	}
	
	//	Формирование запроса на сервер для добавления результата игры в БД
	send_game_status = new XMLHttpRequest();
	send_game_status.open('POST', 'ajax.php');
	send_game_status.setRequestHeader('Content-type', 'application/json');
	
	send_game_status.send(JSON.stringify(json_data));
	
	send_game_status.onload = function()
	{
		if(send_game_status.status != 200)
		{
			console.log(send_game_status.status);
			return;
		}
		
		//	После завершения работы скрипта обновляем данные в таблице
		upload_results();
	};
}

//	Функция изменения статуса лодки после на жатия на кнопку,
//	а так же формирование данных для проверки статуса игры
function go_boat(eventObject)
{
	//	Блокировка действий пока плывет лодка
	go_boat_status = false;
	//	Запоминаем объекты, связаные с лодкой
	boat = document.getElementById('boat');
	boat_place = boat.children[1];
	boat_object = boat_place.children[0];
	
	//	Меняем статус лодки, который запустит анимацию и последующее событие после анимации
	boat.classList.toggle('right');
	boat.classList.toggle('left');
	
	//	Присваивание веса объектам для последующей проверки статуса игры
	if(boat_object === undefined)
	{
		score = 0;
	}
	else if(boat_object.id === 'wolf')
	{
		score = 1;
	}
	else if(boat_object.id === 'goat')
	{
		score = 3;
	}
	else
	{
		score = 5;
	}
	
	//	Проверка текущего статуса игры
	check_game_status(score, boat.classList.contains('left') ? 'left' : 'right');
}

//	Функция переноса объекта при клике на него
//		object - объект на который кликали
function move_object(object)
{
	// Если по какой-то причине объект не отределился или лодка плывет, то ничего не происходит
	if(object !== undefined && go_boat_status)
	{
		//	Запоминаем объект, по которому кликнули
		parent_object = object.parentElement;
		//	Запоминаем объект лодки
		boat = document.getElementById('boat');
		
		if(parent_object.classList.contains('boat_place'))
		{//	Если кликали по лодке, то переносим объект из лодки на берег
			document.querySelector('.coast.'+ (boat.classList.contains('left') ? 'left' : 'right') +' > .'+ object.id +'_place').append(object);
		}
		else
		{//	Если кликали по объекту на берегу, то переносим его в лодку
			coast = parent_object.parentElement.classList.contains('left') ? 'left' : 'right';
			boat_coast = boat.classList.contains('left') ? 'left' : 'right';
			
			//	Если кликали на объект на берегу которого не лодки, то ничего не произойдет
			if(coast === boat_coast)
			{
				//	Запоминаем объекты, связаные с лодкой
				boat_place = boat.children[1];
				change_object = boat_place.children[0];
				
				//	Если в лодке был объект, то он вернется на берег
				if(change_object !== undefined)
				{
					document.querySelector('.coast.'+ boat_coast +' > .'+ change_object.id +'_place').append(change_object);
				}
				
				//	Помещаем объект, по которому кликали в лодку
				boat_place.append(object);
			}
		}
	}
}

//	Проверка статуса игры и отправка данных для записи в БД
//		score - вес перевозимого объекта
//		coast - берег, на который перевозится объект
function check_game_status(score, coast)
{
	//	Получаем имя пользователя
	user_name = document.getElementsByName('user_name')[0].value;
	//	Запоминаем противоположный берег
	another_coast = coast === 'left' ? 'right' : 'left';
	//	Изменение весов берегов после перевозки объекта
	settings[another_coast +'_coast'] -= score;
	settings[coast +'_coast'] += score;
	
	//	Проверка весов берегов и формирования данных для записи в БД и вывода сообщения о статусе игры
	if(settings.right_coast === 9)
	{
		text = 'Победа!';
		send_data('win', user_name, text);
	}
	else if(settings[another_coast +'_coast'] === 4)
	{
		text = 'Волк съел козу';
		send_data('loss', user_name, text);
	}
	else if(settings[another_coast +'_coast'] === 8)
	{
		text = 'Коза съела капусту';
		send_data('loss', user_name, text);
	}
	else if(settings.left_coast === 9)
	{
		text = 'Все друг друга съели';
		send_data('loss', user_name, text);
	}
}

//	Отслеживание кликаемых объектов
function event_click(eventObject)
{
	//	Запоминаем объект по которому был сделан клик
	click_target = eventObject.target;
	
	if(click_target.classList.contains('object'))
	{//	Если клик был по объекту
		//	Инициация переноса объекта с берега в лодку
		move_object(click_target);
	}
	else if(click_target.classList.contains('boat_object'))
	{//	Если клик был по лодке
		//	Инициация переноса объекта из лодки на берег
		move_object(click_target.nextElementSibling.children[0]);
	}
	else if(click_target.id === 'go_boat')
	{//	Если клик был по кнопке отправки лодки на другой берег
		if(go_boat_status)
		{
			//	Если лодка не плывет, то отправляем ее на другой берег
			go_boat();
		}
	}
	else if(click_target.id === 'start_game' || click_target.id === 'repeat_game')
	{//	Если клик был по кнопкам во всплывающих сообщениях
		if(document.getElementsByName('user_name')[0].value !== '')
		{
			//	Если поле с именем не пустое, то закрываются все сообщения,
			//	все объекты и лодка возвращаются на свои места
			//	и обнуляется вес у берегов
			boat = document.getElementById('boat');
			settings = Object.assign({}, default_settings);
			
			document.querySelector('.coast.left > .wolf_place').append(document.getElementById('wolf'));
			document.querySelector('.coast.left > .goat_place').append(document.getElementById('goat'));
			document.querySelector('.coast.left > .cabbage_place').append(document.getElementById('cabbage'));
			boat.classList.remove('right');
			boat.classList.add('left');
			document.getElementById('start_window').style.display = 'none';
			document.getElementById('end_window').style.display = 'none';
			document.getElementById('background').style.display = 'none';
		}
	}
}

//	Отслеживание полной загрузки DOM-элементов
document.addEventListener('DOMContentLoaded', function()
{
	//	Запуск событий при клике
	document.addEventListener('click', event_click);
	
	//	Отслеживание завершение анимации плывущей лодки (анимация идет через CSS)
	document.getElementById('boat').addEventListener('transitionend', function()
	{
		element = this.children[1].children[0];
		
		// Изменение направления лодки, когда она доплывает до берега
		this.style.transform = 'scale('+ (this.classList.contains('left') ? '1' : '-1') +', 1)';
		//	Разрешаем действия полсе окончания плавания лодки
		go_boat_status = true;
		//	Перенос обекта на берег
		move_object(element);
	});
	
	//	Обновить таблицу лидеров после загрузки страницы
	upload_results();
});