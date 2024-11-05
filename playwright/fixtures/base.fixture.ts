import { test as base } from "@playwright/test";
import { AuthStep } from "../steps/auth.step";

// not necessary but can replace reduce imports
export { expect } from "@playwright/test";

type Steps = {
  authStep: AuthStep;
};

// extend the test fixture with extra common logic or page objects
export const test = base.extend<Steps>({
  authStep: ({ page }, use) => {
    use(new AuthStep(page));
  },
});
