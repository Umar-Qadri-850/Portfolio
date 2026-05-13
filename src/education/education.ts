import { Component, OnInit, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Entropy } from "../app/entropy/entropy";

export interface TimelineItem {
  title: string;
  description: string;
  date?: string;
  image?: string;
  status?: 'completed' | 'current' | 'upcoming';
  category?: string;
}

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, Entropy],
  templateUrl: './education.html',
  styleUrl: './education.css'
})
export class Education implements AfterViewInit {
  @ViewChildren('timelineCard') timelineCards!: QueryList<ElementRef>;

  timelineItems: TimelineItem[] = [
 {
  title: 'Bachelors in Software Engineering',
  description: 'Focused on building strong foundations in software development, programming principles, and modern engineering practices through academic and practical learning.',
  date: '01-09-2023',
  category: 'Szabist',
  image: 'image.png',
  status: 'current'
},
   {
  title: 'Intermediate',
  description: 'Completed intermediate education with a strong academic foundation, discipline, and focus on analytical and problem-solving skills.',
  date: '01-06-2023',
  category: 'Pakistan Steel Cadet College',
  image: 'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?w=150&h=150&fit=crop',
  status: 'completed'
},
   {
  title: 'Matric',
  description: 'Completed secondary education with a solid academic foundation, emphasizing core subjects, discipline, and learning fundamentals.',
  date: '01-06-2021',
  category:  'Pakistan Steel Cadet College',
  image: 'https://images.unsplash.com/photo-1603354350317-6f7aaa5911c5?w=150&h=150&fit=crop',
  status: 'completed'
},
  {
  title: 'Certificate of Introduction to AI',
  description: 'Completed an introductory certification covering core artificial intelligence concepts, machine learning basics, and real-world AI applications.',
  date: '16-10-2025',
  category: 'Google',
  image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=150&h=150&fit=crop',
  status: 'completed'
},
  {
  title: 'Certificate of Maximize Productivity with AI Tools',
  description: 'Completed a certification focused on leveraging AI tools to enhance productivity, automate workflows, and optimize daily tasks efficiently.',
  date: '20-10-2025',
  category: 'Google',
  image: 'https://images.unsplash.com/photo-1664575601711-67110e027b9b?w=150&h=150&fit=crop',
  status: 'completed'
},
   {
  title: 'Certificate of Discover the Art of Prompting',
  description: 'Completed a certification focused on effective prompt engineering techniques to communicate clearly with AI systems and achieve accurate, optimized outputs.',
  date: '27-10-2025',
  category: 'Google',
  image: 'https://images.unsplash.com/photo-1674027444485-cec3da58eef4?w=150&h=150&fit=crop',
  status: 'completed'
},
   {
  title: 'Certificate of Foundations of Cybersecurity',
  description: 'Completed a foundational certification covering core cybersecurity concepts, online safety, risk management, and best practices for protecting digital systems.',
  date: '14-10-2025',
  category: 'Google',
  image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=150&h=150&fit=crop',
  status: 'completed'
},
    
  ];

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('timeline-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '-30px' }
    );

    this.timelineCards.forEach((card) => {
      observer.observe(card.nativeElement);
    });
  }

  getProgressWidth(status: TimelineItem['status']): string {
    if (status === 'completed') return '100%';
    if (status === 'current') return '65%';
    return '25%';
  }

  getStatusLabel(status: TimelineItem['status']): string {
    if (!status) return 'Upcoming';
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  getProgressColor(status: TimelineItem['status']): string {
    if (status === 'completed') return 'bg-emerald-500';
    if (status === 'current') return 'bg-blue-500';
    return 'bg-amber-400';
  }

  getBadgeClasses(status: TimelineItem['status']): string {
    if (status === 'completed') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (status === 'current') return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    return 'bg-amber-400/10 text-amber-400 border-amber-400/20';
  }

  getCardBorderColor(status: TimelineItem['status']): string {
    if (status === 'completed') return 'border-emerald-500/20';
    if (status === 'current') return 'border-blue-500/20';
    return 'border-amber-400/20';
  }
}