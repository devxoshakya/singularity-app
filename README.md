# Create Singularity App 📊

> A lightning-fast CLI tool to create result extraction projects using Bun + TypeScript

## 🚀 Quick Start

```bash
bunx singularity-app@latest init
```

## ⚡ What's Inside?

The generated project structure:

```
your-project/
├── src/
│   └── rollNumbers.txt    # Add your roll numbers here
├── out/
│   ├── results.json       # Extracted results in JSON format
│   └── results.csv        # Extracted results in CSV format
├── utils/
│   ├── helper.ts          # Helper functions
│   └── solver.ts          # Core result extraction logic
├── log.txt               # Execution logs
└── package.json
```

## 📝 Usage

1. Create a new project:
```bash
bunx singularity-app@latest init
```

2. Navigate to your project:
```bash
cd your-project-name
```

3. Install dependencies:
```bash
bun install
```

4. Add roll numbers:
Edit `src/rollNumbers.txt` and add your roll numbers (one per line):
```txt
12345
12346
12347
```

5. Run the extraction:
```bash
bun run start
```

Results will be available in:
- `out/results.json` - JSON format
- `out/results.csv` - CSV format
- `log.txt` - Execution logs

## 🛠️ Project Features

- 🚄 **Fast Execution** - Powered by Bun runtime
- 📊 **Multiple Formats** - Export to both JSON and CSV
- 📝 **Logging** - Detailed execution logs
- 🔄 **Type Safety** - Built with TypeScript
- 🎯 **Simple Setup** - Zero configuration needed

## 📦 Requirements

- [Bun](https://bun.sh) 1.0 or later

## 📄 License

MIT © [Dev Shakya](https://github.com/devxoshakya)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/devxoshakya">Dev Shakya</a>
</p>