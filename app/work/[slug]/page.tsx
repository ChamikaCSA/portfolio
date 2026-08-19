import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { featuredProjects, getProject } from "@/content/projects";
import { Case } from "@/components/surfaces/Case";

export function generateStaticParams() {
  return featuredProjects.map((project) => ({ slug: project.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Module" };
  return {
    title: project.title,
    description: project.problem,
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getProject(slug)) notFound();
  return <Case slug={slug} />;
}
