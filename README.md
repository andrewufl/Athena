# Albert - Slack Outreach App

An AI-powered Slack outreach platform that helps businesses automate and optimize their Slack-based lead generation and customer engagement.

## Features
- Automated Slack workspace joining
- Campaign builder UI
- DM scheduler engine
- AI-powered replies
- Reply tracking
- Analytics dashboard

## Installation

### Prerequisites
- Node.js 20.x or higher
- MongoDB
- Redis
- Slack Developer Account
- OpenAI API Key

### Quick Start (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/yourusername/albert.git
cd albert
```

2. Run the setup script:
```bash
chmod +x setup.sh
./setup.sh
```

3. Configure environment variables:
- Copy `.env.example` to `.env`
- Fill in the required credentials:
  - Slack Bot Token
  - Slack App Token
  - Slack Signing Secret
  - OpenAI API Key
  - JWT Secret

### Docker Installation

1. Build and run the application using Docker Compose:
```bash
docker-compose up --build
```

2. Access the application:
- Backend: http://localhost:3000
- Frontend: http://localhost:5173

### Manual Installation

1. Install dependencies:
```bash
npm install
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Build the application:
```bash
npm run build
```

4. Start the backend:
```bash
npm start
```

5. Start the frontend:
```bash
cd frontend
npm run dev
```

### Environment Variables

Create a `.env` file with the following variables:
```
# Slack Credentials
SLACK_BOT_TOKEN=your_slack_bot_token
SLACK_APP_TOKEN=your_slack_app_token
SLACK_SIGNING_SECRET=your_slack_signing_secret

# AI Configuration
OPENAI_API_KEY=your_openai_api_key

# Message Queue
REDIS_URL=redis://localhost:6379

# Application Settings
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=mongodb://localhost:27017/albert

# Security
JWT_SECRET=your_jwt_secret
```

## Documentation
- [Product Documentation](Docs/product.md)
- [High-Level Design](Docs/HLD.md)
- [Low-Level Design](Docs/LLD.md)
- [Tasks](Docs/tasks.md)
- [Change Log](Docs/log.md)

## Contributing
Please follow the Windsurf workflow for contributing:
1. Review and approve PRD → HLD → LLD
2. Create tasks in `taskmaster.mcp`
3. Start sessions with proper documentation
4. Log all changes in `log.md`
