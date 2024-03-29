<?php

include("setting.php");

$response = array();
$error = array();
try {
    if(time() > strtotime("2016-03-04")) //開始徵文的時間判斷
        throw new Exception("徵文已經結束！感謝大家的支持！");
    
    if(!$_POST['name'])
        $error["name"] = "請輸入名字！";
    else if(!preg_match("/^[-' a-z\x{4e00}-\x{9eff}]{1,20}$/iu",$_POST['name']))
        $error["name"] = "名字包含不合法字元！";
    if(!$_POST['email'])
        $error["email"] = "請輸入信箱！";
    else if(!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL))
        $error["email"] = "不正確的信箱格式！";
    if(!$_POST['phone'])
        $error["phone"] = "請輸入電話號碼！";
    else if(!preg_match('/^09\d{8}$/',$_POST['phone']))
        $error["phone"] = "不正確的電話號碼！";
    if(!$_POST['des'])
        $error["des"] = "請輸入一段文字！";
    else if($_POST['des'] != strip_tags($_POST['des']))
        $error["des"] = "敘述包含不合法字串！";
    if(!$_POST['img'])
        $error["img"] = "你的圖呢？";
    else if(!preg_match('/^http:\/\/i.imgur.com\/\w+\.\w+$/',$_POST['img']))
        $error["img"] = "圖片來源有誤！";

    if(!isset($_POST['try'])){
        if(ENABLE_RECAPTCHA){
            if(!isset($_POST['g-recaptcha-response'])){
                $error["g-recaptcha-response"] = "請確認您不是機器人！";
                throw new Exception("請確認您不是機器人！", 1);
            }
            if(!$_POST['g-recaptcha-response']){
                $error["g-recaptcha-response"] = "請確認您不是機器人！";
                throw new Exception("請確認您不是機器人！", 1);
            }
            $url = RECAPTCHA_URL;
            $secret = RECAPTCHA_SECRET;
            $recaptcha = $_POST['g-recaptcha-response'];
            $remoteip = isset($_SERVER['HTTP_X_FORWARDED_FOR']) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : $_SERVER['REMOTE_ADDR'];

            $capcha = json_decode(file_get_contents("$url?secret=$secret&response=$recaptcha&remoteip=$remoteip"));

            $agree = $capcha->success;
            if(!$capcha->success){
                $error["g-recaptcha-response"] = "請確認您不是機器人！";
                throw new Exception("請確認您不是機器人！", 1);
            }
        }

        if(file_exists(SUBMITION_FILE_NAME))
            $submition = json_decode(file_get_contents(SUBMITION_FILE_NAME),true);
        else
            $submition = array();

        $submition[] = array(
            "name" => $_POST["name"],
            "email" => $_POST["email"],
            "phone" => $_POST["phone"],
            "des" => $_POST["des"],
            "img" => $_POST["img"],
            "time" => date("Y-m-d H:i:s"),
            "ip" => $remoteip,
            "agree" => $agree
        );

        file_put_contents(SUBMITION_FILE_NAME,json_encode($submition));
    }

    if(count($error) != 0)
        throw new Exception("Theres some errors!", 1);
    $response["result"] = "OK";
} catch (Exception $e) {
    $response["result"] = $e->getMessage();
    if(count($error) != 0)
        $response['error'] = $error;
}

ob_clean();
echo json_encode($response);

?>
