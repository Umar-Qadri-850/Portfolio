import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  NgZone,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { Entropy } from "../app/entropy/entropy";

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, Entropy],
  templateUrl: './overview.html',
  styleUrls: ['./overview.css']
})
export class Overview implements AfterViewInit, OnDestroy {

  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private rotation: [number, number] = [0, -10];
  private isDragging = false;
  private lastX = 0;
  private lastY = 0;

  private projection!: d3.GeoProjection;
  private context!: CanvasRenderingContext2D;
  private landFeatures: GeoJSON.FeatureCollection | null = null;
  private landDots: [number, number][] = [];

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => this.initGlobe());
  }

  ngOnDestroy(): void {}

  private initGlobe(): void {
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');
    if (!context) return;

    this.context = context;

    const size = 260;
    const W = size;
    const H = size;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    context.scale(dpr, dpr);

    const radius = 105;
    const cx = W / 2;
    const cy = H / 2;

    this.projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([cx, cy])
      .clipAngle(90)
      .rotate(this.rotation);

    const path = d3.geoPath(this.projection, context);
    const graticule = d3.geoGraticule()();

    const DOT_STEP = 2.8;
    const dots: [number, number][] = [];

    for (let lat = -80; lat <= 80; lat += DOT_STEP) {
      for (let lon = -180; lon <= 180; lon += DOT_STEP) {
        dots.push([lon, lat]);
      }
    }

    const pointInPolygon = (pt: [number, number], ring: number[][]) => {
      let inside = false;

      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const [xi, yi] = ring[i];
        const [xj, yj] = ring[j];

        if (
          yi > pt[1] !== yj > pt[1] &&
          pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi
        ) {
          inside = !inside;
        }
      }
      return inside;
    };

    const pointOnLand = (pt: [number, number]) => {
      if (!this.landFeatures) return false;

      for (const f of this.landFeatures.features) {
        const g = (f as any).geometry;
        const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;

        for (const poly of polys) {
          if (pointInPolygon(pt, poly[0])) {
            let hole = false;
            for (let h = 1; h < poly.length; h++) {
              if (pointInPolygon(pt, poly[h])) hole = true;
            }
            if (!hole) return true;
          }
        }
      }
      return false;
    };

    const render = () => {
      context.clearRect(0, 0, W, H);

      context.beginPath();
      context.arc(W / 2, H / 2, radius, 0, Math.PI * 2);
      context.fillStyle = '#000';
      context.fill();

      context.strokeStyle = 'rgba(255,255,255,0.8)';
      context.stroke();

      context.beginPath();
      path(graticule);
      context.strokeStyle = 'rgba(255,255,255,0.12)';
      context.stroke();

      if (this.landFeatures) {
        context.beginPath();
        for (const f of this.landFeatures.features) path(f as any);
        context.strokeStyle = 'rgba(255,255,255,0.55)';
        context.stroke();
      }

      context.fillStyle = '#aaa';
      for (const [lon, lat] of this.landDots) {
        const p = this.projection([lon, lat]);
        if (!p) continue;

        context.beginPath();
        context.arc(p[0], p[1], 1.2, 0, Math.PI * 2);
        context.fill();
      }
    };

    canvas.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    });

    canvas.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;

      const dx = e.clientX - this.lastX;
      const dy = e.clientY - this.lastY;

      this.lastX = e.clientX;
      this.lastY = e.clientY;

      this.rotation[0] += dx * 0.5;
      this.rotation[1] -= dy * 0.3;

      this.rotation[1] = Math.max(-90, Math.min(90, this.rotation[1]));

      this.projection.rotate(this.rotation);
      render();
    });

    canvas.addEventListener('pointerup', () => this.isDragging = false);
    canvas.addEventListener('pointerleave', () => this.isDragging = false);

    const animate = () => {
      if (!this.isDragging) this.rotation[0] += 0.25;

      this.projection.rotate(this.rotation);
      render();

      requestAnimationFrame(animate);
    };

    animate();

    fetch('https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json')
      .then(r => r.json())
      .then(geojson => {
        this.landFeatures = geojson;
        this.landDots = dots.filter(pt => pointOnLand(pt));
        render();
      })
      .catch(() => {
        this.landDots = dots;
        render();
      });

    render();
  }
}