import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link as Link2 } from 'react-scroll';

const HeroSection = () => {
    const scrollProps = {
        smooth: true,
        duration: 500,
        offset: -80,
    };
    return (
        <section className="relative text-white min-h-screen flex items-center justify-center pt-24 pb-48 overflow-hidden">
            <div className="absolute inset-0 bg-auto-scroll-images"></div>
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                 <svg className="absolute bottom-0 left-0 w-full h-auto text-white" fill="currentColor" viewBox="0 0 1440 320">
                    <path d="M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,186.7C672,192,768,160,864,144C960,128,1056,128,1152,149.3C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </div>
            <div className="container mx-auto px-6 text-center relative z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-accent/40 text-white px-4 py-2 rounded-full inline-block mb-4 border border-accent shadow-lg backdrop-blur-sm">
                        Your Partner in Financial Health
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up">
                        Streamline Your Medical Billing. Maximize Your Revenue.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        We provide comprehensive, HIPAA-compliant medical billing services, so you can focus on what matters most: patient care.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                        <Link2 to="services" {...scrollProps} className="cursor-pointer w-full sm:w-auto bg-white text-primary font-bold px-8 py-4 rounded-full text-lg hover:bg-light-gray transition-all duration-300 transform hover:scale-105 shadow-lg shadow-white/10">
                            Our Services
                        </Link2>
                        <Link2 to="contact" {...scrollProps} className="cursor-pointer w-full sm:w-auto bg-white/10 border-2 border-white/50 text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                            Contact Us <ArrowRight className="inline ml-2" size={20} />
                        </Link2>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
