// Statistics - track rounds, wins/losses, switches/stays
class Statistics {
  constructor() {
    this.rounds = 0;
    this.winsWhenSwitched = 0;
    this.roundsWhenSwitched = 0;
    this.winsWhenStayed = 0;
    this.roundsWhenStayed = 0;
  }

  record({ switched, win }) {
    this.rounds++;
    if (switched) {
      this.roundsWhenSwitched++;
      if (win) this.winsWhenSwitched++;
    } else {
      this.roundsWhenStayed++;
      if (win) this.winsWhenStayed++;
    }
  }

  getEstimates() {
    const estSwitched =
      this.roundsWhenSwitched === 0
        ? null
        : this.winsWhenSwitched / this.roundsWhenSwitched;
    const estStayed =
      this.roundsWhenStayed === 0
        ? null
        : this.winsWhenStayed / this.roundsWhenStayed;
    return { estSwitched, estStayed };
  }
}

module.exports = Statistics;
