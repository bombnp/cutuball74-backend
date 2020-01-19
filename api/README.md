API service
--------------------

บริการ API สำหรับ cutuball. [ดู Spec](../docs/api.md)


## เครื่องมือ

API นี้สร้างขึ้นบน NodeJS โดยใช้

- expressJS เป็น Framework
- GAE (Google App Engine) Standard เป็น Host
- mySQL บน Google Cloud SQL เป็นฐานข้อมูล


## การเริ่มพัฒนา

ก่อนทำการรันโค้ด จะต้องติดตั้งเครื่องมือ และตั้งค่าให้ครบก่อน

#### 1. ติดตั้ง dependencies

ต้องใช้ `npm`

```bash
npm install
```

#### 2. ใส่ไฟล์ความลับ

นำไฟล์ `.env` มาใส่ หาได้จาก slacks

`.env`
```
DB_USER=root
DB_PASS=[?????]
DB_NAME=cutuballdb
DB_SOCKET=/cloudsql/cutuball:asia-east2:devsql
SERVER_SECRET=[?????]
```

หลังจากขั้นตอนนี้แล้วควรมี directory ดังนี้

```
.
├── api.yaml
├── config.js
├── controller
├── database.json
├── .env [มีอันนี้]
├── .gcloudignore
├── .gitignore
├── migrations
├── model
├── node_modules [มีอันนี้]
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

#### 3. ติดตั้ง GCP SDK

อ่านได้ที่ [gcloud](../docs/gcloud.md)


#### 4. ตั้ง Proxy สำหรับเชื่อมต่อกับฐานข้อมูลขณะกำลังพัฒนา

อ่าน [Connecting MySQL client using the Cloud SQL Proxy](https://cloud.google.com/sql/docs/mysql/connect-admin-proxy)


**โดยย่อ**
1. Download `cloud_sql_proxy`
2. สร้าง Folder `/cloudsql/`
3. ```bash
./cloud_sql_proxy -dir /cloudsql/ -projects cutuball -credential_file cutuball-6828b1402a73.json
```

ใช้คำสั่ง



> ถ้าคุณไม่อยากสร้าง folder /cloudsql/ ที่รากระบบ คุณอาจเปลี่ยนตำแหน่ง `DB_SOCKET` ใน `.env` ได้ แล้วเปลี่ยนกลับตอน deploy


## ทดลอง Run

1. เชื่อม Database proxy

```bash
./cloud_sql_proxy -dir /cloudsql/ -projects cutuball -credential_file cutuball-6828b1402a73.json
```

2. รัน Server

```bash
npm start
```

## Deploying

```bash
gcloud app deploy api/api.yaml
```

> **Caution:** ระวัง Deploy ผิดโปรเจค หากกำลังทำหลายโปรเจคพร้อมกันอยู่


## ผัง Directory

```
.
├── api.yaml [ไฟล์ตั้งค่า GAE]
├── config.js [ค่าคงที่ต่างๆ]
├── controller [เข้าถึง แก้ไข ข้อมูล]
│   ├── auth.js [Authorization middleware]
│   ├── dummy.js [ทดสอบ]
│   └── route.js [Routing ทั้งหมด]
├── database.json [ไฟล์ตั้งค่า db-migrate]
├── .env [ความลับ]
├── .gcloudignore [ไฟล์งดเว้น GAE]
├── .gitignore [ไฟล์งดเว้น Git]
├── migrations [Process ของ db-migrate]
│   └── 20200113181506-add-users.js
├── model [จัดการข้อมูล]
│   ├── database.js
│   └── user.js
├── node_modules [Node module]
├── package.json [ไฟล์ตั้งค่า NPM]
├── package-lock.json [ไฟล์ตั้งค่า NPM]
├── README.md [เอกสาร]
└── server.js [Code หลัก]
```

แต่ที่น่าสนใจมีเพียง

```
.
├── config.js [ค่าคงที่ต่างๆ]
├── controller [เข้าถึง แก้ไข ข้อมูล]
│   ├── auth.js [Authorization middleware]
│   ├── dummy.js [ทดสอบ]
│   └── route.js [Routing ทั้งหมด]
├── model [จัดการข้อมูล]
│   ├── database.js
│   └── user.js
└── server.js [Code หลัก]
```



## เบ็ดเตล็ด: สร้าง Database

> สำหรับการเปลี่ยนเครื่อง Host ฐานข้อมูลเท่านั้น

สร้าง Database ใหม่ชื่อ `cutuballdb`

```bash
node node_modules/db-migrate/bin/db-migrate up -e prod
```
