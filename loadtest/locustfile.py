from locust import HttpLocust, TaskSet, between, task
from random import randrange, choice
from string import ascii_letters


def gennatid():
    val = []
    x = 0
    for i in range(12):
        v = randrange(10)
        val.append(v)
        x += (13 - i) * v
    x %= 11
    val.append(1 - x if x <= 1 else 11 - x)
    return ''.join(map(str, val))

def genrandstr(charset = ascii_letters, charlen = 0):
    charlen = charlen or randrange(100)
    return ''.join([ choice(charset) for _ in range(charlen)])


thaicharset = ''.join([chr(ord('ก') + l) for l in range(ord('๛') - ord('ก'))])

class UserTask(TaskSet):
    
    def on_start(self):
        self.ud = {
        "ID": gennatid(),
        "name": genrandstr(thaicharset, 20) + ' ' + genrandstr(thaicharset, 5) + ' ' + genrandstr(thaicharset + ascii_letters, 20),
        "email": genrandstr(charlen = 40) + '@' + genrandstr(charlen = 10) + '.com',
        "faculty": "21",
        "tel": '0' + genrandstr(charset = '0123456789', charlen= 9)
        }
        self.register()
        self.login()


    def register(self):
        self.client.post(json = self.ud,
            url = "/register")


    @task(5)
    def login(self):
        res = self.client.post("/token", data = {
            "grant_type" : "password",
            "username" : self.ud['ID'],
            "password" : self.ud['tel']
            })

        self.headers = {'Authorization': 'Bearer ' + res.json()['access_token']}


    @task(20)
    def getuser(self):
        res = self.client.get('/getuser', headers = self.headers).json()
        assert(res == self.ud)


class WebsiteUser(HttpLocust):
    task_set = UserTask
    wait_time = between(5, 9)




    




