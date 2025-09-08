export class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailField = '[data-qa="login-email"]';
    this.passwordField = '[data-qa="login-password"]';
    this.loginButton = '[data-qa="login-button"]';
    this.loggedInText = 'Logged in as Tanvir Sharif';
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email, password) {
    await this.page.fill(this.emailField, email);
    await this.page.fill(this.passwordField, password);
    await this.page.click(this.loginButton);
  }

  async assertLoggedIn() {
    await this.page.getByText(this.loggedInText).isVisible();
  }
}
