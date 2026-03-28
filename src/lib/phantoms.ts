export function generateSheppLogan(size: number): Float32Array {
  const data = new Float32Array(size * size);
  const cx = size / 2, cy = size / 2;
  
  // Standard Shepp-Logan ellipse parameters: [density, a, b, x0, y0, phi(deg)]
  const ellipses: [number, number, number, number, number, number][] = [
    [1.0,   0.69,  0.92,   0,      0,      0],
    [-0.8,  0.6624,0.8740,  0,     -0.0184, 0],
    [-0.2,  0.1100,0.3100,  0.22,   0,     -18],
    [-0.2,  0.1600,0.4100, -0.22,   0,      18],
    [0.1,   0.2100,0.2500,  0,      0.35,   0],
    [0.1,   0.0460,0.0460,  0,      0.1,    0],
    [0.1,   0.0460,0.0460,  0,     -0.1,    0],
    [0.1,   0.0460,0.0230, -0.08,  -0.605,  0],
    [0.1,   0.0230,0.0230,  0,     -0.606,  0],
    [0.1,   0.0230,0.0460,  0.06,  -0.605,  0],
  ];

  for (const [density, a, b, x0, y0, phiDeg] of ellipses) {
    const phi = (phiDeg * Math.PI) / 180;
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);
    const a2 = a * a, b2 = b * b;

    for (let j = 0; j < size; j++) {
      for (let i = 0; i < size; i++) {
        const x = (i - cx) / cx;
        const y = (j - cy) / cy;
        const dx = x - x0;
        const dy = y - y0;
        const xr = dx * cosPhi + dy * sinPhi;
        const yr = -dx * sinPhi + dy * cosPhi;
        if ((xr * xr) / a2 + (yr * yr) / b2 <= 1) {
          data[j * size + i] += density;
        }
      }
    }
  }

  // Normalize to 0-1
  let min = Infinity, max = -Infinity;
  for (let i = 0; i < data.length; i++) {
    if (data[i] < min) min = data[i];
    if (data[i] > max) max = data[i];
  }
  const range = max - min || 1;
  for (let i = 0; i < data.length; i++) {
    data[i] = (data[i] - min) / range;
  }
  return data;
}

export function generateGeometric(size: number): Float32Array {
  const data = new Float32Array(size * size);
  const cx = size / 2, cy = size / 2;

  // Background
  for (let i = 0; i < data.length; i++) data[i] = 0;

  // Large circle
  fillCircle(data, size, cx, cy, size * 0.4, 0.3);
  // Medium circles
  fillCircle(data, size, cx - size * 0.15, cy - size * 0.1, size * 0.12, 0.7);
  fillCircle(data, size, cx + size * 0.15, cy + size * 0.1, size * 0.1, 0.5);
  fillCircle(data, size, cx, cy + size * 0.2, size * 0.08, 0.9);
  // Rectangles
  fillRect(data, size, cx - size * 0.3, cy - size * 0.25, size * 0.12, size * 0.2, 0.6);
  fillRect(data, size, cx + size * 0.1, cy - size * 0.2, size * 0.15, size * 0.1, 0.8);

  return data;
}

export function generateResolution(size: number): Float32Array {
  const data = new Float32Array(size * size);
  const cx = size / 2, cy = size / 2;

  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      const dx = i - cx, dy = j - cy;
      const r = Math.sqrt(dx * dx + dy * dy);
      const maxR = size * 0.45;
      if (r < maxR) {
        // Concentric rings with decreasing spacing
        const normalR = r / maxR;
        const freq = 2 + 20 * normalR * normalR;
        const val = 0.5 + 0.5 * Math.cos(freq * normalR * Math.PI * 2);
        data[j * size + i] = val;
      }
    }
  }
  return data;
}

export function createBlankCanvas(size: number): Float32Array {
  return new Float32Array(size * size);
}

function fillCircle(data: Float32Array, size: number, cx: number, cy: number, r: number, val: number) {
  const r2 = r * r;
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      const dx = i - cx, dy = j - cy;
      if (dx * dx + dy * dy <= r2) {
        data[j * size + i] = val;
      }
    }
  }
}

function fillRect(data: Float32Array, size: number, x: number, y: number, w: number, h: number, val: number) {
  for (let j = Math.max(0, Math.floor(y)); j < Math.min(size, Math.floor(y + h)); j++) {
    for (let i = Math.max(0, Math.floor(x)); i < Math.min(size, Math.floor(x + w)); i++) {
      data[j * size + i] = val;
    }
  }
}
