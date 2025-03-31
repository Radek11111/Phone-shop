import Link from 'next/link';
import MaxWidthWrapper from './MaxWidthWrapper';
import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white h-20 ">
      {" "}
      <MaxWidthWrapper>
        {/* Separator */}
        <div className="border-t border-gray-200 w-full" />

        {/* Główna sekcja stopki */}
        <div className="flex flex-col md:flex-row justify-between items-center py-6">
          {/* Logo na lewo, wyśrodkowane pionowo */}
          <div className="flex items-center ">
            <img className="h-12 mt-8 mb-0" src="/logo.svg" alt="Logo" />
          </div>

          {/* Linki na prawo */}
          <div className="flex space-x-6 mt-4 md:mt-0">
            <FooterLink href="#" text="Terms" />
            <FooterLink href="#" text="Privacy Policy" />
            <FooterLink href="#" text="Cookie Policy" />
          </div>
        </div>

        {/* Kontakt */}
        <div className="border-b w-full flex flex-col md:flex-row justify-center items-center py-4 text-center">
          <div className="flex flex-col md:flex-row gap-4 text-sm text-gray-700">
            <ContactItem icon={<Phone size={20} />} text="+91 910 XXXXXXX" />
            <ContactItem
              icon={<Mail size={20} />}
              text="LoremIpsum@gmail.com"
            />
            <ContactItem icon={<MapPin size={20} />} text="Gdańsk" />
          </div>
        </div>

        <div className="flex justify-center py-2">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
};

const FooterLink = ({ href, text }: { href: string; text: string }) => (
  <Link
    href={href}
    className="text-sm text-gray-500 hover:text-gray-600 transition"
  >
    {text}
  </Link>
);

const ContactItem = ({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) => (
  <div className="flex gap-2 items-center">
    <span className="text-gray-500">{icon}</span>
    {text}
  </div>
);

export default Footer;
