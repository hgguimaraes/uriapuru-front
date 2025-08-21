module.exports = {
  // TypeScript and JavaScript files
  '**/*.(ts|tsx|js|jsx)': [
    'eslint --fix',
    'prettier --write',
  ],
  
  // JSON files
  '**/*.json': [
    'prettier --write',
  ],
  
  // CSS and SCSS files
  '**/*.(css|scss)': [
    'prettier --write',
  ],
  
  // Markdown files
  '**/*.md': [
    'prettier --write',
  ],
  
  // Run type check for TypeScript files
  '**/*.(ts|tsx)': () => 'tsc --noEmit',
  
  // Run tests related to staged files
  '**/*.(ts|tsx|js|jsx)': () => 'npm run test:ci',
};