export class ProductPage {
  constructor(page) {
    this.page = page;
  }

  async addWomenDress() {
    await this.page.getByRole('link', { name: ' Women' }).click();
    await this.page.getByRole('link', { name: 'Dress' }).click();
    await this.page.getByRole('link', { name: ' View Product' }).nth(1).click();
    await this.page.getByRole('button', { name: ' Add to cart' }).click();
    await this.page.getByRole('button', { name: 'Continue Shopping' }).click();
  }

  async addMenTshirt() {
    await this.page.getByRole('link', { name: ' Men' }).click();
    await this.page.getByRole('link', { name: 'Tshirts' }).click();
    await this.page.locator('div:nth-child(5) > .product-image-wrapper > .choose > .nav > li > a').click();
    await this.page.getByRole('button', { name: ' Add to cart' }).click();
  }

  async addKidsDress() {
    await this.page.getByRole('link', { name: ' Products' }).click()
    await this.page.getByRole('link', { name: ' Kids' }).click();
    await this.page.getByRole('link', { name: 'Dress' }).click();
    await this.page.locator('div:nth-child(4) > .product-image-wrapper > .choose > .nav > li > a').click();
    await this.page.getByRole('button', { name: ' Add to cart' }).click();
  }
}