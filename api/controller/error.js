const bodyParser = require('body-parser');


/**
 *
 * @param {Response} res
 * @param {Number} status
 * @param {String} code
 * @param {String} desc
 */

function handleError(res, status, code, desc){
  res.status(status).json({"error" : code, "error_description":desc});
}


/** Safe bodyParser middleware with no error possible.
  *
  * This prevents SyntaxError from being handled by default handler causing it to log error.
  */
function safeBodyParserJson(req, res, next) {
  nextWithCatch = (err) => {
    if (err) {
      handleError(res, 400, "PARSEJSONERR", "Error while parsing JSON request");
    } else {
      next();
    }
  }
  bodyParser.json()(req, res, nextWithCatch);
}


module.exports = {handleError, safeBodyParserJson};
