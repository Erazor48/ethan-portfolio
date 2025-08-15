import { NextRequest, NextResponse } from 'next/server';
import { projectAutomationService } from '@/lib/services/project-automation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const technology = searchParams.get('technology');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    if (technology) {
      const projects = await projectAutomationService.getProjectsByTechnology(technology);
      return NextResponse.json({ projects });
    }

    if (featured === 'true') {
      const projects = await projectAutomationService.getFeaturedProjects();
      return NextResponse.json({ projects });
    }

    if (limit) {
      const projects = await projectAutomationService.getRecentProjects(parseInt(limit));
      return NextResponse.json({ projects });
    }

    const projects = await projectAutomationService.getAutomatedProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const stats = await projectAutomationService.getProjectStats();
    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching project stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 