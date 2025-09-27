const path = require("path");
const fs = require("fs");

class MortyLoader {
  static load(modulePath, className) {
    const resolved = path.resolve(modulePath);
    if (!fs.existsSync(resolved)) {
      throw {
        friendly: true,
        message: `Morty module not found at path: ${modulePath}`,
        hint: "Provide a valid relative or absolute path to Morty implementation file.",
      };
    }
    const mod = require(resolved);
    // If user gave className, try to pick that export
    if (className) {
      if (!mod[className]) {
        // check default/class export names
        throw {
          friendly: true,
          message: `Morty class "${className}" not exported by module ${modulePath}.`,
          hint: "Export your class as module.exports = { YourClass } or export it as named export.",
        };
      }
      return mod[className];
    }
    // If module exports a single class as default or as module.exports
    if (typeof mod === "function") return mod;
    // try common names
    const keys = Object.keys(mod);
    if (keys.length === 1) return mod[keys[0]];
    // If multiple, prefer ClassicMorty if present
    if (mod.ClassicMorty) return mod.ClassicMorty;
    // else pick the first export
    if (keys.length > 0) return mod[keys[0]];
    throw {
      friendly: true,
      message: `Could not find a Morty class in ${modulePath}.`,
      hint: "Ensure the file exports at least one class.",
    };
  }
}

module.exports = MortyLoader;
