import { GitHubTool } from './github-tool';
import { ProjectTool } from './project-tool';
import { SkillTool } from './skill-tool';

export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (params: any) => Promise<any>;
}

export class ToolManager {
  private tools: Map<string, Tool> = new Map();

  constructor() {
    this.registerTools();
  }

  private registerTools() {
    this.tools.set('get_github_profile', new GitHubTool());
    // this.tools.set('get_linkedin_profile', new LinkedInTool());
    // this.tools.set('get_cv_info', new CVTool());
    this.tools.set('get_projects', new ProjectTool());
    this.tools.set('get_skills', new SkillTool());
  }

  async executeTool(toolName: string, parameters: any): Promise<any> {
    const tool = this.tools.get(toolName);
    if (!tool) {
      throw new Error(`Tool ${toolName} not found`);
    }
    return await tool.execute(parameters);
  }

  getAvailableTools(): Tool[] {
    return Array.from(this.tools.values());
  }

  getToolDescriptions(): string {
    return Array.from(this.tools.values())
      .map(tool => `${tool.name}: ${tool.description}`)
      .join('\n');
  }
} 