import {
  Component,
  AfterViewInit,
  OnDestroy,
  NgZone,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef
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

  @ViewChild('quantumCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private frameId = 0;

  timelineData: TimelineItem[] = [
    { id: 1, title: 'Overview', content: 'Professional and quick intro about me', icon: '◔', relatedIds: [2] },
    { id: 2, title: 'Skills', content: 'Technologies, tools, and core strengths.', icon: '🤖', relatedIds: [1, 3] },
    { id: 3, title: 'Experience', content: 'Professional Experience ', icon: '💻', relatedIds: [2, 4] },
    { id: 4, title: 'Education', content: 'Academic background and certifications.', icon: '🎓', relatedIds: [3, 5] },
    { id: 5, title: 'Projects', content: 'Showcase of my best development work.', icon: '🏷️', relatedIds: [4] },
    { id: 6, title: 'Profile', content: 'Contact info and personal details.', icon: '👤', relatedIds: [4] },
  ];

  expanded: Record<number, boolean> = {};
  pulse: Record<number, boolean> = {};
  activeId: number | null = null;

  rotation = 0;
  paused = false;

  private lastTime = 0;

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.frameId = requestAnimationFrame(this.animate);
    });

    this.initQuantumCore();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frameId);
  }

  animate = (time: number) => {
    if (!this.lastTime) this.lastTime = time;
    const delta = time - this.lastTime;
    this.lastTime = time;

    if (!this.paused) {
      this.rotation += delta * 0.005;
      this.zone.run(() => this.cdr.markForCheck());
    }

    this.frameId = requestAnimationFrame(this.animate);
  };

  initQuantumCore(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;

    const W = (canvas.width = 360);
    const H = (canvas.height = 360);
    const cx = W / 2;
    const cy = H / 2;

    const orbits = [
      // ── original 4 ──
      { tiltX: 0,             tiltY: Math.PI / 2,    speed: 0.018, color: 'rgba(255,120,0,',  electronAngle: 0   },
      { tiltX: Math.PI / 3,   tiltY: Math.PI / 6,    speed: 0.013, color: 'rgba(255,200,50,', electronAngle: 2.1 },
      { tiltX: -Math.PI / 4,  tiltY: -Math.PI / 3,   speed: 0.022, color: 'rgba(255,80,10,',  electronAngle: 4.2 },
      { tiltX: Math.PI / 5,   tiltY: -Math.PI / 2.2, speed: 0.016, color: 'rgba(255,160,30,', electronAngle: 1.1 },
      // ── NEW: horizontal (equatorial) ──
      { tiltX: 0,             tiltY: 0,              speed: 0.020, color: 'rgba(255,120,0,',  electronAngle: 3.1 },
      // ── NEW: vertical (polar) ──
      { tiltX: Math.PI / 2,   tiltY: Math.PI / 2,    speed: 0.015, color: 'rgba(255,200,50,', electronAngle: 5.0 },
    ];

    const ORBIT_R = 100;
    let frame = 0;

    const project = (x: number, y: number, z: number, rotY: number, rotX: number) => {
      const x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
      const z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);
      const y1 = y;
      const y2 = y1 * Math.cos(rotX) - z1 * Math.sin(rotX);
      const z2 = y1 * Math.sin(rotX) + z1 * Math.cos(rotX);
      const fov = 440;
      const scale = fov / (fov + z2 + 60);
      return { sx: cx + x1 * scale, sy: cy + y2 * scale, scale, z: z2 };
    };

    const drawOrbit = (orbit: typeof orbits[0], globalRotY: number, globalRotX: number) => {
      const steps = 180;
      const points: { sx: number; sy: number; scale: number; z: number }[] = [];

      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * Math.PI * 2;
        const lx = Math.cos(t) * ORBIT_R;
        const ly = Math.sin(t) * ORBIT_R * Math.cos(orbit.tiltX);
        const lz = Math.sin(t) * ORBIT_R * Math.sin(orbit.tiltY);
        points.push(project(lx, ly, lz, globalRotY, globalRotX));
      }

      for (let i = 0; i < points.length - 1; i++) {
        const p = points[i];
        const depth = (p.z + ORBIT_R) / (2 * ORBIT_R);
        const lineAlpha = 0.12 + depth * 0.65;
        ctx.beginPath();
        ctx.moveTo(p.sx, p.sy);
        ctx.lineTo(points[i + 1].sx, points[i + 1].sy);
        ctx.strokeStyle = orbit.color + lineAlpha + ')';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      orbit.electronAngle += orbit.speed;
      const et = orbit.electronAngle;
      const ex = Math.cos(et) * ORBIT_R;
      const ey = Math.sin(et) * ORBIT_R * Math.cos(orbit.tiltX);
      const ez = Math.sin(et) * ORBIT_R * Math.sin(orbit.tiltY);
      const ep = project(ex, ey, ez, globalRotY, globalRotX);

      const eSize = 6 * ep.scale;
      const depthAlpha = 0.5 + ((ep.z + ORBIT_R) / (2 * ORBIT_R)) * 0.5;

      const eGlow = ctx.createRadialGradient(ep.sx, ep.sy, 0, ep.sx, ep.sy, eSize * 4.5);
      eGlow.addColorStop(0, orbit.color + depthAlpha + ')');
      eGlow.addColorStop(0.4, orbit.color + (depthAlpha * 0.4) + ')');
      eGlow.addColorStop(1, orbit.color + '0)');
      ctx.fillStyle = eGlow;
      ctx.beginPath();
      ctx.arc(ep.sx, ep.sy, eSize * 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(ep.sx, ep.sy, eSize, 0, Math.PI * 2);
      ctx.fillStyle = orbit.color + depthAlpha + ')';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(ep.sx, ep.sy, eSize * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,220,' + depthAlpha + ')';
      ctx.fill();
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      frame++;

      const globalRotY = frame * 0.008;
      const globalRotX = Math.sin(frame * 0.003) * 0.4;

      const ambGlow = ctx.createRadialGradient(cx, cy, 5, cx, cy, 110);
      ambGlow.addColorStop(0, 'rgba(255,140,0,0.22)');
      ambGlow.addColorStop(0.5, 'rgba(255,70,0,0.07)');
      ambGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = ambGlow;
      ctx.fillRect(0, 0, W, H);

      orbits.forEach(o => drawOrbit(o, globalRotY, globalRotX));

      const corona = ctx.createRadialGradient(cx, cy, 3, cx, cy, 36);
      corona.addColorStop(0, 'rgba(255,255,200,1)');
      corona.addColorStop(0.2, 'rgba(255,170,20,0.95)');
      corona.addColorStop(0.55, 'rgba(220,80,0,0.55)');
      corona.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, 36, 0, Math.PI * 2);
      ctx.fillStyle = corona;
      ctx.fill();

      const nCore = ctx.createRadialGradient(cx - 2, cy - 2, 0, cx, cy, 13);
      nCore.addColorStop(0, 'rgba(255,255,255,1)');
      nCore.addColorStop(0.35, 'rgba(255,210,80,1)');
      nCore.addColorStop(1, 'rgba(200,80,0,0.9)');
      ctx.beginPath();
      ctx.arc(cx, cy, 13, 0, Math.PI * 2);
      ctx.fillStyle = nCore;
      ctx.fill();

      requestAnimationFrame(draw);
    };

    draw();
  }

  toggle(id: number): void {
    this.expanded = {};
    this.pulse = {};

    if (this.activeId === id) {
      this.activeId = null;
      this.paused = false;
      return;
    }

    this.activeId = id;
    this.paused = true;
    this.expanded[id] = true;

    const item = this.timelineData.find(i => i.id === id);
    item?.relatedIds.forEach(r => this.pulse[r] = true);
  }

  goTo(item: TimelineItem): void {
    const map: any = {
      Overview: 'overview',
      Skills: 'skills',
      Experience: 'experience',
      Education: 'education',
      Projects: 'projects',
      Profile: 'profile'
    };

    const route = map[item.title];
    if (route) this.router.navigate([route], { relativeTo: this.route });
  }

  getNodeStyle(index: number, id: number) {
    const total = this.timelineData.length;
    const angle = (index / total) * 360 + this.rotation;
    const radius = 230;

    return {
      transform: `translate(${radius * Math.cos(angle * Math.PI / 180)}px,
      ${radius * Math.sin(angle * Math.PI / 180)}px)`,
      zIndex: this.activeId === id ? '999' : '10'
    };
  }

  getCardStyle(index: number) {
    const total = this.timelineData.length;
    const angle = (index / total) * 360 + this.rotation;
    const y = Math.sin(angle * Math.PI / 180);

    return y > 0
      ? { bottom: '4.5rem', top: 'auto' }
      : { top: '4.5rem', bottom: 'auto' };
  }
}