# **Summary**
## [**Pre-register endpoints**](#preregisterendpoints)
* [/api/register](#apiregister)
* [/api/getuser](#apigetuser)
## [**Event day endpoints**](#eventdayendpoints)
* [/api/staff/checkin](#apistaffcheckin)
* [/api/getticket](#apigetticket)
## [**Admin endpoints**](#adminendpoints)
* [/api/admin/getusers](#apiadmingetusers)
* [/api/admin/random](#apiadminrandom)
* [/api/admin/randomhistory](#apiadminrandomhistory)
* [/api/admin/clearhistory](#apiadminclearhistory)
* [/api/admin/edit](#apiadminedit)
* [/api/admin/delete](#apiadmindelete)
* [/api/admin/getstat](#apiadmingetstat)
## [**Authentication**](#Authentication)
* [Authorization](#Authorization)
* [Accessing Protected Resources](#Accessing_Protected_Resources)

---
# **Pre-register endpoints**
## /api/register

 #### Method: `POST`

#### Request JSON

| field | Type | Description |  
| ----------- | ----------- | ----------- |  
| `ID` | `string` | บัตรประชาชน |  
| `name` | `string` | ชื่อ |
| `email` | `string` | email |  
| `faculty` | `string` | รหัสคณะ |
| `tel` | `string` | เบอร์โทรศัพท์ |

#### Error
 | status code | Description |  
| ----------- | ----------- |  
| `400` | ข้อมูลผิดรูปแบบ ( เช่นบัตรประชาชน checksum ไม่ผ่าน) |  
| `409` | ข้อมูลซ้ำ |  

## /api/getuser
ใช้สำหรับดูข้อมูลที่ผู้ใช้ที่มีบัตรประชาชน `id`
 #### Method: `GET`

 #### Request

 จำเป็นต้องมี token

#### Response JSON

| field | Type | Description |  
| ----------- | ----------- | ----------- |  
| `ID` | `string` | บัตรประชาชน |  
| `name` | `string` | ชื่อ |
| `email` | `string` | email |  
| `faculty` | `string` | รหัสคณะ |
| `tel` | `string` | เบอร์โทรศัพท์ |



#### Error
 | status code | Description |  
| ----------- | ----------- |  
| `401` | ไม่มี token หรือ token หมดอายุ |

# **Event day endpoints**
## /api/staff/checkin
ใช้สำหรับ checkin วันงาน
#### Method: `POST`

#### Request JSON:

จำเป็นต้องมี token

| field | Type | Description |  
| ----------- | ----------- | ----------- |  
| `id` | `string` | เลขบัตรประชาชนของคนที่ถูกแสกน |

#### Error
 | status code | Description |  
| ----------- | ----------- |  
| `400` | ไม่พบเลขบัตรประชาชนใน database |
| `401` | ไม่มี token หรือ token หมดอายุ |  

## /api/getticket
ใช้สำหรับรับตั่ว ( user ต้อง checkin ก่อนเท่านั้น )
#### Method: `GET`

#### Request

จำเป็นต้องมี token

#### Response JSON

| field | Type | Description |  
| ----------- | ----------- | ----------- |  
| `number` | `int` | เลขคิว |  
| `name` | `string` | ชื่อ |

#### Error
 | status code | Description |  
| ----------- | ----------- |  
| `401` | ไม่มี token หรือ token หมดอายุ |  
| `403` | user ยังไม่ได้ checkin |
| `409` | user checkin ไปแล้ว |

# **Admin endpoints**
## /api/admin/getusers
ใช้สำหรับดูข้อมูล user
#### Method: `GET`

#### Request Parameter:

| Parameter | Type | Description |  
| ----------- | ----------- | ----------- |  
| `start` | `int` | เริ่มที่ record ที่เท่าไหร่ |
| `end` | `int` | ถึง record ที่เท่าไหร่ |
| `value` | `string` | ข้อมูลที่ต้องการค้นหา |
| `checkedin` | `boolean` | ต้องการเฉพาะคนที่เช็คอินแล้วหรือไม่ |

ถ้าใส่ค่า value มา จะทำการ query ก่อน แล้วจะเอาข้อมูลมาแสดงตาม start กับ end

#### Response JSON

เป็น `object` ที่มี 2 field 

| field | Type | Description |  
| ----------- | ----------- | ----------- | 
| `users` | `object` | ข้อมูลของ user แต่ละคนที่ตรงตาม query ที่ limit จำนวนคนไว้ |
| `users_count` | `int` | จำนวนของ user ทั้งหมดที่ตรงตาม query |

ข้อมูลใน `users`

| field | Type | Description |  
| ----------- | ----------- | ----------- |  
| `number` | `int` | เลขคิว |  
| `ID` | `string` | บัตรประชาชน |  
| `name` | `string` | ชื่อ |
| `email` | `string` | email |  
| `faculty` | `string` | รหัสคณะ |
| `tel` | `string` | เบอร์โทรศัพท์ |
| `createdAt` | `timestamp` | เวลาที่ลงทะเบียน |
| `modifiedAt` | `timestamp` | เวลาที่ถูกแก้ไขล่าสุด |
| `checkedinAt` | `timestamp` | เวลาที่เช็คอิน |


#### Error
 | status code | Description |  
| ----------- | ----------- |  
| `400` | คำขอผิดรูปแบบ เช่น end ก่อน start |
| `401` | ไม่มี token หรือ token หมดอายุ |

## /api/admin/random
ใช้สำหรับสุ่มเลขคิวผู้ใช้

#### Method: `GET`

#### Response JSON

| field | Type | Description |  
| ----------- | ----------- | ----------- |  
| `number` | `int` | เลขคิว |  
| `name` | `string` | ชื่อ |

#### Error
 | status code | Description |  
| ----------- | ----------- |  
| `401` | ไม่มี token หรือ token หมดอายุ |

## /api/admin/randomhistory

#### Method: `GET`

#### Response JSON

Array ของ ผลลัพธ์เก่าของ `/api/admin/random` เรียงจากเก่าที่สุดไปใหม่

```json
{
  "history" : [
    {"number": 1234, "name": "ex"},
    {"number": 12345, "name": "ex"},
  ]
}
```

#### Error
 | status code | Description |  
| ----------- | ----------- |  
| `401` | ไม่มี token หรือ token หมดอายุ |

## /api/admin/clearhistory

#### Method: `DELETE`

ล้างประวัติการสุ่มเลขติวผู้ใช้

#### Error
 | status code | Description |  
| ----------- | ----------- |  
| `401` | ไม่มี token หรือ token หมดอายุ |

## /api/admin/edit
ใช้สำหรับแก้ไขข้อมูล
#### Method: `PUT`

#### Request JSON:

| field | Type | Description |  
| ----------- | ----------- | ----------- |  
| `ID` | `string` | บัตรประชาชนของ user ที่จะแก้ไขข้อมูล |  
| `name` | `string` | ชื่อใหม่ |
| `email` | `string` | email ใหม่ |  
| `faculty` | `string` | รหัสคณะใหม่ |
| `tel` | `string` | เบอร์โทรศัพท์ใหม่  |

ไม่จำเป็นต้องใส่มาทุก field ใส่มาเฉพาะที่จะแก้ไข

#### Error
 | status code | Description |  
| ----------- | ----------- |  
| `400` | คำขอผิดรูปแบบ เช่น ไม่ได้ใส่ ID มา |
| `401` | ไม่มี token หรือ token หมดอายุ |

## /api/admin/delete
ใช้สำหรับลบข้อมูล
#### Method: `DELETE`

#### Request Parameter:

| Parameter | Type | Description |  
| ----------- | ----------- | ----------- |  
| `ID` | `string` | บัตรประชาชนของ user ที่จะลบข้อมูล |

ไม่จำเป็นต้องใส่มาทุก field ใส่มาเฉพาะที่จะแก้ไข

#### Error
 | status code | Description |  
| ----------- | ----------- |  
| `400` | คำขอผิดรูปแบบ เช่น ไม่ได้ใส่ ID มา |
| `401` | ไม่มี token หรือ token หมดอายุ |

## /api/admin/getstat
ใช้สำหรับดูจำนวนคน
#### Method: `GET`

#### Response JSON

| field | Type | Description |  
| ----------- | ----------- | ----------- |  
| `regist` | `int` | จำนวนคนลงทะเบียน |  
| `checkin` | `int` | จำนวนคน checkin |  

#### Error
 | status code | Description |  
| ----------- | ----------- |  
| `401` | ไม่มี token หรือ token หมดอายุ |

# Authentication

ในการเข้าถึง Protected Resources จำเป็นต้องมีการ Authenticate โดยอาศัยมาตรฐานดังต่อไปนี้

#### Authorization

รับ token จาก `/api/token` ด้วยวิธี [Resource Owner Password Credentials Grant](https://tools.ietf.org/html/rfc6749#section-4.3) โดยใช้เลขบัตรประชาชนเป็น Username และ เบอร์โทรศัพท์เป็น Password

#### Accessing Protected Resources

ใช้ token จากข้อก่อนหน้าในการเข้าถึง Protected Resources เช่น `/api/getuser` ด้วยวิธี  [Authorization Request Header Field](https://tools.ietf.org/html/rfc6750#section-2.1)
