import https from 'https';
import fs from 'fs';

https.get('https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-continent.json', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('mapping.json', data);
    console.log('Saved mapping.json');
  });
});
