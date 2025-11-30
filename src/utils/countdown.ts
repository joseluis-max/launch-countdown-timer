export interface CountdownValues {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

export class CountdownTimer {
  private countDownDate: number;
  private previousValues: CountdownValues;
  private interval: number | null = null;

  constructor(targetDate: number) {
    this.countDownDate = targetDate;
    this.previousValues = {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00'
    };
  }

  private calculateTimeUnits(distance: number): CountdownValues {
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return {
      days: String(days).padStart(2, '0'),
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0')
    };
  }

  private flipCard(unit: string, newValue: string): void {
    const card = document.getElementById(unit)?.closest('.countdown-card') as HTMLElement;
    if (!card) return;

    const cardTop = card.querySelector('.card-top') as HTMLElement;
    const cardNext = card.querySelector('.card-next') as HTMLElement;
    const topNumber = document.getElementById(`${unit}-top`) as HTMLElement;
    const bottomNumber = document.getElementById(unit) as HTMLElement;
    const nextNumber = document.getElementById(`${unit}-next`) as HTMLElement;

    // Set next number to show during flip
    nextNumber.textContent = newValue;
    
    // Show next number behind the flipping card
    cardNext.classList.add('visible');

    // Small delay to ensure DOM update, then trigger flip animation on top
    requestAnimationFrame(() => {
      cardTop.classList.add('flipping');
    });

    // After animation, update all values and reset
    setTimeout(() => {
      topNumber.textContent = newValue;
      bottomNumber.textContent = newValue;
      cardTop.classList.remove('flipping');
      cardNext.classList.remove('visible');
      this.previousValues[unit as keyof CountdownValues] = newValue;
    }, 600);
  }

  private updateCountdown(): void {
    const now = new Date().getTime();
    const distance = this.countDownDate - now;

    // Calculate time units
    const values = this.calculateTimeUnits(distance);

    // Check each unit and flip if changed
    (Object.keys(values) as Array<keyof CountdownValues>).forEach((unit) => {
      if (values[unit] !== this.previousValues[unit]) {
        this.flipCard(unit, values[unit]);
      }
    });

    // If countdown is finished
    if (distance < 0) {
      this.stop();
      ['days', 'hours', 'minutes', 'seconds'].forEach(unit => {
        const topNumber = document.getElementById(`${unit}-top`) as HTMLElement;
        const bottomNumber = document.getElementById(unit) as HTMLElement;
        const nextNumber = document.getElementById(`${unit}-next`) as HTMLElement;
        if (topNumber) topNumber.textContent = '00';
        if (bottomNumber) bottomNumber.textContent = '00';
        if (nextNumber) nextNumber.textContent = '00';
      });
    }
  }

  public initialize(): void {
    const now = new Date().getTime();
    const distance = this.countDownDate - now;

    this.previousValues = this.calculateTimeUnits(distance);

    // Set initial values
    (Object.keys(this.previousValues) as Array<keyof CountdownValues>).forEach(unit => {
      const topNumber = document.getElementById(`${unit}-top`) as HTMLElement;
      const bottomNumber = document.getElementById(unit) as HTMLElement;
      const nextNumber = document.getElementById(`${unit}-next`) as HTMLElement;
      if (topNumber) topNumber.textContent = this.previousValues[unit];
      if (bottomNumber) bottomNumber.textContent = this.previousValues[unit];
      if (nextNumber) nextNumber.textContent = this.previousValues[unit];
    });
  }

  public start(): void {
    this.initialize();
    this.interval = window.setInterval(() => this.updateCountdown(), 1000);
  }

  public stop(): void {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}
