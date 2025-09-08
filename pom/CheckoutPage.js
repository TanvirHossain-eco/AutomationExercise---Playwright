export class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.nameField = 'input[name="name_on_card"]';
    this.cardNumberField = 'input[name="card_number"]';
    this.cvcField = 'input[name="cvc"]';
    this.expMonthField = 'input[name="expiry_month"]';
    this.expYearField = 'input[name="expiry_year"]';
    this.payButton = '#submit';
    this.successMessage = 'Congratulations! Your order';
    
  }

  async enterPaymentDetails({ name, cardNumber, cvc, expMonth, expYear }) {
    await this.page.fill(this.nameField, name);
    await this.page.fill(this.cardNumberField, cardNumber);
    await this.page.fill(this.cvcField, cvc);
    await this.page.fill(this.expMonthField, expMonth);
    await this.page.fill(this.expYearField, expYear);
  }

  async payOrder() {
    await this.page.locator(this.payButton).click();
  }

  async assertOrderSuccess() {
    await this.page.getByText(this.successMessage).isVisible();
  }
}