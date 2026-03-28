import type { FilterType } from '@/types';

export function createFilter(numDetectors: number, filterType: FilterType): Float32Array {
  const filter = new Float32Array(numDetectors);
  const n = numDetectors;

  for (let i = 0; i < n; i++) {
    const omega = (i <= n / 2) ? i / n : (i - n) / n;
    const absOmega = Math.abs(omega) * 2; // normalized 0 to 1

    switch (filterType) {
      case 'ram-lak':
        filter[i] = absOmega;
        break;
      case 'shepp-logan':
        filter[i] = absOmega * (absOmega < 1e-6 ? 1 : Math.sin(Math.PI * absOmega / 2) / (Math.PI * absOmega / 2));
        break;
      case 'cosine':
        filter[i] = absOmega * Math.cos(Math.PI * absOmega / 2);
        break;
      case 'hamming':
        filter[i] = absOmega * (0.54 + 0.46 * Math.cos(Math.PI * absOmega));
        break;
      case 'hann':
        filter[i] = absOmega * 0.5 * (1 + Math.cos(Math.PI * absOmega));
        break;
    }
  }

  return filter;
}

export function applyFilter1D(projection: Float32Array, filter: Float32Array): Float32Array {
  const n = projection.length;
  // Simple DFT-based filtering
  const realIn = new Float32Array(n);
  const imagIn = new Float32Array(n);
  const realOut = new Float32Array(n);
  const imagOut = new Float32Array(n);

  for (let i = 0; i < n; i++) realIn[i] = projection[i];

  // Forward DFT
  dft(realIn, imagIn, realOut, imagOut, n, 1);

  // Apply filter
  for (let i = 0; i < n; i++) {
    realOut[i] *= filter[i];
    imagOut[i] *= filter[i];
  }

  // Inverse DFT
  const resultReal = new Float32Array(n);
  const resultImag = new Float32Array(n);
  dft(realOut, imagOut, resultReal, resultImag, n, -1);

  // Scale
  for (let i = 0; i < n; i++) resultReal[i] /= n;

  return resultReal;
}

function dft(realIn: Float32Array, imagIn: Float32Array, realOut: Float32Array, imagOut: Float32Array, n: number, dir: number) {
  for (let k = 0; k < n; k++) {
    let sumR = 0, sumI = 0;
    for (let t = 0; t < n; t++) {
      const angle = (2 * Math.PI * t * k) / n * dir;
      sumR += realIn[t] * Math.cos(angle) - imagIn[t] * Math.sin(angle);
      sumI += realIn[t] * Math.sin(angle) + imagIn[t] * Math.cos(angle);
    }
    realOut[k] = sumR;
    imagOut[k] = sumI;
  }
}

export function getFilterCurve(filterType: FilterType, numPoints: number = 128): { freq: number; amplitude: number }[] {
  const filter = createFilter(numPoints, filterType);
  const points: { freq: number; amplitude: number }[] = [];
  for (let i = 0; i <= numPoints / 2; i++) {
    points.push({ freq: i / numPoints, amplitude: filter[i] });
  }
  return points;
}
