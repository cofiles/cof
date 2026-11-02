<div align="center">

# COFILES

### Everything useful in one place.

**A curated directory of tools, technologies, and resources for developers and PC users.**

Software, Windows resources, Python packages, programming languages, GitHub repositories, guides, and downloads. No account required. No ads.

[![Website](https://img.shields.io/badge/Explore-COFILES-2563eb?style=for-the-badge&logo=googlechrome&logoColor=white)](https://cofiles.github.io/cof/)
[![GitHub](https://img.shields.io/badge/Source_Code-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/cofiles/cof)

<br>

![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-222222?style=flat-square&logo=githubpages&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![License](https://img.shields.io/badge/License-MPL_2.0-3b82f6?style=flat-square)

<br>

[**About**](#-about-the-project) · [**Features**](#-features) · [**Directory**](#-explore-the-directory) · [**Getting Started**](#-getting-started) · [**Structure**](#-project-structure) · [**Contributing**](#-contributing)

</div>

---

## ✦ About the Project

**COFILES** is an open web directory of useful digital resources. Its purpose is simple: make tools and information easy to find without having to search across dozens of websites.

Discover PC software, Windows resources, Python libraries, programming languages and technologies, noteworthy GitHub projects, articles, and downloadable files in one place.

COFILES is a static website hosted on **GitHub Pages**. You can browse it directly, with no installation, account, or registration required.

> **One website. Hundreds of resources. No distractions.**

## ✨ Features

| Feature | Description |
| :--- | :--- |
| 🔎 **Easy search** | Find relevant resources within each directory. |
| 🗂️ **Organized categories** | Browse resources grouped by topic. |
| 🐍 **`requirements.txt` generator** | Select Python packages and download a ready-to-use dependency file. |
| 🪟 **Windows resources** | Find official ISO images, custom ISO creation tools, and recovery utilities. |
| 📚 **Articles and guides** | Explore practical tutorials and reference materials. |
| 🔐 **SHA-256 checksums** | Checksum information is available for hosted files. |
| 🌐 **Instant access** | Browse without signing in or viewing ads. |
| 🧩 **Open source** | Explore the source code and contribute improvements. |

## 📂 Explore the Directory

<table>
<tr>
<td width="50%" valign="top">

### 🖥️ Software

**400 entries**

Utilities for system management, storage, development, networking, multimedia, and more.

[Browse software](https://cofiles.github.io/cof/tools.html)

</td>
<td width="50%" valign="top">

### 🪟 Windows

**50 entries**

Official images, ISO tools, and system recovery utilities.

[Explore Windows resources](https://cofiles.github.io/cof/windows.html)

</td>
</tr>
<tr>
<td valign="top">

### 🐍 Python Packages

**400 entries**

Libraries for web development, automation, scraping, data analysis, and more. Includes a built-in `requirements.txt` builder.

[Explore Python packages](https://cofiles.github.io/cof/python.html)

</td>
<td valign="top">

### 💻 Languages & Technologies

**400 entries**

Programming languages, frameworks, databases, and learning resources.

[Discover technologies](https://cofiles.github.io/cof/languages.html)

</td>
</tr>
<tr>
<td valign="top">

### ⭐ GitHub Repositories

**400 entries**

A selection of open-source projects, utilities, and useful collections.

[Discover repositories](https://cofiles.github.io/cof/repos.html)

</td>
<td valign="top">

### 📖 Articles & Downloads

Tutorials, documentation, and a separate directory of downloadable files with checksums.

[Read articles](https://cofiles.github.io/cof/articles.html) · [Browse files](https://cofiles.github.io/cof/files.html)

</td>
</tr>
</table>

<sub>Entry counts reflect the directory at the time this README was prepared and may change.</sub>

## ⚡ `requirements.txt` Generator

One of COFILES' built-in features lets you create a list of Python dependencies directly in your browser.

1. Open the [Python package directory](https://cofiles.github.io/cof/python.html).
2. Search for the libraries you need or use a predefined collection.
3. Select packages and choose your preferred version format.
4. Download the generated `requirements.txt` file.

Install the dependencies in your Python project:

```bash
python -m pip install -r requirements.txt
```

**No need to type every package name manually.**

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| HTML5 | Page structure and directory cards |
| CSS3 | Styling and responsive layouts |
| JavaScript | Search, filtering, and interactive features |
| Python | Utility scripts for directory maintenance |
| GitHub Pages | Static site hosting |

The website does not require a server-side application, database, or separate administration dashboard. Directory content and pages are stored directly in the repository.

## 🚀 Getting Started

You only need a web browser to explore the site. The website itself has no additional dependencies.

**1. Clone the repository**

```bash
git clone https://github.com/cofiles/cof.git
cd cof
```

**2. Open `index.html`** in your browser.

For development, you can also start a local HTTP server with Python:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## 🗃️ Project Structure

```text
cof/
├── index.html           # Homepage
├── tools.html           # Software and utilities
├── windows.html         # Windows resources and system tools
├── python.html          # Python packages and requirements.txt builder
├── languages.html       # Programming languages and technologies
├── repos.html           # GitHub repositories
├── articles.html        # Article directory
├── articles/            # Individual articles
├── files.html           # File directory
├── files/               # Downloadable files
├── assets/              # CSS, JavaScript, and UI assets
├── check_links.py       # External link checker
├── make_hashes.py       # SHA-256 checksum generator
├── 404.html             # Custom 404 page
├── LICENSE              # MPL 2.0 license
└── README.md            # Documentation
```

## 🔧 Maintenance Tools

### Check External Links

```bash
python check_links.py
```

This script checks external directory links and writes problematic addresses to `broken_links.txt`. Some websites restrict automated requests, so reported results should be verified in a browser.

### Generate File Checksums

```bash
python make_hashes.py
```

This script helps prepare SHA-256 checksums for files added to the directory. A checksum lets users verify the integrity of a downloaded file.

On Windows, use PowerShell:

```powershell
Get-FileHash .\filename.ext -Algorithm SHA256
```

## 🤝 Contributing

COFILES welcomes suggestions and improvements. Report broken links, recommend useful software, correct descriptions, add resources, or improve the interface.

1. [Open an issue](https://github.com/cofiles/cof/issues) to describe a bug or suggestion.
2. Fork the repository if you want to contribute code.
3. Make your changes in a separate branch.
4. Submit a pull request with a clear description.

## 📜 License

This project is distributed under the **Mozilla Public License 2.0 (MPL-2.0)**.

See [LICENSE](LICENSE) for details.

---

<div align="center">

### COFILES

**Find. Learn. Build.**

[🌐 Visit COFILES](https://cofiles.github.io/cof/) · [💻 View Source](https://github.com/cofiles/cof) · [💡 Suggest an Improvement](https://github.com/cofiles/cof/issues)

<sub>Made for curious minds and practical work.</sub>

</div>
