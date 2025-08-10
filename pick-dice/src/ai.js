export function decide({ level = 'medium', currentTurnScore, myTotal, oppTotal, target }) {
    // baseline:
    if (level === 'easy') {

      return Math.random() < 0.5 ? 'roll' : 'hold';
    }
  
    if (level === 'medium') {
   
      return currentTurnScore >= 20 ? 'hold' : 'roll';
    }
  
    const safeMargin = 15;
    if (myTotal + currentTurnScore >= target) return 'hold';
    const lead = myTotal - oppTotal;
    if (lead < 0 && currentTurnScore < 25) return 'roll';
    if (lead > 20 && currentTurnScore >= 15) return 'hold';
    return currentTurnScore >= 22 ? 'hold' : 'roll';
  }