import * as THREE from 'three';

export function createCanvasTexture(
  width: number,
  height: number,
  drawFn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  drawFn(ctx, width, height);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// PCB circuit board texture
export function createPCBTexture(): THREE.CanvasTexture {
  return createCanvasTexture(512, 512, (ctx, w, h) => {
    // Base green
    ctx.fillStyle = '#1a5c2a';
    ctx.fillRect(0, 0, w, h);
    // Solder mask pattern
    ctx.strokeStyle = '#2a8c3a';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 16) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, h);
      ctx.stroke();
    }
    for (let j = 0; j < h; j += 16) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(w, j);
      ctx.stroke();
    }
    // Copper traces
    ctx.strokeStyle = '#c4a44a';
    ctx.lineWidth = 2;
    for (let t = 0; t < 30; t++) {
      ctx.beginPath();
      let x = Math.random() * w;
      let y = Math.random() * h;
      ctx.moveTo(x, y);
      for (let s = 0; s < 5; s++) {
        if (Math.random() > 0.5) x += (Math.random() - 0.5) * 80;
        else y += (Math.random() - 0.5) * 80;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    // SMD pads
    ctx.fillStyle = '#d4b44a';
    for (let p = 0; p < 60; p++) {
      const px = Math.random() * w;
      const py = Math.random() * h;
      ctx.fillRect(px, py, 6, 4);
    }
    // IC chips (dark rectangles)
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(100, 100, 80, 60);
    ctx.fillRect(300, 200, 100, 70);
    ctx.fillRect(150, 350, 60, 40);
    // Chip labels
    ctx.fillStyle = '#888';
    ctx.font = '8px monospace';
    ctx.fillText('QUALCOMM', 110, 135);
    ctx.fillText('ISP-PROC', 310, 240);
    ctx.fillText('DDR4', 160, 375);
    // Vias
    ctx.fillStyle = '#c4a44a';
    for (let v = 0; v < 40; v++) {
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

// Metal brushed texture
export function createBrushedMetalTexture(): THREE.CanvasTexture {
  return createCanvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(0, 0, w, h);
    // Brushed lines
    for (let i = 0; i < h; i += 1) {
      const brightness = 50 + Math.random() * 20;
      ctx.strokeStyle = `rgb(${brightness},${brightness},${brightness})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(w, i);
      ctx.stroke();
    }
  });
}

// LCD screen texture
export function createLCDTexture(): THREE.CanvasTexture {
  return createCanvasTexture(256, 256, (ctx, w, h) => {
    // Screen background
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#001520');
    grad.addColorStop(1, '#002030');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    // UI elements
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('4K/60fps', 30, 50);
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#00cc66';
    ctx.fillText('● REC 00:12:34', 30, 80);
    // Battery indicator
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(180, 20, 50, 20);
    ctx.fillStyle = '#00cc44';
    ctx.fillRect(182, 22, 35, 16);
    ctx.fillRect(230, 26, 4, 8);
    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < w; i += 32) {
      ctx.beginPath(); ctx.moveTo(i, 100); ctx.lineTo(i, h); ctx.stroke();
    }
    for (let j = 100; j < h; j += 32) {
      ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(w, j); ctx.stroke();
    }
    // Focus peaking highlight
    ctx.strokeStyle = '#ff3300';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(128, 170, 40, 0, Math.PI * 2);
    ctx.stroke();
  });
}

// Battery texture
export function createBatteryTexture(): THREE.CanvasTexture {
  return createCanvasTexture(256, 128, (ctx, w, h) => {
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, w, h);
    // Label
    ctx.fillStyle = '#444';
    ctx.fillRect(20, 20, w - 40, h - 40);
    ctx.fillStyle = '#aaa';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('DJI', 40, 50);
    ctx.font = '10px sans-serif';
    ctx.fillText('LiPo 1300mAh', 40, 70);
    ctx.fillText('3.85V  5.0Wh', 40, 85);
    ctx.fillText('BP23-2024', 40, 100);
    // Warning symbols
    ctx.fillStyle = '#ff6600';
    ctx.font = '12px sans-serif';
    ctx.fillText('⚠', 180, 50);
  });
}

// Camera lens texture
export function createLensTexture(): THREE.CanvasTexture {
  return createCanvasTexture(256, 256, (ctx, w, h) => {
    const cx = w / 2, cy = h / 2;
    // Outer ring
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(cx, cy, 120, 0, Math.PI * 2);
    ctx.fill();
    // Lens elements
    const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 100);
    grad.addColorStop(0, '#000820');
    grad.addColorStop(0.3, '#001040');
    grad.addColorStop(0.6, '#000510');
    grad.addColorStop(0.8, '#101030');
    grad.addColorStop(1, '#000000');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 90, 0, Math.PI * 2);
    ctx.fill();
    // Reflection
    ctx.fillStyle = 'rgba(100,150,255,0.15)';
    ctx.beginPath();
    ctx.ellipse(cx - 20, cy - 20, 30, 20, -0.5, 0, Math.PI * 2);
    ctx.fill();
    // Aperture blades hint
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 9; i++) {
      const angle = (i / 9) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * 30, cy + Math.sin(angle) * 30);
      ctx.lineTo(cx + Math.cos(angle) * 70, cy + Math.sin(angle) * 70);
      ctx.stroke();
    }
  });
}

// Heatsink texture
export function createHeatsinkTexture(): THREE.CanvasTexture {
  return createCanvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(0, 0, w, h);
    // Fins
    const finWidth = 8;
    for (let i = 0; i < w; i += finWidth * 2) {
      ctx.fillStyle = '#5a5a5a';
      ctx.fillRect(i, 0, finWidth, h);
      ctx.fillStyle = '#3a3a3a';
      ctx.fillRect(i + finWidth, 0, finWidth, h);
    }
    // Thermal paste area
    ctx.fillStyle = '#888888';
    ctx.fillRect(w / 2 - 30, h / 2 - 30, 60, 60);
  });
}

// Speaker grille texture
export function createSpeakerTexture(): THREE.CanvasTexture {
  return createCanvasTexture(128, 128, (ctx, w, h) => {
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, w, h);
    // Grille holes
    ctx.fillStyle = '#111';
    for (let x = 8; x < w; x += 12) {
      for (let y = 8; y < h; y += 12) {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
}

// USB-C port texture
export function createUSBCTexture(): THREE.CanvasTexture {
  return createCanvasTexture(128, 64, (ctx, w, h) => {
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(0, 0, w, h);
    // Port opening
    ctx.fillStyle = '#111';
    const rx = 20, ry = h / 2 - 8, rw = w - 40, rh = 16;
    const r = 8;
    ctx.beginPath();
    ctx.moveTo(rx + r, ry);
    ctx.lineTo(rx + rw - r, ry);
    ctx.arcTo(rx + rw, ry, rx + rw, ry + r, r);
    ctx.lineTo(rx + rw, ry + rh - r);
    ctx.arcTo(rx + rw, ry + rh, rx + rw - r, ry + rh, r);
    ctx.lineTo(rx + r, ry + rh);
    ctx.arcTo(rx, ry + rh, rx, ry + rh - r, r);
    ctx.lineTo(rx, ry + r);
    ctx.arcTo(rx, ry, rx + r, ry, r);
    ctx.closePath();
    ctx.fill();
    // Inner contacts
    ctx.fillStyle = '#c4a44a';
    for (let i = 0; i < 12; i++) {
      ctx.fillRect(rx + 8 + i * 7, ry + 4, 2, 8);
    }
  });
}

// Housing shell texture
export function createHousingTexture(): THREE.CanvasTexture {
  return createCanvasTexture(512, 512, (ctx, w, h) => {
    // Dark matte finish
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#2a2a2e');
    grad.addColorStop(0.5, '#222226');
    grad.addColorStop(1, '#1e1e22');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    // Subtle noise
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const b = 30 + Math.random() * 15;
      ctx.fillStyle = `rgb(${b},${b},${b})`;
      ctx.fillRect(x, y, 1, 1);
    }
    // DJI logo area
    ctx.fillStyle = '#444';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('DJI', w / 2 - 30, h / 2);
    // Ventilation slots
    ctx.fillStyle = '#1a1a1a';
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(w - 80, 100 + i * 20, 40, 4);
    }
  });
}
