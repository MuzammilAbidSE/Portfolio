import { NextRequest, NextResponse } from "next/server";
import {
  getProjects,
  createProject,
  deleteProject,
  updateProject,
} from "@/utility/project";

export async function GET() {
  try {
    const projects = getProjects();
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json(
      { error: "Failed to load projects" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, technologies, images } = body;
    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 },
      );
    }
    // @ts-ignore
    const project: any = createProject({
      name,
      description,
      technologies: technologies || [],
      images: images || [],
    });
    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    const project = updateProject(id, updates);
    if (!project)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    const success = deleteProject(id);
    if (!success)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
