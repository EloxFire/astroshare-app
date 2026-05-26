import dayjs, { Dayjs } from 'dayjs';

export class EphemerisScheduler {
  private lastUpdate = new Map<string, Dayjs>();

  shouldUpdate(key: string, date: Dayjs, throttleSeconds: number): boolean {
    const last = this.lastUpdate.get(key);
    if (!last || Math.abs(date.diff(last, 'second')) >= throttleSeconds) {
      this.lastUpdate.set(key, date);
      return true;
    }
    return false;
  }

  invalidate(key?: string): void {
    if (key) {
      this.lastUpdate.delete(key);
    } else {
      this.lastUpdate.clear();
    }
  }
}
