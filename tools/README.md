# Tools Directory

This directory contains useful utilities for the Playwright project.

## test-logger.js

A utility to discover and log all tests in the project to the console.

### Features

- **Test Discovery**: Automatically finds all `.spec.js` and `.test.js` files
- **Test Extraction**: Parses test files to extract test names and describe blocks
- **Multiple Output Formats**: Detailed view or simple list format
- **Line Numbers**: Shows where each test is located in the file
- **Statistics**: Provides summary statistics of tests

### Usage

#### Import and use the TestLogger class:

```javascript
import { TestLogger, logAllTests } from './tools/test-logger.js';

// Quick usage - log all tests with default options
await logAllTests();

// Custom test directory
await logAllTests('./tests');

// Simple list format
await logAllTests('./e2e', { format: 'list' });

// Detailed usage with TestLogger class
const logger = new TestLogger('./e2e');
await logger.logAllTests();
```

#### Run directly from command line:

```bash
node tools/test-logger.js
```

#### Available options:

- `includeDescribes`: Show describe blocks (default: true)
- `showLineNumbers`: Show line numbers for tests (default: true)
- `format`: 'detailed' or 'list' (default: 'detailed')

### API

#### TestLogger class methods:

- `discoverTestFiles()`: Returns array of test file paths
- `extractTestsFromFile(filePath)`: Returns test info for a specific file
- `logAllTests(includeDescribes, showLineNumbers)`: Logs all tests in detailed format
- `logTestsList()`: Logs tests in simple list format
- `getTestStats()`: Returns test statistics object

#### Convenience functions:

- `logAllTests(testDir, options)`: Quick way to log all tests

### Example Output

```
🔍 Discovering tests...

📊 Found 5 test file(s):

📁 example.spec.js
   Path: /path/to/e2e/example.spec.js
   Tests: 2, Describes: 0
   🧪 Tests:
      • has title (line 4)
      • get started link (line 11)

📁 simple.spec.js
   Path: /path/to/e2e/simple.spec.js
   Tests: 1, Describes: 0
   🧪 Tests:
      • basic test (line 3)

📈 Summary:
   Total files: 5
   Total describe blocks: 0
   Total tests: 8
```