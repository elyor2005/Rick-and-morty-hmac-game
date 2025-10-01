const readline = require("readline");
const crypto = require("crypto");

class GameCore {
  constructor(numBoxes = 3, rounds = 1) {
    this.numBoxes = numBoxes;
    this.rounds = rounds;
    this.results = []; // track results for stats
  }

  async run() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const ask = (q) =>
      new Promise((res) => rl.question(q, (ans) => res(ans.trim())));

    // helper to wrap crypto.randomInt in a Promise
    const secureRandomInt = (max) =>
      new Promise((resolve, reject) =>
        crypto.randomInt(max, (err, n) => (err ? reject(err) : resolve(n)))
      );

    let keepPlaying = true;
    let round = 1;

    while (keepPlaying && round <= this.rounds) {
      console.log(
        `Morty: Oh geez, Rick, I'm gonna hide your portal gun in one of the ${this.numBoxes} boxes, okay?`
      );

      // === Stage 1: commit random1
      const key1 = crypto.randomBytes(32).toString("hex");
      const rand1 = await secureRandomInt(this.numBoxes);
      const hmac1 = crypto
        .createHmac("sha256", key1)
        .update(rand1.toString())
        .digest("hex");
      console.log(`Morty: HMAC1=${hmac1}`);

      // Rick chooses a box
      const choice = parseInt(
        await ask(
          `Morty: Rick, enter your number [0,${this.numBoxes}) so you don’t whine later that I cheated, alright?\nRick: `
        ),
        10
      );

      // Rick makes a guess
      const guess = parseInt(
        await ask(
          `Morty: Okay, okay, I hid the gun. What’s your guess [0,${this.numBoxes})?\nRick: `
        ),
        10
      );

      // === Stage 2: commit random2
      console.log(
        `Morty: Let’s, uh, generate another value now, I mean, to select a box to keep in the game.`
      );
      const key2 = crypto.randomBytes(32).toString("hex");
      const rand2 = await secureRandomInt(2); // two boxes will remain
      const hmac2 = crypto
        .createHmac("sha256", key2)
        .update(rand2.toString())
        .digest("hex");
      console.log(`Morty: HMAC2=${hmac2}`);

      // Rick enters subchoice
      const subChoice = parseInt(
        await ask(
          `Morty: Rick, enter your number [0,2), and, uh, don’t say I didn’t play fair, okay?\nRick: `
        ),
        10
      );

      // === Ensure Morty keeps two distinct boxes
      let fair1 = (choice + rand1) % this.numBoxes;
      if (fair1 === guess) {
        fair1 = (fair1 + 1) % this.numBoxes; // adjust to avoid duplicate
      }
      const keptBoxes = [guess, fair1];
      console.log(
        `Morty: I'm keeping the box you chose, I mean ${guess}, and the box ${fair1}.`
      );

      // Rick decides to switch or stay
      const finalPick = parseInt(
        await ask(
          `Morty: You can switch your box (enter ${fair1}), or, you know, stick with it (enter ${guess}).\nRick: `
        ),
        10
      );

      // === Reveal both commits here (matches teacher sample)
      console.log(`Morty: Aww man, my 1st random value is ${rand1}.`);
      console.log(`Morty: KEY1=${key1}`);
      console.log(
        `Morty: So the 1st fair number is (${choice} + ${rand1}) % ${this.numBoxes} = ${fair1}.`
      );

      console.log(`Morty: Aww man, my 2nd random value is ${rand2}.`);
      console.log(`Morty: KEY2=${key2}`);
      const fair2 = (subChoice + rand2) % 2;
      console.log(
        `Morty: Uh, okay, the 2nd fair number is (${subChoice} + ${rand2}) % 2 = ${fair2}`
      );

      const gunBox = keptBoxes[fair2];
      console.log(`Morty: You portal gun is in the box ${gunBox}.`);

      const switched = finalPick !== guess;
      const win = finalPick === gunBox;
      if (win) {
        console.log(`Morty: Aww man, you won, Rick!`);
      } else {
        console.log(
          `Morty: Aww man, you lost, Rick. Now we gotta go on one of *my* adventures!`
        );
      }

      // store results
      this.results.push({ switched, win });

      // === Ask to play again
      const again = await ask(
        `Morty: D-do you wanna play another round (y/n)?\nRick: `
      );
      if (again.toLowerCase() !== "y") {
        console.log(`Morty: Okay… uh, bye!`);
        keepPlaying = false;
      }

      round++;
    }

    this.showStats();
    rl.close();
  }

  showStats() {
    const rounds = this.results.length;
    const switchedRounds = this.results.filter((r) => r.switched).length;
    const stayedRounds = rounds - switchedRounds;
    const switchWins = this.results.filter((r) => r.switched && r.win).length;
    const stayWins = this.results.filter((r) => !r.switched && r.win).length;

    console.log("                  GAME STATS ");
    console.log("┌──────────────┬───────────────┬─────────────┐");
    console.log("│ Game results │ Rick switched │ Rick stayed │");
    console.log("├──────────────┼───────────────┼─────────────┤");
    console.log(
      `│ Rounds       │ ${String(switchedRounds).padStart(13)} │ ${String(
        stayedRounds
      ).padStart(11)} │`
    );
    console.log("├──────────────┼───────────────┼─────────────┤");
    console.log(
      `│ Wins         │ ${String(switchWins).padStart(13)} │ ${String(
        stayWins
      ).padStart(11)} │`
    );
    console.log("├──────────────┼───────────────┼─────────────┤");

    const estSwitch =
      switchedRounds > 0 ? (switchWins / switchedRounds).toFixed(3) : "?";
    const estStay =
      stayedRounds > 0 ? (stayWins / stayedRounds).toFixed(3) : "?";
    console.log(
      `│ P (estimate) │ ${String(estSwitch).padStart(13)} │ ${String(
        estStay
      ).padStart(11)} │`
    );
    console.log("├──────────────┼───────────────┼─────────────┤");
    console.log(
      `│ P (exact)    │ ${String((2 / 3).toFixed(3)).padStart(13)} │ ${String(
        (1 / 3).toFixed(3)
      ).padStart(11)} │`
    );
    console.log("└──────────────┴───────────────┴─────────────┘");
  }
}

module.exports = GameCore;
