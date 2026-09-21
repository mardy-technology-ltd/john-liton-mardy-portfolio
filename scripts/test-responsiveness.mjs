import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('\x1b[36m%s\x1b[0m', '=======================================================');
console.log('\x1b[36m%s\x1b[0m', '🚀 STEP-BY-STEP RESPONSIVE DESIGN & UNIT TEST SUITE');
console.log('\x1b[36m%s\x1b[0m', '=======================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function runTest(testName, testFn) {
  totalTests++;
  try {
    testFn();
    console.log(`\x1b[32m✓ [PASS]\x1b[0m ${testName}`);
    passedTests++;
  } catch (err) {
    console.error(`\x1b[31m✗ [FAIL]\x1b[0m ${testName}`);
    console.error(`  \x1b[33mReason:\x1b[0m ${err.message}`);
    failedTests++;
  }
}

function getAllFiles(dirPath, extFilter, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        getAllFiles(fullPath, extFilter, arrayOfFiles);
      }
    } else if (!extFilter || file.endsWith(extFilter)) {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

// -------------------------------------------------------------
// TEST 1: Viewport Metadata & Root Configuration
// -------------------------------------------------------------
runTest('STEP 1: Root Layout Viewport Metadata configuration', () => {
  const layoutPath = path.join(rootDir, 'src/app/layout.js');
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  if (!layoutContent.includes('viewport') || !layoutContent.includes('device-width')) {
    throw new Error('viewport metadata is missing device-width in layout.js');
  }
  if (!layoutContent.includes('initialScale')) {
    throw new Error('initialScale is missing in layout.js viewport');
  }
});

// -------------------------------------------------------------
// TEST 2: Overflow-X Prevention on Global Styles
// -------------------------------------------------------------
runTest('STEP 2: Global CSS overflow-x horizontal scroll prevention', () => {
  const globalsPath = path.join(rootDir, 'src/app/globals.css');
  const globalsContent = fs.readFileSync(globalsPath, 'utf8');
  if (!globalsContent.includes('overflow-x: hidden') && !globalsContent.includes('overflow-x:hidden')) {
    throw new Error('globals.css must specify overflow-x: hidden to prevent mobile horizontal blowout');
  }
});

// -------------------------------------------------------------
// TEST 3: CSS Modules Media Query Breakpoint Coverage
// -------------------------------------------------------------
runTest('STEP 3: Mobile & Tablet Media Query Breakpoints (@media coverage)', () => {
  const cssFiles = getAllFiles(path.join(rootDir, 'src'), '.css');
  const modulesWithMediaQueries = [];
  
  cssFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('@media')) {
      modulesWithMediaQueries.push(path.basename(file));
    }
  });

  const criticalModules = [
    'Navbar.module.css',
    'Hero.module.css',
    'About.module.css',
    'Skills.module.css',
    'Projects.module.css',
    'Experience.module.css',
    'Contact.module.css',
    'adminLayout.module.css',
    'adminForm.module.css',
    'adminTheme.module.css',
    'adminDashboard.module.css',
    'blogPost.module.css',
  ];

  const missing = criticalModules.filter((m) => !modulesWithMediaQueries.includes(m));
  if (missing.length > 0) {
    throw new Error(`Critical CSS modules missing @media queries: ${missing.join(', ')}`);
  }
});

// -------------------------------------------------------------
// TEST 4: No Unconstrained Fixed Pixel Widths on Main Containers
// -------------------------------------------------------------
runTest('STEP 4: Rigid Fixed Width Audit (no unconstrained large fixed widths)', () => {
  const cssFiles = getAllFiles(path.join(rootDir, 'src'), '.css');
  const violations = [];

  cssFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      // Regex checking for width: > 480px without max-width or clamp or %
      const match = line.match(/width:\s*([5-9]\d{2,}|[1-9]\d{3,})px/);
      if (match && !line.includes('max-width') && !line.includes('calc')) {
        // Exclude particle canvas or decorative orbs which are absolutely positioned / background
        if (!content.includes('.orb') && !content.includes('.canvas') && !content.includes('blur')) {
          violations.push(`${path.basename(file)}:L${index + 1} (${line.trim()})`);
        }
      }
    });
  });

  if (violations.length > 0) {
    throw new Error(`Found rigid pixel widths that may clip on small screens: ${violations.join('; ')}`);
  }
});

// -------------------------------------------------------------
// TEST 5: CMS Admin Mobile Drawer & Hamburger Integration
// -------------------------------------------------------------
runTest('STEP 5: CMS Admin Navigation Mobile Drawer Integration', () => {
  const adminLayoutPath = path.join(rootDir, 'src/app/admin/layout.js');
  const adminCssPath = path.join(rootDir, 'src/app/admin/adminLayout.module.css');
  
  const layoutContent = fs.readFileSync(adminLayoutPath, 'utf8');
  const cssContent = fs.readFileSync(adminCssPath, 'utf8');

  if (!layoutContent.includes('mobileMenuOpen') || !layoutContent.includes('mobileToggleBtn')) {
    throw new Error('AdminLayout.js missing mobile hamburger/drawer state integration');
  }

  if (!cssContent.includes('.sidebarOpen') || !cssContent.includes('.backdrop')) {
    throw new Error('adminLayout.module.css missing responsive sidebar drawer or backdrop classes');
  }
});

// -------------------------------------------------------------
// TEST 6: Touch-Friendly Interactive Controls (Min-Height Check)
// -------------------------------------------------------------
runTest('STEP 6: Touch target and form input accessibility validation', () => {
  const adminFormCss = fs.readFileSync(path.join(rootDir, 'src/app/admin/adminForm.module.css'), 'utf8');
  if (!adminFormCss.includes('min-height: 44px') && !adminFormCss.includes('min-height:44px')) {
    throw new Error('adminForm inputs must have >= 44px min-height for touch ergonomics');
  }
});

// -------------------------------------------------------------
// TEST 7: Social Links Manager Responsive Layout
// -------------------------------------------------------------
runTest('STEP 7: Dynamic Social Links Editor responsive grid/flex check', () => {
  const heroAdmin = fs.readFileSync(path.join(rootDir, 'src/app/admin/hero/page.js'), 'utf8');
  const adminFormCss = fs.readFileSync(path.join(rootDir, 'src/app/admin/adminForm.module.css'), 'utf8');

  if (!heroAdmin.includes('styles.socialRow') || !heroAdmin.includes('styles.socialInputs')) {
    throw new Error('admin/hero/page.js must use responsive socialRow and socialInputs classNames');
  }

  if (!adminFormCss.includes('.socialRow') || !adminFormCss.includes('.socialInputs')) {
    throw new Error('adminForm.module.css must declare .socialRow and .socialInputs with media queries');
  }
});

// -------------------------------------------------------------
// TEST 8: Portfolio Navbar Mobile Drawer & Backdrop
// -------------------------------------------------------------
runTest('STEP 8: Portfolio Website Navbar Mobile Menu & Hamburger Toggle', () => {
  const navbarJs = fs.readFileSync(path.join(rootDir, 'src/components/ui/Navbar.jsx'), 'utf8');
  const navbarCss = fs.readFileSync(path.join(rootDir, 'src/components/ui/Navbar.module.css'), 'utf8');

  if (!navbarJs.includes('mobileOpen') && !navbarJs.includes('isOpen')) {
    throw new Error('Navbar.jsx missing mobile toggle handlers');
  }

  if (!navbarCss.includes('.mobileMenu') || !navbarCss.includes('.hamburger')) {
    throw new Error('Navbar.module.css missing mobileMenu and hamburger classes');
  }
});

// -------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------
console.log('\n-------------------------------------------------------');
console.log(`📊 TEST RESULTS: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
console.log('-------------------------------------------------------');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('\x1b[32m%s\x1b[0m', '🎉 All responsive & unit test suites passed successfully!\n');
  process.exit(0);
}
