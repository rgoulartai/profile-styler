import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';

const patterns = [
  {
    id: 'alternating',
    name: 'Alternating',
    description: 'Text and photo rotation',
    bestFor: 'Business, Motivational',
    preview: ['T', 'P', 'T', 'P', 'T', 'P', 'T', 'P', 'T']
  },
  {
    id: 'checkerboard',
    name: 'Checkerboard',
    description: '2D alternating pattern',
    bestFor: 'Visual variety',
    preview: ['P', 'T', 'P', 'T', 'P', 'T', 'P', 'T', 'P']
  },
  {
    id: 'timeline',
    name: 'Timeline Story',
    description: 'Theme per row',
    bestFor: 'Travel, Narrative',
    preview: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P']
  },
  {
    id: 'product_results',
    name: 'Product → Results',
    description: 'Show & demonstrate',
    bestFor: 'Beauty, Products',
    preview: ['P', 'R', 'P', 'R', 'P', 'R', 'P', 'R', 'P']
  },
  {
    id: 'rainbow_flow',
    name: 'Rainbow Flow',
    description: 'Color gradient rows',
    bestFor: 'Fashion, Impact',
    preview: ['B', 'B', 'B', 'G', 'G', 'G', 'Y', 'Y', 'Y']
  },
  {
    id: 'color_gradient',
    name: 'Color Gradient',
    description: 'Subtle transitions',
    bestFor: 'Travel, Lifestyle',
    preview: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P']
  },
  {
    id: 'background_unity',
    name: 'Background Unity',
    description: 'Consistent backgrounds',
    bestFor: 'Food, Products',
    preview: ['P', 'T', 'P', 'T', 'P', 'T', 'P', 'T', 'P']
  },
  {
    id: 'moody_motivation',
    name: 'Moody Motivation',
    description: 'Dark & dramatic',
    bestFor: 'Fitness, Sports',
    preview: ['D', 'T', 'D', 'T', 'D', 'T', 'D', 'T', 'D']
  }
];

const PatternLibrary = ({ selectedPattern, onSelectPattern }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-sans text-lg font-semibold mb-2">Layout Patterns</h3>
        <p className="font-sans text-sm text-muted-foreground mb-4">
          Choose a pattern that fits your content style
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {patterns.map((pattern) => (
          <Card
            key={pattern.id}
            data-testid={`pattern-${pattern.id}`}
            onClick={() => onSelectPattern(pattern)}
            className={`relative cursor-pointer border p-3 transition-all hover:border-primary/50 ${
              selectedPattern?.id === pattern.id
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card'
            }`}
          >
            {selectedPattern?.id === pattern.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            
            <div className="grid grid-cols-3 gap-0.5 mb-3">
              {pattern.preview.map((cell, idx) => (
                <div
                  key={idx}
                  className={`aspect-square text-[8px] flex items-center justify-center font-mono ${
                    cell === 'T' ? 'bg-muted text-muted-foreground' :
                    cell === 'P' ? 'bg-primary/20 text-primary' :
                    cell === 'R' ? 'bg-green-500/20 text-green-600' :
                    cell === 'B' ? 'bg-blue-500/40' :
                    cell === 'G' ? 'bg-green-500/40' :
                    cell === 'Y' ? 'bg-yellow-500/40' :
                    cell === 'D' ? 'bg-slate-800' : 'bg-slate-500/20'
                  }`}
                >
                  {cell}
                </div>
              ))}
            </div>
            
            <div>
              <h4 className="font-sans text-sm font-semibold mb-0.5">{pattern.name}</h4>
              <p className="font-sans text-xs text-muted-foreground mb-1">{pattern.description}</p>
              <p className="font-mono text-[10px] text-primary uppercase tracking-wide">Best for: {pattern.bestFor}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PatternLibrary;