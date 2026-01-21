import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Instagram, Grid3x3, Sparkles, Wand2 } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F2F0E9] grain-texture">
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Instagram className="w-6 h-6 text-primary" />
            <span className="font-serif text-2xl font-medium tracking-tight">ProfileStyler</span>
          </div>
          <Button 
            data-testid="nav-get-started-btn"
            onClick={() => navigate('/auth')} 
            className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 font-medium uppercase tracking-wide text-sm transition-all active:scale-95"
          >
            Get Started
          </Button>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-5xl md:text-7xl font-medium tracking-tight leading-[1.1] mb-6">
              Your Instagram,
              <br />
              <span className="text-primary">Professionally Styled</span>
            </h1>
            <p className="font-sans text-base leading-relaxed text-slate-600 mb-8 max-w-lg">
              AI-powered layout suggestions, real-time filter previews, and intelligent grid organization. 
              Create a cohesive, professional Instagram profile effortlessly.
            </p>
            <div className="flex gap-4">
              <Button 
                data-testid="hero-get-started-btn"
                onClick={() => navigate('/auth')} 
                className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 font-medium uppercase tracking-wide text-sm transition-all active:scale-95"
              >
                Start Styling
              </Button>
              <Button 
                data-testid="hero-learn-more-btn"
                variant="outline" 
                className="rounded-none border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 px-8 font-medium uppercase tracking-wide text-sm"
              >
                Learn More
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="border border-border bg-card p-8">
              <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-4 text-center">
                Example: Professional Instagram Layout
              </p>
              <img 
                src="https://customer-assets.emergentagent.com/job_6b928bac-1959-4888-998d-0078774b0d9f/artifacts/enfy8woe_image.png"
                alt="Professional Instagram grid layout example"
                className="w-full h-auto"
              />
              <p className="font-sans text-sm text-center text-muted-foreground mt-4">
                Cohesive aesthetic with photos, text overlays & consistent color scheme
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl font-normal tracking-tight mb-4">Features</h2>
          <p className="font-mono text-xs tracking-widest uppercase text-slate-500">Everything you need</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="border border-border bg-card p-8 hover:border-primary/50 transition-colors duration-300"
          >
            <Wand2 className="w-12 h-12 text-primary mb-4" />
            <h3 className="font-sans text-xl md:text-2xl font-semibold tracking-tight uppercase text-muted-foreground mb-3">
              AI-Powered Layouts
            </h3>
            <p className="font-sans text-base leading-relaxed text-slate-600">
              Our AI analyzes your photos and suggests optimal grid arrangements for maximum visual impact.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border border-border bg-card p-8 hover:border-primary/50 transition-colors duration-300"
          >
            <Sparkles className="w-12 h-12 text-primary mb-4" />
            <h3 className="font-sans text-xl md:text-2xl font-semibold tracking-tight uppercase text-muted-foreground mb-3">
              Real-Time Filters
            </h3>
            <p className="font-sans text-base leading-relaxed text-slate-600">
              Preview and apply professional filters instantly. See your entire grid transform in real-time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="border border-border bg-card p-8 hover:border-primary/50 transition-colors duration-300"
          >
            <Grid3x3 className="w-12 h-12 text-primary mb-4" />
            <h3 className="font-sans text-xl md:text-2xl font-semibold tracking-tight uppercase text-muted-foreground mb-3">
              Grid Visualizer
            </h3>
            <p className="font-sans text-base leading-relaxed text-slate-600">
              See exactly how your profile will look. Drag, drop, and rearrange with ease.
            </p>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-border/50 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="font-mono text-xs tracking-widest uppercase text-slate-500">
            © 2025 ProfileStyler. Built with Emergent.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;