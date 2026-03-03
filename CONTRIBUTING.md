# Contributing to FeedLens

Thank you for your interest in contributing to FeedLens! This document provides guidelines and instructions.

## 🎯 Project Goals

FeedLens aims to be:
- **Privacy-first**: No tracking, no cookies, no personal data
- **Simple**: One-click snapshot publishing
- **Open**: Transparent and community-driven
- **Fast**: Minimal dependencies, optimized performance

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork
3. Follow [INSTALLATION.md](./INSTALLATION.md) to set up locally
4. Create a new branch for your feature/fix

## 💻 Development Workflow

### Backend Changes

1. Make changes in `app/` directory
2. Test locally with `npm run dev`
3. Verify API endpoints work correctly
4. Check database migrations if schema changed

### Extension Changes

1. Make changes in `extension/` directory
2. Rebuild: `npm run build`
3. Reload extension in Chrome
4. Test on YouTube homepage

### Database Changes

1. Update `prisma/schema.prisma`
2. Create migration: `npx prisma migrate dev --name description`
3. Test migration on fresh database
4. Update API routes if needed

## 🧪 Testing

Before submitting PR:

1. Test manually (see [TESTING.md](./TESTING.md))
2. Verify no TypeScript errors: `npx tsc --noEmit`
3. Test both backend and extension together
4. Check console for errors

## 📝 Code Style

- **TypeScript**: Use strict mode, no `any` types
- **Naming**: camelCase for variables, PascalCase for components
- **Comments**: Only for non-obvious logic, avoid redundant comments
- **Formatting**: Use consistent indentation (2 spaces)

## 🐛 Bug Reports

When reporting bugs, include:

1. **Description**: Clear description of the issue
2. **Steps to reproduce**: Exact steps to trigger the bug
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Environment**: 
   - OS and version
   - Chrome version
   - Node.js version
   - Extension version
6. **Screenshots**: If UI-related
7. **Console logs**: Any error messages

## ✨ Feature Requests

When requesting features:

1. **Use case**: Why is this needed?
2. **Proposed solution**: How should it work?
3. **Alternatives**: Other approaches considered?
4. **Privacy impact**: Does it collect any new data?

## 🔒 Privacy Guidelines

All contributions MUST follow these rules:

- ❌ NO cookies collection
- ❌ NO IP address logging
- ❌ NO user tracking
- ❌ NO private identifiers
- ❌ NO browsing history access
- ✅ ONLY public YouTube data
- ✅ ONLY user-provided info (nickname, city, etc.)

## 📋 Pull Request Process

1. **Branch**: Create from `main`
2. **Commits**: Write clear, descriptive commit messages
3. **PR Description**: 
   - What does this PR do?
   - Why is it needed?
   - How to test?
4. **Testing**: Verify everything works
5. **Documentation**: Update docs if needed

### PR Checklist

- [ ] Code follows project style
- [ ] No TypeScript errors
- [ ] Tested locally
- [ ] Documentation updated (if needed)
- [ ] No breaking changes (or clearly documented)
- [ ] Privacy guidelines followed

## 🎨 UI/UX Guidelines

- **Minimal**: Clean, uncluttered interface
- **Fast**: No unnecessary animations or heavy assets
- **Accessible**: Semantic HTML, proper contrast
- **Responsive**: Works on all screen sizes
- **Consistent**: Follow existing design patterns

## 🏗 Architecture Decisions

When making significant changes:

1. Open an issue first to discuss
2. Consider impact on existing users
3. Maintain backward compatibility when possible
4. Update ARCHITECTURE.md if needed

## 📚 Documentation

Help improve docs:

- Fix typos and grammar
- Add examples and screenshots
- Clarify confusing sections
- Translate to other languages (future)

## 🙋 Questions?

- Open an issue for questions
- Use GitHub Discussions for broader topics
- Check existing issues first

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🎉 Recognition

All contributors will be recognized in the project README.

Thank you for contributing to FeedLens! 🙌
