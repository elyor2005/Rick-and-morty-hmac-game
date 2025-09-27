// src/ArgParser.js
class ArgParser {
  static parse(args) {
    if (args.length < 3) {
      throw {
        friendly: true,
        message:
          "Usage: node randm.js <boxCount> <mortyPath> <mortyClassName> [rounds]",
        hint: "Example: node randm.js 3 ./morties/ClassicMorty.js ClassicMorty 5",
      };
    }

    const boxCount = parseInt(args[0], 10);
    if (isNaN(boxCount) || boxCount < 2) {
      throw {
        friendly: true,
        message: "Invalid box count.",
        hint: "Box count must be an integer >= 2",
      };
    }

    const mortyPath = args[1];
    const mortyClassName = args[2];
    const rounds = args[3] ? parseInt(args[3], 10) : 1; // default 1 round

    return { boxCount, mortyPath, mortyClassName, rounds };
  }
}

module.exports = ArgParser;
