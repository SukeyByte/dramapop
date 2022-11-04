function non_str() {
  var data = '';
  var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M']
  for (var i = 0; i < 32; i++) {
    var id = parseInt(Math.random() * (chars.length - 1));
    data += chars[id]
  }
  return data
}

module.exports = {
  non_str: non_str
}