import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Instagram, LogOut, Upload, Wand2, Grid3x3, Image as ImageIcon, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [layouts, setLayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const [photosRes, layoutsRes] = await Promise.all([
        axios.get(`${API}/photos/${user.id}`),
        axios.get(`${API}/layouts/${user.id}`)
      ]);
      setPhotos(photosRes.data);
      setLayouts(layoutsRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('user_id', user.id);
        formData.append('image', file);
        await axios.post(`${API}/photos`, formData);
      }
      toast.success(`${files.length} photo(s) uploaded successfully!`);
      fetchData();
    } catch (error) {
      toast.error('Failed to upload photos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      await axios.delete(`${API}/photos/${photoId}`);
      toast.success('Photo deleted successfully!');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete photo');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] dark text-foreground">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Instagram className="w-6 h-6 text-primary" />
            <span className="font-serif text-2xl font-medium tracking-tight">ProfileStyler</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground">Hi, {user.name}</span>
            <Button
              data-testid="logout-btn"
              onClick={onLogout}
              variant="ghost"
              className="rounded-none hover:bg-accent hover:text-accent-foreground h-10 px-4 font-medium uppercase tracking-wide text-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-serif text-5xl md:text-7xl font-medium tracking-tight leading-[1.1] mb-4">
            Dashboard
          </h1>
          <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-12">
            Manage your Instagram profile
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card data-testid="photos-stats-card" className="border border-border bg-card p-6">
              <ImageIcon className="w-8 h-8 text-primary mb-3" />
              <div className="font-serif text-4xl font-medium mb-1">{photos.length}</div>
              <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">Photos</p>
            </Card>

            <Card data-testid="layouts-stats-card" className="border border-border bg-card p-6">
              <Grid3x3 className="w-8 h-8 text-primary mb-3" />
              <div className="font-serif text-4xl font-medium mb-1">{layouts.length}</div>
              <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">Layouts</p>
            </Card>

            <Card data-testid="approved-layouts-card" className="border border-border bg-card p-6">
              <Wand2 className="w-8 h-8 text-primary mb-3" />
              <div className="font-serif text-4xl font-medium mb-1">{layouts.filter(l => l.approved).length}</div>
              <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">Approved</p>
            </Card>
          </div>

          <div className="flex gap-4 mb-12">
            <label htmlFor="photo-upload">
              <Button
                data-testid="upload-photos-btn"
                type="button"
                onClick={() => document.getElementById('photo-upload').click()}
                className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 font-medium uppercase tracking-wide text-sm transition-all active:scale-95"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photos
              </Button>
              <input
                id="photo-upload"
                data-testid="photo-upload-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <Button
              data-testid="go-to-studio-demo-btn"
              onClick={() => navigate('/studio-demo')}
              className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 font-medium uppercase tracking-wide text-sm transition-all active:scale-95"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Try Pattern Demo
            </Button>

            <Button
              data-testid="go-to-studio-btn"
              onClick={() => navigate('/studio')}
              disabled={photos.length < 1}
              className="rounded-none border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 px-8 font-medium uppercase tracking-wide text-sm"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Your Photos Studio
            </Button>
          </div>

          {loading ? (
            <div data-testid="loading-indicator" className="text-center py-12">
              <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">Loading...</p>
            </div>
          ) : photos.length > 0 ? (
            <div>
              <div data-testid="current-instagram-grid" className="mb-12">
                <h2 className="font-serif text-3xl md:text-5xl font-normal tracking-tight mb-6">Current Instagram Layout</h2>
                <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-6">Preview of your profile grid</p>
                <div className="instagram-grid mx-auto">
                  {photos.slice(0, 9).map((photo, index) => (
                    <motion.div
                      key={photo.id}
                      data-testid={`instagram-preview-${index}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="instagram-grid-item border border-border bg-card overflow-hidden"
                    >
                      <img
                        src={`data:image/jpeg;base64,${photo.image_data}`}
                        alt={`Grid ${index + 1}`}
                        className="w-full h-full object-cover"
                        style={{ filter: photo.filter_applied || 'none' }}
                      />
                    </motion.div>
                  ))}
                  {Array.from({ length: Math.max(0, 9 - photos.length) }).map((_, i) => (
                    <div key={`empty-${i}`} className="instagram-grid-item border border-dashed border-border bg-muted/20 flex items-center justify-center">
                      <span className="text-muted-foreground text-xs">{photos.length + i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div data-testid="photos-grid">
                <h2 className="font-serif text-3xl md:text-5xl font-normal tracking-tight mb-6">All Photos</h2>
                <p className="font-sans text-sm text-muted-foreground mb-6">Click the X button to delete any photo</p>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {photos.map((photo) => (
                    <motion.div
                      key={photo.id}
                      data-testid={`photo-item-${photo.id}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="aspect-square border border-border bg-card overflow-hidden relative group"
                    >
                      <img
                        src={`data:image/jpeg;base64,${photo.image_data}`}
                        alt="Uploaded"
                        className="w-full h-full object-cover"
                        style={{ filter: photo.filter_applied || 'none' }}
                      />
                      <button
                        data-testid={`delete-photo-${photo.id}`}
                        onClick={() => handleDeletePhoto(photo.id)}
                        title="Delete photo"
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-none w-8 h-8 flex items-center justify-center opacity-70 hover:opacity-100 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div data-testid="empty-state" className="text-center py-24 border border-dashed border-muted-foreground/20 bg-card">
              <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="font-serif text-2xl font-normal mb-2">No photos yet</p>
              <p className="font-sans text-base text-muted-foreground">Upload your first photos to get started</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;