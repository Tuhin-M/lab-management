
import React from "react";

const DoctorAppointmentFooter: React.FC = () => {
  return (
    <footer className="border-t mt-12">
      <div className="container mx-auto py-6 px-4 md:flex justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p className="text-sm text-muted-foreground">
            © 2023 Ekitsa. All rights reserved.
          </p>
        </div>
        <div className="flex justify-center md:justify-end space-x-6">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Terms of Service
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default DoctorAppointmentFooter;
