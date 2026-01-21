import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Instagram, LogOut, Wand2, Sparkles, ArrowLeft, Zap, Grid3x3 } from 'lucide-react';
import PatternLibrary from '@/components/PatternLibrary';
import { samplePhotos, textSuggestions } from '@/data/samplePhotos';
import { toast } from 'sonner';

const filters = [
  { id: 'modern', name: 'Modern Bright', css: 'brightness(105%) contrast(110%) saturate(105%)' },
  { id: 'vintage', name: 'Vintage Warmth', css: 'sepia(30%) saturate(120%) brightness(105%)' },
  { id: 'moody', name: 'Moody Dark', css: 'brightness(85%) contrast(120%) saturate(90%)' },
  { id: 'bright', name: 'Bright & Airy', css: 'brightness(115%) saturate(110%) contrast(95%)' },
  { id: 'polaroid', name: 'Polaroid Retro', css: 'sepia(20%) saturate(100%) brightness(102%)' },
  { id: 'fashion', name: 'High Fashion', css: 'contrast(115%) saturate(110%) brightness(102%)' },
  { id: 'minimal', name: 'Clean Minimal', css: 'saturate(90%) brightness(108%) contrast(105%)' },
  { id: 'warm', name: 'Warm Glow', css: 'sepia(15%) saturate(120%) brightness(110%)' }
];

const LayoutStudioDemo = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [gridPhotos, setGridPhotos] = useState([]);
  const [aiSuggesting, setAiSuggesting] = useState(false);

  useEffect(() => {
    // Initialize with sample photos
    setGridPhotos(samplePhotos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePatternSelect = (pattern) => {
    setSelectedPattern(pattern);
    toast.success(`${pattern.name} pattern applied!`);
    
    // Apply pattern logic
    applyPattern(pattern);
  };

  const applyPattern = (pattern) => {
    // This is where pattern application logic would go
    // For demo, we just update the grid with appropriate items
    let updatedGrid = [...samplePhotos];

    if (pattern.id === 'alternating') {
      updatedGrid = samplePhotos.map((photo, idx) => ({
        ...photo,
        showText: idx % 2 === 0,
        text: textSuggestions.business[Math.floor(idx / 2) % 5]
      }));
    } else if (pattern.id === 'rainbow_flow') {
      // Sort by color for rainbow effect
      updatedGrid = [...samplePhotos].sort((a, b) => a.dominantColor.localeCompare(b.dominantColor));
    } else if (pattern.id === 'product_results') {
      updatedGrid = samplePhotos.map((photo, idx) => ({
        ...photo,
        isResult: idx % 2 === 1
      }));
    }

    setGridPhotos(updatedGrid.slice(0, 9));
  };

  const handleAISuggestion = () => {
    setAiSuggesting(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const suggestedPattern = {
        id: 'alternating',
        name: 'Alternating',
        description: 'Text and photo rotation',
        bestFor: 'Business, Motivational'
      };
      
      setSelectedPattern(suggestedPattern);
      setSelectedFilter(filters[1]); // Vintage
      applyPattern(suggestedPattern);
      
      setAiSuggesting(false);
      toast.success(
        <div>
          <p className="font-semibold">AI Suggestion Applied!</p>
          <p className="text-sm">Alternating pattern with Vintage Warmth filter</p>
        </div>
      );
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] dark text-foreground">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              data-testid="back-to-dashboard-btn"
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              className="rounded-none hover:bg-accent hover:text-accent-foreground h-10 px-4"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Instagram className="w-6 h-6 text-primary" />
              <span className="font-serif text-2xl font-medium tracking-tight">Layout Studio</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              data-testid="ai-magic-btn"
              onClick={handleAISuggestion}
              disabled={aiSuggesting}
              className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 font-medium uppercase tracking-wide text-sm transition-all"
            >
              {aiSuggesting ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  AI Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  AI Magic
                </>
              )}
            </Button>
            <Button
              data-testid="studio-logout-btn"
              onClick={onLogout}
              variant="ghost"
              className="rounded-none hover:bg-accent hover:text-accent-foreground h-10 px-4"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[350px_1fr_320px] gap-8">
          {/* Left Sidebar - Pattern & Filter Selection */}
          <div className="space-y-6">
            <Card className="border border-border bg-card p-6">
              <Tabs defaultValue="patterns" className="w-full">
                <TabsList className="w-full rounded-none bg-secondary mb-4">
                  <TabsTrigger value="patterns" className="rounded-none flex-1 font-mono text-xs uppercase">
                    <Grid3x3 className="w-3 h-3 mr-1" />
                    Patterns
                  </TabsTrigger>
                  <TabsTrigger value="filters" className="rounded-none flex-1 font-mono text-xs uppercase">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Filters
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="patterns" className="mt-0">
                  <PatternLibrary 
                    selectedPattern={selectedPattern}
                    onSelectPattern={handlePatternSelect}
                  />
                </TabsContent>

                <TabsContent value="filters" className="mt-0">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-sans text-lg font-semibold mb-2">Filters</h3>
                      <p className="font-sans text-sm text-muted-foreground mb-4">
                        Choose a filter to apply to your grid
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {filters.map((filter) => (
                        <Card
                          key={filter.id}
                          data-testid={`filter-${filter.id}`}
                          onClick={() => {
                            setSelectedFilter(filter);
                            toast.success(`${filter.name} applied!`);
                          }}
                          className={`border p-3 cursor-pointer transition-all ${
                            selectedFilter?.id === filter.id
                              ? 'border-primary bg-primary/10'
                              : 'border-border bg-card hover:border-primary/50'
                          }`}
                        >
                          <h4 className="font-sans text-sm font-semibold">{filter.name}</h4>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Center - Grid Preview */}
          <div>
            <div className="mb-6">
              <h2 className="font-serif text-4xl font-medium tracking-tight mb-2">Grid Preview</h2>
              <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
                {selectedPattern ? selectedPattern.name : 'Select a pattern to begin'}
              </p>
            </div>

            <Card className="border border-border bg-card p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedPattern?.id || 'default'}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="instagram-grid mx-auto"
                  data-testid="grid-preview"
                >
                  {gridPhotos.slice(0, 9).map((photo, index) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="instagram-grid-item border border-border bg-card overflow-hidden relative group"
                      data-testid={`grid-cell-${index}`}
                    >
                      {photo.showText ? (
                        <div className="bg-white/95 flex items-center justify-center p-4 h-full">
                          <p className="font-serif text-xs text-center leading-tight text-slate-800">
                            {photo.text}
                          </p>
                        </div>
                      ) : (
                        <>
                          <img
                            src={photo.url}
                            alt={`Grid ${index + 1}`}
                            className="w-full h-full object-cover filter-preview"
                            style={{ filter: selectedFilter?.css || 'none' }}
                          />
                          {photo.isResult && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white text-[8px] px-2 py-0.5 font-mono uppercase">
                              Result
                            </div>
                          )}
                        </>
                      )}
                      
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="text-white text-xs font-mono uppercase">
                          Edit
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </Card>

            <div className="mt-6 flex gap-3">
              <Button
                className="flex-1 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-medium uppercase tracking-wide text-sm"
                onClick={() => toast.success('Layout saved!')}
              >
                Save Layout
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-none border border-input bg-background hover:bg-accent h-12 font-medium uppercase tracking-wide text-sm"
                onClick={() => toast.info('Export feature coming soon!')}
              >
                Export
              </Button>
            </div>
          </div>

          {/* Right Sidebar - Info & Actions */}
          <div className="space-y-6">
            <Card className="border border-border bg-card p-6">
              <h3 className="font-sans text-lg font-semibold mb-3 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-primary" />
                Quick Tips
              </h3>
              <ul className="space-y-3 font-sans text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Click any pattern to instantly apply it to your grid</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Try different filters to match your brand aesthetic</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Use "AI Magic" for instant professional layouts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Hover over grid cells to edit individual items</span>
                </li>
              </ul>
            </Card>

            <Card className="border border-primary/50 bg-primary/5 p-6">
              <h3 className="font-sans text-lg font-semibold mb-2 text-primary">Demo Mode</h3>
              <p className="font-sans text-sm text-foreground/80 mb-4">
                You're viewing demo sample photos. Connect your Instagram to see your actual content!
              </p>
              <Button
                className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 font-medium uppercase tracking-wide text-sm"
                onClick={() => toast.info('Instagram connection coming soon!')}
              >
                Connect Instagram
              </Button>
            </Card>

            {selectedPattern && (
              <Card className="border border-border bg-card p-6">
                <h3 className="font-sans text-lg font-semibold mb-3">Current Selection</h3>
                <div className="space-y-2 font-sans text-sm">
                  <div>
                    <span className="text-muted-foreground">Pattern:</span>
                    <span className="ml-2 font-semibold">{selectedPattern.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Filter:</span>
                    <span className="ml-2 font-semibold">{selectedFilter.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Best For:</span>
                    <span className="ml-2 font-semibold">{selectedPattern.bestFor}</span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutStudioDemo;