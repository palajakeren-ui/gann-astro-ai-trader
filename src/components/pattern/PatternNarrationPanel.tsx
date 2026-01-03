import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { DetectedPattern, generatePatternNarration } from "@/lib/patternUtils";

interface PatternNarrationPanelProps {
  patterns: DetectedPattern[];
}

export const PatternNarrationPanel = ({ patterns }: PatternNarrationPanelProps) => {
  const narrations = generatePatternNarration(patterns);

  return (
    <Card className="p-4 border-border bg-card border-l-4 border-l-primary">
      <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-primary" />
        Pattern Summary (Narasi)
      </h3>
      <div className="space-y-3 text-sm">
        {narrations.length > 0 ? (
          narrations.map((narration, idx) => (
            <p
              key={idx}
              className={`p-3 rounded-lg ${
                narration.includes("⚠️")
                  ? "bg-destructive/10 border border-destructive/30"
                  : "bg-success/10 border border-success/30"
              }`}
              dangerouslySetInnerHTML={{
                __html: narration.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
              }}
            />
          ))
        ) : (
          <>
            <p className="p-3 bg-success/10 border border-success/30 rounded-lg">
              <strong>Bullish Engulfing</strong> pada 101,700 (konfirmasi intraday 2025-11-04
              15:25:00 UTC) memberikan sinyal masuk awal.
            </p>
            <p className="p-3 bg-success/10 border border-success/30 rounded-lg">
              <strong>Morning Star</strong> pada area 101,800 memperkuat setup bagi Wave 3
              impulsif — target terukur 102,200 dalam 7–14 days.
            </p>
            <p className="p-3 bg-accent/10 border border-accent/30 rounded-lg">
              <strong>Gann Wave</strong> menunjuk reversal window kuat sekitar 2025-11-16 (target
              103,000) — gunakan untuk manajemen TP bagian/scale-out.
            </p>
          </>
        )}
      </div>
    </Card>
  );
};
