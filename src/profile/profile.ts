import {
  Component,
  ElementRef,
  ViewChild,
  signal,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Entropy } from "../app/entropy/entropy";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, Entropy],
  templateUrl: './profile.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [`
    @keyframes spotlight {
      0%   { opacity: 0; transform: translate(-72%, -62%) skewX(12deg); }
      100% { opacity: 1; transform: translate(-50%, -40%) skewX(12deg); }
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class Profile {
  @ViewChild('container', { static: true })
  container!: ElementRef<HTMLDivElement>;

  mouseX = signal(0);
  mouseY = signal(0);
  isHover = signal(false);

  get spotlightLeft(): number {
    const el = this.container?.nativeElement;
    if (!el) return -999;
    const rect = el.getBoundingClientRect();
    return (this.mouseX() * 0.5 + 0.5) * rect.width - 110;
  }

  get spotlightTop(): number {
    const el = this.container?.nativeElement;
    if (!el) return -999;
    const rect = el.getBoundingClientRect();
    return (this.mouseY() * 0.5 + 0.5) * rect.height - 110;
  }

  onMove(e: MouseEvent): void {
    const rect = this.container.nativeElement.getBoundingClientRect();
    this.mouseX.set((e.clientX - rect.left) / rect.width * 2 - 1);
    this.mouseY.set((e.clientY - rect.top) / rect.height * 2 - 1);
  }

  enter(): void { this.isHover.set(true); }

  leave(): void {
    this.isHover.set(false);
    this.mouseX.set(0);
    this.mouseY.set(0);
  }
   ngAfterViewInit(): void {
    setTimeout(() => {
      const viewer = document.querySelector('spline-viewer');
      if (viewer?.shadowRoot) {
        const logo = viewer.shadowRoot.querySelector('#logo');
        if (logo) (logo as HTMLElement).style.display = 'none';
      }
    }, 1000);
  }
}