// Angular uses the same twig templates from backend
// This copy twig templates from backend to frontend
// so that they can be used in the Angular app

import cpy from 'cpy';
import { rmSync, existsSync } from 'fs';

(async () => {
  try {
    // Clean destination directory first (like cpx clean: true option)
    if (existsSync('src/templates')) {
      rmSync('src/templates', { recursive: true, force: true });
    }
    
    await cpy('../_api_app/app/**/*.twig', 'src/templates', {
      parents: true
    });
    console.log('✓ Twig files copied from backend to Angular app.');
  } catch (error) {
    console.error('Error copying files:', error);
    process.exit(1);
  }
})();
