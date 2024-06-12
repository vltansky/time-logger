interface IElapsedLogger {
  end(label?: string): void;
  get(): string;
  _diff(): HrTime;
  parse(hrtime: HrTime): string;
}
declare type HrTime = [number, number];
declare const _default: {
  get: (label: string) => string | boolean;
  getValue: (unit: "ns" | "ms" | "sec" | "min" | "hr") => number
  end: (label: string, overrideLabel?: string) => void;
  start: (label?: string) => IElapsedLogger;
};
export default _default;
