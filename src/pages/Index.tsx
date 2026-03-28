import { AppShell } from '@/components/layout/AppShell';
import { useCTStore } from '@/store/ctStore';
import { PhantomStep } from '@/components/steps/PhantomStep';
import { ProjectionStep } from '@/components/steps/ProjectionStep';
import { SinogramStep } from '@/components/steps/SinogramStep';
import { ReconstructionStep } from '@/components/steps/ReconstructionStep';
import { ComparisonStep } from '@/components/steps/ComparisonStep';
import { AnimatePresence, motion } from 'framer-motion';

const STEPS = [PhantomStep, ProjectionStep, SinogramStep, ReconstructionStep, ComparisonStep];

const Index = () => {
  const activeStep = useCTStore((s) => s.activeStep);
  const StepComponent = STEPS[activeStep];

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <StepComponent />
        </motion.div>
      </AnimatePresence>
    </AppShell>
  );
};

export default Index;
