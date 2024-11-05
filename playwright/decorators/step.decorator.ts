import { test } from "@playwright/test";

/**
 * Decorator function for wrapping playwright functions in a test.step improving legibility of the test log.
 *
 * @param title - Optional title of the test step. Defaults to the function name
 * @returns A decorator function that can be used to decorate test methods.
 */
export function step(title?: string) {
  return function decorator(target: Function, context: ClassMethodDecoratorContext) {
    return function replacementMethod(...args: any) {
      const name = `${title || (context.name as string)}`;
      return test.step(name, async () => {
        return await target.call(this, ...args);
      });
    };
  };
}
