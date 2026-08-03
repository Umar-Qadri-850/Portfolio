import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Entropy } from '../app/entropy/entropy';


interface ProjectItem {
  icon: string;
  title: string;
  category: string;
  description: string;
  link: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  templateUrl: './projects.html',
  styleUrl: './projects.css',
  imports: [CommonModule, Entropy],
})
export class Projects {
  heading = 'Personal Projects';

  items: ProjectItem[] = [
    {
      icon: 'fa-solid fa-skull',
      title: 'Domius Noctis',
      category: 'Angular20',
      description: 'A Luxury Style 3D Clothing Brand',
      link: 'https://domius-noctis-clothing-brand.vercel.app/',
    },
    {
      icon: 'fa-solid fa-robot',
      title: 'Talkgenie Clone',
      category: 'Angular20',
      description: 'Clone of official Talkgenie.ai',
      link: 'https://github.com/Umar-Qadri-850/Talkgenie-Clone',
    },
       {
      icon: 'fa-solid fa-chart-line',
      title: 'PSX all Stock Scraper',
      category: 'Python',
      description: 'Real-time Stock Analyzer',
      link: 'https://github.com/Umar-Qadri-850/Psx-all-Stock-Scraper',
    },
    {
  icon: 'fa-brands fa-linkedin',
  title: 'LinkedIn Scraper',
  category: 'Python',
  description: 'Real-time LinkedIn data scraper that extracts posts and profiles based on user-defined keywords.',
  link: 'https://github.com/Umar-Qadri-850/Linkedin-Scrapper',
},
  {
  icon: 'fa-brands fa-instagram',
  title: 'Instagram Scraper',
  category: 'Python',
  description: 'Real-time Instagram data scraper that extracts posts and profiles based on user-defined keywords.',
  link: 'https://github.com/Umar-Qadri-850/Instagram-Scrapper',
},
  {
  icon: 'fa-brands fa-tiktok',
  title: 'TikTok Scraper',
  category: 'Python',
  description: 'Real-time TikTok data scraper that extracts reels and profiles based on user-defined keywords.',
  link: 'https://github.com/Umar-Qadri-850/TikTok-Scrapper',
},
       {
      icon: 'fa-brands fa-atlassian',
      title: 'Vibe Todo Automation',
      category: 'React + Vite TypeScript',
      description: 'A modern TodoList with automated test cases and connectivity with Jira via MCP',
      link: 'https://github.com/Umar-Qadri-850/vibe-todo-automation',
    },
    {
      icon: 'fa-solid fa-camera',
      title: 'Google Meet Clone ',
      category: 'WebRtc + Angular20',
      description: 'Real-time video communication',
      link: 'https://github.com/Umar-Qadri-850/Google-Meet-Clone-WebRtc',
    },
      {
      icon: 'fa-solid fa-globe',
      title: 'Quick Fruity  ',
      category: 'React',
      description: 'E-commerce Website',
      link: 'https://github.com/Umar-Qadri-850/QuickFruity-React',
    },
    {
      icon: 'fa-solid fa-briefcase',
      title: 'Assingment Tracker',
      category: 'Flutter',
      description: 'Assingment or task tracking app',
      link: 'https://github.com/Umar-Qadri-850/assignment_tracker-via-flutter',
    },
    
    {
      icon: 'fa-solid fa-mug-saucer',
      title: 'Coffie Website',
      category: 'Angular20',
      description: 'Coffee shop website UI/UX design',
      link: 'https://github.com/Umar-Qadri-850/Coffee',
    },
    {
      icon: 'fa-solid fa-square-parking',
      title: 'Parking Management System',
      category: 'Java',
      description: 'Automated parking space management system',
      link: 'https://github.com/Umar-Qadri-850/Parking-Management-System',
    },
  ];
}