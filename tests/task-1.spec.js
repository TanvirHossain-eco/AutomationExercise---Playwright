import { test, expect } from '@playwright/test';
import fs from 'fs';
import { LoginPage } from '../pom/LoginPage.js';
import { ProductPage } from '../pom/ProductPage.js';
import { CartPage } from '../pom/CartPage.js';
import { CheckoutPage } from '../pom/CheckoutPage.js';
import { InvoicePage } from '../pom/InvoicePage.js';

test('End-to-End Purchase Flow using POM & Invoice Per Browser', async ({ page, request }, testInfo) => {
  // Step 1. Create Account via API
  const userData = {
    name: "Tanvir Sharif1",
    email: `tanvir.sharif3@test.com`,
    password: "Password123",
    title: "Mr",
    birth_date: "10",
    birth_month: "May",
    birth_year: "1995",
    firstname: "Tanvir",
    lastname: "Sharif3",
    company: "Test Ltd",
    address1: "123 Test Street",
    country: "Canada",
    zipcode: "L5B4N4",
    state: "Ontario",
    city: "Toronto",
    mobile_number: "+11234567890"
  };

  const response = await request.post("https://automationexercise.com/api/createAccount", {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    form: userData
  });

  expect(response.status()).toBe(200);

  // Step 2. Save credentials in JSON
  fs.writeFileSync("fixtures/user_credentials.json", JSON.stringify({
    email: userData.email,
    password: userData.password
  }));

  // Step 3. Navigate to base URL, Retrieve credentials & Login
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(userData.email, userData.password);
  await loginPage.assertLoggedIn();

  // Clear cart if anything is already there
  const cartPage = new CartPage(page);
  await cartPage.clearCartIfNotEmpty();


  // Step 4. Add two products to the cart from two different categories
  const productPage = new ProductPage(page);
  await productPage.addWomenDress();
  await productPage.addMenTshirt();

  // Step 5. Checkout & Place Order
  // const cartPage = new CartPage(page);
  await cartPage.gotoCart();
  await cartPage.proceedToCheckout();
  // Verify Total Price is greater than 0
  await cartPage.assertTotalPrice();
  // Keeping the value for asserting the invoice
  // const total = await cartPage.assertTotalPrice();
  await cartPage.addMessage("This is a test order");
  await cartPage.proceedToCheckout();

  // Step 6: Enter payment & place order
  const checkoutPage = new CheckoutPage(page);
  // Enter payment details
  await checkoutPage.enterPaymentDetails({
    name: "Tanvir Sharif",
    cardNumber: "1234567890",
    cvc: "321",
    expMonth: "05",
    expYear: "2030"
  });
  await checkoutPage.payOrder();

  // Step 7: Verify Order Placement & Successful Message
  await checkoutPage.assertOrderSuccess();

  // Step 8, 9, 10: Download the invoice, Save the file, Verify file exist & Check file size>0
  const invoicePage = new InvoicePage(page);
  const filePath = await invoicePage.downloadInvoice(testInfo, 'downloads');  
  // await invoicePage.assertInvoice(filePath, userData.name, total);
  await invoicePage.assertInvoice(filePath);
});
