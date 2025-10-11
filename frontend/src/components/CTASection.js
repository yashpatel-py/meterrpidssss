// FILE: src/components/CTASection.js
import { ArrowRight as ArrowRight2 } from 'lucide-react';
import { Link as Link3 } from 'react-scroll';

const CTASection = () => {
    return (
        <section className="bg-primary-dark">
             <div className="container mx-auto px-6 py-16 md:py-20 text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Ready to Improve Your Practice's Financial Health?</h2>
                <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">Let's talk about how Meteorroids can help you increase revenue and reduce administrative burden. Get a free, no-obligation analysis of your current billing.</p>
                <Link3 to="contact" smooth={true} duration={500} offset={-80} className="cursor-pointer w-full sm:w-auto bg-white text-primary font-bold px-8 py-4 rounded-full text-lg hover:bg-light-gray transition-all duration-300 transform hover:scale-105 shadow-lg shadow-white/10">
                    Request a Free Analysis <ArrowRight2 className="inline ml-2" size={20} />
                </Link3>
            </div>
        </section>
    );
};
export { CTASection as default };
