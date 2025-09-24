// FILE: src/components/StatsSection.js
import { useEffect as useEffect3, useState as useState2 } from 'react';
import useOnScreen4 from '../hooks/useOnScreen';
import { Users, DollarSign as DollarSign2, FileText as FileText2 } from 'lucide-react';

const AnimatedCounter = ({ end, duration = 2000, suffix = '', prefix = '' }) => {
    const [count, setCount] = useState2(0);
    const [ref, isVisible] = useOnScreen4({ threshold: 0.5 });

    useEffect3(() => {
        if (isVisible) {
            let start = 0;
            const numericMatch = end.toString().match(/^(\d+)(.*)$/);
            const endValue = numericMatch ? parseInt(numericMatch[1]) : parseInt(end);
            const endSuffix = numericMatch ? numericMatch[2] : '';
            
            if (start === endValue) return;
            let startTime = null;
            const step = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                setCount(Math.floor(progress * (endValue - start) + start));
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }
    }, [end, duration, isVisible]);

    const numericMatch = end.toString().match(/^(\d+)(.*)$/);
    const endSuffix = numericMatch ? numericMatch[2] : '';
    
    return <span ref={ref}>{prefix}{count.toLocaleString()}{endSuffix}{suffix}</span>;
};

const StatsSection = () => {
    const stats = [
        { icon: <DollarSign2 size={40} />, value: "50M", label: "Collected for Clients", prefix: "$" },
        { icon: <FileText2 size={40} />, value: "98", label: "Clean Claim Rate", suffix: "%" },
        { icon: <Users size={40} />, value: "150", label: "Satisfied Providers", prefix: "+" },
    ];

    return (
        <section className="py-16 md:py-20 bg-primary text-white">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {stats.map((stat, index) => (
                        <div key={index} className="p-6 sm:p-8">
                            <div className="text-white mb-4 bg-white/20 p-4 rounded-full inline-block">{stat.icon}</div>
                            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
                                <AnimatedCounter end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                            </h3>
                            <p className="text-lg text-accent mt-2">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
export { StatsSection as default };
