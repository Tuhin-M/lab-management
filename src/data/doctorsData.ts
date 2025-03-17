
// If this file exists, we'll just add to it; otherwise we'll create it
// You would replace this with actual API data in a real application

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualifications: string;
  experience: number;
  rating: number;
  reviewCount: number;
  fee: number;
  discountedFee?: number;
  hospital: string;
  location: string;
  distance: number;
  imageUrl: string;
  availableToday: boolean;
  verified?: boolean;
  languages?: string[];
  consultationOptions?: ('in-person' | 'video' | 'phone')[];
}

export const timeSlots = [
  "9:00 AM", 
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM"
];

export const doctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Rahul Sharma",
    specialty: "Cardiologist",
    qualifications: "MBBS, MD, DM Cardiology",
    experience: 15,
    rating: 4.8,
    reviewCount: 542,
    fee: 1200,
    discountedFee: 1500,
    hospital: "Apollo Hospitals",
    location: "Bandra, Mumbai",
    distance: 3.2,
    imageUrl: "https://placehold.co/400x600/3730a3/FFFFFF.png?text=Doctor+Profile&font=montserrat",
    availableToday: true,
    verified: true,
    languages: ["English", "Hindi", "Marathi"],
    consultationOptions: ["in-person", "video", "phone"]
  },
  {
    id: "d2",
    name: "Dr. Priya Patel",
    specialty: "Dermatologist",
    qualifications: "MBBS, MD Dermatology",
    experience: 10,
    rating: 4.9,
    reviewCount: 378,
    fee: 1500,
    hospital: "Fortis Hospital",
    location: "Malad, Mumbai",
    distance: 7.5,
    imageUrl: "https://placehold.co/400x600/3730a3/FFFFFF.png?text=Doctor+Profile&font=montserrat",
    availableToday: false,
    verified: true,
    languages: ["English", "Hindi", "Gujarati"],
    consultationOptions: ["in-person", "video"]
  },
  {
    id: "d3",
    name: "Dr. Sanjay Gupta",
    specialty: "Orthopedic Surgeon",
    qualifications: "MBBS, MS Orthopedics",
    experience: 18,
    rating: 4.7,
    reviewCount: 623,
    fee: 1800,
    discountedFee: 2000,
    hospital: "Lilavati Hospital",
    location: "Dadar, Mumbai",
    distance: 5.1,
    imageUrl: "https://placehold.co/400x600/3730a3/FFFFFF.png?text=Doctor+Profile&font=montserrat",
    availableToday: true,
    languages: ["English", "Hindi"],
    consultationOptions: ["in-person"]
  },
  {
    id: "d4",
    name: "Dr. Meera Desai",
    specialty: "Gynecologist",
    qualifications: "MBBS, MD, DGO",
    experience: 12,
    rating: 4.9,
    reviewCount: 421,
    fee: 1300,
    hospital: "Nanavati Hospital",
    location: "Andheri, Mumbai",
    distance: 8.7,
    imageUrl: "https://placehold.co/400x600/3730a3/FFFFFF.png?text=Doctor+Profile&font=montserrat",
    availableToday: true,
    verified: true,
    languages: ["English", "Hindi", "Marathi"],
    consultationOptions: ["in-person", "video", "phone"]
  },
  {
    id: "d5",
    name: "Dr. Vikram Mehta",
    specialty: "Neurologist",
    qualifications: "MBBS, MD, DM Neurology",
    experience: 20,
    rating: 4.8,
    reviewCount: 316,
    fee: 2000,
    hospital: "Hinduja Hospital",
    location: "Mahim, Mumbai",
    distance: 6.3,
    imageUrl: "https://placehold.co/400x600/3730a3/FFFFFF.png?text=Doctor+Profile&font=montserrat",
    availableToday: false,
    languages: ["English", "Hindi"],
    consultationOptions: ["in-person", "video"]
  },
  {
    id: "d6",
    name: "Dr. Anjali Singh",
    specialty: "Pediatrician",
    qualifications: "MBBS, MD Pediatrics",
    experience: 8,
    rating: 4.7,
    reviewCount: 287,
    fee: 1000,
    hospital: "Kokilaben Hospital",
    location: "Versova, Mumbai",
    distance: 9.8,
    imageUrl: "https://placehold.co/400x600/3730a3/FFFFFF.png?text=Doctor+Profile&font=montserrat",
    availableToday: true,
    verified: true,
    languages: ["English", "Hindi", "Punjabi"],
    consultationOptions: ["in-person", "video", "phone"]
  }
];
