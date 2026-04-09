export function computeRMSE(recon: Float32Array, reference: Float32Array): number {
  let sum = 0;
  const n = Math.min(recon.length, reference.length);
  for (let i = 0; i < n; i++) {
    const d = recon[i] - reference[i];
    sum += d * d;
  }
  return Math.sqrt(sum / n);
}

export function computePSNR(recon: Float32Array, reference: Float32Array): number {
  const rmse = computeRMSE(recon, reference);
  if (rmse < 1e-10) return 100;
  let maxVal = 0;
  for (let i = 0; i < reference.length; i++) {
    if (reference[i] > maxVal) maxVal = reference[i];
  }
  return 20 * Math.log10(maxVal / rmse);
}

export function computeSSIM(recon: Float32Array, reference: Float32Array, size: number): number {
  const n = recon.length;
  let muX = 0, muY = 0;
  for (let i = 0; i < n; i++) { muX += recon[i]; muY += reference[i]; }
  muX /= n; muY /= n;

  let sigX2 = 0, sigY2 = 0, sigXY = 0;
  for (let i = 0; i < n; i++) {
    const dx = recon[i] - muX;
    const dy = reference[i] - muY;
    sigX2 += dx * dx;
    sigY2 += dy * dy;
    sigXY += dx * dy;
  }
  sigX2 /= n; sigY2 /= n; sigXY /= n;

  const C1 = 0.0001, C2 = 0.0009;
  return ((2 * muX * muY + C1) * (2 * sigXY + C2)) /
    ((muX * muX + muY * muY + C1) * (sigX2 + sigY2 + C2));
}

export function computeSNR(recon: Float32Array, reference: Float32Array): number {
  let signalPower = 0, noisePower = 0;
  const n = Math.min(recon.length, reference.length);
  for (let i = 0; i < n; i++) {
    signalPower += reference[i] * reference[i];
    const d = recon[i] - reference[i];
    noisePower += d * d;
  }
  if (noisePower < 1e-10) return 100;
  return 10 * Math.log10(signalPower / noisePower);
}

export function computeAllMetrics(recon: Float32Array, reference: Float32Array, size: number) {
  return {
    rmse: computeRMSE(recon, reference),
    psnr: computePSNR(recon, reference),
    ssim: computeSSIM(recon, reference, size),
    snr: computeSNR(recon, reference),
  };
}
