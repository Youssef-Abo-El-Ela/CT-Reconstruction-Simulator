export function artReconstruction(
  sinogram: Float32Array,
  numAngles: number,
  numDetectors: number,
  outputSize: number,
  iterations: number = 10,
  lambda: number = 0.5
): Float32Array {
  const recon = new Float32Array(outputSize * outputSize);
  const cx = outputSize / 2, cy = outputSize / 2;
  const detHalf = numDetectors / 2;
  const scale = numDetectors / outputSize;

  for (let iter = 0; iter < iterations; iter++) {
    for (let ai = 0; ai < numAngles; ai++) {
      const theta = (ai * Math.PI) / numAngles;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);

      // For each detector, compute forward projection and update
      for (let di = 0; di < numDetectors; di++) {
        const measured = sinogram[ai * numDetectors + di];
        let projected = 0;
        let rayLen = 0;

        // Collect ray pixels
        const rayPixels: { idx: number; weight: number }[] = [];

        const s = (di - detHalf + 0.5) / scale;
        for (let t = -cx; t < cx; t += 1) {
          const x = s * cosT - t * sinT + cx;
          const y = s * sinT + t * cosT + cy;
          const xi = Math.floor(x), yi = Math.floor(y);
          if (xi >= 0 && xi < outputSize && yi >= 0 && yi < outputSize) {
            const idx = yi * outputSize + xi;
            rayPixels.push({ idx, weight: 1 });
            projected += recon[idx];
            rayLen += 1;
          }
        }

        if (rayLen > 0) {
          const correction = lambda * (measured - projected) / rayLen;
          for (const { idx } of rayPixels) {
            recon[idx] += correction;
          }
        }
      }
    }
  }

  return recon;
}
