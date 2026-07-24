const fs = require('fs');
let content = fs.readFileSync('src/ui/screens/MessagesScreen.ts', 'utf8');
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');
fs.writeFileSync('src/ui/screens/MessagesScreen.ts', content);
