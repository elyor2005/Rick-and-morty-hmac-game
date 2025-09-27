// LazyMorty - never removes portal, but removes lowest indices without randomness.

class LazyMorty {
  constructor({ generator, boxes }) {
    this.generator = generator;
    this.boxes = boxes;
    this.portal = null;
  }

  async requestFairNumber(range, tag = "") {
    // LazyMorty still needs to pick a portal location fairly; use generator with range boxes
    const res = await this.generator.generate(range, `${tag}`);
    this.portal = res.final;
    return res;
  }

  async onPlayerGuess(playerGuess) {
    // Lazy removes boxes with lowest indices (except keep player's box and the portal box)
    // No second fair number needed: we will decide deterministically.
    return { needsFairNumber: false };
  }

  getCurrentBoxes(playerGuess) {
    // Determine remaining two boxes: player's box and portal box (if different)
    if (playerGuess === this.portal) {
      // portal and player same: choose the smallest index not equal to player as the other
      const other = Array.from({ length: this.boxes }, (_, i) => i).find(
        (i) => i !== playerGuess
      );
      return {
        availableBoxes: [playerGuess, other],
        keptBoxIndices: [playerGuess, other],
      };
    } else {
      return {
        availableBoxes: [playerGuess, this.portal],
        keptBoxIndices: [playerGuess, this.portal],
      };
    }
  }

  async onRoundEnd() {
    this.portal = null;
  }

  // exact probability for LazyMorty: this is identical to ClassicMorty (because portal never removed)
  static probability(N, switched) {
    if (switched) return (N - 1) / N;
    return 1 / N;
  }
}

module.exports = { LazyMorty };
