//Ping health check
function ping(req, res) {
  res.send("ping");
}


//Protected resources
function testprotect(req, res) {
  res.send("Protected Enpoint Reached.<br>Welcome " + req.user.name + "!");
}


module.exports = {ping, testprotect}
