
// Doctor data for Ekitsa healthcare platform
// All doctors are based in Bangalore with AI-generated Indian images

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
  city: string;
  distance: number;
  imageUrl: string;
  availableToday: boolean;
  verified?: boolean;
  languages?: string[];
  consultationOptions?: ('in-person' | 'video' | 'phone')[];
  bio?: string;
  gender: 'male' | 'female';
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

export const cities = [
  "Bangalore, Karnataka",
  "Mumbai, Maharashtra",
  "Delhi, NCR",
  "Chennai, Tamil Nadu",
  "Hyderabad, Telangana",
  "Pune, Maharashtra",
  "Kolkata, West Bengal",
];

export const doctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Rajesh Kumar",
    specialty: "Cardiologist",
    qualifications: "MBBS, MD, DM Cardiology",
    experience: 15,
    rating: 4.8,
    reviewCount: 542,
    fee: 1200,
    discountedFee: 1500,
    hospital: "Manipal Hospital",
    location: "Whitefield, Bangalore",
    city: "Bangalore, Karnataka",
    distance: 3.2,
    imageUrl: "/doctors/doctor1.png",
    availableToday: true,
    verified: true,
    languages: ["English", "Hindi", "Kannada"],
    consultationOptions: ["in-person", "video", "phone"],
    bio: "Renowned cardiologist with expertise in interventional cardiology and heart failure management.",
    gender: "male"
  },
  {
    id: "d2",
    name: "Dr. Priya Sharma",
    specialty: "Dermatologist",
    qualifications: "MBBS, MD Dermatology",
    experience: 10,
    rating: 4.9,
    reviewCount: 378,
    fee: 1500,
    hospital: "Apollo Hospital",
    location: "Koramangala, Bangalore",
    city: "Bangalore, Karnataka",
    distance: 5.5,
    imageUrl: "/doctors/doctor2.png",
    availableToday: true,
    verified: true,
    languages: ["English", "Hindi", "Kannada"],
    consultationOptions: ["in-person", "video"],
    bio: "Expert in cosmetic dermatology, laser treatments, and skin rejuvenation procedures.",
    gender: "female"
  },
  {
    id: "d3",
    name: "Dr. Suresh Reddy",
    specialty: "Orthopedic Surgeon",
    qualifications: "MBBS, MS Orthopedics",
    experience: 18,
    rating: 4.7,
    reviewCount: 623,
    fee: 1800,
    discountedFee: 2000,
    hospital: "Narayana Health",
    location: "Electronic City, Bangalore",
    city: "Bangalore, Karnataka",
    distance: 8.1,
    imageUrl: "/doctors/doctor3.png",
    availableToday: true,
    verified: true,
    languages: ["English", "Hindi", "Telugu", "Kannada"],
    consultationOptions: ["in-person"],
    bio: "Specialist in joint replacement surgery and sports medicine with international training.",
    gender: "male"
  },
  {
    id: "d4",
    name: "Dr. Kavitha Rao",
    specialty: "Gynecologist",
    qualifications: "MBBS, MD, DGO",
    experience: 12,
    rating: 4.9,
    reviewCount: 421,
    fee: 1300,
    hospital: "Fortis Hospital",
    location: "Bannerghatta Road, Bangalore",
    city: "Bangalore, Karnataka",
    distance: 6.7,
    imageUrl: "/doctors/doctor4.png",
    availableToday: true,
    verified: true,
    languages: ["English", "Hindi", "Kannada", "Tamil"],
    consultationOptions: ["in-person", "video", "phone"],
    bio: "Compassionate gynecologist specializing in high-risk pregnancies and laparoscopic surgeries.",
    gender: "female"
  },
  {
    id: "d5",
    name: "Dr. Arun Prasad",
    specialty: "Neurologist",
    qualifications: "MBBS, MD, DM Neurology",
    experience: 20,
    rating: 4.8,
    reviewCount: 316,
    fee: 2000,
    hospital: "Aster CMI Hospital",
    location: "Hebbal, Bangalore",
    city: "Bangalore, Karnataka",
    distance: 4.3,
    imageUrl: "/doctors/doctor5.png",
    availableToday: false,
    verified: true,
    languages: ["English", "Hindi", "Kannada"],
    consultationOptions: ["in-person", "video"],
    bio: "Leading neurologist specializing in stroke management and neurodegenerative disorders.",
    gender: "male"
  },
  {
    id: "d6",
    name: "Dr. Sneha Murthy",
    specialty: "Pediatrician",
    qualifications: "MBBS, MD Pediatrics",
    experience: 8,
    rating: 4.7,
    reviewCount: 287,
    fee: 1000,
    hospital: "Columbia Asia Hospital",
    location: "Yeshwanthpur, Bangalore",
    city: "Bangalore, Karnataka",
    distance: 7.8,
    imageUrl: "/doctors/doctor6.png",
    availableToday: true,
    verified: true,
    languages: ["English", "Hindi", "Kannada"],
    consultationOptions: ["in-person", "video", "phone"],
    bio: "Child-friendly pediatrician with expertise in developmental disorders and vaccinations.",
    gender: "female"
  },
  {
    id: "d7",
    name: "Dr. Venkatesh Iyer",
    specialty: "Cardiologist",
    qualifications: "MBBS, MD, DM Cardiology",
    experience: 22,
    rating: 4.9,
    reviewCount: 712,
    fee: 2500,
    discountedFee: 3000,
    hospital: "Jayadeva Hospital",
    location: "Jayanagar, Bangalore",
    city: "Bangalore, Karnataka",
    distance: 5.2,
    imageUrl: "/doctors/doctor7.png",
    availableToday: true,
    verified: true,
    languages: ["English", "Hindi", "Kannada", "Tamil"],
    consultationOptions: ["in-person", "video"],
    bio: "Award-winning cardiologist with expertise in cardiac electrophysiology.",
    gender: "male"
  },
  {
    id: "d8",
    name: "Dr. Lakshmi Devi",
    specialty: "Dermatologist",
    qualifications: "MBBS, MD, DNB Dermatology",
    experience: 14,
    rating: 4.8,
    reviewCount: 445,
    fee: 1800,
    hospital: "Sakra World Hospital",
    location: "Marathahalli, Bangalore",
    city: "Bangalore, Karnataka",
    distance: 6.5,
    imageUrl: "/doctors/doctor8.png",
    availableToday: true,
    verified: true,
    languages: ["English", "Hindi", "Kannada", "Telugu"],
    consultationOptions: ["in-person", "video", "phone"],
    bio: "Expert in hair transplantation and advanced aesthetic procedures.",
    gender: "female"
  }
];
