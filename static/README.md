Front-end static content hosting
===========================

Host สำหรับเว็บ Front-end.


#ขั้นตอนการ Upload หน้าเว็บ

## Download front-end repo

ต้องมีสิทธิอ่าน repo `paphonb/cutuball-register`

```bash
git submodule init
git submodule update
```

จะได้ repo ของ front-end ใน `repo/`

## Build front-end

สอบถามจาก frontent

หลังจาก Build แล้ว ควรจะได้ directory `repo/build`

## Deploy to GAE

ต้องมีสิทธิ Deploy GAE อ่านวิธีได้ที่ `docs/gcloud.md`

```bash
gcloud app deploy static.yaml
```
