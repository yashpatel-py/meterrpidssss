// FILE: src/components/Footer.js
import { Stethoscope as Stethoscope3, Mail, Phone, MapPin } from 'lucide-react';
import { Link as Link4 } from 'react-scroll';

const Footer = () => {
    const scrollProps = {
        smooth: true,
        duration: 500,
        offset: -80,
    };
    const quickLinks = [
        { text: "About Us", to: "about-us" },
        { text: "Services", to: "services" },
        { text: "Why Us", to: "about-us" },
        { text: "Contact", to: "contact" }
    ];
    const serviceLinks = [
        { text: "Medical Coding", to: "services" },
        { text: "Revenue Cycle Management", to: "services" },
        { text: "Credentialing", to: "services" },
        { text: "Compliance & Auditing", to: "services" }
    ];

    return (
        <footer className="bg-primary-dark text-gray-300">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
                    <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-center sm:justify-start space-x-2 mb-4">
                            <Stethoscope3 className="text-accent h-8 w-8" />
                            <span className="font-bold text-2xl text-white">Meteorroids</span>
                        </div>
                        <p className="text-gray-400">Your trusted partner in medical billing and revenue cycle management.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            {quickLinks.map(link => (
                                <li key={link.text}><Link4 to={link.to} {...scrollProps} className="cursor-pointer hover:text-white transition-colors">{link.text}</Link4></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold text-lg mb-4">Our Services</h4>
                        <ul className="space-y-2">
                            {serviceLinks.map(link => (
                                <li key={link.text}><Link4 to={link.to} {...scrollProps} className="cursor-pointer hover:text-white transition-colors">{link.text}</Link4></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold text-lg mb-4">Contact Info</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start justify-center sm:justify-start space-x-3"><MapPin size={18} className="text-accent flex-shrink-0 mt-1" /><p className="text-sm sm:text-base">230 Kubol Dr, Lawrenceville, GA 30046</p></li>
                            <li className="flex items-center justify-center sm:justify-start space-x-3"><Phone size={18} className="text-accent flex-shrink-0" /><a href="tel:18005551234" className="hover:text-white text-sm sm:text-base">+1 (520) 276-8517</a></li>
                            <li className="flex items-center justify-center sm:justify-start space-x-3"><Mail size={18} className="text-accent flex-shrink-0" /><a href="mailto:Contact@meteoroidservices.com" className="hover:text-white text-sm sm:text-base">Contact@meteoroidservices.com</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-500">
                    <p>&copy; 2025 Meteorroids Services. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};
export { Footer as default };
