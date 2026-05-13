import {
  Component,
  AfterViewInit,
  OnDestroy,
  NgZone,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Entropy } from "../app/entropy/entropy";

interface TimelineItem {
  id: number;
  title: string;
  content: string;
  icon: string;
  relatedIds: number[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgStyle, Entropy, RouterOutlet],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home implements AfterViewInit, OnDestroy {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  timelineData: TimelineItem[] = [
    { id: 1, title: 'Overview',   content: 'Professional and quick intro about me',         icon: '◔', relatedIds: [2] },
    { id: 2, title: 'Skills',     content: 'Technologies, tools, and core strengths.',       icon: '🤖', relatedIds: [1, 3] },
    { id: 3, title: 'Experience', content: 'Professional Experience & Real-World Projects',  icon: '💻', relatedIds: [2, 4] },
    { id: 4, title: 'Education',  content: 'Academic background and certifications.',        icon: '🎓', relatedIds: [3, 5] },
    { id: 5, title: 'Projects',   content: 'Showcase of my best development work.',          icon: '🏷️', relatedIds: [4] },
    { id: 6, title: 'Profile',    content: 'Contact info and personal details.',             icon: '👤', relatedIds: [4] },
  ];

  expanded: Record<number, boolean> = {};
  pulse: Record<number, boolean> = {};
  activeId: number | null = null;

  rotation = 0;
  paused = false;

  private lastTime = 0;
  private frameId = 0;

  ngAfterViewInit(): void {
    // Run the rAF loop outside Angular so it doesn't trigger CD every frame
    this.zone.runOutsideAngular(() => {
      this.frameId = requestAnimationFrame(this.animate);
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frameId);
  }

  animate = (time: number) => {
    if (!this.lastTime) this.lastTime = time;
    const delta = time - this.lastTime;
    this.lastTime = time;

    if (!this.paused) {
      this.rotation += delta * 0.0080;
      // Re-enter Angular zone only to mark the view dirty
      this.zone.run(() => this.cdr.markForCheck());
    }

    this.frameId = requestAnimationFrame(this.animate);
  };

  togglePause(): void {
    this.paused = !this.paused;
  }

  getPosition(index: number) {
    const total = this.timelineData.length;
    const baseAngle = (index / total) * 360;
    const angle = baseAngle + this.rotation;
    const radius = 230;
    const rad = (angle * Math.PI) / 180;
    return {
      transform: `translate(${radius * Math.cos(rad)}px, ${radius * Math.sin(rad)}px)`
    };
  }

  // toggle(id: number): void {
  //   this.expanded = {};
  //   this.pulse = {};

  //   if (this.activeId === id) {
  //     this.activeId = null;
  //     return;
  //   }

  //   this.activeId = id;
  //   this.expanded[id] = true;
  //   const item = this.timelineData.find(i => i.id === id);
  //   item?.relatedIds.forEach(r => { this.pulse[r] = true; });
  // }
  toggle(id: number): void {
  this.expanded = {};
  this.pulse = {};

  if (this.activeId === id) {
    // Same node clicked again → close and resume
    this.activeId = null;
    this.paused = false;
    return;
  }

  // New node clicked → pause and open
  this.activeId = id;
  this.paused = true;
  this.expanded[id] = true;
  const item = this.timelineData.find(i => i.id === id);
  item?.relatedIds.forEach(r => { this.pulse[r] = true; });
}

  goTo(item: TimelineItem): void {
    const routeMap: Record<string, string> = {
      'Overview': 'overview', 'Skills': 'skills', 'Experience': 'experience',
      'Education': 'education', 'Projects': 'projects', 'Profile': 'profile'
    };
    const route = routeMap[item.title];
    if (route) this.router.navigate([route], { relativeTo: this.route });
  }

  isRelated(id: number): boolean {
    if (!this.activeId) return false;
    const active = this.timelineData.find(i => i.id === this.activeId);
    return active?.relatedIds.includes(id) ?? false;
  }
}