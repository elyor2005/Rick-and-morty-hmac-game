// const ArgParser = require("./src/ArgParser");
// const GameCore = require("./src/GameCore");

// (async function main() {
//   try {
//     const args = process.argv.slice(2);
//     const parsed = ArgParser.parse(args);

//     // GameCore now only needs boxCount and rounds
//     const game = new GameCore(parsed.boxCount, parsed.rounds);

//     await game.run();
//   } catch (err) {
//     if (err && err.friendly) {
//       console.error(`Error: ${err.message}`);
//       if (err.hint) console.error(`Hint: ${err.hint}`);
//       process.exit(1);
//     } else {
//       console.error(`Unexpected error: ${err.message || err}`);
//       process.exit(2);
//     }
//   }
// })();

// !/usr/bin/env node
const ArgParser = require("./src/ArgParser");
const GameCore = require("./src/GameCore");

(async function main() {
  try {
    const args = process.argv.slice(2);
    const parsed = ArgParser.parse(args);

    // GameCore now only needs boxCount and rounds
    const game = new GameCore(parsed.boxCount, parsed.rounds);

    await game.run();
  } catch (err) {
    if (err && err.friendly) {
      console.error(`Error: ${err.message}`);
      if (err.hint) console.error(`Hint: ${err.hint}`);
      process.exit(1);
    } else {
      console.error(`Unexpected error: ${err.message || err}`);
      process.exit(2);
    }
  }
})();
