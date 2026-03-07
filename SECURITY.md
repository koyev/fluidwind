# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 1.x     | Yes       |

Only the latest minor release within the current major version receives security fixes.

---

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

To report a vulnerability, email **marko.jevic03@gmail.com** with:

- A description of the vulnerability and its potential impact
- Steps to reproduce or a proof-of-concept
- Any suggested mitigations (optional)

You will receive an acknowledgement within **48 hours** and a status update within **7 days**.

If the issue is confirmed, a patched release will be published and you will be credited in the changelog (unless you prefer to remain anonymous).

---

## Scope

Fluidwind is a build-time Tailwind CSS plugin - it runs during the CSS compilation step in Node.js and produces static CSS. It has no runtime browser footprint and makes no network requests.

The primary concern for this package is **supply-chain security** (dependency integrity). If you discover a vulnerability in a dependency, please report it upstream and cc the address above.
