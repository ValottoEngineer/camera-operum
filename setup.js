const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando Operum Mobile App...');
console.log('');

// Verificar se google-services.json existe
const googleServicesPath = path.join(__dirname, 'google-services.json');
if (fs.existsSync(googleServicesPath)) {
  console.log('✅ google-services.json encontrado');
} else {
  console.log('⚠️  google-services.json não encontrado - configure no Firebase Console');
}

// Verificar se GoogleService-Info.plist existe
const plistPath = path.join(__dirname, 'GoogleService-Info.plist');
if (fs.existsSync(plistPath)) {
  console.log('✅ GoogleService-Info.plist encontrado');
} else {
  console.log('⚠️  GoogleService-Info.plist não encontrado - configure no Firebase Console');
}

console.log('');
console.log('📱 Para executar:');
console.log('  npm start          # Iniciar Expo Dev Server');
console.log('  npm run android    # Android via Expo');
console.log('  npm run ios        # iOS via Expo');
console.log('  npm run web        # Web (desenvolvimento rápido)');
console.log('');
console.log('🔧 Para build nativo (só se necessário):');
console.log('  npm run prebuild   # Gerar código nativo');
console.log('  npm run android    # Build Android');
console.log('  npm run ios        # Build iOS');
console.log('');
console.log('💡 Dica: Use "npm start" + "w" para desenvolvimento web rápido!');
