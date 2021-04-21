<?php 
    $db = new PDO('mysql:host=std-mysql; dbname=std_937; charset=utf8', 'std_937', '12345678');
    $sql = 'SELECT * from vocabulary order by id desc';
    $result = $db->query($sql);
    $vocabularyItem = $result->fetchAll(PDO::FETCH_ASSOC);
    echo (json_encode($vocabularyItem));
?>