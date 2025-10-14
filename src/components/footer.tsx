import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Mail, MapPin, Phone, Clock, Award, Shield, CheckCircle, ChevronRight } from 'lucide-react';

interface FooterProps {
  forceUpdate?: number;
}

export function Footer({ forceUpdate }: FooterProps = {}) {
  const { lang = 'en' } = useParams<{ lang: string }>();

  return (
    <footer className="bg-white text-gray-800 border-t border-gray-200">
      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* Company Profile */}
            <div>
              <h3 className="text-lg font-bold mb-5 text-[#064E3B] uppercase tracking-wider">
                Company Profile
              </h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Hangzhou Karn New Building Materials Co., Ltd. specializes in the research, development, production, and sales of new building materials, providing customers with high-quality building material solutions.
              </p>
              <div className="flex items-center text-[#047857]">
                <Award className="h-4 w-4 mr-2" />
                <span className="text-xs">ISO 9001 Quality Certified</span>
              </div>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="text-lg font-bold mb-5 text-[#064E3B] uppercase tracking-wider">
                Contact Us
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-sm bg-[#047857] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-600 ml-3">
                    Starlight Building A, 15 Starlight Street,<br />Donghu Street, Yuhang District,<br />Hangzhou, Zhejiang, China
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-sm bg-[#047857] flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-600 ml-3">+86 571-8888-8888</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-sm bg-[#047857] flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-600 ml-3">info@karn-materials.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-5 text-[#064E3B] uppercase tracking-wider">
                Quick Links
              </h3>
              <div className="space-y-3">
                <Link
                  to={`/${lang}/`}
                  className="flex items-center text-sm text-gray-600 hover:text-[#047857] transition-colors duration-200 py-1.5 group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 text-[#047857] group-hover:translate-x-1 transition-transform" />
                  Home
                </Link>
                <Link
                  to={`/${lang}/products`}
                  className="flex items-center text-sm text-gray-600 hover:text-[#047857] transition-colors duration-200 py-1.5 group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 text-[#047857] group-hover:translate-x-1 transition-transform" />
                  Products
                </Link>
                <Link
                  to={`/${lang}/about`}
                  className="flex items-center text-sm text-gray-600 hover:text-[#047857] transition-colors duration-200 py-1.5 group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 text-[#047857] group-hover:translate-x-1 transition-transform" />
                  About Us
                </Link>
                <Link
                  to={`/${lang}/contact`}
                  className="flex items-center text-sm text-gray-600 hover:text-[#047857] transition-colors duration-200 py-1.5 group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 text-[#047857] group-hover:translate-x-1 transition-transform" />
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Quality Assurance */}
            <div>
              <h3 className="text-lg font-bold mb-5 text-[#064E3B] uppercase tracking-wider">
                Quality Assurance
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-sm bg-[#047857] flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-600 ml-3">ISO 9001:2015 Quality System</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-sm bg-[#047857] flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-600 ml-3">Eco-friendly Materials</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-sm bg-[#047857] flex items-center justify-center flex-shrink-0">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-600 ml-3">Industry Certification</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-200 bg-gray-50 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              © 2024 Hangzhou Karn New Building Materials Co., Ltd. All Rights Reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-600 mt-3 md:mt-0">
              <a href="#" className="hover:text-[#047857] transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-[#047857] transition-colors duration-200">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}