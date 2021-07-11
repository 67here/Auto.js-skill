//1.初始化
auto.waitFor();

//2.使用屏幕长宽数据的初始化
if(!device.width) {toastLog('BUG啦，请重启手机');exit();};

//3.截图初始化
if(!requestScreenCapture()){
  toast("请求截图失败");
  exit();}

//4.点击控件 找不到报错
function sureclick(x) {if(x) return x.click();else toastLog('未找到按钮');}

//5.点击不可点击的控件
function position_click(x){if(x) click(x.bounds().centerX(), x.bounds().centerY())
  else toastLog('找不到此控件');}

//6.子线程 音量键关闭
threads.start(function(){
  events.observeKey();
 events.onKeyDown("volume_up", function(event){toastLog("\n音量+被按下，即将结束脚本！");sleep(2000);console.hide();exit();});
});

//7.不断查找某控件父元素，并点击(解决模拟器和手机不查找元素不一致问题)
function up_click(x) {
  if (x && x.clickable()) return x.click();
  for (let ii = 0; ii < 6; ii++) {
      if (!x) break
      x = x.parent();
      if (x && x.clickable()) return x.click();
      let list_x = x.children();
      for (let i = 0; i < list_x.length; i++) 
      {if (list_x[i] && list_x[i].clickable()) return list_x[i].click()};}
  return false}

//8.找图点击 
function png_click(num, pngbase64){
  while(num--){
      let img = captureScreen();
      let temp1 = images.fromBase64(pngbase64);
      let pos = findImage(img, temp1);
      if(pos){return click(pos.x, pos.y);} else sleep(1000);}
  return false;}

//9.找色点击
function cs_click(rgb, xr, yr, wr, hr) {
  let img = captureScreen()
  let point = findColor(img, rgb, { region: [img.getWidth() * xr, img.getHeight() * yr, img.getWidth() * wr, img.getHeight() * hr], threshold: 8 })
      if (point) {
          point.x = img.getWidth() - point.x; point.y = img.getHeight() - point.y       
          return click(point.x, point.y);
      }
}

//10.多词匹配
let sth = textMatches('.+关键词.+|.+关键词.+|.+关键词.+');

//11.意图启动
app.startActivity({
  packageName:'com.taobao.live',
  action:'VIEW',
  className:'com.taobao.live.TaoLiveVideoActivity'
  }); 

//百度OCR 三连发
//ocr1 返回识图结果
function Baidu_ocr(imgFile){
  log("识图...");
  var imag64 = images.toBase64(imgFile, "png", 100);
  var API_Key="自己的AK";
  var Secret_Key="自己的SK";
  var getTokenUrl="https://aip.baidubce.com/oauth/2.0/token";//选择网络图片识别
  var token_Res = http.post(getTokenUrl, {
      grant_type: "client_credentials",
      client_id: API_Key,
      client_secret: Secret_Key,
  });
  var access_token=token_Res.body.json().access_token;
  var ocrUrl = "https://aip.baidubce.com/rest/2.0/ocr/v1/webimage_loc";
  var ocr_Res = http.post(ocrUrl, {
      headers: {
          "Content - Type": "application/x-www-form-urlencoded"
      },
      access_token: access_token,
      image: imag64,
      language_type:"CHN_ENG"//可添加额外参数
  });
  sleep(1000);
  var json = ocr_Res.body.json();
  return json.words_result;
}
//OCR2 处理返回结果 并点击
function ocr_click(target_words) {
  var imgScreen = captureScreen();
  var logOcr= Baidu_ocr(imgScreen);
  var target_nums = 0;

  for (i = 0; i < logOcr.length; i++){
      if(target_words == logOcr[i].words) {console.log('找到：'+target_words);target_nums = i;break;}
  }
  if(!target_nums) {log('未找到指定文字');return false;}
  let postion = new Array();

  postion[1] = logOcr[target_nums].location.top;
  postion[0] = logOcr[target_nums].location.left;
  sleep(500);

  click(postion[0], postion[1]);
  return postion;
}
//ocr3.记录所有相同字的位置，目的是为了尽可能的少发送截图请求
function list_ocr(target_words) {
  sleep(2000);
  let img = captureScreen();
  let imgScreen = images.clip(img, 0, dev_hight/2, dev_width, dev_hight/2);
  var logOcr= Baidu_ocr(imgScreen);
  let nums_list = new Array();
  let times = 0;

  for (i = 0; i < logOcr.length; i++){
      if(target_words == logOcr[i].words) nums_list[times++] = i;
  }
  if(!times) {log('未找到指定文字');return false;}
    else log('找到'+times+'个');

  var postion = new Array();
  for(k = 0; k < times; k++){
    postion[k]=new Array();
  }
  for(i = 0; i < times; i++){
    postion[i][0] = logOcr[nums_list[i]].location.left;
    postion[i][1] = logOcr[nums_list[i]].location.top;
  }
  return postion; 
}
