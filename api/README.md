API service
--------------------

a nodeJS API services.

## Setting up development environment

#### Install required package
```bash
npm install
```

#### สร้างไฟล์ .env สำหรับเก็บรหัสผ่าน

`.env`
```
DB_USER=root
DB_PASS=[?????]
DB_NAME=cutuballdb
DB_SOCKET=/cloudsql/cutuball:asia-east2:devsql
SERVER_SECRET=[?????]
```

#### ตั้ง Proxy สำหรับเชื่อมต่อกับฐานข้อมูลขณะกำลังพัฒนา

[Connecting MySQL client using the Cloud SQL Proxy](https://cloud.google.com/sql/docs/mysql/connect-admin-proxy)

หลังตั้งค่าเสร็จแล้วสามารถเปิด Proxy โดย

```bash
./cloud_sql_proxy -dir /cloudsql/ -projects cutuball -credential_file cutuball-6828b1402a73.json
```

## Starting development server

```bash
npm start
```

## Deploying API service (backend)

```bash
gcloud app deploy --project=cutuball api/api.yaml
```

> **Note for Caution:** `--project=cutuball` นั้น **สำคัญ** มาก นั่งหัวร้อนแก้ Bug เพราะ deploy ผิด Project มันไม่สนุกเลย 😭

## Migrating database

สร้าง Database ใหม่ชื่อ `cutuballdb`

```bash
node node_modules/db-migrate/bin/db-migrate up -e prod
```
