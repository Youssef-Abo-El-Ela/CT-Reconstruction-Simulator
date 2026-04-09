# CT Reconstruction Simulator

An interactive, browser-based simulator that walks you through the complete CT (Computed Tomography) imaging pipeline — from phantom definition to image reconstruction and algorithm comparison — entirely in the browser with no backend required.

🌐 **[Try it live → ct-reconstruction-simulator.vercel.app](https://ct-reconstruction-simulator.vercel.app/)**

---

## 📖 Overview

CT reconstruction is the mathematical process of recovering a 2D cross-sectional image from a set of X-ray projections taken at multiple angles. This simulator makes that process tangible and educational, letting you configure every parameter and observe the results in real time.

---

## Features

### 🟦 Step 1 — Phantom Definition
Define the object to be "scanned" before any simulation begins.

- **Shepp-Logan Phantom** — The standard benchmark image used to test CT algorithms, composed of 10 overlapping ellipses simulating human tissue densities.
- **Geometric Phantom** — A simple geometric shape for quick, illustrative tests.
- **Resolution Phantom** — A phantom designed to evaluate spatial resolution limits.
- **Custom Draw Mode** — Draw your own phantom freehand on a 256×256 canvas with adjustable brush size, eraser, undo history, and canvas clear.

---

### 🟨 Step 2 — X-ray Projection (Radon Transform)
Simulate the physical X-ray scanning process.

- Configurable **number of angles** (18–360) and **number of detectors** (64–512).
- Real-time **animated projection viewer** showing the X-ray beam sweeping across the phantom.
- Live **sinogram generation** — watch the sinogram build up angle by angle as the scan progresses.
- Optional **Gaussian noise injection** with adjustable SNR (10–60 dB) to simulate real scanner noise.
- Scannable progress bar displaying the current angle being processed.
---

### 🟧 Step 3 — Sinogram Viewer
Inspect the raw sinogram data produced from the projection step before moving to reconstruction.

---

### 🟥 Step 4 — Reconstruction Algorithms
Apply four distinct reconstruction algorithms to recover the image from the sinogram.

| Algorithm | Description |
|-----------|-------------|
| **Back Projection (BP)** | Smears each projection back across image space. Fast but produces blurry results without filtering. Features a step-by-step animated build-up. |
| **Filtered Back Projection (FBP)** | Applies a frequency-domain filter before back-projection. Supports **Ram-Lak (Ramp)**, **Shepp-Logan**, **Cosine**, **Hamming**, and **Hann** filters. Features an animated reconstruction viewer. |
| **Fourier Reconstruction** | Uses the **Fourier Slice Theorem** — the 1D FFT of each projection populates a radial line in 2D frequency space, followed by 2D IFFT to recover the image. |
| **ART (Algebraic Reconstruction Technique)** | An iterative method with configurable **iterations** (1–50) and **relaxation factor λ**. Trades speed for convergence quality. |

---

### 🟩 Step 5 — Comparison Dashboard
Compare all executed reconstructions side by side with quantitative metrics.

- **Side-by-side image grid** of the original phantom vs. every reconstructed output.
- **Per-algorithm metric cards** showing:
  - **RMSE** — Root Mean Square Error
  - **PSNR** — Peak Signal-to-Noise Ratio (dB)
  - **SSIM** — Structural Similarity Index
  - **Time** — Execution time in milliseconds
- **Interactive bar chart** (Recharts) comparing PSNR, SSIM, and SNR across all algorithms with animated bars and a custom glassmorphic tooltip.
---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) |
| **Charts** | [Recharts](https://recharts.org/) |
---

## Algorithms Implemented (Pure TypeScript, No Dependencies)

All CT math is implemented from scratch in the browser:

- **Radon Transform** — forward projection via line integral approximation
- **Back Projection** — simple and filtered, with frequency-domain convolution
- **FBP Filters** — Ram-Lak, Shepp-Logan, Cosine, Hamming, Hann
- **Fourier Reconstruction** — via the Fourier Slice Theorem + 2D IFFT
- **ART** — iterative algebraic solver with configurable relaxation
- **Image Quality Metrics** — RMSE, PSNR, SSIM, SNR

---

## Running Locally

```bash
# Clone the repository
git clone https://github.com/karreemm/CT-Reconstruction-Simulator.git
cd CT-Reconstruction-Simulator

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.
