import { test, expect } from '@playwright/test';

const buildUserPayload = (overrides = {}) => ({
  name: 'Tanvir Sharif',
  email: `tanvir.sharif6@test.com`, // unique by default; can override
  password: 'Password123',
  title: 'Mr',
  birth_date: '10',
  birth_month: 'May',
  birth_year: '1995',
  firstname: 'Tanvir',
  lastname: 'Sharif6',
  company: 'Test Ltd',
  address1: '123 Test Street',
  country: 'Canada',
  zipcode: 'L5B4N4',
  state: 'Ontario',
  city: 'Toronto',
  mobile_number: '+11234567890',
  ...overrides
});

test.describe.serial('Create Account API', () => {
  let sharedEmail;
//   test.beforeEach(({}, testInfo) => {
//     // Skip test if browser is not Chromium
//     if (testInfo.project.name !== 'chromium') {
//       test.skip(true, 'API automation runs only on Chromium');
//     }
//   });

  test('Register a user (either "User created!" or "Email already exists!")', async ({ request }) => {
    const payload = buildUserPayload();
    sharedEmail = payload.email;

    const res = await request.post('/api/createAccount', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      form: payload,
    });

    expect(res.ok()).toBeTruthy();
    const body = await res.json();

    if (body.responseCode === 201) {
      console.log('First run: User created successfully:', body);
      expect(body.message).toContain('User created');
    } else if (body.responseCode === 400) {
      console.log('Second run (or later): User already exists:', body);
      expect(body.message).toContain('Email already exists');
    } else {
      throw new Error(`Unexpected response: ${JSON.stringify(body)}`);
    }
  });

  test('Attempt duplicate registration (always expect "Email already exists!")', async ({ request }) => {
    const payload = buildUserPayload({ email: sharedEmail });

    const res = await request.post('/api/createAccount', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      form: payload,
    });

    expect(res.ok()).toBeTruthy();
    const body = await res.json();

    // Always should fail because email is reused
    expect(body.responseCode).toBe(400);
    expect(body.message).toContain('Email already exists');

    console.log('Duplicate create response:', body);
  });
});
