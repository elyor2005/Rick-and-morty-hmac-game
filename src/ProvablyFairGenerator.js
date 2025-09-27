// ProvablyFairGenerator - performs the HMAC-based collaborative protocol
const crypto = require("crypto");
const RandomKeyManager = require("./RandomKeyManager");
const readline = require("readline");

class ProvablyFairGenerator {
  constructor() {
    // check for preferred HMAC (sha3-256) availability
    const hashes = crypto.getHashes();
    this.preferred = hashes.includes("sha3-256") ? "sha3-256" : "sha256";
    this.availableAlg = this.preferred;
  }

  // interactive method to produce a fair integer in [0, range)
  async generate(range, promptPrefix = "") {
    if (!Number.isInteger(range) || range <= 0) {
      throw new Error("Range must be a positive integer.");
    }
    const mortyValue = this._secureRandomInt(range);
    const key = RandomKeyManager.createKey();
    const hmac = crypto
      .createHmac(this.availableAlg, key)
      .update(String(mortyValue))
      .digest("hex")
      .toUpperCase();

    console.log(`${promptPrefix}Morty: HMAC=${hmac}`);
    const rickValue = await this._askRickInt(
      range,
      `${promptPrefix}Morty: Rick, enter your number [0,${range}) so you don’t whine later that I cheated, alright? `
    );

    const final = (mortyValue + rickValue) % range;

    // store data to be revealed on request
    return {
      final,
      reveal: () => ({
        mortyValue,
        keyHex: RandomKeyManager.keyToHex(key),
        algorithm: this.availableAlg,
        final,
      }),
    };
  }

  _secureRandomInt(range) {
    // unbiased integer in [0, range)
    const bytes = crypto.randomBytes(6); // up to 48 bits
    let val = 0n;
    for (const b of bytes) val = (val << 8n) + BigInt(b);
    return Number(val % BigInt(range));
  }

  _askRickInt(range, prompt) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    return new Promise((resolve) => {
      const ask = () => {
        rl.question(prompt, (ans) => {
          const v = Number(ans.trim());
          if (!Number.isInteger(v) || v < 0 || v >= range) {
            console.log(`Please enter an integer between 0 and ${range - 1}.`);
            ask();
            return;
          }
          rl.close();
          resolve(v);
        });
      };
      ask();
    });
  }
}

module.exports = ProvablyFairGenerator;
