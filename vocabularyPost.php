<?php
    $ourWord = $_POST['word'];
    $ourTranslate = $_POST['translate'];
    $db = new PDO('mysql:host=std-mysql; dbname=std_937; charset=utf8', 'std_937', '12345678');
    $sql = 'INSERT into vocabulary(word, translate) values(:word, :translate)';
    $stmt = $db->prepare($sql);
    $stmt->bindValue(':word', $ourWord);
    $stmt->bindValue(':translate', $ourTranslate);
    $stmt->execute();    
?>