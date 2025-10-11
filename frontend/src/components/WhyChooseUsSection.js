// FILE: src/components/WhyChooseUsSection.js
import useOnScreen3 from '../hooks/useOnScreen';
import { Check, Stethoscope as Stethoscope2 } from 'lucide-react';

const WhyChooseUsSection = () => {
    const features = [
        { title: "Increased Clean Claim Rate", description: "Our meticulous process significantly boosts your first-pass claim acceptance." },
        { title: "Reduced A/R Days", description: "We accelerate your payment cycles, improving cash flow and financial stability." },
        { title: "Dedicated Account Managers", description: "Personalized support from an expert who understands your practice's unique needs." },
        { title: "Advanced Technology", description: "Leveraging cutting-edge software for efficient and transparent billing processes." }
    ];
    const [ref, isVisible] = useOnScreen3({ threshold: 0.2 });

    return (
        <section ref={ref} className="py-16 md:py-20 bg-light-gray overflow-x-hidden">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className={`${isVisible ? 'animate-fade-in-right' : ''}`}>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose Meteorroids?</h2>
                        <p className="text-lg text-gray-600 mb-8">We're more than a billing company; we're a strategic partner invested in your success. Our commitment to transparency, accuracy, and client support sets us apart.</p>
                        <div className="space-y-6">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-start">
                                    <div className="flex-shrink-0 h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center mr-4 mt-1">
                                        <Check size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold text-gray-800">{feature.title}</h4>
                                        <p className="text-gray-600">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={`relative mt-8 md:mt-0 ${isVisible ? 'animate-fade-in-left' : ''}`}>
                        <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-2xl">
                             <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop" alt="Doctor using a tablet" className="rounded-xl w-full h-auto object-cover aspect-video" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x450/cccccc/ffffff?text=Image+Not+Found'; }} />
                        </div>
                        <div className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:-right-8 bg-primary p-4 sm:p-6 rounded-xl text-white w-56 sm:w-64 shadow-xl hidden lg:block">
                            <Stethoscope2 size={32} className="mb-2" />
                            <p className="font-bold text-base sm:text-lg">Expert Care for Your Finances</p>
                            <p className="text-xs sm:text-sm text-accent">Just like you care for your patients.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
export { WhyChooseUsSection as default };
