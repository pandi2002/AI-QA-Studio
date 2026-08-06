# 🤖 AI QA Studio

### AI-Powered Quality Assurance Platform

Generate **Professional Test Cases**, **Playwright Automation Scripts**, **SQL Verification Queries**, **AI Reviews**, and **Bug Reports** from software requirements or UI screenshots.

---

![Version](https://img.shields.io/badge/Version-v2.2-blue)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61DAFB)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688)
![Automation](https://img.shields.io/badge/Automation-Playwright-45BA4B)
![SQL](https://img.shields.io/badge/SQL-Verification-blue)
![AI](https://img.shields.io/badge/AI-Gemini%20%7C%20Groq-orange)
![License](https://img.shields.io/badge/License-MIT-green)

---

> 🚀 **AI QA Studio** is an intelligent Quality Assurance platform that combines Artificial Intelligence with modern automation technologies to accelerate the software testing lifecycle.

---

# 📸 Application Preview

> Replace this image after deployment.

```text
screenshots/home.png
```

```md
![Home](screenshots/home.png)
```

---

# ✨ Features

| Feature | Status |
|----------|:------:|
| 🧪 AI Test Case Generator | ✅ |
| 🎭 Playwright Code Generator | ✅ |
| 🗄 SQL Verification Generator | ✅ |
| 🤖 AI Review | ✅ |
| 🐞 AI Bug Report Generator | ✅ |
| ▶ Playwright Automation Runner | ✅ |
| 📊 Allure Report Integration | ✅ |
| 📄 Excel Export | ✅ |
| 📕 PDF Export | ✅ |
| 📷 Screenshot Analysis | ✅ |
| 📋 Copy Test Cases | ✅ |
| 📋 Copy JSON | ✅ |
| 💻 Console Log Viewer | ✅ |
| 📈 Execution Summary | ✅ |

---

# 🚀 Core Modules

---

## 🧪 AI Test Case Generation

Generate professional software test cases using Artificial Intelligence.

### Features

- Requirement-based Test Case Generation
- UI Screenshot-based Test Case Generation
- Multiple Testing Types
- Multiple Test Design Techniques
- Positive Test Cases
- Negative Test Cases
- Boundary Value Analysis
- Equivalence Partitioning
- Integration Testing
- Regression Testing
- Smoke Testing
- Sanity Testing

---

## 🎭 Playwright Automation Generator

Automatically generate production-ready Playwright TypeScript automation scripts.

### Features

- Playwright Test Framework
- TypeScript
- Environment Variables
- Placeholder Locators
- Assertions
- Professional Automation Structure
- Download Code
- Copy Code
- Syntax Highlighting

---

## 🗄 SQL Verification Generator

Generate SQL queries for backend database verification.

### Features

- Requirement-based SQL Generation
- Test Case-based SQL Generation
- Verification Queries
- Copy SQL
- Download SQL
- SQL Syntax Highlighting

---

## ▶ Automation Execution

Run generated Playwright scripts directly from the application.

### Features

- Automatic Script Execution
- Console Log Viewer
- Execution Summary
- Screenshot Capture
- Video Recording
- Trace Collection
- Allure Result Generation

---

## 📊 Reporting

Generate QA documentation automatically.

### Available Reports

- AI Review
- AI Bug Report
- Execution Summary
- Allure Report
- Excel Export
- PDF Export

---

## 🖼 Image Analysis

Upload UI Screenshots to generate Test Cases.

### Features

- Single Image Upload
- Multiple Image Upload
- AI UI Understanding
- Requirement Extraction

---

# 🏗 Architecture

```text
                        React + TypeScript
                               │
                               ▼
                      FastAPI REST Backend
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
          Google Gemini                 Groq LLM
                 │                           │
                 └─────────────┬─────────────┘
                               ▼
                  AI QA Generation Engine
                               │
        ┌───────────┬──────────┼───────────┬───────────┐
        ▼           ▼          ▼           ▼           ▼
   Test Cases   Playwright     SQL     AI Review   Bug Report
                               │
                               ▼
                      Automation Execution
                               │
                               ▼
                        Allure Reporting
```

---

# 🛠 Technology Stack

## Frontend

- React
- TypeScript
- Tailwind CSS
- Vite
- React Hot Toast

---

## Backend

- FastAPI
- Python
- Pydantic
- Uvicorn

---

## AI Providers

- Google Gemini
- Groq

---

## Automation

- Playwright
- Allure Report

---

## Libraries

- OpenPyXL
- ReportLab
- Pydantic
- Uvicorn

---

# 📂 Project Structure

```text
AI-QA-Assistant
│
├── backend
│   ├── automation
│   ├── exports
│   ├── prompts
│   ├── providers
│   ├── routes
│   ├── services
│   ├── utils
│   ├── .env
│   ├── requirements.txt
│   └── main.py
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── constants
│   │   ├── services
│   │   ├── styles
│   │   ├── types
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── screenshots
│
├── README.md
├── CHANGELOG.md
├── LICENSE
└── CONTRIBUTING.md
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/<your-github-username>/AI-QA-Assistant.git

cd AI-QA-Assistant
```

---

# 🖥 Backend Setup

Create Virtual Environment

```bash
cd backend

python -m venv venv
```

Activate Environment

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install Dependencies

```bash
pip install -r requirements.txt
```

Run Backend

```bash
uvicorn main:app --reload
```

Backend

```text
http://127.0.0.1:8000
```

Swagger Documentation

```text
http://127.0.0.1:8000/docs
```

---

# 💻 Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend

```text
http://localhost:5173
```

---

# 🔄 Application Workflow

```text
             Requirement / UI Screenshot
                        │
                        ▼
        ┌─────────────────────────────────┐
        │ AI Test Case Generation         │
        └─────────────────────────────────┘
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
 Playwright Generator      SQL Generator
         │
         ▼
 Automation Execution
         │
         ▼
 Allure Report
         │
         ▼
 AI Review
         │
         ▼
 AI Bug Report
         │
         ▼
 Excel / PDF Export
```

---

# 📸 Screenshots

> Add screenshots after deployment.

| Screen | Preview |
|---------|---------|
| Home Page | screenshots/home.png |
| Test Case Generator | screenshots/testcases.png |
| Playwright Generator | screenshots/playwright.png |
| SQL Generator | screenshots/sql.png |
| Automation Execution | screenshots/automation.png |
| Allure Report | screenshots/allure.png |
| AI Review | screenshots/review.png |
| Bug Report | screenshots/bugreport.png |

Example:

```md
![Home](screenshots/home.png)
```

---

# 🎯 Why AI QA Studio?

Traditional QA activities involve multiple manual steps:

- Writing Test Cases
- Creating Automation Scripts
- Writing SQL Queries
- Preparing Bug Reports
- Reviewing Test Coverage
- Executing Automation
- Analyzing Reports

AI QA Studio combines all these tasks into a single AI-powered platform, reducing repetitive work and allowing QA engineers to focus on quality rather than documentation.

---

# 🚀 Roadmap

## ✅ Version 2.2

- AI Test Case Generator
- Playwright Generator
- SQL Verification Generator
- AI Review
- AI Bug Report
- Automation Runner
- Allure Report
- Execution Summary
- Excel Export
- PDF Export
- Screenshot Analysis

---

## 🚧 Version 3.0

- User Authentication
- PostgreSQL Integration
- JWT Authentication
- Dashboard
- Saved Projects
- Test Case History
- Automation History
- Team Workspace
- Cloud Deployment
- Email Notifications

---

# 🤝 Contributing

Contributions are welcome.

Steps:

1. Fork the repository

2. Create a new feature branch

```bash
git checkout -b feature/my-feature
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push to GitHub

```bash
git push origin feature/my-feature
```

5. Open a Pull Request

---

# 👨‍💻 Author

## Raja P

**Programmer Analyst | QA Automation Engineer**

### Skills

- QA Automation
- Playwright
- FastAPI
- React
- TypeScript
- Python
- Artificial Intelligence
- Prompt Engineering

---

# 📬 Connect

- GitHub: https://github.com/<your-github-username>

- LinkedIn: https://linkedin.com/in/<your-linkedin>

---

# 📄 License

This project is licensed under the MIT License.

See the **LICENSE** file for details.

---

# ⭐ Support

If you found this project useful:

⭐ Star this repository

🍴 Fork the repository

🛠 Contribute to the project

---

# 🙏 Acknowledgements

Special thanks to the open-source community and the teams behind:

- React
- TypeScript
- FastAPI
- Playwright
- Google Gemini
- Groq
- Tailwind CSS
- Allure Framework

---

> Built with ❤️ using React, FastAPI, Playwright, TypeScript, Python and Artificial Intelligence.