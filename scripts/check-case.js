const fs = require('fs');
const path = require('path');

const checkFiles = [
  'components/ui/card.tsx',
  'components/darkmodetoggle.tsx',
  'components/qrcodegenerator.tsx',
  'components/paymentform.tsx',
  'components/backbutton.tsx'
];

checkFiles.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing file: ${file}`);
    process.exit(1);
  }
  console.log(`✅ Found: ${file}`);
});