import express from 'express';
import path from 'path';
import multer from 'multer';
import fs from 'fs-extra';
import { exec } from 'child_process';
import util from 'util';
import AdmZip from 'adm-zip';
import os from 'os';

const execPromise = util.promisify(exec);
const upload = multer({ dest: os.tmpdir() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to upload and build React project
  app.post('/api/build', upload.single('project'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No project zip file uploaded.' });
    }

    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'react-build-'));
    const extractDir = path.join(tempDir, 'extracted');
    const buildDir = path.join(extractDir, 'dist'); // Standard Vite/React build dir
    const legacyBuildDir = path.join(extractDir, 'build'); // Standard CRA build dir

    try {
      // 1. Extract the Zip file
      const zip = new AdmZip(req.file.path);
      zip.extractAllTo(extractDir, true);

      // Clean up uploaded zip
      await fs.remove(req.file.path);

      // Find the actual project root containing package.json
      let projectRoot = extractDir;
      
      const findPackageJsonDir = async (dir: string): Promise<string | null> => {
        if (await fs.pathExists(path.join(dir, 'package.json'))) return dir;
        const items = await fs.readdir(dir);
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = await fs.stat(fullPath);
          if (stat.isDirectory() && item !== '__MACOSX' && item !== 'node_modules') {
            const found = await findPackageJsonDir(fullPath);
            if (found) return found;
          }
        }
        return null;
      };

      const foundRoot = await findPackageJsonDir(extractDir);
      if (!foundRoot) {
        throw new Error('No package.json found in the uploaded archive.');
      }
      projectRoot = foundRoot;

      // Handle environment variables if provided
      if (req.body.envVars) {
        try {
          const envVars = JSON.parse(req.body.envVars);
          if (Array.isArray(envVars) && envVars.length > 0) {
            let envContent = '';
            for (const ev of envVars) {
              if (ev.key && ev.value) {
                envContent += `${ev.key}=${ev.value}\n`;
              }
            }
            if (envContent) {
              await fs.writeFile(path.join(projectRoot, '.env'), envContent);
              console.log(`Wrote .env file to ${projectRoot}`);
            }
          }
        } catch (e) {
          console.warn('Failed to parse envVars:', e);
        }
      }

      // 2. Run npm install
      console.log(`Starting npm install in ${projectRoot}`);
      // Use --legacy-peer-deps to reduce errors on older React projects
      await execPromise('npm install --legacy-peer-deps', { cwd: projectRoot });

      // 3. Run npm run build
      console.log(`Starting npm run build in ${projectRoot}`);
      await execPromise('npm run build', { cwd: projectRoot });

      // 4. Determine output folder
      let finalBuildDir = '';
      if (await fs.pathExists(path.join(projectRoot, 'dist'))) {
        finalBuildDir = path.join(projectRoot, 'dist');
      } else if (await fs.pathExists(path.join(projectRoot, 'build'))) {
        finalBuildDir = path.join(projectRoot, 'build');
      } else {
        throw new Error('Build output folder (dist/ or build/) not found after building.');
      }

      // 5. Zip the build folder and stream it to the client
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="build.zip"');

      const archiverModule = await import('archiver');
      const archive = new archiverModule.ZipArchive({ zlib: { level: 9 } });

      archive.on('error', (err: any) => {
        throw err;
      });

      archive.pipe(res);
      archive.directory(finalBuildDir, false);
      
      await archive.finalize();

    } catch (error: any) {
      console.error('Build error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message || 'An error occurred during the build process.' });
      }
    } finally {
      // Clean up temp directory in the background
      fs.remove(tempDir).catch(console.error);
    }
  });

  // API Route to push build zip to GitHub
  app.post('/api/github/push', upload.single('buildZip'), async (req, res) => {
    let tempDir = '';
    try {
      const { token, repoName, isNewRepo } = req.body;
      if (!req.file || !token || !repoName) {
        return res.status(400).json({ error: 'Missing required fields (buildZip, token, repoName).' });
      }

      // Initialize Octokit to get user info and create repo if needed
      const { Octokit } = await import('@octokit/rest');
      const octokit = new Octokit({ auth: token });
      
      const { data: user } = await octokit.rest.users.getAuthenticated();
      const username = user.login;

      // Create repo if requested
      if (isNewRepo === 'true') {
        try {
          await octokit.rest.repos.createForAuthenticatedUser({
            name: repoName,
            private: false,
            auto_init: false,
            description: 'Built via React Cloud Builder'
          });
        } catch (err: any) {
          // 422 commonly implies it already exists
          if (err.status !== 422) throw err;
        }
      }

      // Extract the build zip
      tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'gh-push-'));
      const extractDir = path.join(tempDir, 'extracted');
      
      const zip = new AdmZip(req.file.path);
      zip.extractAllTo(extractDir, true);
      await fs.remove(req.file.path);

      // Git commands to push
      const remoteUrl = `https://${token}@github.com/${username}/${repoName}.git`;
      
      await execPromise('git init', { cwd: extractDir });
      await execPromise('git checkout -b main', {cwd: extractDir}).catch(() => {});
      await execPromise('git config user.name "React Cloud Builder"', { cwd: extractDir });
      await execPromise('git config user.email "bot@reactbuilder.local"', { cwd: extractDir });
      
      // We might need to add a safe.directory to avoid git ownership errors in some docker environments
      await execPromise(`git config --global --add safe.directory ${extractDir}`).catch(() => {});

      await execPromise('git add .', { cwd: extractDir });
      
      // Only commit if there are changes
      const status = await execPromise('git status --porcelain', { cwd: extractDir });
      if (status.stdout.trim() !== '') {
         await execPromise('git commit -m "Deploy build output via React Cloud Builder"', { cwd: extractDir });
         await execPromise(`git remote add origin ${remoteUrl}`, { cwd: extractDir });
         await execPromise(`git push -u origin main --force`, { cwd: extractDir });
      }

      const repoUrl = `https://github.com/${username}/${repoName}`;
      res.json({ success: true, url: repoUrl });

    } catch (error: any) {
      console.error('GitHub Push Error:', error);
      res.status(500).json({ error: error.message || 'An error occurred while pushing to GitHub.' });
    } finally {
      if (tempDir) fs.remove(tempDir).catch(console.error);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
