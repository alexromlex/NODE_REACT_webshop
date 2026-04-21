// scripts_testing/metadata-collector.js
const fs = require('fs').promises;
const path = require('path');
const { stat } = require('fs').promises;

const projectRoot = path.resolve(__dirname, '..');
const testsPath = path.join(projectRoot, 'src/__tests__');

console.log('\nMETADATA collection started ...\n');
console.log(`Tests directory: ${testsPath}\n`);


async function findTestFiles(dir, relativePath = '') {
    let items;
    try {
        items = await fs.readdir(dir);
    } catch (error) {
        console.error(`Error readdir ${dir}:`, error.message);
        return [];
    }
    const testFiles = [];
    
    const promises = items.map(async (item) => {
        const fullPath = path.join(dir, item);
        let fileStat;
        
        try {
            fileStat = await stat(fullPath);
        } catch (error) {
            console.error(`Error to get stat ${fullPath}:`, error.message);
            return [];
        }
        
        let relativeItemPath = relativePath ? `${relativePath}/${item}` : item;
        
        if (fileStat.isDirectory()) {
            return await findTestFiles(fullPath, relativeItemPath);
        } else if (fileStat.isFile() && (item.endsWith('.test.ts') || item.endsWith('.spec.ts'))) {
            relativeItemPath = relativeItemPath.replace(/\\/g, '/');
            return [{
                name: item,
                relativePath: relativeItemPath,
                fullPath: fullPath
            }];
        }
        return [];
    });
    
    const results = await Promise.all(promises);
    
    for (const result of results) {
        testFiles.push(...result);
    }
    return testFiles;
}

function extractTags(content) {
    const tags = [];
    const tagRegex = /@group\s+([^\s\n]+)/g;
    let match;
    while ((match = tagRegex.exec(content)) !== null) {
        tags.push(match[1]);
    }
    return tags;
}

async function main() {
    try {
        const testFiles = await findTestFiles(testsPath);
        console.log(`Found test files: ${testFiles.length}\n`);
        
        const metadata = [];
        
        const filePromises = testFiles.map(async (file) => {
            try {
                const content = await fs.readFile(file.fullPath, 'utf-8');
                const tags = extractTags(content);
                console.log(`  - ${file.relativePath} ${tags.length > 0 ? `[ ${tags.join(', ')} ]` : ''}`);
                return { file: file.relativePath, tags: tags };
            } catch (error) {
                console.error(`FIle read error ${file.relativePath}:`, error.message);
                return null;
            }
        });
        
        const results = await Promise.all(filePromises);
        for (const result of results) {
            if (result) {
                metadata.push(result);
            }
        }
        
        const outputPath = path.join(projectRoot, 'scripts_testing/test-metadata.json');
        await fs.writeFile(outputPath, JSON.stringify(metadata, null, 2));
        console.log(`\nMETADATA file has been saved to ${outputPath}\n`);
        
        const filesWithTags = metadata.filter(m => m.tags.length > 0);
        const allTags = new Set(metadata.flatMap(m => m.tags));
        
        console.log('RESULTS:');
        console.log(`- Total test files: ${metadata.length}`);
        console.log(`- Files with tags: ${filesWithTags.length}`);
        console.log(`- Unique tags: ${allTags.size}`);
        if (allTags.size > 0) {
            console.log(`- Tags: ${Array.from(allTags).join(', ')}`);
        }
        console.log('\nMETADATA collection finished.');
        
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

// Запускаем
main();