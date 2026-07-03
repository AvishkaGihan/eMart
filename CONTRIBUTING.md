# Contributing to eMart

Thank you for your interest in contributing to eMart! We welcome contributions from everyone. By participating in this project, you agree to abide by our guidelines and maintain a positive, welcoming environment.

---

## How Can I Contribute?

### 1. Reporting Bugs
If you find a bug in the application:
1. Check the existing Issues page to see if it has already been reported.
2. If it hasn't, open a new issue.
3. Use a clear, descriptive title.
4. Provide a step-by-step description of how to reproduce the issue, including expected and actual behavior, screenshots (if applicable), and your environment details (browser, Node.js version, etc.).

### 2. Suggesting Enhancements/Features
If you have ideas to improve eMart:
1. Open an issue with the tag `enhancement`.
2. Describe the feature in detail, explaining why it would be useful and how it should work.

### 3. Submitting Code Changes (Pull Requests)
If you want to write code to fix a bug or implement a feature:
1. **Fork** the repository and clone it locally.
2. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   # or for bug fixes:
   git checkout -b bugfix/your-bugfix-name
   ```
3. Follow the project setup instructions in [README.md](./README.md) to run the frontend and backend locally.
4. Write clean, commented, and linted code.
5. Commit your changes with clear, descriptive commit messages:
   ```bash
   git commit -m "feat: add payment confirmation toast notification"
   ```
6. Push to your fork and submit a **Pull Request (PR)** to the `main` branch.

---

## Code Style & Best Practices

- **JavaScript/React**: Use ES6+ syntax, functional components, and standard React hooks.
- **State Management**: Utilize Redux Toolkit slices for global state.
- **Styling**: Use React Bootstrap components and clean custom CSS class names where necessary.
- **Backend/Express**: Keep controllers focused, use async/await for database queries, and write middleware for route protection.
- **Git Commits**: Try to follow the [Conventional Commits](https://www.conventionalcommits.org/) specification (e.g., `feat: ...`, `fix: ...`, `docs: ...`, `style: ...`).

---

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](./LICENSE).
