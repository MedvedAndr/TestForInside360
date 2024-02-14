<?php
//	Получение данных от клиента
$data = json_decode(file_get_contents("php://input"), true);

//	Проверка наличия переменной 'ajax' в переданных данных
if(isset($data['ajax']))
{
	//	Подключаем соединение к БД
	include 'connection.php';
	
	if($data['ajax'] === 'send_query')
	{//	Запуск скрипта для добавления или обновления данных в БД
		$connection = connection();
		
		$query	 = "SELECT *";
		$query	.= " FROM `results`";
		$query	.= " WHERE `user_name` = '". $data['user_name'] ."'";
		$result_query = $connection->query($query);
		
		if($result_query->num_rows > 0)
		{
			$query	 = "UPDATE `results` SET ";
			if($data['status'] === 'win')
			{
				$query	.= "`victories` = `victories` + 1";
			}
			else
			{
				$query	.= "`losses` = `losses` + 1";
			}
			$query	.= " WHERE `user_name` = '". $data['user_name'] ."'";
		}
		else
		{
			$victiories = 0;
			$losses = 0;
			
			if($data['status'] === 'win')
			{
				$victiories += 1;
			}
			else
			{
				$losses += 1;
			}
			
			$query	 = "INSERT INTO `results` (";
			$query	.=		 "`user_name`,";
			$query	.=		" `victories`,";
			$query	.=		" `losses`";
			$query	.= ") VALUES (";
			$query	.=		 "'". $data['user_name'] ."',";
			$query	.=		" ". $victiories .",";
			$query	.=		" ". $losses ."";
			$query	.= ")";
		}
		
		$connection->query($query);
		
		mysqli_close($connection);
		
		echo json_encode(array('status' => 'OK', 'data' => $data), JSON_UNESCAPED_UNICODE);
	}
	elseif($data['ajax'] === 'get_liders')
	{//	Запуск скрипта для получения списка лидеров
		$connection = connection();
		
		$query	 = "SELECT *,";
		$query	.=		" `victories` * 100 / (`victories` + `losses`) AS `percent`";
		$query	.= " FROM `results`";
		$query	.= " ORDER BY `percent` DESC";
		$query	.= " LIMIT 10";
		$result_query = $connection->query($query);
		
		mysqli_close($connection);
		
		$return = array();
		
		if($result_query->num_rows > 0)
		{
			while($res = $result_query->fetch_assoc())
			{
				array_push($return, $res);
			}
		}
		
		echo json_encode(array('status' => 'OK', 'data' => $return), JSON_UNESCAPED_UNICODE);
	}
}
?>