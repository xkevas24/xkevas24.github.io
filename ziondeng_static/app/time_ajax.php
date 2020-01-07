<?php
/**
 * Created by PhpStorm.
 * User: xkevas
 * Date: 2019/10/7
 * Time: 17:25
 */

$con=mysqli_connect("localhost","root","","ziondeng");
//检查是否有该IP的记录

function getIp()
{
    if (!empty($_SERVER["HTTP_CLIENT_IP"])) {
        $cip = $_SERVER["HTTP_CLIENT_IP"];
    } else if (!empty($_SERVER["HTTP_X_FORWARDED_FOR"])) {
        $cip = $_SERVER["HTTP_X_FORWARDED_FOR"];
    } else if (!empty($_SERVER["REMOTE_ADDR"])) {
        $cip = $_SERVER["REMOTE_ADDR"];
    } else {
        $cip = '';
    }
    preg_match("/[\d\.]{7,15}/", $cip, $cips);
    $cip = isset($cips[0]) ? $cips[0] : 'unknown';
    unset($cips);
    return $cip;
}

$ip=getIp();

$sql="select id from visit_time where ip='$ip';";
$ip_id=mysqli_fetch_row(mysqli_query($con,$sql))[0];
if($ip_id==""){
    //创建记录
    $sql="insert into visit_time (ip,the_time) values ('$ip','1');";
}else{
    $sql="update visit_time set the_time=the_time+1 where ip='$ip';";
}

$do=mysqli_query($con,$sql);
mysqli_close($con);

echo $ip_id;
