const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../build/static/js');

fs.readdir(dir, (err, files) => {
  if (err) throw err;

  files.forEach(file => {
    const filePath = path.join(dir, file);
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) throw err;
      const result = data.replace(/console\.(log|info|debug|warn)\(.*?\);?/g, '');
      fs.writeFile(filePath, result, 'utf8', err => {
        if (err) throw err;
      });
    });
  });
});
