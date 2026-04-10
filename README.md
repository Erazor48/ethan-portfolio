# Ethan Orain Portfolio - AI Chatbot

Personal portfolio with an AI chatbot powered by LangChain and automatic GitHub synchronization.

## 🚀 Features

- **Intelligent AI Chatbot** : Conversational assistant powered by LangChain
- **GitHub Synchronization** : Automatic retrieval of projects and skills from GitHub
- **Structured Database** : Centralized and organized personal data
- **Modern Interface** : Responsive design with Tailwind CSS
- **Optimized Performance** : Cache system and optimized queries
- **Project Automation** : Automatic project management from GitHub

## 🛠️ Architecture

### Data Structure

```
lib/
├── data/
│   └── personal-data.ts          # Structured personal data
├── services/
│   ├── chatbot-service.ts        # LangChain service for chatbot
│   ├── github-sync.ts           # GitHub synchronization
│   ├── project-automation.ts    # Automated project management
│   └── data-service.ts          # Centralized data access service
└── components/
    └── hooks/
        └── useChat.ts           # Custom chat hook
```

### Main Services

1. **ChatbotService** : Manages AI interactions with LangChain
2. **GitHubSyncService** : Synchronizes data with GitHub
3. **ProjectAutomationService** : Automated project management
4. **DataService** : Centralized data access point

## 📦 Installation

```bash
npm install
```

## 🔧 Configuration

1. Create a `.env.local` file:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   GITHUB_TOKEN=your_github_token_here
   ```

````

2. Update your personal data in `lib/data/personal-data.ts`

## 🚀 Démarrage

   ```bash
   npm run dev
````

## 📊 Chatbot Features

- **Skills Questions** : "What are your React skills?"
- **Project Search** : "Show me your TypeScript projects"
- **Personal Information** : "Tell me about your experience"
- **Intelligent Suggestions** : The chatbot can suggest projects or skills

## 🔄 GitHub Synchronization

The system automatically retrieves:

- GitHub projects with descriptions and technologies
- Programming languages used
- Project statistics (stars, forks)
- Real-time updates with intelligent caching

## 🎯 Advantages

- **Minimal Code** : Optimized architecture with minimal code
- **Scalable** : Easy to add new data sources
- **Performance** : Cache system and optimized queries
- **Maintainable** : Clear structure and complete documentation

## 🔧 Customization

### Adding New Data

1. Modify `lib/data/personal-data.ts`
2. The chatbot will automatically have access to new information

### Adding New Sources

1. Create a new service in `lib/services/`
2. Integrate it into `DataService`

## 📝 API Endpoints

- `POST /api/chat` : Send a message to the chatbot
- `GET /api/chat` : Get quick facts
- `GET /api/projects` : Get automated projects
- `POST /api/projects` : Get project statistics

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
