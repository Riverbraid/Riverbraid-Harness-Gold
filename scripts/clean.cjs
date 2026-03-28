const fs = require('fs');
const artifacts = ['FETCH_HEAD', 'main', 'state.map.json', '.DS_Store'];

artifacts.forEach(file => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`🧹 Purged: ${file}`);
  }
});
