var emailRegex = /^[\w]+@[\w.]+/gm;

function isValidEmail(input) {
  return emailRegex.test(input);
}
