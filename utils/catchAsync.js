module.exports = fn => {
    return (req, res, next) => {
      fn(req, res, next).catch(next); // This is where the magic happens
    };
  };