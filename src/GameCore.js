const readline = require("readline");
const crypto = require("crypto");

class GameCore {
  constructor(numBoxes, MortyClass, mortyName, rounds = 1) {
    this.numBoxes = numBoxes;
    this.Morty = new MortyClass(numBoxes);
    this.mortyName = mortyName;
    this.rounds = rounds;
    this.wins = 0;
    this.losses = 0;
  }

  async run() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    for (let round = 1; round <= this.rounds; round++) {
      console.log(`\n🔹 Round ${round} of ${this.rounds}`);

      const secret = crypto.randomBytes(16).toString("hex");
      const mortyChoice = Math.floor(Math.random() * this.numBoxes);
      const hmac = crypto
        .createHmac("sha256", secret)
        .update(mortyChoice.toString())
        .digest("hex");

      console.log(
        `\n${this.mortyName}: Oh geez, Rick, I’m hiding your portal gun...`
      );
      console.log(`1st Morty: HMAC=${hmac}`);
      console.log(`1st Morty: Rick, enter your number [0,${this.numBoxes})`);

      const guess = await new Promise((resolve) =>
        rl.question("> ", (ans) => resolve(parseInt(ans)))
      );

      console.log(`\n${this.mortyName}: Okay, okay, I reveal my choice.`);
      console.log(`Secret=${secret}, My box=${mortyChoice}`);

      const check = crypto
        .createHmac("sha256", secret)
        .update(mortyChoice.toString())
        .digest("hex");

      if (check === hmac) {
        console.log(
          `${this.mortyName}: See, Rick! I didn’t cheat. The HMAC matches!`
        );
      } else {
        console.log(
          `${this.mortyName}: Uh-oh... Something’s fishy with my HMAC!`
        );
      }

      if (guess === mortyChoice) {
        console.log("Rick: Wubba lubba dub-dub! I won this round!");
        this.wins++;
      } else {
        console.log("Rick: Damn it, Morty! You tricked me again!");
        this.losses++;
      }
    }

    rl.close();
    this.showStats();
  }

  showStats() {
    console.log("\n===== 📊 Game Stats =====");
    console.log(`Total rounds: ${this.rounds}`);
    console.log(`Rick’s wins: ${this.wins}`);
    console.log(`Morty’s wins: ${this.losses}`);
    console.log(`Win rate: ${((this.wins / this.rounds) * 100).toFixed(2)}%`);

    const expectedProb = (1 / this.numBoxes) * 100;
    console.log(
      `Expected win probability: ${expectedProb.toFixed(2)}% (with ${
        this.numBoxes
      } boxes)`
    );
    console.log("=========================\n");
  }
}

module.exports = GameCore;
