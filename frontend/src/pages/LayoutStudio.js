import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Instagram, LogOut, Wand2, Sparkles, ArrowLeft, Check, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Mock Instagram photos to simulate current profile
const mockInstagramPhotos = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop'
];

const LayoutStudio = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [instagramPhotos, setInstagramPhotos] = useState([]);
  const [filters, setFilters] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // Simulate loading Instagram photos
    setInstagramPhotos(mockInstagramPhotos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const [photosRes, filtersRes] = await Promise.all([
        axios.get(`${API}/photos/${user.id}`),
        axios.get(`${API}/filters`)
      ]);
      setPhotos(photosRes.data);
      setFilters(filtersRes.data);
      if (filtersRes.data.length > 0) {
        setSelectedFilter(filtersRes.data[0]);
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (photos.length < 3) {
      toast.error('You need at least 3 photos to analyze');
      return;
    }

    setAnalyzing(true);
    try {
      const formData = new FormData();
      photos.slice(0, 9).forEach(photo => {
        formData.append('photo_ids', photo.id);
      });
      formData.append('user_id', user.id);

      const response = await axios.post(`${API}/layouts/analyze`, formData);
      setAiSuggestion(response.data.suggestion);
      toast.success('AI analysis complete!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApprove = async () => {
    try {
      const layout = {
        user_id: user.id,
        photo_ids: photos.slice(0, 9).map(p => p.id),
        layout_type: 'ai-suggested',
        ai_suggestion: aiSuggestion,
        approved: true
      };
      await axios.post(`${API}/layouts`, layout);
      toast.success('Layout approved and saved!');
      setAiSuggestion('');
      fetchData();
    } catch (error) {
      toast.error('Failed to save layout');
    }
  };

  const gridPhotos = photos.slice(0, 9);
  while (gridPhotos.length < 9) {
    gridPhotos.push(null);
  }

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
              <span className="font-serif text-2xl font-medium tracking-tight">Photo Studio</span>
            </div>
          </div>
          <Button
            data-testid="studio-logout-btn"
            onClick={onLogout}
            variant="ghost"
            className="rounded-none hover:bg-accent hover:text-accent-foreground h-10 px-4 font-medium uppercase tracking-wide text-sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div data-testid="studio-loading" className="text-center py-12">
            <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-serif text-3xl md:text-5xl font-normal tracking-tight mb-6">Your Current Instagram</h2>
              <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-8">
                Apply filters to transform your profile
              </p>

              <div data-testid="instagram-grid-preview" className="instagram-grid mb-8">
                {instagramPhotos.slice(0, 9).map((photoUrl, index) => (
                  <motion.div
                    key={`insta-${index}`}
                    data-testid={`grid-cell-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="instagram-grid-item border border-border bg-card overflow-hidden"
                  >
                    <img
                      src={photoUrl}
                      alt={`Instagram ${index + 1}`}
                      className="w-full h-full object-cover filter-preview"
                      style={{ filter: selectedFilter?.css_filter || 'none' }}
                    />
                  </motion.div>
                ))}
              </div>

              <Tabs defaultValue="filters" className="w-full">
                <TabsList className="w-full rounded-none bg-secondary">
                  <TabsTrigger data-testid="filters-tab" value="filters" className="rounded-none flex-1 font-mono text-xs uppercase tracking-widest">Filters</TabsTrigger>
                  <TabsTrigger data-testid="ai-tab" value="ai" className="rounded-none flex-1 font-mono text-xs uppercase tracking-widest">AI Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="filters" className="mt-6">
                  <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-4">Select a filter to preview</p>
                  <div data-testid="filters-list" className="grid grid-cols-2 gap-4">
                    {filters.map((filter) => (
                      <Card
                        key={filter.id}
                        data-testid={`filter-${filter.name.toLowerCase()}`}
                        onClick={() => setSelectedFilter(filter)}
                        className={`border p-4 cursor-pointer transition-all ${
                          selectedFilter?.id === filter.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-card hover:border-primary/50'
                        }`}
                      >
                        <h3 className="font-sans text-lg font-semibold mb-1">{filter.name}</h3>
                        <p className="font-sans text-sm text-muted-foreground">{filter.description}</p>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="ai" className="mt-6">
                  <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-4">Get AI-powered layout recommendations</p>
                  <Button
                    data-testid="analyze-layout-btn"
                    onClick={handleAnalyze}
                    disabled={analyzing || photos.length < 3}
                    className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-medium uppercase tracking-wide text-sm transition-all active:scale-95 mb-6"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    {analyzing ? 'Analyzing...' : 'Analyze with AI'}
                  </Button>

                  {aiSuggestion && (
                    <Card data-testid="ai-suggestion-card" className="border border-border bg-card p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <h3 className="font-sans text-lg font-semibold">AI Recommendation</h3>
                      </div>
                      <div className="font-sans text-base leading-relaxed text-foreground mb-6 space-y-3">
                        {aiSuggestion.split('\n').map((line, i) => (
                          line.trim() && <p key={i}>{line.replace(/[*#]/g, '')}</p>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <Button
                          data-testid="approve-layout-btn"
                          onClick={handleApprove}
                          className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 font-medium uppercase tracking-wide text-sm transition-all active:scale-95"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Approve & Save
                        </Button>
                        <Button
                          data-testid="reject-layout-btn"
                          onClick={() => setAiSuggestion('')}
                          variant="outline"
                          className="rounded-none border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6 font-medium uppercase tracking-wide text-sm"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Try Again
                        </Button>
                      </div>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="font-serif text-3xl md:text-5xl font-normal tracking-tight mb-6">Templates</h2>
              <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-8">
                Pre-defined layouts
              </p>

              <div data-testid="templates-list" className="space-y-4">
                {['Checkerboard', 'Row Pattern', 'Color Blocks', 'Diagonal Flow'].map((template) => (
                  <Card
                    key={template}
                    data-testid={`template-${template.toLowerCase().replace(' ', '-')}`}
                    className="border border-border bg-card p-6 hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <h3 className="font-sans text-xl font-semibold mb-2">{template}</h3>
                    <p className="font-sans text-sm text-muted-foreground">
                      A professional {template.toLowerCase()} layout for visual consistency.
                    </p>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LayoutStudio;