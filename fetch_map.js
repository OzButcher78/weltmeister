import https from 'https';
import fs from 'fs';

https.get('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('map.svg', data);
    console.log('Saved map.svg');
  });
});
