import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import * as THREE from 'three';

@Component({
  selector: 'app-entropy',
  template: `
    <canvas #canvas></canvas>
    <div class="vignette"></div>
  `,
  styles: [`
    canvas {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      display: block;
      pointer-events: none;
    }

    .vignette {
      position: fixed;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      background: radial-gradient(
        ellipse at center,
        rgba(0, 0, 0, 0.08) 0%,
        rgba(0, 0, 0, 0.50) 100%
      );
    }
  `]
})
export class Entropy implements AfterViewInit, OnDestroy {

  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private particles!: THREE.Points;

  private frameId: number = 0;
  private animationRunning = true;

  ngAfterViewInit() {
    this.initScene();
    this.animate();

    window.addEventListener('resize', this.onResize);
  }

  initScene() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    this.camera.position.z = 80;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas.nativeElement,
      alpha: true,
      antialias: true
    });

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    const geometry = new THREE.BufferGeometry();
    const count = 5000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 200;
    }

    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.7,
      transparent: true,
      opacity: 0.7
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  animate = () => {
    if (!this.animationRunning) return;

    this.frameId = requestAnimationFrame(this.animate);

    this.particles.rotation.y += 0.0008;
    this.particles.rotation.x += 0.0004;

    this.renderer.render(this.scene, this.camera);
  };

  onResize = () => {
    if (!this.camera || !this.renderer) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  };

  ngOnDestroy() {
    this.animationRunning = false;

    cancelAnimationFrame(this.frameId);

    window.removeEventListener('resize', this.onResize);

    this.particles?.geometry.dispose();
    (this.particles?.material as THREE.Material)?.dispose();
    this.renderer?.dispose();
  }
}