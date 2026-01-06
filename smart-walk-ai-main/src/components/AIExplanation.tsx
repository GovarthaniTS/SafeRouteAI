import { Bot, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIExplanationProps {
  explanation: string;
  isLoading?: boolean;
}

export function AIExplanation({ explanation, isLoading }: AIExplanationProps) {
  if (isLoading) {
    return (
      <div className="glass-card p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bot className="w-5 h-5 text-primary" />
            <Sparkles className="w-3 h-3 text-accent absolute -top-1 -right-1" />
          </div>
          <span className="text-sm font-medium text-primary">SafeRoute AI</span>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-secondary/50 rounded animate-pulse w-full" />
          <div className="h-4 bg-secondary/50 rounded animate-pulse w-4/5" />
          <div className="h-4 bg-secondary/50 rounded animate-pulse w-3/4" />
        </div>
      </div>
    );
  }

  if (!explanation) return null;

  // Parse the explanation to format bullet points
  const formatExplanation = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map((line, index) => {
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*');
      const cleanLine = line.replace(/^[\s•\-\*]+/, '').trim();
      
      if (isBullet) {
        return (
          <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="text-primary mt-1.5">•</span>
            <span>{cleanLine}</span>
          </li>
        );
      }
      
      return (
        <p key={index} className="text-sm text-muted-foreground leading-relaxed">
          {cleanLine}
        </p>
      );
    });
  };

  return (
    <div className="glass-card p-5 space-y-3 animate-fade-in">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Bot className="w-5 h-5 text-primary" />
          <Sparkles className="w-3 h-3 text-accent absolute -top-1 -right-1 animate-pulse" />
        </div>
        <span className="text-sm font-medium text-primary font-display">SafeRoute AI</span>
        <span className="text-xs text-muted-foreground">• Safety Analysis</span>
      </div>
      
      <div className="space-y-2 pl-1">
        {formatExplanation(explanation)}
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-border/30">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-xs text-muted-foreground">
          Powered by Gemini AI
        </span>
      </div>
    </div>
  );
}
