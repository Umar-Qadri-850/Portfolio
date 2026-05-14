import {
  Component,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { Entropy } from "../app/entropy/entropy";

interface SkillItem {
  id: number;
  title: string;
  level: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, NgStyle, Entropy],
  templateUrl: './skills.html',
  styleUrls: ['./skills.css']
})
export class Skills implements AfterViewInit, OnDestroy {

  skillsData: SkillItem[] = [
    {
      id: 1,
      title: 'HTML',
      level: 'Advanced',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 2,
      title: 'CSS',
      level: 'Intermediate',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      id: 3,
      title: 'TypeScript',
      level: 'Advanced',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      color: 'from-blue-600 to-blue-400'
    },
    {
      id: 4,
      title: 'React',
      level: 'Basic',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      color: 'from-cyan-400 to-blue-500'
    },
    {
      id: 5,
      title: 'Angular',
      level: 'Advanced',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg',
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 6,
      title: 'Figma',
      level: 'Intermediate',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
      color: 'from-purple-500 to-pink-400'
    },
    {
      id: 7,
      title: 'Python',
      level: 'Intermediate',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      color: 'from-yellow-400 to-green-400'
    },
    {
      id: 8,
      title: 'Tailwind',
      level: 'Intermediate',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
      color: 'from-yellow-400 to-green-400'
    }
  ];

  activeId: number | null = null;
  expanded: Record<number, boolean> = {};

  rotation = 0;
  isRotating = true;
  private lastTime = 0;
  private frameId: number = 0;

  ngAfterViewInit(): void {
    this.animate(0);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frameId);
  }

  animate = (time: number) => {
    if (!this.lastTime) this.lastTime = time;
    const delta = time - this.lastTime;
    this.lastTime = time;

    this.rotation += delta * 0.02;

    this.frameId = requestAnimationFrame(this.animate);
  };

  /**
   * Merges position transform + z-index into one ngStyle object.
   * Active node gets z-index 1000 so its card always renders above
   * neighbouring nodes and their labels.
   */
  getNodeStyle(index: number, id: number): Record<string, string> {
    const total = this.skillsData.length;
    const baseAngle = (index / total) * 360;
    const angle = baseAngle + this.rotation;
    const radius = 230;
    const rad = (angle * Math.PI) / 180;
    const x = radius * Math.cos(rad);
    const y = radius * Math.sin(rad);

    return {
      transform: `translate(${x}px, ${y}px)`,
      zIndex: this.activeId === id ? '1000' : '20'
    };
  }

  /**
   * Positions the expanded card above or below the node
   * depending on which half of the orbit the node is currently in.
   * sin > 0  → bottom half → card opens UPWARD
   * sin <= 0 → top half    → card opens DOWNWARD
   */
  getCardStyle(index: number): Record<string, string> {
    const total = this.skillsData.length;
    const baseAngle = (index / total) * 360;
    const angle = baseAngle + this.rotation;
    const rad = (angle * Math.PI) / 180;
    const y = Math.sin(rad);

    if (y > 0) {
      return { bottom: '4.5rem', top: 'auto' };
    } else {
      return { top: '4.5rem', bottom: 'auto' };
    }
  }

  toggle(id: number): void {
    if (this.activeId === id) {
      this.activeId = null;
      this.expanded = {};
      this.isRotating = true;
      this.lastTime = 0;
    } else {
      this.activeId = id;
      this.expanded = {};
      this.expanded[id] = true;
      this.isRotating = false;
    }
  }

  getLevelWidth(level: string): string {
    const map: Record<string, string> = {
      'Expert': '90%',
      'Advanced': '75%',
      'Intermediate': '55%',
      'Beginner': '30%',
      'Basic': '30%'
    };
    return map[level] || '50%';
  }

  stars = Array.from({ length: 80 }, () => ({
    size: Math.random() * 3 + 1,
    top: Math.random() * 100,
    left: Math.random() * 100,
    opacity: Math.random() * 0.7 + 0.2,
  }));
}