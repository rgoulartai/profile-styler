import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Instagram, LogOut, Wand2, Sparkles, ArrowLeft, Zap, Grid3x3 } from 'lucide-react';
import PatternLibrary from '@/components/PatternLibrary';
import { samplePhotos, textSuggestions, realGridExamples } from '@/data/samplePhotos';
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
  const [showRealExample, setShowRealExample] = useState(false);
  const [gridPhotos, setGridPhotos] = useState([]);
  const [aiSuggesting, setAiSuggesting] = useState(false);

  useEffect(() => {
    setGridPhotos(samplePhotos);
  }, []);

  const handlePatternSelect = (pattern) => {
    setSelectedPattern(pattern);
    toast.success(`${pattern.name} pattern applied!`);
    applyPattern(pattern);
  };

  const applyPattern = (pattern) => {
    let updatedGrid = [...samplePhotos];

    if (pattern.id === 'alternating') {
      // Text → Photo → Text → Photo
      updatedGrid = samplePhotos.map((photo, idx) => ({
        ...photo,
        showText: idx % 2 === 0,
        text: textSuggestions.business[Math.floor(idx / 2) % 5]
      }));
    } else if (pattern.id === 'checkerboard') {
      // Checkerboard pattern (alternating in 2D)
      updatedGrid = samplePhotos.map((photo, idx) => {
        const row = Math.floor(idx / 3);
        const col = idx % 3;
        return {
          ...photo,
          showText: (row + col) % 2 === 0,
          text: textSuggestions.business[Math.floor(idx / 2) % 5]
        };
      });
    } else if (pattern.id === 'timeline') {
      // Row-based timeline (all photos, no text)
      updatedGrid = [...samplePhotos];
    } else if (pattern.id === 'product_results') {
      // Product → Results alternating
      updatedGrid = samplePhotos.map((photo, idx) => ({
        ...photo,
        isResult: idx % 2 === 1
      }));
    } else if (pattern.id === 'rainbow_flow') {
      // Sort by dominant color for rainbow effect
      updatedGrid = [...samplePhotos].sort((a, b) => a.dominantColor.localeCompare(b.dominantColor));
    } else if (pattern.id === 'color_gradient') {
      // Subtle color gradient (sort by color but maintain variety)
      updatedGrid = [...samplePhotos].sort((a, b) => {
        const typeOrder = { business: 1, fashion: 2, travel: 3 };
        return (typeOrder[a.type] || 0) - (typeOrder[b.type] || 0);
      });
    } else if (pattern.id === 'background_unity') {
      // Mix of photos and text with consistent theme
      updatedGrid = samplePhotos.map((photo, idx) => ({
        ...photo,
        showText: idx % 3 === 1,
        text: textSuggestions.food[Math.floor(idx / 3) % 5]
      }));
    } else if (pattern.id === 'moody_motivation') {
      // Dark photos with motivational text
      updatedGrid = samplePhotos.map((photo, idx) => ({
        ...photo,
        showText: [1, 3, 5, 7].includes(idx),
        text: textSuggestions.fitness[Math.floor(idx / 2) % 5]
      }));
    }

    setGridPhotos(updatedGrid.slice(0, 9));
  };

  const handleAISuggestion = () => {
    setAiSuggesting(true);
    
    setTimeout(() => {
      const suggestedPattern = {
        id: 'alternating',
        name: 'Alternating',
        description: 'Text and photo rotation',
        bestFor: 'Business, Motivational'
      };
      
      setSelectedPattern(suggestedPattern);
      setSelectedFilter(filters[1]);
      applyPattern(suggestedPattern);
      
      setAiSuggesting(false);
      toast.success('AI Suggestion Applied! Alternating pattern with Vintage Warmth filter');
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
        <div className="grid lg:grid-cols-2 gap-8 h-[calc(100vh-180px)]">
          {/* LEFT - Fixed Grid Preview */}
          <div className="flex flex-col">
            <div className="mb-6">
              <h2 className="font-serif text-4xl font-medium tracking-tight mb-2">Your Grid</h2>
              <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
                {selectedPattern ? selectedPattern.name : 'Select a pattern from the right'}
              </p>
              {selectedFilter && (
                <p className="font-sans text-sm text-muted-foreground mt-1">
                  Filter: {selectedFilter.name}
                </p>
              )}
            </div>

            <Card className="border border-border bg-card p-8 flex-1 flex items-center justify-center">
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

          {/* RIGHT - Scrollable Pattern & Filter Selection */}
          <div className="overflow-y-auto pr-2">
            <div className="space-y-6 pb-6">
              {/* Patterns Section */}
              <div>
                <h3 className="font-serif text-3xl font-medium tracking-tight mb-1">Layout Patterns</h3>
                <p className="font-sans text-sm text-muted-foreground mb-6">
                  Choose a pattern that fits your content style
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      id: 'alternating',
                      name: 'Alternating',
                      description: 'Text/photo rotation',
                      bestFor: 'Business',
                      preview: ['T', 'P', 'T', 'P', 'T', 'P', 'T', 'P', 'T']
                    },
                    {
                      id: 'checkerboard',
                      name: 'Checkerboard',
                      description: '2D pattern',
                      bestFor: 'Variety',
                      preview: ['P', 'T', 'P', 'T', 'P', 'T', 'P', 'T', 'P']
                    },
                    {
                      id: 'timeline',
                      name: 'Timeline',
                      description: 'Theme per row',
                      bestFor: 'Travel',
                      preview: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P']
                    },
                    {
                      id: 'product_results',
                      name: 'Product → Results',
                      description: 'Show & demo',
                      bestFor: 'Beauty',
                      preview: ['P', 'R', 'P', 'R', 'P', 'R', 'P', 'R', 'P']
                    },
                    {
                      id: 'rainbow_flow',
                      name: 'Rainbow Flow',
                      description: 'Color rows',
                      bestFor: 'Fashion',
                      preview: ['B', 'B', 'B', 'G', 'G', 'G', 'Y', 'Y', 'Y']
                    },
                    {
                      id: 'color_gradient',
                      name: 'Color Gradient',
                      description: 'Subtle transition',
                      bestFor: 'Lifestyle',
                      preview: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P']
                    },
                    {
                      id: 'background_unity',
                      name: 'Background Unity',
                      description: 'Consistent BG',
                      bestFor: 'Food',
                      preview: ['P', 'T', 'P', 'T', 'P', 'T', 'P', 'T', 'P']
                    },
                    {
                      id: 'moody_motivation',
                      name: 'Moody Dark',
                      description: 'Dramatic style',
                      bestFor: 'Fitness',
                      preview: ['D', 'T', 'D', 'T', 'D', 'T', 'D', 'T', 'D']
                    }
                  ].map((pattern) => (
                    <Card
                      key={pattern.id}
                      data-testid={`pattern-${pattern.id}`}
                      onClick={() => handlePatternSelect(pattern)}
                      className={`relative cursor-pointer border p-3 transition-all hover:border-primary/50 ${
                        selectedPattern?.id === pattern.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-card'
                      }`}
                    >
                      {selectedPattern?.id === pattern.id && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-3 gap-0.5 mb-2">
                        {pattern.preview.map((cell, idx) => (
                          <div
                            key={idx}
                            className={`aspect-square text-[6px] flex items-center justify-center font-mono ${
                              cell === 'T' ? 'bg-muted' :
                              cell === 'P' ? 'bg-primary/20' :
                              cell === 'R' ? 'bg-green-500/20' :
                              cell === 'B' ? 'bg-blue-500/40' :
                              cell === 'G' ? 'bg-green-500/40' :
                              cell === 'Y' ? 'bg-yellow-500/40' :
                              cell === 'D' ? 'bg-slate-800' : 'bg-slate-500/20'
                            }`}
                          />
                        ))}
                      </div>
                      
                      <h4 className="font-sans text-sm font-semibold mb-0.5">{pattern.name}</h4>
                      <p className="font-sans text-xs text-muted-foreground mb-1">{pattern.description}</p>
                      <p className="font-mono text-[9px] text-primary uppercase tracking-wide">
                        {pattern.bestFor}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Filters Section */}
              <div>
                <h3 className="font-serif text-3xl font-medium tracking-tight mb-1">Filters</h3>
                <p className="font-sans text-sm text-muted-foreground mb-6">
                  Apply professional filters to your photos
                </p>

                <div className="grid grid-cols-2 gap-2">
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

              {/* Demo Info */}
              <Card className="border border-primary/50 bg-primary/5 p-6">
                <h3 className="font-sans text-lg font-semibold mb-2 text-primary">Demo Mode</h3>
                <p className="font-sans text-sm text-foreground/80 mb-4">
                  You're viewing sample photos. Connect Instagram to use your actual content!
                </p>
                <Button
                  className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 font-medium uppercase tracking-wide text-sm"
                  onClick={() => toast.info('Instagram connection coming soon!')}
                >
                  Connect Instagram
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutStudioDemo;
