Database
====================

## Database layout

layout for database `cutuballdb`

#### users table

```
mysql> describe users;
+-----------+--------------+------+-----+---------+-------+
| Field     | Type         | Null | Key | Default | Extra |
+-----------+--------------+------+-----+---------+-------+
| id        | varchar(13)  | NO   | PRI | NULL    |       |
| firstname | varchar(255) | YES  |     | NULL    |       |
| lastname  | varchar(255) | YES  |     | NULL    |       |
| email     | varchar(255) | YES  |     | NULL    |       |
| faculty    | varchar(255) | YES  |     | NULL    |       |
| tel       | varchar(255) | YES  |     | NULL    |       |
+-----------+--------------+------+-----+---------+-------+
```
