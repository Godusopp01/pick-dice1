export class Game {
    constructor({ target = 100, mode = 'pvp', players = ['ผู้เล่น 1', 'ผู้เล่น 2'], aiLevel = 'medium' } = {}) {
      this.target = target;
      this.mode = mode; // 'pvp' | 'cpu'
      this.players = players.slice(0, 2);
      this.aiLevel = aiLevel;
  
      this.reset();
    }
  
    reset() {
      this.totals = [0, 0];
      this.current = 0;
      this.active = 0;       
      this.lastRoll = null;
      this.winner = null;
      this.inProgress = true;
    }
  
    roll() {
      if (!this.inProgress) return { value: 0, busted: false };
      const value = Math.floor(Math.random() * 6) + 1;
      this.lastRoll = value;
  
      if (value === 1) {
        this.current = 0;
        this.switchTurn();
        return { value, busted: true };
      } else {
        this.current += value;
        return { value, busted: false };
      }
    }
  
    hold() {
      if (!this.inProgress) return { won: false };
      this.totals[this.active] += this.current;
      this.current = 0;
  
      if (this.totals[this.active] >= this.target) {
        this.winner = this.active;
        this.inProgress = false;
        return { won: true, winner: this.active };
      }
  
      this.switchTurn();
      return { won: false };
    }
  
    switchTurn() {
      this.active = this.active === 0 ? 1 : 0;
    }
  
    isAITurn() {
      return this.mode === 'cpu' && this.active === 1;
    }
  }