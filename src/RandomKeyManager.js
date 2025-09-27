// RandomKeyManager - manages the one-time secret keys (crypto-safe)
const crypto = require("crypto");

class RandomKeyManager {
  // create a cryptographically secure key of at least 256 bits
  static createKey() {
    return crypto.randomBytes(32); // 32 bytes == 256 bits
  }

  static keyToHex(key) {
    return key.toString("hex").toUpperCase();
  }
}

module.exports = RandomKeyManager;
