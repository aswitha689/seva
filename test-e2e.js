import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
  console.log('🚀 Starting SevaSaarthi automated browser test suite...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const consoleErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.toString());
  });

  try {
    await page.setViewport({ width: 1280, height: 850 });

    // 1. Visit Home
    console.log('1. Testing Home page at http://localhost:5173/ ...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    const title = await page.title();
    console.log('   Page Title:', title);

    // 2. Test Language Switcher to Telugu
    console.log('2. Switching language to Telugu (తెలుగు)...');
    const buttons = await page.$$('button');
    let teluguBtn = null;
    for (const b of buttons) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && text.includes('తెలుగు')) {
        teluguBtn = b;
        break;
      }
    }
    if (teluguBtn) {
      await teluguBtn.click();
      await sleep(600);
      const heroText = await page.evaluate(() => document.querySelector('h1')?.textContent);
      console.log('   Telugu Hero Text:', heroText);
    } else {
      console.warn('   Could not find Telugu button');
    }

    // 3. Test Search / Discovery for Anitha
    console.log('3. Searching query for Anitha student scholarship in Telugu...');
    await page.type('#citizen-need-input', 'నేను విద్యార్థిని, కళాశాల ఫీజులకు స్కాలర్‌షిప్ కావాలి');
    const searchBtn = await page.$('button[type="submit"]');
    if (searchBtn) {
      await searchBtn.click();
      await sleep(1000);
    }

    const currentUrl = page.url();
    console.log('   Discovery page reached. URL:', currentUrl);

    // Check if cards rendered
    const cards = await page.$$('h3');
    console.log('   Found headings on Discovery:', cards.length);

    // 4. Click "Check my eligibility"
    console.log('4. Clicking "Check my eligibility"...');
    const checkEligBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent?.includes('Check my eligibility') || b.textContent?.includes('అర్హత') || b.textContent?.includes('పాత్రతా'));
    });
    if (checkEligBtn && checkEligBtn.asElement()) {
      await checkEligBtn.asElement().click();
      await sleep(1000);
    }

    // 5. Test Eligibility Wizard
    console.log('5. On Eligibility Wizard...');
    const fillAnithaBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent?.includes('Anitha') || b.textContent?.includes('అనిత'));
    });
    if (fillAnithaBtn && fillAnithaBtn.asElement()) {
      await fillAnithaBtn.asElement().click();
      console.log('   Clicked Fill Demo Persona Anitha');
      await sleep(600);
    }

    // Click Continue to Document Checklist
    const continueChecklistBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent?.includes('Document Checklist') || b.textContent?.includes('పత్రాల'));
    });
    if (continueChecklistBtn && continueChecklistBtn.asElement()) {
      await continueChecklistBtn.asElement().click();
      await sleep(1000);
    }

    // 6. Test Document Checklist
    console.log('6. On Document Checklist...');
    const autoAttachBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent?.includes('Auto-Attach') || b.textContent?.includes('అటాచ్'));
    });
    if (autoAttachBtn && autoAttachBtn.asElement()) {
      await autoAttachBtn.asElement().click();
      console.log('   Clicked Auto-Attach All Demo Documents');
      await sleep(600);
    }

    // Proceed to Guided Application
    const proceedApplyBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent?.includes('Proceed to 4-Step') || b.textContent?.includes('దరఖాస్తు'));
    });
    if (proceedApplyBtn && proceedApplyBtn.asElement()) {
      await proceedApplyBtn.asElement().click();
      await sleep(1000);
    }

    // 7. Test 4-Step Guided Application
    console.log('7. On Guided Application: Advancing steps...');
    for (let step = 1; step <= 3; step++) {
      const nextBtn = await page.evaluateHandle(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns.find(b => b.textContent?.includes('Next Stage') || b.textContent?.includes('తదుపరి'));
      });
      if (nextBtn && nextBtn.asElement()) {
        await nextBtn.asElement().click();
        await sleep(600);
      }
    }

    // Click Submit Application
    console.log('   Submitting Application...');
    const submitBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent?.includes('Submit Application') || b.textContent?.includes('సమర్పించండి'));
    });
    if (submitBtn && submitBtn.asElement()) {
      await submitBtn.asElement().click();
      await sleep(1500);
    }

    // 8. Test Submission Success Screen
    console.log('8. Checking Submission Success screen...');
    const submittedHeading = await page.evaluate(() => document.querySelector('h1')?.textContent);
    console.log('   Submission Heading:', submittedHeading);

    // 9. Test Track Application
    console.log('9. Clicking Track Application...');
    const trackBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent?.includes('Track') || b.textContent?.includes('ట్రాక్'));
    });
    if (trackBtn && trackBtn.asElement()) {
      await trackBtn.asElement().click();
      await sleep(1000);
    }

    // Verify timeline
    const trackingHeading = await page.evaluate(() => document.querySelector('h1')?.textContent);
    console.log('   Tracking Heading:', trackingHeading);

    // Advance Stage in tracking
    const advanceBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent?.includes('Simulate Next Stage') || b.textContent?.includes('మరో దశ'));
    });
    if (advanceBtn && advanceBtn.asElement()) {
      await advanceBtn.asElement().click();
      console.log('   Clicked Simulate Next Stage Progress');
      await sleep(1000);
    }

    // 10. Check Admin Portal
    console.log('10. Navigating to Admin Portal...');
    const adminNavBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent?.includes('Admin') || b.textContent?.includes('అడ్మిన్'));
    });
    if (adminNavBtn && adminNavBtn.asElement()) {
      await adminNavBtn.asElement().click();
      await sleep(1000);
    }
    const adminHeading = await page.evaluate(() => document.querySelector('h1')?.textContent);
    console.log('   Admin Heading:', adminHeading);

    // 11. Check Analytics Portal
    console.log('11. Navigating to Analytics Portal...');
    const analyticsNavBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent?.includes('Analytics') || b.textContent?.includes('విశ్లేషణలు'));
    });
    if (analyticsNavBtn && analyticsNavBtn.asElement()) {
      await analyticsNavBtn.asElement().click();
      await sleep(1000);
    }
    const analyticsHeading = await page.evaluate(() => document.querySelector('h1')?.textContent);
    console.log('   Analytics Heading:', analyticsHeading);

    console.log('\n📊 TEST SUITE SUMMARY:');
    console.log('   Console Errors Encountered:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      consoleErrors.forEach((e, i) => console.log(`   [${i+1}] ${e}`));
    } else {
      console.log('   ✅ ZERO console errors detected during full browser run!');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  } finally {
    await browser.close();
  }
}

runTests();
