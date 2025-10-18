const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const getCommitHash = () => {
  try {
    const hash = execSync('git rev-parse --short HEAD')
      .toString()
      .trim();
    return hash;
  } catch (error) {
    console.error('Erro ao obter hash do commit:', error);
    return 'development';
  }
};

const updateAppJson = () => {
  const commitHash = getCommitHash();
  const appJsonPath = path.join(__dirname, '..', 'app.json');
  
  try {
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
    
    if (!appJson.expo.extra) {
      appJson.expo.extra = {};
    }
    
    appJson.expo.extra.commitHash = commitHash;
    
    fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
    console.log(`✅ Hash do commit atualizado: ${commitHash}`);
  } catch (error) {
    console.error('❌ Erro ao atualizar app.json:', error);
    process.exit(1);
  }
};

updateAppJson();
