import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';
import { Instagram } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await axios.post(`${API}${endpoint}`, payload);
      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
      onLogin(response.data);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F0E9] grain-texture flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Instagram className="w-8 h-8 text-primary" />
            <span className="font-serif text-3xl font-medium tracking-tight">ProfileStyler</span>
          </div>
          <p className="font-mono text-xs tracking-widest uppercase text-slate-500">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </p>
        </div>

        <Card className="border border-border bg-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div data-testid="register-name-field">
                <Label htmlFor="name" className="font-mono text-xs tracking-widest uppercase">Name</Label>
                <Input
                  id="name"
                  data-testid="register-name-input"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-none border-input bg-transparent focus:ring-1 focus:ring-primary mt-2"
                  required={!isLogin}
                />
              </div>
            )}

            <div data-testid="auth-email-field">
              <Label htmlFor="email" className="font-mono text-xs tracking-widest uppercase">Email</Label>
              <Input
                id="email"
                data-testid="auth-email-input"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="rounded-none border-input bg-transparent focus:ring-1 focus:ring-primary mt-2"
                required
              />
            </div>

            <div data-testid="auth-password-field">
              <Label htmlFor="password" className="font-mono text-xs tracking-widest uppercase">Password</Label>
              <Input
                id="password"
                data-testid="auth-password-input"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="rounded-none border-input bg-transparent focus:ring-1 focus:ring-primary mt-2"
                required
              />
            </div>

            <Button
              data-testid="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-medium uppercase tracking-wide text-sm transition-all active:scale-95"
            >
              {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              data-testid="auth-toggle-btn"
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-sans text-sm text-slate-600 hover:text-primary transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthPage;