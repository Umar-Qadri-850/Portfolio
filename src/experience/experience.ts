import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Entropy } from "../app/entropy/entropy";

export interface ExperienceItem {
  title: string;
  company: string;
  duration: string;
  description: string;
  icon: string;        // SVG path or emoji fallback
  iconColor: string;   // Tailwind text color class
  iconBg: string;      // Tailwind bg color class
  status: string;
  tags: string[];
  colSpan?: number;
  hasPersistentHover?: boolean;
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, Entropy],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
})
export class Experience {
  experiences: ExperienceItem[] = [
    {
      title: 'Frontend Intern',
      company: 'Akvateq',
      duration: '8 Months',
      description:
        'Hands-on experience in Angular 20, developing dynamic and responsive user interfaces, integrating APIs, and applying best practices in frontend architecture.',
      icon: 'trending-up',
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10',
      status: 'Completed',
      tags: ['Angular', 'TypeScript', 'Tailwind','Html'],
      colSpan: 2,
      hasPersistentHover: true,
    },
   {
  title: 'AI Intern',
  company: 'HexaVibes',
  duration: '6 Months (Remote)',
  description:
    'Worked as an AI Intern contributing to the development of AI-powered features, experimenting with machine learning models, and integrating intelligent solutions into web applications.',
  icon: 'code',
  iconColor: 'text-blue-400',
  iconBg: 'bg-blue-500/10',
  status: 'Completed',
  tags: ['Python', 'React', 'AI'],
  colSpan: 1,
},
   
    {
  title: 'Freelancing Projects',
  company: 'HexaVibes/Personal Clients',
  duration: 'Present',
  description:
    'Working on diverse freelance projects involving AI-powered solutions, modern web applications, and interactive user interfaces for clients, focusing on scalable and user-friendly digital products.',
  icon: 'briefcase',
  iconColor: 'text-purple-400',
  iconBg: 'bg-purple-500/10',
  status: 'Ongoing',
  tags: ['Python', 'React', 'AI','WebScrappers','Chatbots'],
  colSpan: 2,
}
   
  ];

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      Current: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
      Ongoing: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      Completed: 'bg-white/10 text-gray-300 border border-white/10',
      Alumni: 'bg-white/10 text-gray-400 border border-white/10',
    };
    return map[status] ?? 'bg-white/10 text-gray-300';
  }
}