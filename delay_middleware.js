module.exports = (req, res, next) => {
  sleep(500).then(() => {
     next()
  });
}

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

