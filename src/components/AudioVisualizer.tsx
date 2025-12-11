import { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  stream: MediaStream | null;
}

export default function AudioVisualizer({ stream }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyzerRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (!stream || !canvasRef.current) return;

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyzer = audioContext.createAnalyser();
    
    analyzer.fftSize = 2048;  // Increased for better frequency resolution
    analyzer.smoothingTimeConstant = 0.8;  // Increased for smoother response
    source.connect(analyzer);
    analyzerRef.current = analyzer;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!canvas || !ctx || !analyzer) return;

      animationRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear previous frame
      analyzer.getByteFrequencyData(dataArray);

      const barWidth = 2;  // Thinner bars
      const gap = 1;       // Smaller gap for more bars
      const totalWidth = barWidth + gap;
      const halfWidth = canvas.width / 2;
      const barCount = Math.floor(halfWidth / totalWidth);

      // Create frequency bands for more even distribution
      const maxFreq = audioContext.sampleRate / 2;
      const minFreq = 20; // Lowest audible frequency
      const bandCount = barCount;
      
      // Create logarithmic frequency bands
      const getBandFrequency = (index: number) => {
        const exponent = index / bandCount;
        return minFreq * Math.pow(maxFreq / minFreq, exponent);
      };
      
      // Get frequency bin index from frequency
      const getIndexForFrequency = (freq: number) => {
        return Math.round((freq / maxFreq) * (bufferLength - 1));
      };

      // Draw from center to right
      for (let i = 0; i < barCount; i++) {
        // Calculate frequency range for this bar
        const f1 = getBandFrequency(i);
        const f2 = getBandFrequency(i + 1);
        
        // Get indexes range
        const startIndex = getIndexForFrequency(f1);
        const endIndex = getIndexForFrequency(f2);
        
        // Average the frequencies in the band
        let sum = 0;
        let count = 0;
        for (let j = startIndex; j <= endIndex; j++) {
          sum += dataArray[j];
          count++;
        }
        let value = count > 0 ? sum / count : 0;

        // Apply noise gate
        const noiseThreshold = 15; // Adjust this value to control sensitivity
        if (value < noiseThreshold) {
          value = 0;
        } else {
          // Scale the remaining range to maintain visual dynamics
          value = ((value - noiseThreshold) / (255 - noiseThreshold)) * 255;
        }

        // Apply additional boost to higher frequencies based on position
        const positionBoost = 1 + (i / barCount) * 0.3;
        value = value * positionBoost * 0.8;

        // Ensure we don't exceed 255 after all boosts
        value = Math.min(255, value);
        const percent = value / 255;
        const height = Math.max((canvas.height * percent) * 0.9, 2);  // Minimum height of 2px

        // Gradient based on amplitude
        const alpha = 0.3 + (percent * 0.7);  // More dynamic opacity range
        ctx.fillStyle = `rgba(124, 58, 237, ${alpha})`;

        // Draw right bar
        const x = halfWidth + (i * totalWidth);
        ctx.beginPath();
        ctx.roundRect(x, (canvas.height - height) / 2, barWidth, height, barWidth / 2);
        ctx.fill();

        // Draw mirrored left bar
        const mirrorX = halfWidth - ((i + 1) * totalWidth);
        ctx.beginPath();
        ctx.roundRect(mirrorX, (canvas.height - height) / 2, barWidth, height, barWidth / 2);
        ctx.fill();
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      audioContext.close();
    };
  }, [stream]);

  return (
    <canvas 
      ref={canvasRef} 
      width={500} 
      height={60} 
      className="w-full h-20 rounded-lg"
    />
  );
}