// Script to automatically wrap all level pages with LevelGuard
// This ensures access control is enforced across all levels

const fs = require('fs');
const path = require('path');

const levelsDir = path.join(__dirname, 'src', 'app', 'level');
const levelIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

levelIds.forEach(levelId => {
  const levelPath = path.join(levelsDir, String(levelId), 'page.tsx');
  
  if (fs.existsSync(levelPath)) {
    let content = fs.readFileSync(levelPath, 'utf8');
    
    // Check if LevelGuard is already imported
    if (!content.includes('import LevelGuard')) {
      // Add import after 'use client' directive
      const useClientMatch = content.match(/('use client'[\r\n]+)/);
      if (useClientMatch) {
        const insertPos = useClientMatch.index + useClientMatch[0].length;
        content = content.slice(0, insertPos) + 
          "\nimport LevelGuard from '@/components/LevelGuard'\n" + 
          content.slice(insertPos);
      }
      
      // Find the default export function and wrap its return
      const functionMatch = content.match(/(export default function \w+\([^)]*\)[^{]*{)/);
      if (functionMatch) {
        // Find the return statement
        const returnMatch = content.match(/([\s]*)return\s*\(/);
        if (returnMatch) {
          const returnPos = returnMatch.index + returnMatch[0].length;
          
          // Find the end of the return statement (matching parentheses)
          let depth = 1;
          let endPos = returnPos;
          while (depth > 0 && endPos < content.length) {
            if (content[endPos] === '(') depth++;
            if (content[endPos] === ')') depth--;
            endPos++;
          }
          
          // Extract the returned JSX
          const returnedContent = content.slice(returnPos, endPos - 1);
          
          // Wrap with LevelGuard
          const wrappedContent = `\n    <LevelGuard levelId={${levelId}}>\n      ${returnedContent}\n    </LevelGuard>\n  `;
          
          content = content.slice(0, returnMatch.index + returnMatch[1].length) + 
            'return (' + wrappedContent + content.slice(endPos);
          
          fs.writeFileSync(levelPath, content);
          console.log(`✓ Updated level ${levelId}`);
        }
      }
    } else {
      console.log(`- Level ${levelId} already has LevelGuard`);
    }
  }
});

console.log('All levels updated with access control!');
