GCloud
======================

Project นี้ Host ทุกอย่างบน Google Cloud Platform ดังนั้นในเอกสารนี้จะแสดงวิธีการติดตั้งเครื่องมือ `gcloud` สำหรับใช้ในการ Deploy, Config, etc. Project


### ติดตั้ง SDK

อ่านได้ที่ [Quickstart](https://cloud.google.com/sdk/docs/quickstarts)

ตัวอย่างสำหรับ Ubuntu

```bash
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
sudo apt-get update && sudo apt-get install google-cloud-sdk
gcloud init
```

### ยืนยันตัวตน

> Note: ตอนนี้มีผู้ที่เพิ่มสมาชิก GCloud ได้คือ `@Pipat Saengow` และ `@BossWT`

1. หากคุณเป็นสมาชิก Project แล้ว
  - `gcloud auth login`
2. หากคุณยังไม่เป็นสมาชิก
  - หาไฟล์ `cutuball-6828b1402a73.json` ใน slack
  - `gcloud auth activate-service-account --key-file=cutuball-6828b1402a73.json`

  
