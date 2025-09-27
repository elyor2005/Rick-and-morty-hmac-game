#!/usr/bin/env node
// randm.js - entry point

const ArgParser = require("./src/ArgParser");
const MortyLoader = require("./src/MortyLoader");
const GameCore = require("./src/GameCore");

(async function main() {
  try {
    const args = process.argv.slice(2);
    const parsed = ArgParser.parse(args);
    const mortyModule = MortyLoader.load(
      parsed.mortyPath,
      parsed.mortyClassName
    );

    const game = new GameCore(
      parsed.boxCount,
      mortyModule,
      parsed.mortyClassName || mortyModule.name || "Morty",
      parsed.rounds //
    );
    await game.run();
  } catch (err) {
    // Friendly error reporting (no stack traces for common errors)
    if (err && err.friendly) {
      console.error(`Error: ${err.message}`);
      if (err.hint) console.error(`Hint: ${err.hint}`);
      process.exit(1);
    } else {
      // Unexpected — print minimal info
      console.error(`Unexpected error: ${err.message || err}`);
      process.exit(2);
    }
  }
})();
