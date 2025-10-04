const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src', 'local-data');
const destDir = path.join(__dirname, '..', '.next', 'server', 'src', 'local-data');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy all files from local-data
const files = fs.readdirSync(srcDir);
files.forEach((file) => {
  const srcFile = path.join(srcDir, file);
  const destFile = path.join(destDir, file);
  
  if (fs.statSync(srcFile).isFile()) {
    fs.copyFileSync(srcFile, destFile);
    console.log(`Copied ${file} to build directory`);
  }
});

console.log('✓ Local data files copied successfully');
