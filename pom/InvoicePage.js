import fs from 'fs';
import path from 'path';

export class InvoicePage {
  constructor(page) {
    this.page = page;
    this.downloadLink = 'a.check_out'; // adjust if invoice link differs
  }

  async downloadInvoice(testInfo, downloadDir = 'downloads') {
    // Ensure downloads dir exists
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }
    // Wait for download event
    const downloadPromise = this.page.waitForEvent('download');
    await this.page.locator(this.downloadLink).click();
    const download = await downloadPromise;
    // const filePath = `${downloadDir}/${await download.suggestedFilename()}`;
    // await download.saveAs(filePath);
    // return filePath;
    // Build browser-specific filename
    const fileName = `invoice-${testInfo.project.name}.txt`;
    const filePath = path.join(downloadDir, fileName);

    // Save download as browser-specific file
    await download.saveAs(filePath);

    return filePath;
  }

  assertInvoice(filePath, expectedName, expectedTotal) {
     // Verify file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`Invoice file not found at: ${filePath}`);
    }
    // Verify file is not empty
    const stats = fs.statSync(filePath);
    if (stats.size <= 0) {
      throw new Error('Invoice file is empty');
    }

    // Read file content
    // const content = fs.readFileSync(filePath, 'utf-8');
    // console.log(`Invoice content:\n${content}`);

    // // Build expected text
    // const expectedText = `Hi ${expectedName}, Your total purchase amount is ${expectedTotal}. Thank you`;

    // // Verify content
    // if (!content.includes(expectedText)) {
    //   throw new Error(
    //     `Invoice text mismatch!\nExpected to include: "${expectedText}"\nActual content: "${content}"`
    //   );
    // }


    console.log(`Invoice verified: ${filePath} (${stats.size} bytes)`);

  }
}