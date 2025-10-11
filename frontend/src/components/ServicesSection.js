// FILE: src/components/ServicesSection.js
import { FileText, DollarSign, Briefcase, ShieldCheck } from 'lucide-react';
import useOnScreen2 from '../hooks/useOnScreen';

const ServicesSection = () => {
    const services = [
        { icon: <FileText size={40} />, title: "Medical Coding", description: "Accurate and compliant coding for all specialties to ensure proper reimbursement." },
        { icon: <DollarSign size={40} />, title: "Revenue Cycle Management", description: "End-to-end management of your financial cycle, from patient registration to final payment." },
        { icon: <Briefcase size={40} />, title: "Credentialing Services", description: "We handle the complex provider credentialing and enrollment process with all payers." },
        { icon: <ShieldCheck size={40} />, title: "Compliance & Auditing", description: "Stay ahead of regulations with our expert compliance checks and internal audits." },
    ];
    const [ref, isVisible] = useOnScreen2({ threshold: 0.2 });

    return (
        <section ref={ref} className="py-16 md:py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">What We Do</h2>
                    <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">Comprehensive medical billing solutions tailored to your practice's unique needs.</p>
                    <div className="mt-4 w-24 h-1 bg-primary mx-auto rounded"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className={`bg-gray-50 p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-primary ${isVisible ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: `${index * 0.15}s` }}>
                            <div className="text-primary mb-4 bg-accent/20 p-4 rounded-full inline-block">{service.icon}</div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">{service.title}</h3>
                            <p className="text-gray-600">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
export { ServicesSection as default };
