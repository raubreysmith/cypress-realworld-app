// import { User } from "../../../src/models";
// import { isMobile } from "../../support/utils";
import { test, expect, selectors } from "@playwright/test";
import child_process from "node:child_process";
import util from "util";
const exec = util.promisify(child_process.exec);

// const apiGraphQL = `${Cypress.env("apiUrl")}/graphql`;

// refresh the json db with seeded backup
async function seedDb() {
  const { stdout, stderr } = await exec("yarn db:seed:dev");
  console.log("stdout:", stdout);
  console.error("stderr:", stderr);
}

// generate a uuid from the workId and epoch timestamp ensuring parallel runs work reliably
function getIdSeed(workerIndex: number): string {
  return `-${workerIndex}-${Date.now()}`;
}

test.describe.only("User Sign-up and Login", function () {
  test.beforeAll(async () => {
    // cy.task("db:seed");
    await seedDb();

    // cy.intercept("POST", "/users").as("signup");
    // cy.intercept("POST", apiGraphQL, (req) => {
    //   const { body } = req;
    //   if (body.hasOwnProperty("operationName") && body.operationName === "CreateBankAccount") {
    //     req.alias = "gqlCreateBankAccountMutation";
    //   }
    // });
  });

  test.afterAll(async () => {
    await seedDb();
  });

  test.fixme("should redirect unauthenticated user to signin page", async ({ page }) => {
    // cy.visit("/personal");
    // cy.location("pathname").should("equal", "/signin");
    // cy.visualSnapshot("Redirect to SignIn");
  });

  test.fixme("should redirect to the home page after login", async ({ page }) => {
    // cy.database("find", "users").then((user: User) => {
    //   cy.login(user.username, "s3cret", { rememberUser: true });
    // });
    // cy.location("pathname").should("equal", "/");
  });

  test.fixme("should remember a user for 30 days after login", async ({ page }) => {
    // cy.database("find", "users").then((user: User) => {
    //   cy.login(user.username, "s3cret", { rememberUser: true });
    // });
    // // Verify Session Cookie
    // cy.getCookie("connect.sid").should("have.property", "expiry");
    // // Logout User
    // if (isMobile()) {
    //   cy.getBySel("sidenav-toggle").click();
    // }
    // cy.getBySel("sidenav-signout").click();
    // cy.location("pathname").should("eq", "/signin");
    // cy.visualSnapshot("Redirect to SignIn");
  });

  test.only("should allow a visitor to sign-up, login, and logout", async ({ page }, testInfo) => {
    const userInfo = {
      firstName: "Bob",
      lastName: "Ross",
      username: "PainterJoy" + getIdSeed(testInfo.workerIndex),
      password: "s3cret",
    };

    // Sign-up User

    // cy.visit("/");
    await page.goto("/");

    // blur uname field else sign up click doesnt work first time (App Bug!)
    await page.getByLabel("Username").blur();

    // cy.getBySel("signup").click();
    await page.getByRole("link", { name: "Sign Up" }).click();

    // cy.getBySel("signup-title").should("be.visible").and("contain", "Sign Up");
    await expect(page.getByRole("heading", { name: "Sign Up" })).toBeVisible();

    // cy.visualSnapshot("Sign Up Title");
    await expect(page).toHaveScreenshot("Sign Up Title.png");

    // cy.getBySel("signup-first-name").type(userInfo.firstName);
    await page.getByLabel("First Name").fill(userInfo.firstName);

    // cy.getBySel("signup-last-name").type(userInfo.lastName);
    await page.getByLabel("Last Name").fill(userInfo.lastName);

    // cy.getBySel("signup-username").type(userInfo.username);
    await page.getByLabel("Username").fill(userInfo.username);

    // cy.getBySel("signup-password").type(userInfo.password);
    await page.getByLabel(/^Password/).fill(userInfo.password);

    // cy.getBySel("signup-confirmPassword").type(userInfo.password);
    await page.getByLabel("Confirm Password").fill(userInfo.password);
    await page.getByLabel("Confirm Password").blur();

    // cy.visualSnapshot("About to Sign Up");
    await expect(page).toHaveScreenshot("About to Sign Up.png", { maxDiffPixels: 200 });

    // @signup -> intercept network request
    await page.route("/users", (route) => route.continue());

    // cy.getBySel("signup-submit").click();
    await page.getByRole("button", { name: "Sign Up" }).click();

    // cy.wait("@signup");
    // -> cy.intercept("POST", "/users").as("signup");

    // // Login User
    // cy.login(userInfo.username, userInfo.password);
    // ->

    const signinPath = "/signin";
    // const log = Cypress.log({
    //   name: "login",
    //   displayName: "LOGIN",
    //   message: [`🔐 Authenticating | ${username}`],
    //   // @ts-ignore
    //   autoEnd: false,
    // });

    // cy.intercept("POST", "/login").as("loginUser");
    await page.route("/login", (route) => route.continue());

    // cy.intercept("GET", "checkAuth").as("getUserProfile");
    await page.route("/checkAuth", (route) => route.continue());

    // cy.location("pathname", { log: false }).then((currentPath) => {
    //   if (currentPath !== signinPath) {
    //     cy.visit(signinPath);
    //   }
    // });

    const currentPath = page.url();
    if (currentPath !== signinPath) {
      await page.goto(signinPath);
    }

    // log.snapshot("before");

    // cy.getBySel("signin-username").type(username);
    await page.getByLabel("Username").fill(userInfo.username);

    // cy.getBySel("signin-password").type(password);
    await page.getByLabel("Password").fill(userInfo.password);

    // if (rememberUser) {
    //   cy.getBySel("signin-remember-me").find("input").check();
    // }

    // cy.getBySel("signin-submit").click();
    await page.getByRole("button", { name: "Sign In" }).click();

    // cy.wait("@loginUser").then((loginUser: any) => {
    //   log.set({
    //     consoleProps() {
    //       return {
    //         username,
    //         password,
    //         rememberUser,
    //         userId: loginUser.response.statusCode !== 401 && loginUser.response.body.user.id,
    //       };
    //     },
    //   });

    //   log.snapshot("after");
    //   log.end();
    // });

    // Onboarding

    // cy.getBySel("user-onboarding-dialog").should("be.visible");
    await expect(page.getByRole("dialog", { name: "Get Started" })).toBeVisible();

    // cy.getBySel("list-skeleton").should("not.exist");
    selectors.setTestIdAttribute("data-test"); // playwright defaults to data-testid
    await expect(page.getByTestId("list-skeleton")).not.toBeVisible();

    // cy.getBySel("nav-top-notifications-count").should("exist");
    await expect(page.getByTestId("nav-top-notifications-count")).toBeVisible();

    // cy.visualSnapshot("User Onboarding Dialog");
    await expect(page).toHaveScreenshot("User Onboarding Dialog.png", { maxDiffPixels: 200 });

    // cy.getBySel("user-onboarding-next").click();
    await page.getByRole("button", { name: "Next" }).click();

    // cy.getBySel("user-onboarding-dialog-title").should("contain", "Create Bank Account");
    await expect(page.getByRole("heading", { name: "Create Bank Account" })).toBeVisible();

    // cy.getBySelLike("bankName-input").type("The Best Bank");
    await page.getByPlaceholder("Bank Name").fill("The Best Bank");

    // cy.getBySelLike("accountNumber-input").type("123456789");
    await page.getByPlaceholder("Routing Number").fill("123456789");

    // cy.getBySelLike("routingNumber-input").type("987654321");
    await page.getByPlaceholder("Account Number").fill("987654321");

    // cy.visualSnapshot("About to complete User Onboarding");
    await expect(page).toHaveScreenshot("About to complete User Onboarding.png", {
      maxDiffPixels: 200,
    });

    // cy.getBySelLike("submit").click();
    await page.getByRole("button", { name: "Save" }).click();

    // cy.wait("@gqlCreateBankAccountMutation");
    // cy.getBySel("user-onboarding-dialog-title").should("contain", "Finished");
    await expect(page.getByRole("heading", { name: "Finished" })).toBeVisible();

    // cy.getBySel("user-onboarding-dialog-content").should("contain", "You're all set!");
    await expect(page.getByText("You're all set!")).toBeVisible();

    // cy.visualSnapshot("Finished User Onboarding");
    await expect(page).toHaveScreenshot("Finished User Onboarding.png", { maxDiffPixels: 200 });

    // cy.getBySel("user-onboarding-next").click();
    // cy.getBySel("transaction-list").should("be.visible");
    // cy.visualSnapshot("Transaction List is visible after User Onboarding");
    // // Logout User
    // if (isMobile()) {
    //   cy.getBySel("sidenav-toggle").click();
    // }
    // cy.getBySel("sidenav-signout").click();
    // cy.location("pathname").should("eq", "/signin");
    // cy.visualSnapshot("Redirect to SignIn");
  });

  test("should display login errors", async ({ page }) => {
    // cy.visit("/");
    await page.goto("/");

    // cy.getBySel("signin-username").type("User").find("input").clear().blur();
    await page.getByLabel("Username").fill("User");
    await page.getByLabel("Username").clear();
    await page.getByLabel("Username").blur();

    // cy.get("#username-helper-text").should("be.visible").and("contain", "Username is required");
    await expect(page.getByText("Username is required")).toBeVisible();

    // cy.visualSnapshot("Display Username is Required Error");
    await expect(page).toHaveScreenshot("Display Username is Required Error.png");

    // cy.getBySel("signin-password").type("abc").find("input").blur();
    await page.getByLabel("Password").fill("abc");
    await page.getByLabel("Password").blur();

    // cy.get("#password-helper-text")
    //   .should("be.visible")
    //   .and("contain", "Password must contain at least 4 characters");
    await expect(page.getByText("Password must contain at least 4 characters")).toBeVisible();

    // cy.visualSnapshot("Display Password Error");
    await expect(page).toHaveScreenshot("Display Password Error.png");

    // cy.getBySel("signin-submit").should("be.disabled");
    await expect(page.getByRole("button", { name: "Sign In" })).toBeDisabled();

    // cy.visualSnapshot("Sign In Submit Disabled");
    await expect(page).toHaveScreenshot("Sign In Submit Disabled.png");
  });

  test.fixme("should display signup errors", async ({ page }) => {
    // cy.intercept("GET", "/signup");
    // cy.visit("/signup");
    // cy.getBySel("signup-first-name").type("First").find("input").clear().blur();
    // cy.get("#firstName-helper-text").should("be.visible").and("contain", "First Name is required");
    // cy.getBySel("signup-last-name").type("Last").find("input").clear().blur();
    // cy.get("#lastName-helper-text").should("be.visible").and("contain", "Last Name is required");
    // cy.getBySel("signup-username").type("User").find("input").clear().blur();
    // cy.get("#username-helper-text").should("be.visible").and("contain", "Username is required");
    // cy.getBySel("signup-password").type("password").find("input").clear().blur();
    // cy.get("#password-helper-text").should("be.visible").and("contain", "Enter your password");
    // cy.getBySel("signup-confirmPassword").type("DIFFERENT PASSWORD").find("input").blur();
    // cy.get("#confirmPassword-helper-text")
    //   .should("be.visible")
    //   .and("contain", "Password does not match");
    // cy.visualSnapshot("Display Sign Up Required Errors");
    // cy.getBySel("signup-submit").should("be.disabled");
    // cy.visualSnapshot("Sign Up Submit Disabled");
  });

  test.fixme("should error for an invalid user", async ({ page }) => {
    // cy.login("invalidUserName", "invalidPa$$word");
    // cy.getBySel("signin-error")
    //   .should("be.visible")
    //   .and("have.text", "Username or password is invalid");
    // cy.visualSnapshot("Sign In, Invalid Username and Password, Username or Password is Invalid");
  });

  test.fixme("should error for an invalid password for existing user", async ({ page }) => {
    // cy.database("find", "users").then((user: User) => {
    //   cy.login(user.username, "INVALID");
    // });
    // cy.getBySel("signin-error")
    //   .should("be.visible")
    //   .and("have.text", "Username or password is invalid");
    // cy.visualSnapshot("Sign In, Invalid Username, Username or Password is Invalid");
  });
});
