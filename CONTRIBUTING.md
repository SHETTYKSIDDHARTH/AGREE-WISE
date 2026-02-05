# Contributing to AgreeWise

Thank you for your interest in contributing to AgreeWise! This document provides guidelines and instructions for contributing.

## 🌟 How Can I Contribute?

### Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Screenshots** (if applicable)
- **Environment details**:
  - OS (Windows/macOS/Linux)
  - Python version
  - Node.js version
  - Browser (for frontend issues)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please include:

- **Clear title and description**
- **Use case** - why is this enhancement useful?
- **Proposed solution** (if you have one)
- **Alternative solutions** you've considered

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test thoroughly** - ensure all features work
4. **Update documentation** if needed
5. **Commit with clear messages** describing what and why
6. **Submit a pull request** with detailed description

## 🛠️ Development Setup

Follow the [Installation](README.md#-installation) section in README.md to set up your local development environment.

## 📝 Coding Standards

### Python (Backend)

- Follow [PEP 8](https://pep8.org/) style guide
- Use meaningful variable and function names
- Add docstrings to functions and classes
- Keep functions focused and small
- Use type hints where applicable

Example:
```python
def analyze_contract(file_path: str, language: str) -> dict:
    """
    Analyze a contract document and return risk assessment.

    Args:
        file_path: Path to the contract file
        language: Target language for analysis

    Returns:
        Dictionary containing analysis results
    """
    # Implementation
    pass
```

### JavaScript/React (Frontend)

- Use functional components with hooks
- Follow React best practices
- Use meaningful component and variable names
- Keep components small and focused
- Add comments for complex logic

Example:
```javascript
/**
 * Component for displaying contract analysis results
 * @param {Object} analysis - Analysis data from backend
 * @param {string} language - Selected display language
 */
const AnalysisResults = ({ analysis, language }) => {
  // Implementation
};
```

### CSS/Tailwind

- Use Tailwind utility classes
- Keep custom CSS minimal
- Follow mobile-first responsive design
- Maintain consistent spacing and colors

## 🧪 Testing

Before submitting a PR:

1. **Test all features** - upload different file types, try all languages
2. **Test error cases** - invalid files, network errors, API failures
3. **Test on different browsers** - Chrome, Firefox, Safari
4. **Check console** for errors or warnings
5. **Verify mobile responsiveness**

## 📋 Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add support for RTF file format
fix: resolve translation timeout issue
docs: update installation instructions
style: format code with prettier
refactor: simplify risk calculation logic
```

## 🔍 Code Review Process

1. Maintainers will review your PR within 3-5 days
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be credited in release notes

## 🎯 Priority Areas

We especially welcome contributions in these areas:

- **Testing**: Unit tests, integration tests
- **Documentation**: Tutorials, guides, API docs
- **Accessibility**: Screen reader support, keyboard navigation
- **Performance**: Optimization, caching
- **New Features**: See [Roadmap](README.md#-roadmap)

## 📧 Questions?

If you have questions about contributing:

- Check existing [Issues](https://github.com/yourusername/agreewise/issues)
- Ask in [Discussions](https://github.com/yourusername/agreewise/discussions)
- Reach out to maintainers

## 🙏 Thank You!

Your contributions make AgreeWise better for everyone. We appreciate your time and effort!
