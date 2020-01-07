////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////操作BASE64////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////


var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;

    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if(i == len)
    {
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt((c1 & 0x3) << 4);
        out += "==";
        break;
    }
    c2 = str.charCodeAt(i++);
    if(i == len)
    {
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt((c2 & 0xF) << 2);
        out += "=";
        break;
    }
    c3 = str.charCodeAt(i++);
    out += base64EncodeChars.charAt(c1 >> 2);
    out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
    out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
    out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}

function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;

    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
    /* c1 */
    do {
        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while(i < len && c1 == -1);
    if(c1 == -1)
        break;

    /* c2 */
    do {
        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while(i < len && c2 == -1);
    if(c2 == -1)
        break;

    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

    /* c3 */
    do {
        c3 = str.charCodeAt(i++) & 0xff;
        if(c3 == 61)
        return out;
        c3 = base64DecodeChars[c3];
    } while(i < len && c3 == -1);
    if(c3 == -1)
        break;

    out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

    /* c4 */
    do {
        c4 = str.charCodeAt(i++) & 0xff;
        if(c4 == 61)
        return out;
        c4 = base64DecodeChars[c4];
    } while(i < len && c4 == -1);
    if(c4 == -1)
        break;
    out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}

function utf16to8(str) {
	
	str=str+"";
    var out, i, len, c;

    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i);
    } else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
        out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
        out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
    } else {
        out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
        out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
    }
    }
    return out;
}

function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = str.length;
    i = 0;
    while(i < len) {
    c = str.charCodeAt(i++);
    switch(c >> 4)
    { 
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
        out += str.charAt(i-1);
        break;
      case 12: case 13:
        // 110x xxxx   10xx xxxx
        char2 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = str.charCodeAt(i++);
        char3 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x0F) << 12) |
                       ((char2 & 0x3F) << 6) |
                       ((char3 & 0x3F) << 0));
        break;
    }
    }

    return out;
}

function CharToHex(str) {
    var out, i, len, c, h;

    out = "";
    len = str.length;
    i = 0;
    while(i < len) 
    {
        c = str.charCodeAt(i++);
        h = c.toString(16);
        if(h.length < 2)
            h = "0" + h;
        
        out += "\\x" + h + " ";
        if(i > 0 && i % 8 == 0)
            out += "\r\n";
    }

    return out;
}

function xp_Encode_base64(str) {
	
    return base64encode(utf16to8(str));
}

function xp_Decode_base64(str) {
    //var src = document.getElementById('src').value;
    //var opts = document.getElementById('opt');
	
	return utf8to16(base64decode(str));

}




////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////操作COOKIE////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

function xp_getCookie(c_name){
　　　　if (document.cookie.length>0){　　//先查询cookie是否为空，为空就return ""
　　　　　　c_start=document.cookie.indexOf(c_name + "=")　　//通过String对象的indexOf()来检查这个cookie是否存在，不存在就为 -1　　
　　　　　　if (c_start!=-1){ 
　　　　　　　　c_start=c_start + c_name.length+1　　//最后这个+1其实就是表示"="号啦，这样就获取到了cookie值的开始位置
　　　　　　　　c_end=document.cookie.indexOf(";",c_start)　　//其实我刚看见indexOf()第二个参数的时候猛然有点晕，后来想起来表示指定的开始索引的位置...这句是为了得到值的结束位置。因为需要考虑是否是最后一项，所以通过";"号是否存在来判断	
				//alert("cookie:"+document.cookie+"|c_start："+c_start+"|c_end："+c_end)
　　　　　　　　if (c_end==-1) c_end=document.cookie.length　　
　　　　　　　　return unescape(document.cookie.substring(c_start,c_end))　　//通过substring()得到了值。想了解unescape()得先知道escape()是做什么的，都是很重要的基础，想了解的可以搜索下，在文章结尾处也会进行讲解cookie编码细节
　　　　　　} 
　　　　}
　　　　return "";
}　
function xp_setCookie(name,value,minite){
	var date=new Date();
    if(minite>10000000) minite=10000000;
	var expireDays=minite; //存储10分钟
	date.setTime(date.getTime()+expireDays*60*1000);
	document.cookie=name+"="+value+";expires="+date.toGMTString();
}
function xp_deleteCookie(name){
    var value="";
	var date=new Date();
	var expireDays=-10000000; //存储10分钟
	date.setTime(date.getTime()+expireDays*60*1000);
	document.cookie=name+"="+value+";expires="+date.toGMTString();
}



////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////ajax异步交互//////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

function xp_topost(tourl,totype,todata,todataType,tocache,callback){
    if(!tourl){
        callback("缺少异步操作的url");
        return false;
    } //判断发送的url
    totype=="GET" ? totype='GET':totype='POST'; //判断发送方法，默认是 POST
    if(!todata) todata=""; //发送的参数

    var tiaoshiMOOD=0;
    if(tocache==1){
        tocache=true;
    }

    if(tocache==9){ 
        alert('开启调试模式：\n'+JSON.stringify(todata));
        tiaoshiMOOD=1;
        tocache=false;
    }
    

    todataType==1 ? todataType='script':todataType=''; //判断发送方法，默认是 POST
    if(!tocache || totype!=0) tocache=false; //判断是否缓存
    
    $.ajax({
            url:tourl,
            cache:tocache,
            type:totype,
            data:todata,
            dataType:todataType,
            error:function(xhr){
                //alert(xhr.status+"\n"+xhr.responseText+"\n");
                if(todataType=="script"){
                    callback(tourl+"返回的不是script\n但是，你启用了script");
                }
                callback("有错误，详细情况：请查询控制台");
                console.log(xhr);
                //
            },
            success:function(result,status,xhr){
            if(tiaoshiMOOD==1){
                callback('返回：\n'+result);
                console.log(result);
            }

            callback(result);
           }
    });
}


////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////ajax上传//////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

function onprogress(evt) {
  var loaded = evt.loaded;     //已经上传大小情况 
  var tot = evt.total;      //附件总大小 
  var per = Math.floor(100*loaded/tot);  //已经上传的百分比 
  $("#upload_jdt").html('传输进度：'+per+"%");
  // if(parseInt(per*1000)==100000){
  //   $("#upload_jdt").html("上传成功");
  // }
};




function xp_toUpload(idx,Upload_Url,callback){
  alert("从1.1版本开始，包括此版本，已经取消了本方法。请使用xp_toUpload_And_data");
}



function xp_toUpload_And_data(idx,postdata,Upload_Url,callback){
  var formData = new FormData();
  var fileObj;
  if(typeof idx == "object"){
    fileObj=$(idx);     
  }else{
    fileObj=$("#"+idx);
  }
  if(!fileObj.attr("filesize") || fileObj.attr("filesize")==""){
    
  }else{
    var file_size=parseInt(fileObj[0].size);
    var size=parseInt(fileObj.attr("filesize"));
    if(file_size>size){
        callback("错误：你上传的文件超过了"+parseInt(fileObj.attr("filesize"))+"KB,请重试");
        return false;
    }    
  }
  if(fileObj.val().length<2){
        callback("错误：你选择的上传文件有误");
        return;
  } 
  if(!fileObj.attr("name") || fileObj.attr("name")==""){
    var filename="file";
  }else{
    var filename=fileObj.attr("name");
  }
  if(!fileObj.attr("filetype") || fileObj.attr("filetype")==""){
  }else{
    var file_type=fileObj.attr("filetype");
        file_type=file_type.split("|");
    var hz=fileObj.val();
        hz=hz.split(".");
        hz=hz[hz.length-1];
    var hzjy=0;
    for(i in file_type){
        if(file_type[i]==hz){
            hzjy=1;            
            break;
        }        
    }
    if(hzjy==0){
        callback("错误：上传的格式不正确");
        return "false";
    }
  }
  formData.append(filename,fileObj[0].files[0]);

  if(postdata){
    formData.append("data",postdata);
  }
  fileObj.attr("multiple","multiple");
  $.ajax({ 
    url : Upload_Url, 
    type : 'POST', 
    data : formData,
    // 告诉jQuery不要去处理发送的数据
    processData : false, 
    // 告诉jQuery不要去设置Content-Type请求头
    contentType : false,
    beforeSend:function(){
      if(!document.getElementById("uploadoutbox")){
        $("body").append('<div style="position:fixed;right:0;bottom:0; width:240px; height:60px;z-index:4350;" id="uploadoutbox"><div style="width:240px; height:60px;position: relative;"><div style="position:absolute;background:#000;filter:alpha(opacity=50); -moz-opacity:0.5;-khtml-opacity:0.5;opacity:0.5;width:240px; height:60px;top:0;left:0;z-index:4351;"></div><div id="upload_jdt" style="position:absolute;width:240px; height:60px; color:#fff; line-height:60px;text-align:center;z-index:4352; font-size:24px;">0%</div></div></div>');
      }else{
        $("#uploadoutbox").show();
      };      
    },
    error:function(xhr){
      callback("错误：上传失败，请查询控制台");
      console.log(xhr);
      $("#uploadoutbox").hide();
    },
    success:function(result,status,xhr){      
      setTimeout('javasript:$("#uploadoutbox").fadeOut(1000)',2000);
      callback(result);
    },
    xhr: function() {
            var xhr = jQuery.ajaxSettings.xhr();
            if(onprogress && xhr.upload) {
                xhr.upload.addEventListener('progress', onprogress, false);
                //增加绑定事件，用于返回给ajax 使用
            }
            return xhr;
        }

  });
}


function xp_toUpload_And_data_2(idx,postdata,Upload_Url,callback){
  var formData = new FormData();
  var fileObj;
  if(typeof idx == "object"){
    fileObj=$(idx);     
  }else{
    fileObj=$("#"+idx);
  }
  if(!fileObj.attr("filesize") || fileObj.attr("filesize")==""){
    
  }else{
    var file_size=parseInt(fileObj[0].size);
    var size=parseInt(fileObj.attr("filesize"));
    if(file_size>size){
        callback("错误：你上传的文件超过了"+parseInt(fileObj.attr("filesize"))+"KB,请重试");
        return false;
    }    
  }
  if(fileObj.val().length<2){
        callback("错误：你选择的上传文件有误");
        return;
  } 
  if(!fileObj.attr("name") || fileObj.attr("name")==""){
    var filename="file";
  }else{
    var filename=fileObj.attr("name");
  }
  if(!fileObj.attr("filetype") || fileObj.attr("filetype")==""){
  }else{
    var file_type=fileObj.attr("filetype");
        file_type=file_type.split("|");
    var hz=fileObj.val();
        hz=hz.split(".");
        hz=hz[hz.length-1];
    var hzjy=0;
    for(i in file_type){
        if(file_type[i]==hz){
            hzjy=1;            
            break;
        }        
    }
    if(hzjy==0){
        callback("错误：上传的格式不正确");
        return "false";
    }
  }
  formData.append(filename,fileObj[0].files[0]);

  formData.append("data","asdasd");
  if(postdata){

    if(typeof postdata == "object"){
        $.each(postdata,function(index,obj){
            formData.append(index,obj);
        });
    }else{
        formData.append('data',postdata);
    }
    

  }
  fileObj.attr("multiple","multiple");
  $.ajax({ 
    url : Upload_Url, 
    type : 'POST', 
    data : formData,
    // 告诉jQuery不要去处理发送的数据
    processData : false, 
    // 告诉jQuery不要去设置Content-Type请求头
    contentType : false,
    beforeSend:function(){
      if(!document.getElementById("uploadoutbox")){
        $("body").append('<div style="position:fixed;right:0;bottom:0; width:240px; height:60px;z-index:4350;" id="uploadoutbox"><div style="width:240px; height:60px;position: relative;"><div style="position:absolute;background:#000;filter:alpha(opacity=50); -moz-opacity:0.5;-khtml-opacity:0.5;opacity:0.5;width:240px; height:60px;top:0;left:0;z-index:4351;"></div><div id="upload_jdt" style="position:absolute;width:240px; height:60px; color:#fff; line-height:60px;text-align:center;z-index:4352; font-size:24px;">0%</div></div></div>');
      }else{
        $("#uploadoutbox").show();
      };      
    },
    error:function(xhr){
      callback("错误：上传失败，请查询控制台");
      console.log(xhr);
      $("#uploadoutbox").hide();
    },
    success:function(result,status,xhr){      
      setTimeout('javasript:$("#uploadoutbox").fadeOut(1000)',2000);
      callback(result);
    },
    xhr: function() {
            var xhr = jQuery.ajaxSettings.xhr();
            if(onprogress && xhr.upload) {
                xhr.upload.addEventListener('progress', onprogress, false);
                //增加绑定事件，用于返回给ajax 使用
            }
            return xhr;
        }
  });
}



function xp_toUpload_And_data_for_dorp(fileObject,postdata,Upload_Url,callback){ //多动上传
  var formData = new FormData();
  var fileObj=fileObject;

  var filename="file";
  formData.append(filename,fileObj);
  
  if(postdata){
    formData.append("data",postdata);
  }
  //fileObj.attr("multiple","multiple");
  $.ajax({ 
    url : Upload_Url, 
    type : 'POST', 
    data : formData,
    // 告诉jQuery不要去处理发送的数据
    processData : false, 
    // 告诉jQuery不要去设置Content-Type请求头
    contentType : false,
    beforeSend:function(){
      if(!document.getElementById("uploadoutbox")){
        $("body").append('<div style="position:fixed;right:0;bottom:0; width:240px; height:60px;z-index:4350;" id="uploadoutbox"><div style="width:240px; height:60px;position: relative;"><div style="position:absolute;background:#000;filter:alpha(opacity=50); -moz-opacity:0.5;-khtml-opacity:0.5;opacity:0.5;width:240px; height:60px;top:0;left:0;z-index:4351;"></div><div id="upload_jdt" style="position:absolute;width:240px; height:60px; color:#fff; line-height:60px;text-align:center;z-index:4352; font-size:24px;">0%</div></div></div>');
      }else{
        $("#uploadoutbox").show();
      };      
    },
    error:function(xhr){
      callback("错误：上传失败，请查询控制台");
      console.log(xhr);
      $("#uploadoutbox").hide();
    },
    success:function(result,status,xhr){      
      setTimeout('javasript:$("#uploadoutbox").fadeOut(1000)',2000);
      callback(result);
    },
    xhr: function() {
            var xhr = jQuery.ajaxSettings.xhr();
            if(onprogress && xhr.upload) {
                xhr.upload.addEventListener('progress', onprogress, false);
                //增加绑定事件，用于返回给ajax 使用
            }
            return xhr;
        }

  });
}
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////submit_提交表单生成json///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////


function xp_submitFrom(fromId){
    var form_arr = [];
    
    //each input 逻辑
    $("#"+fromId+" input").each(function(){
        
        if(!$(this).attr('name') || $(this).attr('name')=='undefined') return true;
        if($(this).attr('type')=='radio'){ //判断radio 选项
            if($(this).is(':checked')) form_arr.push("\""+$(this).attr('name')+"\":\""+$(this).val()+"\"");
            return true;
        }
        form_arr.push("\""+$(this).attr('name')+"\":\""+$(this).val()+"\"");        
    });


    //each select 逻辑
    $("#"+fromId+" select").each(function(){
        if(!$(this).attr('name') || $(this).attr('name')=='undefined') return true;
        form_arr.push("\""+$(this).attr('name')+"\":\""+$(this).val()+"\"");
        form_arr.push("\""+$(this).attr('name')+"_text"+"\":\""+$(this).find("option:selected").text()+"\"");
        //form_arr.push("\""+$(this).attr('name')+"dm"+"\":\""+$(this).val()+"\"");
    });

    //each input 逻辑
    $("#"+fromId+" textarea").each(function(){
        if(!$(this).attr('name') || $(this).attr('name')=='undefined' || $(this).attr('name')=='editorValue') return true;
        form_arr.push("\""+$(this).attr('name')+"\":\""+$(this).val()+"\"");        
    });


    return eval("({"+form_arr.join(",")+"})");
}


////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////符号过滤//////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

function symbolFiltering(str){
    if(str.length<10){
        if($("#"+str)){
            str=$("#"+str).val();
        }
    }
    str=str.replace(/\#/g,"");
    str=str.replace(/\</g,"");
    str=str.replace(/\>/g,"");
    str=str.replace(/\*/g,"");
    str=str.replace(/\,/g,"，");
    str=str.replace(/\'/g,"‘");
    str=str.replace(/\"/g,"“");
    return str;
}


function str_repace_symbol(str){
    str=str.replace(/\#/g,"");
    str=str.replace(/\</g,"");
    str=str.replace(/\>/g,"");
    str=str.replace(/\*/g,"");
    str=str.replace(/\,/g,"，");
    str=str.replace(/\'/g,"‘");
    str=str.replace(/\"/g,"“");
    return str;
}

console.log("xp加载完成，版本号：1.1，修改日期2017年05月24日。\n废弃使用 xp_toUpload，仅仅保留 xp_toUpload_And_data ，且使用出错时，直接callback回去！不在用alret")