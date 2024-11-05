function checkBody(body, keys) {
  
  for (const field of keys) {
    if (body[field] && body[field] !== "") {
      return true;
    }
  }

  return false;
}

module.exports = { checkBody };
