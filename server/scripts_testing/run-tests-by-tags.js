const fs = require('fs').promises;
const path = require('path');
const { exec, execSync } = require('child_process');
const { promisify } = require('util');

// const execAsync = promisify(exec);

// function runCommand(command) {
//     return new Promise((resolve, reject) => {
//         const child = exec(command, { stdio: 'inherit' });
        
//         child.on('close', (code) => {
//             if (code !== 0) {
//                 reject(new Error(`Command failed with code ${code}`));
//             } else {
//                 resolve('ok');
//             }
//         });
        
//         child.on('error', reject);
//     });
// }

async function runTestsByTags(tags, options = {}) {
    const metadataPath = path.join(__dirname, 'test-metadata.json');
    
    try {
        await fs.access(metadataPath);
    } catch (error) {
        console.error('Metadata file not found. Please run "npm run collect-metadata" first.');
        process.exit(1);
    }
    
    let metadata;
    try {
        const data = await fs.readFile(metadataPath, 'utf-8');
        metadata = JSON.parse(data);
    } catch (error) {
        console.error('Error reading metadata file:', error.message);
        process.exit(1);
    }
    
    const tagsToRun = Array.isArray(tags) ? tags : [tags];

    const filesToRun = metadata
        .filter(file => file.tags && file.tags.some(tag => tagsToRun.includes(tag)))
        .map(file => file.file);
    
    if (filesToRun.length === 0) {
        console.log(`No tests found with tags: ${tagsToRun.join(', ')}`);
        return;
    }
    
    console.log(`Running ${filesToRun.length} files with tags: ${tagsToRun.join(', ')}`);
    console.log(`Files:\n${filesToRun.map(f => `   - ${path.relative(process.cwd(), f)}`).join('\n')}\n`);
    const escapedPaths = filesToRun.map(f => f.replace(/\\/g, '\\\\'));
    const testPathPattern = escapedPaths.join('|');
    let jestCommand = `npx jest --testPathPattern="${testPathPattern}"`;

    if (options.coverage) jestCommand += ' --coverage';
    if (options.watch) jestCommand += ' --watch';
    
    // console.log(`Run command: ${jestCommand}\n`);

    try {
        execSync(jestCommand, { stdio: 'inherit' });
    } catch (error) {
        process.exit(error.status);
    }

    // await runCommand(jestCommand);
    
    // try {
    //     const { stdout, stderr } = await execAsync(jestCommand, { stdio: 'inherit' });
    // } catch (error) {
    //     process.exit(error.code || 1);
    // }

}

if (require.main === module) {
    const args = process.argv.slice(2);
    const tags = [];
    let options = {};
    
    for (const arg of args) {
        if (arg === '--coverage') {
            options.coverage = true;
        } else if (arg === '--watch') {
            options.watch = true;
        } else {
            tags.push(arg);
        }
    }
    
    if (tags.length === 0) {
        console.log('Usage: node run-tests-by-tags.js <tag1> [tag2] [--coverage] [--watch]');
        console.log('Example: node run-tests-by-tags.js smoke regression --coverage');
        process.exit(1);
    }
    
    runTestsByTags(tags, options);
}

module.exports = { runTestsByTags };