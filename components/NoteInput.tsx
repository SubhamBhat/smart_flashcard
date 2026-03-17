'use client';

interface NoteInputProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export default function NoteInput({
  inputText,
  onInputChange,
  onGenerate,
  isLoading,
}: NoteInputProps) {
  return (
    <div className="group relative">
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-accent to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg -z-10" />
      
      <div className="relative bg-card border border-border rounded-2xl p-8 backdrop-blur-sm">
        <label htmlFor="notes" className="block text-lg font-semibold mb-4 text-foreground">
          Paste Your Study Notes
        </label>
        <textarea
          id="notes"
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={isLoading}
          placeholder="Paste your study notes here... The AI will automatically generate flashcards from your content. Include key concepts, definitions, and important points for best results."
          className="w-full h-64 p-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 resize-none disabled:opacity-50 disabled:cursor-not-allowed placeholder-muted-foreground text-foreground text-base leading-relaxed"
        />
        
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={onGenerate}
            disabled={isLoading || !inputText.trim()}
            className="relative px-8 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden group/btn"
          >
            <span className="relative flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>Generate Flashcards</span>
                </>
              )}
            </span>
          </button>
          
          {inputText.trim() && (
            <div className="text-sm text-muted-foreground">
              {inputText.trim().split(/\s+/).length} words
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
