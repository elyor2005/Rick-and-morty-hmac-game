const crypto = require("crypto");

class ClassicMorty {
  constructor(boxCount) {
    this.boxCount = boxCount;
  }

  commit() {
    // Morty picks a random box
    const choice = Math.floor(Math.random() * this.boxCount);

    // Morty generates a random secret
    const secret = crypto.randomBytes(16).toString("hex");

    // Create HMAC to commit
    const hmac = crypto
      .createHmac("sha256", secret)
      .update(choice.toString())
      .digest("hex");

    return { choice, secret, hmac };
  }
}

module.exports = { ClassicMorty };
