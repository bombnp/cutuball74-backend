//Ping health check
function ping(req, res) {
  res.send("ping");
}


//Protected resources
function testProtect(req, res) {
  res.send("Protected Endpoint Reached.<br>Welcome " + req.user.name + "!");
}


module.exports = {ping, testProtect}
