import React from 'react';
import { Phone, Mail } from 'lucide-react';

const TopBar = () => {
    return (
        <div className="bg-primary-dark text-white py-2 text-sm fixed top-0 left-0 right-0 z-50">
            <div className="container mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Phone size={16} className="text-accent" />
                    <a href="tel:+15202768517" className="hover:text-accent transition-colors">
                        +1 (520) 276-8517
                    </a>
                </div>
                <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-accent" />
                    <a href="mailto:Contact@meteoroidservices.com" className="hover:text-accent transition-colors">
                        contact@meteoroidservices.com
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
