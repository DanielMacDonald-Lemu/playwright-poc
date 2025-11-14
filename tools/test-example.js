import { logAllTests } from './test-logger.js';

console.log('='.repeat(50));
console.log('Testing the Test Logger Tool');
console.log('='.repeat(50));

// Test the tool
try {
    await logAllTests('./e2e');
} catch (error) {
    console.error('Error running test logger:', error);
}