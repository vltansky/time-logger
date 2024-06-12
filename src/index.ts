import hrtime from 'browser-hrtime';
interface IElapsedLogger {
  end(label?: string): void;
  get(): string;
  _diff(): HrTime;
  parse(hrtime: HrTime): string;
}
type HrTime = [number, number];
class ElapsedLogger implements IElapsedLogger {
  private _timer: HrTime;
  constructor() {
    this._timer = hrtime();
  }

  end(label: string = '') {
    const elapsedTime = this.get();
    console.log(`${label ? label + ' ' : ''}${elapsedTime}`);
  }

  _diff(): HrTime {
    return hrtime(this._timer);
  }

  get(): string {
    const diff = this._diff();
    return this.parse(diff);
  }

  getValue(unit: "ns" | "ms" | "sec" | "min" | "hr"): number {
    switch(unit) {
      case "ns":
        return this._getNS();
      case "ms":
        return this._getMS();
      case "sec":
        return this._getSeconds();
      case "min":
        return this._getMinutes();
      case "hr":
        return this._getHours();
    }
  }

  _getRawValue(hrtime?: HrTime): number {
    if (!hrtime)
      hrtime = this._diff();
    return (hrtime[0] * 1e9 + hrtime[1]) / 1e6
  }

  _getNS(sourceMS?: number): number {
    if (!sourceMS) {
      sourceMS = this._getRawValue()
    }
    return sourceMS
  }

  _getMS(sourceMS?: number): number {
    if (!sourceMS) {
      sourceMS = this._getRawValue()
    }
    return Math.round(sourceMS % 1000)
  }

  _getSeconds(sourceMS?: number): number {
    if (!sourceMS) {
      sourceMS = this._getRawValue()
    }
    return Math.round((((sourceMS / 1000) % 60) + Number.EPSILON) * 100) / 100
  }

  _getMinutes(sourceMS?: number): number {
    if (!sourceMS) {
      sourceMS = this._getRawValue()
    }
    return Math.floor((sourceMS / (1000 * 60)) % 60);
  }

  _getHours(sourceMS?: number): number {
    if (!sourceMS) {
      sourceMS = this._getRawValue()
    }
    return Math.floor((sourceMS / (1000 * 60 * 60)) % 24)
  }

  parse(hrtime: HrTime): string {
    let result = '';
    const sourceMS: number = this._getRawValue(hrtime);
    const ms: number = this._getMS(sourceMS);
    const sec: number = this._getSeconds(sourceMS);
    const mins: number = this._getMinutes(sourceMS);
    const hrs: number = this._getHours(sourceMS);

    if (hrs > 0) {
      result += hrs + ' hours ';
    }
    if (mins > 0) {
      result += mins + ' minutes ';
    }
    if (sec >= 1) {
      result += sec + ' seconds ';
    }
    if (mins === 0 && hrs === 0 && sec < 1 && ms > 0) {
      result += ms + 'ms';
    }

    return result;
  }
}

const _timers = new Map<string, IElapsedLogger>();

const start = (label: string | null = null): IElapsedLogger => {
  const elapsed = new ElapsedLogger();
  if (!label) {
    return elapsed;
  }
  _timers.set(label, elapsed);
  return elapsed;
};

const end = (label: string, overrideLabel: string | null = null): void => {
  const elapsedTime = get(label);
  if (elapsedTime === false) {
    return;
  }
  console.log(`${overrideLabel || label} ${elapsedTime}`);
  _timers.delete(label);
};

const get = (label: string): string | boolean => {
  const timer = _timers.get(label);
  if (!timer) {
    console.warn(`No such label '${label}' for ElapsedLogger`); // process.emitWarning
    return false;
  }
  return timer.get();
};
export default {
  get,
  end,
  start,
};
