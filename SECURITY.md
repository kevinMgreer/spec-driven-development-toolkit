# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

**Do not open a public issue.** Instead, email the maintainers or use
[GitHub's private vulnerability reporting](https://github.com/kevinMgreer/spec-driven-toolkit/security/advisories/new).

We will acknowledge receipt within 48 hours and provide an estimated timeline for a fix.

## Scope

This toolkit consists of documentation, configuration files, and install scripts. It does not
include runtime application code. Security concerns most likely relate to:

- Install scripts (`install.sh`, `install.ps1`) — file copy behavior, path handling
- AI instruction files — prompt injection or unsafe instructions
