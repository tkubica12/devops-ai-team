const { exec } = require('child_process');

const checkForUpdates = () => {
  exec('npm run audit', (err, stdout, stderr) => {
    if (err || stderr) {
      console.error(`Error: ${stderr}`);
      return;
    }
    console.log(`Audit Results: ${stdout}`);
  });

  exec('npm outdated', (err, stdout, stderr) => {
    if (err || stderr) {
      console.error(`Error: ${stderr}`);
      return;
    }
    if (stdout) {
      console.log(`Outdated Packages: ${stdout}`);
    } else {
      console.log('All packages are up to date.');
    }
  });
};

module.exports = checkForUpdates;
