import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Instagram, Grid3x3, Sparkles, Wand2 } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentLayout, setCurrentLayout] = useState(0);

  const layouts = [
    {
      name: "Business & Professional",
      audience: "Entrepreneurs & Coaches",
      filter: "brightness(105%) contrast(110%) saturate(105%)",
      items: [
        { type: 'text', content: 'Your brand tells a story before you say a word' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1600610429853-81d08d9ae4b1?w=400&h=400&fit=crop' },
        { type: 'text', content: 'Consistency is the foundation of recognition' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1644566622057-baae2f78f652?w=400&h=400&fit=crop' },
        { type: 'text', content: 'Create. Curate. Captivate.' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1760278041834-dc1021506a0b?w=400&h=400&fit=crop' },
        { type: 'text', content: 'Strategic content builds authority' },
        { type: 'image', url: 'https://images.pexels.com/photos/29152435/pexels-photo-29152435.jpeg?w=400&h=400&fit=crop' },
        { type: 'text', content: 'Design with intention, post with purpose' }
      ]
    },
    {
      name: "Beauty & Cosmetics",
      audience: "Makeup Artists & Beauty Brands",
      filter: "brightness(110%) saturate(115%) contrast(105%)",
      items: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1595051665600-afd01ea7c446?w=400&h=400&fit=crop' },
        { type: 'text', content: 'Glow Up Your Feed' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1606158582120-b4fc196bffad?w=400&h=400&fit=crop' },
        { type: 'text', content: 'Beauty is an art, your grid is the canvas' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1688955665338-fb430ff8436d?w=400&h=400&fit=crop' },
        { type: 'text', content: 'Curate your aesthetic' },
        { type: 'image', url: 'https://images.pexels.com/photos/2536009/pexels-photo-2536009.jpeg?w=400&h=400&fit=crop' },
        { type: 'text', content: 'Every post is a statement' },
        { type: 'image', url: 'https://images.pexels.com/photos/13534782/pexels-photo-13534782.jpeg?w=400&h=400&fit=crop' }
      ]
    },
    {
      name: "Travel & Adventure",
      audience: "Travel Bloggers & Wanderlusters",
      filter: "brightness(110%) saturate(120%) contrast(108%)",
      items: [
        { type: 'text', content: 'Wanderlust captured in every frame' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1723065219121-3bfaf2170563?w=400&h=400&fit=crop' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1764451273176-257d1ef57052?w=400&h=400&fit=crop' },
        { type: 'text', content: 'Explore. Dream. Discover.' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1763845982603-289707ee22e6?w=400&h=400&fit=crop' },
        { type: 'text', content: 'Your passport to a stunning feed' },
        { type: 'image', url: 'https://images.pexels.com/photos/16427719/pexels-photo-16427719.jpeg?w=400&h=400&fit=crop' },
        { type: 'text', content: 'Adventure awaits in every post' },
        { type: 'image', url: 'https://images.pexels.com/photos/28743772/pexels-photo-28743772.jpeg?w=400&h=400&fit=crop' }
      ]
    },
    {
      name: "Fashion & Style",
      audience: "Fashion Influencers & Stylists",
      filter: "contrast(115%) saturate(110%) brightness(102%)",
      items: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1739773375456-79be292cedb1?w=400&h=400&fit=crop' },
        { type: 'text', content: 'Style is a way to say who you are' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1739773375403-36a4ba177f73?w=400&h=400&fit=crop' },
        { type: 'text', content: 'Fashion fades, style is eternal' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1739773375426-880a10bea9a9?w=400&h=400&fit=crop' },
        { type: 'text', content: 'Dress your feed in confidence' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop' },
        { type: 'text', content: 'Curate your signature look' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop' }
      ]
    },
    {
      name: "Health & Fitness",
      audience: "Fitness Coaches & Wellness Brands",
      filter: "contrast(112%) saturate(105%) brightness(108%)",
      items: [
        { type: 'text', content: 'Strong feed, stronger you' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1666979290238-2d862b573345?w=400&h=400&fit=crop' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1701457916764-7cc7c990b37a?w=400&h=400&fit=crop' },
        { type: 'text', content: 'Transform your profile, inspire your audience' },
        { type: 'image', url: 'https://images.pexels.com/photos/3888343/pexels-photo-3888343.jpeg?w=400&h=400&fit=crop' },
        { type: 'text', content: 'Fitness is a lifestyle' },
        { type: 'image', url: 'https://images.pexels.com/photos/4162553/pexels-photo-4162553.jpeg?w=400&h=400&fit=crop' },
        { type: 'text', content: 'Consistency builds results' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1666979290090-dde24b4614bb?w=400&h=400&fit=crop' }
      ]
    },
    {
      name: "Food & Culinary",
      audience: "Food Bloggers & Restaurants",
      filter: "sepia(20%) saturate(130%) brightness(108%)",
      items: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1757358957218-67e771ec07bb?w=400&h=400&fit=crop' },
        { type: 'text', content: 'Good food, beautiful grid' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1689997122000-c94449288dd1?w=400&h=400&fit=crop' },
        { type: 'text', content: 'Plate it, post it, perfect it' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1632898657999-ae6920976661?w=400&h=400&fit=crop' },
        { type: 'text', content: 'Feed your audience visually' },
        { type: 'image', url: 'https://images.pexels.com/photos/19606040/pexels-photo-19606040.jpeg?w=400&h=400&fit=crop' },
        { type: 'text', content: 'Taste the aesthetic' },
        { type: 'image', url: 'https://images.pexels.com/photos/13485216/pexels-photo-13485216.jpeg?w=400&h=400&fit=crop' }
      ]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLayout((prev) => (prev + 1) % layouts.length);
    }, 4000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      <section className="max-w-7xl mx-auto px-6 py-16">
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
              <div className="flex items-center justify-between mb-4">
                <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
                  Layout Examples
                </p>
                <div className="flex gap-2">
                  {layouts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentLayout(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentLayout === index ? 'bg-primary w-6' : 'bg-muted-foreground/30'
                      }`}
                      aria-label={`Switch to layout ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentLayout}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="instagram-grid mx-auto">
                      {layouts[currentLayout].items.map((item, index) => (
                        <div key={index} className="instagram-grid-item border border-border overflow-hidden">
                          {item.type === 'text' ? (
                            <div className="bg-white/90 flex items-center justify-center p-4 h-full">
                              <p className="font-serif text-xs text-center leading-tight text-slate-800">
                                {item.content}
                              </p>
                            </div>
                          ) : (
                            <img 
                              src={item.url}
                              alt={`Grid ${index + 1}`}
                              className="w-full h-full object-cover"
                              style={{ filter: layouts[currentLayout].filter }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <div className="mt-4 text-center">
                <p className="font-sans text-sm text-muted-foreground mb-1">
                  {layouts[currentLayout].name}
                </p>
                <p className="font-sans text-xs text-muted-foreground">
                  Mix photos with text quotes • Professional filters applied
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
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

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-5xl font-normal tracking-tight mb-4">What You Can Create</h2>
          <p className="font-mono text-xs tracking-widest uppercase text-slate-500">Transform your Instagram profile</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="font-sans text-2xl font-semibold mb-4">Cohesive Aesthetics</h3>
            <p className="font-sans text-base leading-relaxed text-slate-600 mb-4">
              Create stunning grid layouts with consistent color palettes, typography overlays, and professional filters. 
              Mix photos with text quotes, line art, and abstract shapes for a magazine-quality feed.
            </p>
            <ul className="space-y-2 font-sans text-base text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Elegant fashion & lifestyle grids</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Text overlay posts with quotes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Minimalist line art & abstract elements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Consistent color schemes & branding</span>
              </li>
            </ul>
          </div>

          <div className="border border-border bg-card p-6">
            <div className="instagram-grid mx-auto">
              <div className="instagram-grid-item border border-border bg-white/90 flex items-center justify-center p-3">
                <p className="font-serif text-[10px] text-center leading-tight text-slate-800">Strategic content builds authority</p>
              </div>
              <div className="instagram-grid-item bg-muted">
                <img 
                  src="https://images.unsplash.com/photo-1644566622057-baae2f78f652?w=400&h=400&fit=crop"
                  alt="Example 2"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="instagram-grid-item border border-border bg-white/90 flex items-center justify-center p-3">
                <p className="font-serif text-[10px] text-center leading-tight text-slate-800">Make every post count</p>
              </div>
              <div className="instagram-grid-item bg-muted">
                <img 
                  src="https://images.unsplash.com/photo-1600610429853-81d08d9ae4b1?w=400&h=400&fit=crop"
                  alt="Example 4"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="instagram-grid-item border border-border bg-white/90 flex items-center justify-center p-3">
                <p className="font-serif text-xs text-center font-medium text-slate-800">Your feed, your story</p>
              </div>
              <div className="instagram-grid-item bg-muted">
                <img 
                  src="https://images.unsplash.com/photo-1760278041834-dc1021506a0b?w=400&h=400&fit=crop"
                  alt="Example 6"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="instagram-grid-item border border-border bg-white/90 flex items-center justify-center p-3">
                <p className="font-serif text-[10px] text-center leading-tight text-slate-800">Quality over quantity, always</p>
              </div>
              <div className="instagram-grid-item bg-muted">
                <img 
                  src="https://images.pexels.com/photos/19238352/pexels-photo-19238352.jpeg?w=400&h=400&fit=crop"
                  alt="Example 8"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="instagram-grid-item border border-border bg-white/90 flex items-center justify-center p-3">
                <p className="font-serif text-[10px] text-center leading-tight text-slate-800">Elevate your visual presence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50 mt-12">
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