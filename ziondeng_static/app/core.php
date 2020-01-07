<?php
/**
 * Created by PhpStorm.
 * User: xkevas
 * Date: 2019/10/3
 * Time: 10:13
 */

$con=mysqli_connect("localhost","root","","ziondeng");
require "zionadmin/app/core_function.php";
$ip=getIp();
$page=where_am_i();
$date=date("Y-m-d");
$time=date("H:i:s");

$visit_log=mysqli_query($con,"insert into visit_log (ip,page,the_date,the_time) values ('$ip','$page','$date','$time')");


