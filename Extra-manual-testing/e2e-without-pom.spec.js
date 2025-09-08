import { test, expect } from '@playwright/test';
import fs from 'fs';

test('End-to-End Purchase Flow', async ({ page, request }) => {
  // Step 1. Create Account via API
  const userData = {
    name: "Tanvir Sharif",
    email: `tanvir.sharif123@test.com`,
    password: "Password123",
    title: "Mr",
    birth_date: "10",
    birth_month: "May",
    birth_year: "1995",
    firstname: "Tanvir",
    lastname: "Sharif",
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

  const resBody = await response.json();
  console.log("API Response:", resBody);
  expect(response.status()).toBe(200);

  // Step 2. Save credentials
  fs.writeFileSync("fixtures/user_credentials.json", JSON.stringify({
    email: userData.email,
    password: userData.password
  }));

  // Step 3. Login with UI
  await page.goto("/login");
  const creds = JSON.parse(fs.readFileSync("fixtures/user_credentials.json"));
  await page.fill('[data-qa="login-email"]', creds.email);
  await page.fill('[data-qa="login-password"]', creds.password);
  await page.click('[data-qa="login-button"]');
  await expect(page.getByText('Logged in as Tanvir Sharif')).toBeVisible();

  // Step 4. Add Products to Cart
//   await page.goto("/product_details/1");
//   await page.click("button.add-to-cart");
//   await page.goto("/product_details/2");
//   await page.click("button.add-to-cart");
  await page.getByRole('link', { name: ' Women' }).click();
  await page.getByRole('link', { name: 'Dress' }).click();
  await page.getByRole('link', { name: ' View Product' }).nth(1).click();
  await page.getByRole('button', { name: ' Add to cart' }).click();
  await page.getByRole('button', { name: 'Continue Shopping' }).click();
  await page.getByRole('link', { name: ' Men' }).click();
  await page.getByRole('link', { name: 'Tshirts' }).click();
  await page.locator('div:nth-child(5) > .product-image-wrapper > .choose > .nav > li > a').click();
  await page.getByRole('button', { name: ' Add to cart' }).click();

  // Step 5. Checkout & Place Order
  await page.goto("/view_cart");
  await page.click("a.check_out");
  await page.locator('textarea[name="message"]').scrollIntoViewIfNeeded();
  await page.locator('textarea[name="message"]').fill("This is a test order");
  await page.click("a.check_out");

  // Enter payment details
  await page.fill('input[name="name_on_card"]', "Tanvir Sharif");
  await page.fill('input[name="card_number"]', "1234567890");
  await page.fill('input[name="cvc"]', "321");
  await page.fill('input[name="expiry_month"]', "05");
  await page.fill('input[name="expiry_year"]', "2030");
//   await page.click("button.confirm_order");
  await page.locator('#submit').click();

  // Step 6. Verify Order Success
//   await expect(page.locator("p")).toContainText("Congratulations! Your order has been confirmed!");
  await expect(page.getByText('Congratulations! Your order')).toBeVisible();

  // Step 7. Download Invoice
//   const [download] = await Promise.all([
//     page.waitForEvent("download"),
//     // Download Invoice page locator
//     await page.locator("a.check_out").click()
//   ]);

  const downloadPromise = page.waitForEvent('download');
  await page.locator("a.check_out").click();
  const download = await downloadPromise;
  const filePath = await download.path();

  // Verify invoice
  expect(fs.existsSync(filePath)).toBeTruthy();
  const stats = fs.statSync(filePath);
  expect(stats.size).toBeGreaterThan(0);
});
