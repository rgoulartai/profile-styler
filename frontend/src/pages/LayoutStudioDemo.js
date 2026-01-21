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

const Layout Studio = ({ user, onLogout }) => {
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
  };\n\n  return (\n    <div className=\"min-h-screen bg-[#0A0A0A] dark text-foreground\">\n      <nav className=\"border-b border-border bg-card/50 backdrop-blur-sm\">\n        <div className=\"max-w-7xl mx-auto px-6 py-4 flex items-center justify-between\">\n          <div className=\"flex items-center gap-4\">\n            <Button\n              data-testid=\"back-to-dashboard-btn\"\n              onClick={() => navigate('/dashboard')}\n              variant=\"ghost\"\n              className=\"rounded-none hover:bg-accent hover:text-accent-foreground h-10 px-4\"\n            >\n              <ArrowLeft className=\"w-4 h-4\" />\n            </Button>\n            <div className=\"flex items-center gap-2\">\n              <Instagram className=\"w-6 h-6 text-primary\" />\n              <span className=\"font-serif text-2xl font-medium tracking-tight\">Layout Studio</span>\n            </div>\n          </div>\n          <div className=\"flex items-center gap-3\">\n            <Button\n              data-testid=\"ai-magic-btn\"\n              onClick={handleAISuggestion}\n              disabled={aiSuggesting}\n              className=\"rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 font-medium uppercase tracking-wide text-sm transition-all\"\n            >\n              {aiSuggesting ? (\n                <>\n                  <Sparkles className=\"w-4 h-4 mr-2 animate-spin\" />\n                  AI Analyzing...\n                </>\n              ) : (\n                <>\n                  <Zap className=\"w-4 h-4 mr-2\" />\n                  AI Magic\n                </>\n              )}\n            </Button>\n            <Button\n              data-testid=\"studio-logout-btn\"\n              onClick={onLogout}\n              variant=\"ghost\"\n              className=\"rounded-none hover:bg-accent hover:text-accent-foreground h-10 px-4\"\n            >\n              <LogOut className=\"w-4 h-4\" />\n            </Button>\n          </div>\n        </div>\n      </nav>\n\n      <div className=\"max-w-7xl mx-auto px-6 py-8\">\n        <div className=\"grid lg:grid-cols-[350px_1fr_320px] gap-8\">\n          {/* Left Sidebar - Pattern & Filter Selection */}\n          <div className=\"space-y-6\">\n            <Card className=\"border border-border bg-card p-6\">\n              <Tabs defaultValue=\"patterns\" className=\"w-full\">\n                <TabsList className=\"w-full rounded-none bg-secondary mb-4\">\n                  <TabsTrigger value=\"patterns\" className=\"rounded-none flex-1 font-mono text-xs uppercase\">\n                    <Grid3x3 className=\"w-3 h-3 mr-1\" />\n                    Patterns\n                  </TabsTrigger>\n                  <TabsTrigger value=\"filters\" className=\"rounded-none flex-1 font-mono text-xs uppercase\">\n                    <Sparkles className=\"w-3 h-3 mr-1\" />\n                    Filters\n                  </TabsTrigger>\n                </TabsList>\n\n                <TabsContent value=\"patterns\" className=\"mt-0\">\n                  <PatternLibrary \n                    selectedPattern={selectedPattern}\n                    onSelectPattern={handlePatternSelect}\n                  />\n                </TabsContent>\n\n                <TabsContent value=\"filters\" className=\"mt-0\">\n                  <div className=\"space-y-4\">\n                    <div>\n                      <h3 className=\"font-sans text-lg font-semibold mb-2\">Filters</h3>\n                      <p className=\"font-sans text-sm text-muted-foreground mb-4\">\n                        Choose a filter to apply to your grid\n                      </p>\n                    </div>\n\n                    <div className=\"grid grid-cols-1 gap-2\">\n                      {filters.map((filter) => (\n                        <Card\n                          key={filter.id}\n                          data-testid={`filter-${filter.id}`}\n                          onClick={() => {\n                            setSelectedFilter(filter);\n                            toast.success(`${filter.name} applied!`);\n                          }}\n                          className={`border p-3 cursor-pointer transition-all ${\n                            selectedFilter?.id === filter.id\n                              ? 'border-primary bg-primary/10'\n                              : 'border-border bg-card hover:border-primary/50'\n                          }`}\n                        >\n                          <h4 className=\"font-sans text-sm font-semibold\">{filter.name}</h4>\n                        </Card>\n                      ))}\n                    </div>\n                  </div>\n                </TabsContent>\n              </Tabs>\n            </Card>\n          </div>\n\n          {/* Center - Grid Preview */}\n          <div>\n            <div className=\"mb-6\">\n              <h2 className=\"font-serif text-4xl font-medium tracking-tight mb-2\">Grid Preview</h2>\n              <p className=\"font-mono text-xs tracking-widest uppercase text-muted-foreground\">\n                {selectedPattern ? selectedPattern.name : 'Select a pattern to begin'}\n              </p>\n            </div>\n\n            <Card className=\"border border-border bg-card p-8\">\n              <AnimatePresence mode=\"wait\">\n                <motion.div\n                  key={selectedPattern?.id || 'default'}\n                  initial={{ opacity: 0, scale: 0.95 }}\n                  animate={{ opacity: 1, scale: 1 }}\n                  exit={{ opacity: 0, scale: 0.95 }}\n                  transition={{ duration: 0.3 }}\n                  className=\"instagram-grid mx-auto\"\n                  data-testid=\"grid-preview\"\n                >\n                  {gridPhotos.slice(0, 9).map((photo, index) => (\n                    <motion.div\n                      key={photo.id}\n                      initial={{ opacity: 0, y: 20 }}\n                      animate={{ opacity: 1, y: 0 }}\n                      transition={{ delay: index * 0.05 }}\n                      className=\"instagram-grid-item border border-border bg-card overflow-hidden relative group\"\n                      data-testid={`grid-cell-${index}`}\n                    >\n                      {photo.showText ? (\n                        <div className=\"bg-white/95 flex items-center justify-center p-4 h-full\">\n                          <p className=\"font-serif text-xs text-center leading-tight text-slate-800\">\n                            {photo.text}\n                          </p>\n                        </div>\n                      ) : (\n                        <>\n                          <img\n                            src={photo.url}\n                            alt={`Grid ${index + 1}`}\n                            className=\"w-full h-full object-cover filter-preview\"\n                            style={{ filter: selectedFilter?.css || 'none' }}\n                          />\n                          {photo.isResult && (\n                            <div className=\"absolute top-2 right-2 bg-green-500 text-white text-[8px] px-2 py-0.5 font-mono uppercase\">\n                              Result\n                            </div>\n                          )}\n                        </>\n                      )}\n                      \n                      <div className=\"absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center\">\n                        <button className=\"text-white text-xs font-mono uppercase\">\n                          Edit\n                        </button>\n                      </div>\n                    </motion.div>\n                  ))}\n                </motion.div>\n              </AnimatePresence>\n            </Card>\n\n            <div className=\"mt-6 flex gap-3\">\n              <Button\n                className=\"flex-1 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-medium uppercase tracking-wide text-sm\"\n                onClick={() => toast.success('Layout saved!')}\n              >\n                Save Layout\n              </Button>\n              <Button\n                variant=\"outline\"\n                className=\"flex-1 rounded-none border border-input bg-background hover:bg-accent h-12 font-medium uppercase tracking-wide text-sm\"\n                onClick={() => toast.info('Export feature coming soon!')}\n              >\n                Export\n              </Button>\n            </div>\n          </div>\n\n          {/* Right Sidebar - Info & Actions */}\n          <div className=\"space-y-6\">\n            <Card className=\"border border-border bg-card p-6\">\n              <h3 className=\"font-sans text-lg font-semibold mb-3 flex items-center gap-2\">\n                <Wand2 className=\"w-5 h-5 text-primary\" />\n                Quick Tips\n              </h3>\n              <ul className=\"space-y-3 font-sans text-sm text-muted-foreground\">\n                <li className=\"flex items-start gap-2\">\n                  <span className=\"text-primary\">•</span>\n                  <span>Click any pattern to instantly apply it to your grid</span>\n                </li>\n                <li className=\"flex items-start gap-2\">\n                  <span className=\"text-primary\">•</span>\n                  <span>Try different filters to match your brand aesthetic</span>\n                </li>\n                <li className=\"flex items-start gap-2\">\n                  <span className=\"text-primary\">•</span>\n                  <span>Use \"AI Magic\" for instant professional layouts</span>\n                </li>\n                <li className=\"flex items-start gap-2\">\n                  <span className=\"text-primary\">•</span>\n                  <span>Hover over grid cells to edit individual items</span>\n                </li>\n              </ul>\n            </Card>\n\n            <Card className=\"border border-primary/50 bg-primary/5 p-6\">\n              <h3 className=\"font-sans text-lg font-semibold mb-2 text-primary\">Demo Mode</h3>\n              <p className=\"font-sans text-sm text-foreground/80 mb-4\">\n                You're viewing demo sample photos. Connect your Instagram to see your actual content!\n              </p>\n              <Button\n                className=\"w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 font-medium uppercase tracking-wide text-sm\"\n                onClick={() => toast.info('Instagram connection coming soon!')}\n              >\n                Connect Instagram\n              </Button>\n            </Card>\n\n            {selectedPattern && (\n              <Card className=\"border border-border bg-card p-6\">\n                <h3 className=\"font-sans text-lg font-semibold mb-3\">Current Selection</h3>\n                <div className=\"space-y-2 font-sans text-sm\">\n                  <div>\n                    <span className=\"text-muted-foreground\">Pattern:</span>\n                    <span className=\"ml-2 font-semibold\">{selectedPattern.name}</span>\n                  </div>\n                  <div>\n                    <span className=\"text-muted-foreground\">Filter:</span>\n                    <span className=\"ml-2 font-semibold\">{selectedFilter.name}</span>\n                  </div>\n                  <div>\n                    <span className=\"text-muted-foreground\">Best For:</span>\n                    <span className=\"ml-2 font-semibold\">{selectedPattern.bestFor}</span>\n                  </div>\n                </div>\n              </Card>\n            )}\n          </div>\n        </div>\n      </div>\n    </div>\n  );\n};\n\nexport default LayoutStudio;