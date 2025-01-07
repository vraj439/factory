import React from 'react';
import Dropdown from "../components/Dropdown";

const DropdownMenu: React.FC = () => {
  return (
    <nav className="bg-blue-900 text-white">
      <ul className="flex p-4">
        <Dropdown
          title="Capabilities"
          options={[
            {label: "Casting", link: "/casting"},
            {label: "Forging", link: "/forging"},
            {label: "CNC Machining", link: "/cnc-machining"},
            {label: "PCB Assembly", link: "/pcb-assembly"},
            {label: "Sheet Metal Fabrication", link: "/sheet-metal"},
            {label: "Box Build", link: "/box-build"},
            {label: "Injection Moulding", link: "/injection-moulding"},
          ]}
        />
        <Dropdown
          title="Industries"
          options={[
            {label: "Automotive", link: "/automotive"},
            {label: "Aerospace", link: "/aerospace"},
            {label: "Electronics", link: "/electronics"},
            {label: "Medical", link: "/medical"},
          ]}
        />
        <Dropdown
          title="Resources"
          options={[
            {label: "Blog", link: "/blog"},
            {label: "Case Studies", link: "/case-studies"},
          ]}
        />
        <Dropdown
          title="Company"
          options={[
            {label: "About Us", link: "/about-us"},
            {label: "Culture & Careers", link: "/careers"},
            {label: "Contact Us", link: "/contact"},
            {label: "News", link: "/news"},
          ]}
        />
      </ul>
    </nav>
  );
};

export default DropdownMenu;
