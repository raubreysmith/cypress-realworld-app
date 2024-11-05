import { Page } from "@playwright/test";
import { step } from "../decorators/step.decorator";

export class AuthStep {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  @step("Login Step")
  async login(username: string, password: string) {
    // start waiting for response before clicking. Note no await.
    // alternative to route interception that has a return object so we can use the data elsewhere
    const loginResponse = this.page.waitForResponse("**/login");

    await this.page.getByLabel("Username").fill(username);
    await this.page.getByLabel("Password").fill(password);
    // if (rememberUser) {
    //   cy.getBySel("signin-remember-me").find("input").check();
    // }
    await this.page.getByRole("button", { name: "Sign In" }).click();

    // now we can consume the data of the response we waited on
    const response = await loginResponse;
    const body = JSON.parse(await response.text());
    console.log({
      username: username,
      password: password,
      rememberUser: false,
      userId: body.user.id,
    });
  }
}
