## 接口API

### 目前服务器地址：http://106.14.223.219:8089/
### 所有接口统一返回ApiResponse对象，json格式为：
```json
{
  "data": "json data",
  "errorCode": 1000,
  "message": "",
  "success": true
}
```

### data： 表示实际返回数据的json格式
### errorCode： 1000表示操作成功，反之，表示具体的失败的异常码
### message：详细的错误描述信息
### success：操作成功还是失败

#### 失败的返回示例:
```json
{
  "errorCode": 100001001,
  "message": "[code:100001001,message:null]",
  "success": false
}
```

#### 成功的返回示例:
```json
{
  "data": "xxx",
  "errorCode": 1000,
  "message": "",
  "success": true
}
```

--------- 
### 1.登录注册模块

##### 1）  发送注册短信

###### 请求url:
http://106.14.223.219:8089/register/sendRegSms.json
###### 参数:
mobile 手机号 

##### 接口示例：

http://106.14.223.219:8089/register/sendRegSms.json?mobile=18061661296

##### 接口返回:
```json
{
  "data": null,
  "errorCode": 1000,
  "message": "",
  "success": true
}
```

##### 2）  手机注册
  
###### 请求url:
http://106.14.223.219:8089/register/registerByMobile.json
###### 参数:
mobile 手机号 

password 密码

verifyCode 短信验证码

##### 接口示例：

http://106.14.223.219:8089/register/registerByMobile.json?mobile=18061661297&password=123456abc&verifyCode=178651

##### 接口返回:
```json
{
  "data": {
    "uid": 1,
    "sessionId": "xasdadadassdsadasdasdasd"
  },
  "errorCode": 1000,
  "message": "",
  "success": true
}
```

##### 3）  手机/密码登录
  
###### 请求url:
https://127.0.0.1:8080/login/loginByMobile.json
###### 参数:

userName 手机号 

password 密码

verifyCode 验证码(可能没有，输错几次密码之后才会有)

##### 接口示例：

https://127.0.0.1:8080/login/loginByMobile.json?userName=18061661297&password=123456abc&verifyCode=xx

##### 接口返回:
```json
{
  "data": {
    "allowAttation": 1,
    "channelType": 0,
    "headUrl": "",
    "isVip": 0,
    "nickName": "7f63af11-f3f2-4a26-89da-d5471fcae725",
    "openId": "18061661297",
    "regStat": 0,
    "uid": 1006,
    "sessionId": "xasdadadassdsadasdasdasd"
  },
  "errorCode": 1000,
  "message": "",
  "success": true
}
```

##### 4） 微博登录
  
###### 请求url:
https://127.0.0.1:8080/login/loginByOpenId.json
###### 参数:
openId: 第三方登录的openid，比如微博的uid 

token: token信息

channelType:  频道类型  1-微博

##### 接口示例：

https://127.0.0.1:8080/login/loginByOpenId.json?openId=123123123&token=123456abc&channelType=1

##### 接口返回:
```json
{
  "data": {
    "allowAttation": 1,
    "channelType": 0,
    "headUrl": "",
    "isVip": 0,
    "nickName": "7f63af11-f3f2-4a26-89da-d5471fcae725",
    "openId": "18061661297",
    "regStat": 0,
    "uid": 1006,
    "sessionId": "xasdadadassdsadasdasdasd"
  },
  "errorCode": 1000,
  "message": "",
  "success": true
}
```
