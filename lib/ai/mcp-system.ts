import { ToolManager } from './tools';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface MCPResponse {
  message: string;
  tools_used: string[];
  data_accessed: any[];
  confidence: number;
}

export class MCPSystem {
  private toolManager: ToolManager;
  private secretKey = '__ETHAN_SECRET_ANSWER_42__'; // Clé déclencheur secrète

  constructor() {
    this.toolManager = new ToolManager();
  }

  async processMessage(messages: ChatMessage[]): Promise<MCPResponse> {
    const lastMessage = messages[messages.length - 1]?.content || '';
    const lowerMessage = lastMessage.toLowerCase();

    // Check for secret key first
    if (lowerMessage.includes(this.secretKey.toLowerCase())) {
      return this.handleSecretResponse(lastMessage);
    }

    // Analyze the message to determine which tools to use
    const toolDecisions = this.analyzeMessage(lowerMessage);
    
    // Execute relevant tools
    const toolResults = await this.executeTools(toolDecisions);
    
    // Generate intelligent response based on tool results
    const response = await this.generateResponse(lastMessage, toolResults, lowerMessage);
    
    return {
      message: response,
      tools_used: toolDecisions.map(d => d.tool),
      data_accessed: toolResults,
      confidence: this.calculateConfidence(toolDecisions, toolResults)
    };
  }

  private handleSecretResponse(message: string): MCPResponse {
    // Réponses préparées pour la clé secrète
    const preparedResponses = {
      'hello': "🎉 Welcome to the secret mode! This is a special response triggered by the secret key. You now have access to enhanced features and detailed information about Ethan's work.",
      'help': "🔐 Secret Help Mode:\n• You can ask for detailed technical information\n• Access to advanced project details\n• Special insights about Ethan's development process\n• Priority response system activated",
      'projects': "🚀 Secret Projects Access:\n• Full project portfolio with detailed descriptions\n• Technical architecture insights\n• Performance metrics and achievements\n• Future roadmap and planned features",
      'skills': "⚡ Secret Skills Mode:\n• Complete skill assessment with proficiency levels\n• Learning progress and certifications\n• Technology stack preferences\n• Expert-level insights and recommendations"
    };

    const lowerMessage = message.toLowerCase();
    let response = "🔐 Secret mode activated! You have access to enhanced information.";

    // Check for specific secret commands
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      response = preparedResponses.hello;
    } else if (lowerMessage.includes('help')) {
      response = preparedResponses.help;
    } else if (lowerMessage.includes('project')) {
      response = preparedResponses.projects;
    } else if (lowerMessage.includes('skill')) {
      response = preparedResponses.skills;
    }

    return {
      message: response,
      tools_used: ['secret_mode'],
      data_accessed: [],
      confidence: 1.0
    };
  }

  private analyzeMessage(message: string): Array<{tool: string, params: any, priority: number}> {
    const decisions: Array<{tool: string, params: any, priority: number}> = [];

    // GitHub related queries
    if (this.containsKeywords(message, ['github', 'repo', 'repository', 'code', 'project', 'contribution'])) {
      if (this.containsKeywords(message, ['stats', 'statistics', 'overview'])) {
        decisions.push({ tool: 'get_github_profile', params: { action: 'stats' }, priority: 1 });
      } else if (this.containsKeywords(message, ['repo', 'repository', 'project'])) {
        decisions.push({ tool: 'get_github_profile', params: { action: 'repos' }, priority: 1 });
      } else {
        decisions.push({ tool: 'get_github_profile', params: { action: 'profile' }, priority: 2 });
      }
    }

    // Skills related queries
    if (this.containsKeywords(message, ['skill', 'technology', 'tech', 'expertise', 'know', 'can'])) {
      if (this.containsKeywords(message, ['frontend', 'react', 'next', 'typescript'])) {
        decisions.push({ tool: 'get_skills', params: { category: 'frontend' }, priority: 1 });
      } else if (this.containsKeywords(message, ['backend', 'node', 'python', 'api'])) {
        decisions.push({ tool: 'get_skills', params: { category: 'backend' }, priority: 1 });
      } else if (this.containsKeywords(message, ['database', 'mongo', 'postgres'])) {
        decisions.push({ tool: 'get_skills', params: { category: 'databases' }, priority: 1 });
      } else if (this.containsKeywords(message, ['ai', 'ml', 'machine learning'])) {
        decisions.push({ tool: 'get_skills', params: { category: 'ai_ml' }, priority: 1 });
      } else {
        decisions.push({ tool: 'get_skills', params: { category: 'all' }, priority: 2 });
      }
    }

    // Projects related queries
    if (this.containsKeywords(message, ['project', 'work', 'build', 'create', 'develop'])) {
      if (this.containsKeywords(message, ['featured', 'best', 'main'])) {
        decisions.push({ tool: 'get_projects', params: { filter: 'featured' }, priority: 1 });
      } else if (this.containsKeywords(message, ['recent', 'latest', 'new'])) {
        decisions.push({ tool: 'get_projects', params: { filter: 'recent' }, priority: 1 });
      } else {
        decisions.push({ tool: 'get_projects', params: { filter: 'all' }, priority: 2 });
      }
    }

    // LinkedIn/Experience related queries
    if (this.containsKeywords(message, ['linkedin', 'experience', 'work', 'job', 'career', 'background'])) {
      if (this.containsKeywords(message, ['education', 'study', 'school'])) {
        decisions.push({ tool: 'get_linkedin_profile', params: { section: 'education' }, priority: 1 });
      } else if (this.containsKeywords(message, ['skill', 'endorsement'])) {
        decisions.push({ tool: 'get_linkedin_profile', params: { section: 'skills' }, priority: 1 });
      } else {
        decisions.push({ tool: 'get_linkedin_profile', params: { section: 'experience' }, priority: 1 });
      }
    }

    // CV related queries
    if (this.containsKeywords(message, ['cv', 'resume', 'certification', 'achievement'])) {
      if (this.containsKeywords(message, ['download', 'pdf', 'file'])) {
        decisions.push({ tool: 'get_cv_info', params: { section: 'download' }, priority: 1 });
      } else if (this.containsKeywords(message, ['certification', 'cert'])) {
        decisions.push({ tool: 'get_cv_info', params: { section: 'certifications' }, priority: 1 });
      } else if (this.containsKeywords(message, ['achievement', 'accomplishment'])) {
        decisions.push({ tool: 'get_cv_info', params: { section: 'achievements' }, priority: 1 });
      } else {
        decisions.push({ tool: 'get_cv_info', params: { section: 'overview' }, priority: 2 });
      }
    }

    // Contact related queries
    if (this.containsKeywords(message, ['contact', 'email', 'reach', 'get in touch', 'hire'])) {
      // Use LinkedIn for contact info
      decisions.push({ tool: 'get_linkedin_profile', params: { section: 'profile' }, priority: 1 });
    }

    // Sort by priority (lower number = higher priority)
    return decisions.sort((a, b) => a.priority - b.priority);
  }

  private containsKeywords(message: string, keywords: string[]): boolean {
    return keywords.some(keyword => message.includes(keyword));
  }

  private async executeTools(decisions: Array<{tool: string, params: any, priority: number}>): Promise<any[]> {
    const results = [];
    
    for (const decision of decisions) {
      try {
        const result = await this.toolManager.executeTool(decision.tool, decision.params);
        results.push({
          tool: decision.tool,
          params: decision.params,
          data: result
        });
      } catch (error) {
        console.error(`Error executing tool ${decision.tool}:`, error);
        results.push({
          tool: decision.tool,
          params: decision.params,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return results;
  }

  private async generateResponse(
    originalMessage: string, 
    toolResults: any[], 
    lowerMessage: string
  ): Promise<string> {
    
    // If no tools were used, provide a general response
    if (toolResults.length === 0) {
      return this.generateGeneralResponse(originalMessage);
    }

    // Generate response based on the data from tools
    const response = await this.generateContextualResponse(originalMessage, toolResults);
    
    return response;
  }

  private generateGeneralResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (this.containsKeywords(lowerMessage, ['hello', 'hi', 'hey'])) {
      return "Hello! I'm Ethan's AI assistant. I can help you learn about his skills, projects, experience, and how to get in touch. What would you like to know about Ethan?";
    }
    
    if (this.containsKeywords(lowerMessage, ['help', 'what can you do'])) {
      return "I can help you learn about Ethan's:\n• Skills and technologies\n• Projects and work experience\n• GitHub profile and repositories\n• LinkedIn profile and network\n• CV and certifications\n• Contact information\n\nJust ask me anything specific!";
    }
    
    return "I'm here to help you learn about Ethan's work as a Full Stack Developer. You can ask me about his skills, projects, experience, or how to contact him. What interests you most?";
  }

  private async generateContextualResponse(message: string, toolResults: any[]): Promise<string> {
    let response = "Based on the information I have access to:\n\n";
    
    for (const result of toolResults) {
      if (result.error) {
        continue; // Skip failed tools
      }
      
      switch (result.tool) {
        case 'get_github_profile':
          response += this.formatGitHubResponse(result.data);
          break;
        case 'get_skills':
          response += this.formatSkillsResponse(result.data);
          break;
        case 'get_projects':
          response += this.formatProjectsResponse(result.data);
          break;
        case 'get_linkedin_profile':
          response += this.formatLinkedInResponse(result.data);
          break;
        case 'get_cv_info':
          response += this.formatCVResponse(result.data);
          break;
      }
    }
    
    // Add a call to action
    response += "\n\nIs there anything specific about Ethan's work that you'd like to know more about?";
    
    return response;
  }

  private formatGitHubResponse(data: any): string {
    if (data.action === 'stats') {
      return `📊 GitHub Statistics:\n• Total repositories: ${data.total_repos}\n• Total stars: ${data.total_stars}\n• Top languages: ${data.top_languages.map((lang: any) => `${lang.language} (${lang.count})`).join(', ')}\n\n`;
    } else if (data.action === 'repos') {
      const repos = Array.isArray(data) ? data : [];
      return `📁 Recent Projects:\n${repos.slice(0, 3).map((repo: any) => `• ${repo.name}: ${repo.description || 'No description'}`).join('\n')}\n\n`;
    } else {
      return `🐙 GitHub Profile:\n• Username: ${data.username}\n• Bio: ${data.bio || 'No bio'}\n• Public repos: ${data.public_repos}\n• Profile: ${data.html_url}\n\n`;
    }
  }

  private formatSkillsResponse(data: any): string {
    const skills = data.skills || [];
    const summary = data.summary || {};
    
    return `🛠️ Skills Overview:\n• Total skills: ${summary.total_skills || skills.length}\n• Advanced skills: ${summary.advanced_skills || skills.filter((s: any) => s.level === 'advanced' || s.level === 'expert').length}\n• Primary focus: ${summary.primary_focus || 'Full Stack Development'}\n\nTop skills: ${skills.slice(0, 5).map((skill: any) => skill.name).join(', ')}\n\n`;
  }

  private formatProjectsResponse(data: any): string {
    const projects = Array.isArray(data) ? data : [];
    
    return `🚀 Projects:\n${projects.slice(0, 3).map((project: any) => 
      `• ${project.name}: ${project.description}\n  Technologies: ${project.technologies.join(', ')}`
    ).join('\n\n')}\n\n`;
  }

  private formatLinkedInResponse(data: any): string {
    if (data.section === 'profile') {
      return `💼 LinkedIn Profile:\n• Current position: ${data.current_position}\n• Company: ${data.company}\n• Location: ${data.location}\n• Connections: ${data.connection_count}\n• Profile: ${data.profile_url}\n\n`;
    } else if (data.section === 'experience') {
      const experiences = Array.isArray(data) ? data : [];
      return `💼 Experience:\n${experiences.slice(0, 2).map((exp: any) => 
        `• ${exp.title} at ${exp.company} (${exp.duration})\n  ${exp.description}`
      ).join('\n\n')}\n\n`;
    }
    return `💼 LinkedIn: ${data.profile_url}\n\n`;
  }

  private formatCVResponse(data: any): string {
    if (data.section === 'overview') {
      return `📄 CV Overview:\n• Title: ${data.title}\n• Email: ${data.email}\n• Website: ${data.website}\n• Download: ${data.download_url}\n\n`;
    } else if (data.section === 'certifications') {
      const certs = Array.isArray(data) ? data : [];
      return `🏆 Certifications:\n${certs.slice(0, 3).map((cert: any) => 
        `• ${cert.name} (${cert.issuer}, ${cert.date})`
      ).join('\n')}\n\n`;
    }
    return `📄 CV: ${data.download_url}\n\n`;
  }

  private calculateConfidence(decisions: any[], results: any[]): number {
    const successfulTools = results.filter(r => !r.error).length;
    const totalTools = decisions.length;
    
    if (totalTools === 0) return 0.3; // Low confidence for general responses
    if (successfulTools === 0) return 0.2; // Very low confidence if all tools failed
    
    return Math.min(0.9, 0.3 + (successfulTools / totalTools) * 0.6);
  }
} 