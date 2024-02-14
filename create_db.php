<?php
include 'connection.php';

$connection = new mysqli($db['host'], $db['login'], $db['pass']);

//	Создание БД
$query = "CREATE DATABASE `". $db['db_name'] ."`";
$connection->query($query);

$connection->select_db($db['db_name']);

//	Создание таблицы 'results'
$query	 = "CREATE TABLE IF NOT EXISTS `results` (";
$query	.=		 "`id` int(11) NOT NULL AUTO_INCREMENT,";
$query	.=		" `user_name` varchar(255) DEFAULT NULL,";
$query	.=		" `victories` int(11) NOT NULL DEFAULT 0,";
$query	.=		" `losses` int(11) NOT NULL DEFAULT 0,";
$query	.= "  PRIMARY KEY (`id`))";
$query	.= " ENGINE = INNODB,";
$query	.= " CHARACTER SET `utf8`,";
$query	.= " COLLATE `utf8_general_ci`";
$connection->query($query);

mysqli_close($connection);

echo 'DB create successfully';
?>