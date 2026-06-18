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
      icon: '🤖',
      title: 'Talkgenie Clone',
      category: 'Angular20',
      description: 'Clone of official Talkgenie.ai',
      link: 'https://github.com/Umar-Qadri-850/Talkgenie-Clone',
    },
    {
      icon: '🕸️',
      title: 'Linkedin Scrapper',
      category: 'Python',
      description: 'Real-time text extractor based on keyword',
      link: 'https://github.com/Umar-Qadri-850/Linkedin-Scrapper',
    },
    {
      icon: '📷',
      title: 'Google Meet Clone ',
      category: 'WebRtc',
      description: 'Real-time video communication',
      link: 'https://github.com/Umar-Qadri-850/Google-Meet-Clone-WebRtc',
    },
      {
      icon: '🌐',
      title: 'Quick Fruity  ',
      category: 'React',
      description: 'E-commerce Website',
      link: 'https://github.com/Umar-Qadri-850/QuickFruity-React',
    },
    {
      icon: '💼',
      title: 'Assingment Tracker',
      category: 'Flutter',
      description: 'Assingment or task tracking app',
      link: 'https://github.com/Umar-Qadri-850/assignment_tracker-via-flutter',
    },
    
    {
      icon: '☕',
      title: 'Coffie Website',
      category: 'Angular',
      description: 'Coffee shop website UI/UX design',
      link: 'https://github.com/Umar-Qadri-850/Coffee',
    },
    {
      icon: '🅿️',
      title: 'Parking Management System',
      category: 'Java',
      description: 'Automated parking space management system',
      link: 'https://github.com/Umar-Qadri-850/Parking-Management-System',
    },
  ];
}