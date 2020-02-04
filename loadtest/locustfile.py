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
        "tel": '0' + genrandstr(charset = '0123456789', charlen= 9),
        }
        self.register()
        self.login()
        self.stafflogin()
        self.checkin = False


    def register(self):
        modud = dict(self.ud)
        modud["bypassrecaptcha"] = "true"
        res = self.client.post(json = modud,
            url = "/register")


    def reqtoken(self, username, password):
        res = self.client.post("/token", data = {
            "grant_type" : "password",
            "username" : username,
            "password" : password
            })
        return res.json()['access_token']


    @task(5)
    def login(self):
        token = self.reqtoken(self.ud['ID'], self.ud['tel'])
        self.headers = {'Authorization': 'Bearer ' + token}


    def stafflogin(self):
        self.staffheaders = {'Authorization': 'Bearer ' + self.reqtoken("staff", "IaMsTaFf")}

    @task(20)
    def getuser(self):
        with self.client.get('/getuser', headers = self.headers, catch_response=True) as res:
            if res.status_code == 200 and res.json() == self.ud:
                res.success()
            else:
                res.failure("getuser status err or data mismatch")
                print(str(self.ud) + " <> " + str(res.json()))

    @task(5)
    def checkin(self):
        with self.client.post('/staff/checkin', headers = self.staffheaders, json = {"id":self.ud['ID']}, catch_response=True) as res:
            if not self.checkin:
                if res.status_code == 200:
                    res.success()
                    self.checkin = True
                else:
                    res.failure("Checking fail")
                
            else:
                if res.status_code == 409:
                    res.success()
                else:
                    res.failure("Re-checkin fail")


class WebsiteUser(HttpLocust):
    task_set = UserTask
    wait_time = between(5, 9)




    




