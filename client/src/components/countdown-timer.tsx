import { useCountdown } from "@/hooks/use-countdown";

interface CountdownTimerProps {
  targetDate: string;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  return (
    <div className="countdown-pulse text-2xl font-mono text-glow-pink">
      <span>{days.toString().padStart(3, '0')}</span>d{' '}
      <span>{hours.toString().padStart(2, '0')}</span>h{' '}
      <span>{minutes.toString().padStart(2, '0')}</span>m{' '}
      <span>{seconds.toString().padStart(2, '0')}</span>s
    </div>
  );
}
