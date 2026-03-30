import https from 'https';
import fs from 'fs';

https.get('https://unpkg.com/world-atlas@2.0.2/countries-110m.json', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('world.json', data);
    console.log('Saved world.json');
  });
});
