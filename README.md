# Dutch Name Generator

Generate authentic Dutch names using real phonetic patterns.

## Installation

```bash
npm install
```

## Usage

### CLI Commands

```bash
# Generate 10 random names
npm run cli generate

# Generate 50 male names
npm run cli gen -c 50 -g male

# Export 1000 names to CSV
npm run cli export -c 1000 -o names.csv

# Run interactive demo
npm run demo
```

### As Library

```typescript
import { DutchPhoneticNameGenerator } from './src';

const generator = new DutchPhoneticNameGenerator();
const name = generator.generateName();
console.log(name.fullName);
```

## Development

```bash
npm run build    # Compile TypeScript
npm run demo     # Run demo
npm run dev      # Run CLI with ts-node
```