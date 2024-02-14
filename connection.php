<?php
function connection()
{
	global $db;
	
	$connection = new mysqli($db['host'], $db['login'], $db['pass']);
	$connection->select_db($db['db_name']);
	$connection->query('SET NAMES utf8');
	
	return $connection;
}

$db = array(
	'host'	=> 'localhost',
	'login'	=> 'root',
	'pass'	=> '!Xthtpyjue666z',
	'db_name'	=> 'wolf_goat_cabbage'
);
?>