<?php
$_POST = json_decode(file_get_contents("php://input"), true); // получение json в php нативно так сделать нельзя
echo var_dump($_POST);