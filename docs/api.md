# **Summary**
## [**Pre-register endpoints**](#preregisterendpoints)
* [/api/register](#apiregister)
* [/api/getuser](#apigetuser)
## [**Event day endpoints**](#eventdayendpoints)
* [/api/checkin](#apicheckin)
* [/api/getticket](#apigetticket)
## [**Admin endpoints**](#adminendpoints)
* [/api/admin/getusers](#apiadmingetusers)
* [/api/admin/query](#apiadminquery)
* [/api/admin/random](#apiadminrandom)
* [/api/admin/pastrandom](#apiadminpastrandom)
* [/api/admin/edit](#apiadminedit)
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
## /api/checkin
ใช้สำหรับ checkin วันงาน
#### Method: `POST`

#### Request JSON:

จำเป็นต้องมี token

| field | Type | Description |  
| ----------- | ----------- | ----------- |  
| `QRtoken` | `string` | สำหรับตรวจสอบว่าได้สแกน QR หรือเปล่า |

#### Response JSON

| field | Type | Description |  
| ----------- | ----------- | ----------- |  
| `number` | `int` | เลขคิว |  
| `name` | `string` | ชื่อ |

#### Error
 | status code | Description |  
| ----------- | ----------- |  
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

# **Admin endpoints**
## /api/admin/getusers
ใช้สำหรับดูข้อมูล user
#### Method: `GET`

#### Request JSON:

| field | Type | Description |  
| ----------- | ----------- | ----------- |  
| `range` | `object` | สำหรับระบุว่าเอา record ในช่วงไหน ( ถ้าต้องการทั้งหมดให้เป็น `null` หรือ ไม่ต้องใส่มา) |

โดย `range` มีรูปแบบดังนี้

| field | Type | Description |  
| ----------- | ----------- | ----------- |  
| `start` | `int` | เริ่มที่ record ที่เท่าไหร่ |
| `end` | `int` | ถึง record ที่เท่าไหร่ |

#### Response JSON

`array` ของ `object` โดยแต่ละ object มีรูปแบบดังนี้

| field | Type | Description |  
| ----------- | ----------- | ----------- |  
| `number` | `int` | เลขคิว |  
| `ID` | `string` | บัตรประชาชน |  
| `name` | `string` | ชื่อ |
| `email` | `string` | email |  
| `faculty` | `string` | รหัสคณะ |
| `tel` | `string` | เบอร์โทรศัพท์ |


#### Error
 | status code | Description |  
| ----------- | ----------- |  
| `400` | คำขอผิดรูปแบบ เช่น end ก่อน start |
| `401` | username/password ไม่ถูกต้อง |

## /api/admin/query
ใช้สำหรับ query ข้อมูล
#### Method: `POST`

#### Request JSON:

| field | Type | Description |  
| ----------- | ----------- | ----------- |  
| `number` | `int` | เลขคิว |  
| `ID` | `string` | บัตรประชาชน |  
| `name` | `string` | ชื่อ |
| `email` | `string` | email |  
| `faculty` | `string` | รหัสคณะ |
| `tel` | `string` | เบอร์โทรศัพท์ |

ไม่จำเป็นต้องใส่มาทุก field ใส่มาเฉพาะที่จะ query

#### Response JSON

ข้อมูลของผู้ใช้ทุกคนที่ตรงตาม query เป็น `array` ของ `object` โดยแต่ละ object มีรูปแบบดังนี้

| field | Type | Description |  
| ----------- | ----------- | ----------- |  
| `number` | `int` | เลขคิว |  
| `ID` | `string` | บัตรประชาชน |  
| `name` | `string` | ชื่อ |
| `email` | `string` | email |  
| `faculty` | `string` | รหัสคณะ |
| `tel` | `string` | เบอร์โทรศัพท์ |


#### Error
 | status code | Description |  
| ----------- | ----------- |  
| `401` | username/password ไม่ถูกต้อง |

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
| `401` | username/password ไม่ถูกต้อง |

## /api/admin/pastrandom

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
| `401` | username/password ไม่ถูกต้อง |

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
| `401` | username/password ไม่ถูกต้อง |

# Authentication

ในการเข้าถึง Protected Resources จำเป็นต้องมีการ Authenticate โดยอาศัยมาตรฐานดังต่อไปนี้

#### Authorization

รับ token จาก `/api/token` ด้วยวิธี [Resource Owner Password Credentials Grant](https://tools.ietf.org/html/rfc6749#section-4.3) โดยใช้เลขบัตรประชาชนเป็น Username และ เบอร์โทรศัพท์เป็น Password

#### Accessing Protected Resources

ใช้ token จากข้อก่อนหน้าในการเข้าถึง Protected Resources เช่น `/api/getuser` ด้วยวิธี  [Authorization Request Header Field](https://tools.ietf.org/html/rfc6750#section-2.1)
