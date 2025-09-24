// FILE: src/components/TestimonialsSection.js
import useOnScreen5 from '../hooks/useOnScreen';

const TestimonialsSection = () => {
    const testimonials = [
        { name: "Dr. Emily Carter", practice: "Carter Family Practice", quote: "Meteorroids transformed our revenue cycle. Their team is professional, responsive, and incredibly effective. Our collections have never been better.", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop" },
        { name: "Mark Chen, Office Manager", practice: "Ortho Specialists Group", quote: "Switching to Meteorroids was the best decision we made last year. Their reporting is transparent, and our A/R days have dropped by 30%.", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop" },
        { name: "Dr. Sarah Jenkins", practice: "Jenkins Pediatrics", quote: "The peace of mind they provide is invaluable. I can focus completely on my patients, knowing the financial side of my practice is in expert hands.", avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1887&auto=format&fit=crop" },
    ];
    const [ref, isVisible] = useOnScreen5({ threshold: 0.1 });

    return (
        <section ref={ref} className="py-16 md:py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">What Our Clients Say</h2>
                    <p className="text-lg text-gray-600 mt-4">Real results from practices just like yours.</p>
                    <div className="mt-4 w-24 h-1 bg-primary mx-auto rounded"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                         <div key={index} className={`bg-gray-50 p-8 rounded-xl shadow-lg transition-all duration-300 ${isVisible ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: `${index * 0.15}s` }}>
                            <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                            <div className="flex items-center">
                                <img src={testimonial.avatar} alt={testimonial.name} className="w-16 h-16 rounded-full mr-4 border-2 border-accent object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/cccccc/ffffff?text=Avatar'; }} />
                                <div>
                                    <h4 className="font-bold text-gray-800 text-lg">{testimonial.name}</h4>
                                    <p className="text-gray-500">{testimonial.practice}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
export { TestimonialsSection as default };
