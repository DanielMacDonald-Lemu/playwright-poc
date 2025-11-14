import { readdir, readFile } from 'fs/promises';
import { join, resolve } from 'path';

/**
 * Test Logger - A utility to discover and log all tests in the project
 */
export class TestLogger {
    constructor(testDir = './e2e') {
        this.testDir = resolve(testDir);
    }

    /**
     * Discovers all test files in the test directory
     * @returns {Promise<string[]>} Array of test file paths
     */
    async discoverTestFiles() {
        try {
            const files = await readdir(this.testDir);
            return files
                .filter(file => file.endsWith('.spec.js') || file.endsWith('.test.js'))
                .map(file => join(this.testDir, file));
        } catch (error) {
            console.error(`Error reading test directory ${this.testDir}:`, error.message);
            return [];
        }
    }

    /**
     * Extracts test names from a test file
     * @param {string} filePath Path to the test file
     * @returns {Promise<Object>} Object containing file info and tests
     */
    async extractTestsFromFile(filePath) {
        try {
            const content = await readFile(filePath, 'utf-8');
            const tests = [];
            
            // Regular expression to match test() and test.describe() calls
            const testRegex = /test\s*\(\s*['"`]([^'"`]+)['"`]/g;
            const describeRegex = /test\.describe\s*\(\s*['"`]([^'"`]+)['"`]/g;
            
            let match;
            
            // Find all test() calls
            while ((match = testRegex.exec(content)) !== null) {
                tests.push({
                    type: 'test',
                    name: match[1],
                    line: content.substring(0, match.index).split('\n').length
                });
            }
            
            // Find all test.describe() calls
            const describes = [];
            while ((match = describeRegex.exec(content)) !== null) {
                describes.push({
                    type: 'describe',
                    name: match[1],
                    line: content.substring(0, match.index).split('\n').length
                });
            }
            
            return {
                filePath,
                fileName: filePath.split('/').pop(),
                totalTests: tests.length,
                totalDescribes: describes.length,
                tests,
                describes
            };
        } catch (error) {
            console.error(`Error reading file ${filePath}:`, error.message);
            return {
                filePath,
                fileName: filePath.split('/').pop(),
                totalTests: 0,
                totalDescribes: 0,
                tests: [],
                describes: [],
                error: error.message
            };
        }
    }

    /**
     * Logs all tests in a formatted way
     * @param {boolean} includeDescribes Whether to include describe blocks
     * @param {boolean} showLineNumbers Whether to show line numbers
     */
    async logAllTests(includeDescribes = true, showLineNumbers = true) {
        console.log('🔍 Discovering tests...\n');
        
        const testFiles = await this.discoverTestFiles();
        
        if (testFiles.length === 0) {
            console.log('❌ No test files found in', this.testDir);
            return;
        }
        
        let totalTests = 0;
        let totalDescribes = 0;
        let totalFiles = 0;
        
        console.log(`📊 Found ${testFiles.length} test file(s):\n`);
        
        for (const filePath of testFiles) {
            const fileInfo = await this.extractTestsFromFile(filePath);
            totalFiles++;
            totalTests += fileInfo.totalTests;
            totalDescribes += fileInfo.totalDescribes;
            
            // File header
            console.log(`📁 ${fileInfo.fileName}`);
            console.log(`   Path: ${fileInfo.filePath}`);
            
            if (fileInfo.error) {
                console.log(`   ❌ Error: ${fileInfo.error}\n`);
                continue;
            }
            
            console.log(`   Tests: ${fileInfo.totalTests}, Describes: ${fileInfo.totalDescribes}`);
            
            // List describe blocks if requested
            if (includeDescribes && fileInfo.describes.length > 0) {
                console.log('   📋 Describe blocks:');
                fileInfo.describes.forEach(desc => {
                    const lineInfo = showLineNumbers ? ` (line ${desc.line})` : '';
                    console.log(`      • ${desc.name}${lineInfo}`);
                });
            }
            
            // List individual tests
            if (fileInfo.tests.length > 0) {
                console.log('   🧪 Tests:');
                fileInfo.tests.forEach(test => {
                    const lineInfo = showLineNumbers ? ` (line ${test.line})` : '';
                    console.log(`      • ${test.name}${lineInfo}`);
                });
            }
            
            console.log(''); // Empty line between files
        }
        
        // Summary
        console.log('📈 Summary:');
        console.log(`   Total files: ${totalFiles}`);
        console.log(`   Total describe blocks: ${totalDescribes}`);
        console.log(`   Total tests: ${totalTests}`);
    }

    /**
     * Logs tests in a simple list format
     */
    async logTestsList() {
        const testFiles = await this.discoverTestFiles();
        
        console.log('📝 All Tests List:\n');
        
        for (const filePath of testFiles) {
            const fileInfo = await this.extractTestsFromFile(filePath);
            
            if (fileInfo.error) {
                console.log(`❌ ${fileInfo.fileName}: Error reading file`);
                continue;
            }
            
            fileInfo.tests.forEach(test => {
                console.log(`• ${test.name} (${fileInfo.fileName})`);
            });
        }
    }

    /**
     * Gets test statistics
     * @returns {Promise<Object>} Object with test statistics
     */
    async getTestStats() {
        const testFiles = await this.discoverTestFiles();
        const stats = {
            totalFiles: testFiles.length,
            totalTests: 0,
            totalDescribes: 0,
            files: []
        };
        
        for (const filePath of testFiles) {
            const fileInfo = await this.extractTestsFromFile(filePath);
            stats.totalTests += fileInfo.totalTests;
            stats.totalDescribes += fileInfo.totalDescribes;
            stats.files.push(fileInfo);
        }
        
        return stats;
    }
}

/**
 * Convenience function to quickly log all tests
 * @param {string} testDir Test directory path (default: './e2e')
 * @param {Object} options Logging options
 */
export async function logAllTests(testDir = './e2e', options = {}) {
    const logger = new TestLogger(testDir);
    const { 
        includeDescribes = true, 
        showLineNumbers = true, 
        format = 'detailed' 
    } = options;
    
    if (format === 'list') {
        await logger.logTestsList();
    } else {
        await logger.logAllTests(includeDescribes, showLineNumbers);
    }
}

// Example usage if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    logAllTests();
}