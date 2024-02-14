<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Тестовое задание Inside 360</title>
		
		<link rel="stylesheet" href="/styles.css"></link>
		
		<script src="/functions.js"></script>
	</head>
	
	<body>
		<div id="content">
			<div class="left_col">
				<div class="h1">Волк, коза и капуста</div>
				
				<div id="game">
					<div id="start_window" class="window">
						<div class="field">
							<div class="field_head">Укажите своё имя</div>
							<div class="field_body">
								<input type="text" name="user_name" />
							</div>
						</div>
						
						<div class="buttons">
							<div id="start_game" class="button">Начать</div>
						</div>
					</div>
					
					<div id="end_window" class="window">
						<div class="field">
							<div class="field_body">Сообщение</div>
						</div>
						
						<div class="buttons">
							<div id="repeat_game" class="button">Повторить</div>
						</div>
					</div>
					
					<div id="background"></div>
					
					<div class="coast left">
						<div class="place wolf_place">
							<div id="wolf" class="object wolf"></div>
						</div>
						
						<div class="place goat_place">
							<div id="goat" class="object goat"></div>
						</div>
						
						<div class="place cabbage_place">
							<div id="cabbage" class="object cabbage"></div>
						</div>
					</div>
					
					<div class="coast right">
						<div class="place wolf_place"></div>
						<div class="place goat_place"></div>
						<div class="place cabbage_place"></div>
					</div>
					
					<div class="river">
						<div id="boat" class="boat left">
							<div class="boat_object"></div>
							<div class="place boat_place"></div>
						</div>
					</div>
					
					<div id="go_boat" class="button">Плыть</div>
				</div>
			</div>
			
			<div class="right_col">
				<div class="h1">Таблица лидеров</div>
				
				<table id="results" class="table">
					<thead>
						<tr>
							<td>№</td>
							<td>Имя</td>
							<td>Побед</td>
							<td>Поражений</td>
							<td>% Побед</td>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td class="center" colspan="5">Загрузка...</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</body>
</html>