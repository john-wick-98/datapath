declare module 'hot-formula-parser' {
  export class Parser {
    constructor(config?: any);
    on(event: string, cb: (...args: any[]) => any): void;
    off(event: string): void;
    parse(formula: string): { result: any; error: string | null };
  }
}
