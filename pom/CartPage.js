import { ProductPage } from './ProductPage.js';
import { expect } from '@playwright/test';
export class CartPage {
  constructor(page) {
    this.page = page;
    this.cartLink = 'a[href="/view_cart"]';
    this.messageBox = 'textarea[name="message"]';
    this.checkoutButton = 'a.check_out';
    this.emptyCartMessage = 'Cart is empty! Click here to';
    // this.totalPriceLocator = '#cart_info tbody tr:last-child td .cart_total_price';
    this.totalPriceLocator = '#cart_info .cart_total_price';
    this.cartItemsLocator = '#cart_info_table tbody tr';
    // this.cartItemsLocator = '#cart_info tbody tr[id^="product-"]';
    this.deleteExtraCartItem = '.cart_quantity_delete';
  }
// Verify products are in cart & Ensure total price is not zero
  async gotoCart() {
    await this.page.goto('/view_cart');
    // Check if cart is empty
    const isEmpty = await this.page.locator(`text=${this.emptyCartMessage}`).isVisible().catch(() => false);
    if (isEmpty) {
      console.log('Cart is empty, adding products...');
      const productPage = new ProductPage(this.page);

      // Add products
      await productPage.addWomenDress();
      await productPage.addMenTshirt();

      // Return to cart
      await this.page.goto('/view_cart');
    }
    // Optional: Verify cart has items
    let cartItems = await this.page.locator(this.cartItemsLocator).count();
    // If less than 2 items, add a Kids Dress
    if (cartItems < 2) {
      console.log(`Cart has ${cartItems} item(s). Adding Kids Dress...`);
      const productPage = new ProductPage(this.page);
      await productPage.addKidsDress();
      await this.page.goto('/view_cart');
      cartItems = await this.page.locator(this.cartItemsLocator).count();
      // return cartItems;
    }
    // If more than 2, Delete last product
    else if (cartItems > 2) {
      console.log(`Cart has ${cartItems} item(s). Deleting extra items...`);

      // Get all product rows
      const rows = this.page.locator(this.cartItemsLocator);
      const lastRow = rows.nth(cartItems - 1); // last product row

      // Click delete button inside last row
      await lastRow.locator(this.deleteExtraCartItem).click();

      // Refresh cart count
      await this.page.waitForTimeout(1000); // wait for DOM update
      cartItems = await this.page.locator(this.cartItemsLocator).count();
      // return cartItems;
    }
    // Assert cart now has exactly 2 items
    expect(cartItems).toBe(2);

  }

  async assertTotalPrice() {
    const totalText = await this.page.locator(this.totalPriceLocator).last().innerText();
    // console.log(`Total price: ${totalText}`);
    // Ensure it's a string
    if (!totalText || typeof totalText !== 'string') {
      throw new Error('Could not retrieve total price text from cart');
    }
    // Remove non-digit characters and convert to number
    const total = Number(totalText.replace(/[^0-9]/g, ''));
    console.log(`Total price: ${total}`);
    expect(total).toBeGreaterThan(0);
    // console.log(`Total price verified: Rs. ${total}`);
    return total;
  }

  // async getTotalPrice() {
  //   const totalText = await this.page.locator(this.totalPriceLocator).last().innerText();
  //   const total = Number(totalText.replace(/[^0-9]/g, ''));
  //   return total;
  // }

  async addMessage(message) {
    await this.page.locator(this.messageBox).scrollIntoViewIfNeeded();
    await this.page.locator(this.messageBox).fill(message);
  }

  async proceedToCheckout() {
    await this.page.click(this.checkoutButton);
  }

  async clearCartIfNotEmpty() {
    await this.page.click(this.cartLink);
    await this.page.waitForLoadState('domcontentloaded');

    const cartItems = await this.page.locator(this.cartItemsLocator).count();
    if (cartItems > 0) {
      console.log(`Found ${cartItems} items in cart. Clearing...`);
      const deleteButtons = this.page.locator(this.deleteExtraCartItem);
      const count = await deleteButtons.count();
      for (let i = 0; i < count; i++) {
        await deleteButtons.nth(i).click();
        await this.page.waitForTimeout(500); // allow UI update
      }
      await this.page.waitForSelector('.cart_info', { state: 'detached', timeout: 5000 }).catch(() => {
        console.log('Cart table still visible, but items likely cleared.');
      });
    } else {
      console.log('Cart already empty.');
    }
  }
}