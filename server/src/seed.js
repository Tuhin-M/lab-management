
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Lab = require('./models/Lab');
const Test = require('./models/Test');
const Specialty = require('./models/Specialty');
const Category = require('./models/Category');
const BlogPost = require('./models/BlogPost');

// Sample data
const specialties = [
  { name: 'Cardiology', description: 'Deals with heart disorders', icon: 'heart.png' },
  { name: 'Dermatology', description: 'Deals with skin disorders', icon: 'skin.png' },
  { name: 'Neurology', description: 'Deals with nervous system disorders', icon: 'brain.png' },
  { name: 'Orthopedics', description: 'Deals with musculoskeletal issues', icon: 'bone.png' },
  { name: 'Pediatrics', description: 'Medical care of infants, children, and adolescents', icon: 'child.png' }
];

const categories = [
  { name: 'Blood Tests', description: 'Tests that analyze blood components' },
  { name: 'Imaging', description: 'Tests that produce visual representations of body parts' },
  { name: 'Allergy Tests', description: 'Tests that identify allergic reactions' },
  { name: 'Cancer Screening', description: 'Tests that detect signs of cancer' },
  { name: 'Genetic Tests', description: 'Tests that analyze chromosomes, genes, or proteins' }
];

const blogCategories = [
  { name: 'Health Tips', description: 'Articles providing health advice' },
  { name: 'Medical News', description: 'Latest updates in healthcare' },
  { name: 'Disease Prevention', description: 'Information on preventing diseases' },
  { name: 'Mental Health', description: 'Articles about psychological wellbeing' },
  { name: 'Nutrition', description: 'Information about food and diet' }
];

const seedDB = async () => {
  try {
    // Connect to the database
    await connectDB();
    
    console.log('Database connected for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Lab.deleteMany({});
    await Test.deleteMany({});
    await Specialty.deleteMany({});
    await Category.deleteMany({});
    await BlogPost.deleteMany({});

    console.log('Previous data cleared');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@healthcare.com',
      password: 'password123',
      role: 'admin'
    });

    console.log('Admin user created');

    // Add specialties
    const createdSpecialties = await Specialty.insertMany(specialties);
    console.log(`${createdSpecialties.length} specialties added`);

    // Add categories
    const createdCategories = await Category.insertMany([
      ...categories,
      ...blogCategories
    ]);
    console.log(`${createdCategories.length} categories added`);

    // Add doctors
    const doctors = [
      {
        name: 'Dr. John Smith',
        specialty: 'Cardiology',
        qualifications: ['MD', 'FACC'],
        experience: 15,
        hospital: 'Heart Care Center',
        address: {
          street: '123 Main St',
          city: 'Boston',
          state: 'MA',
          zipCode: '02115'
        },
        consultationFee: 150,
        availableSlots: [
          { day: 'Monday', startTime: '09:00', endTime: '17:00' },
          { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
          { day: 'Friday', startTime: '09:00', endTime: '13:00' }
        ],
        rating: 4.8
      },
      {
        name: 'Dr. Sarah Johnson',
        specialty: 'Dermatology',
        qualifications: ['MD', 'FAAD'],
        experience: 10,
        hospital: 'Skin Health Clinic',
        address: {
          street: '456 Oak St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        },
        consultationFee: 130,
        availableSlots: [
          { day: 'Tuesday', startTime: '10:00', endTime: '18:00' },
          { day: 'Thursday', startTime: '10:00', endTime: '18:00' },
          { day: 'Saturday', startTime: '10:00', endTime: '14:00' }
        ],
        rating: 4.7
      }
    ];

    const createdDoctors = await Doctor.insertMany(doctors);
    console.log(`${createdDoctors.length} doctors added`);

    // Add labs
    const labs = [
      {
        name: 'MediLab Diagnostics',
        description: 'Full-service medical testing laboratory with state-of-the-art equipment.',
        address: {
          street: '789 Pine St',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601'
        },
        contactInfo: {
          phone: '312-555-1234',
          email: 'info@medilab.com',
          website: 'www.medilab.com'
        },
        certifications: ['CAP', 'CLIA'],
        operatingHours: {
          weekdays: { open: '07:00', close: '19:00' },
          weekends: { open: '08:00', close: '14:00' }
        },
        rating: 4.5
      },
      {
        name: 'LifeCare Labs',
        description: 'Specialized in advanced genetic and pathology testing.',
        address: {
          street: '321 Elm St',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94105'
        },
        contactInfo: {
          phone: '415-555-6789',
          email: 'contact@lifecarelabs.com',
          website: 'www.lifecarelabs.com'
        },
        certifications: ['CAP', 'ISO 15189'],
        operatingHours: {
          weekdays: { open: '08:00', close: '20:00' },
          weekends: { open: '09:00', close: '15:00' }
        },
        rating: 4.6
      }
    ];

    const createdLabs = await Lab.insertMany(labs);
    console.log(`${createdLabs.length} labs added`);

    // Add tests
    const tests = [
      {
        name: 'Complete Blood Count (CBC)',
        description: 'Measures several components and features of your blood.',
        category: 'Blood Tests',
        price: 50,
        timeRequired: '1 hour',
        reportTime: '24 hours',
        homeCollection: true,
        homeCollectionFee: 15,
        popularity: 95,
        labs: [createdLabs[0]._id, createdLabs[1]._id]
      },
      {
        name: 'Lipid Profile',
        description: 'Measures cholesterol and triglycerides in your blood.',
        category: 'Blood Tests',
        price: 45,
        preparationNeeded: 'Fasting for 12 hours',
        timeRequired: '30 minutes',
        reportTime: '24 hours',
        homeCollection: true,
        homeCollectionFee: 15,
        popularity: 90,
        labs: [createdLabs[0]._id, createdLabs[1]._id]
      },
      {
        name: 'Chest X-Ray',
        description: 'Imaging test that uses X-rays to create pictures of the inside of your chest.',
        category: 'Imaging',
        price: 120,
        timeRequired: '15 minutes',
        reportTime: '48 hours',
        homeCollection: false,
        popularity: 85,
        labs: [createdLabs[0]._id]
      },
      {
        name: 'Thyroid Function Test',
        description: 'Checks how well your thyroid gland is working.',
        category: 'Blood Tests',
        price: 65,
        timeRequired: '20 minutes',
        reportTime: '24 hours',
        homeCollection: true,
        homeCollectionFee: 15,
        popularity: 80,
        labs: [createdLabs[0]._id, createdLabs[1]._id]
      }
    ];

    const createdTests = await Test.insertMany(tests);
    console.log(`${createdTests.length} tests added`);

    // Update labs with tests
    await Lab.updateOne(
      { _id: createdLabs[0]._id },
      { $set: { tests: [createdTests[0]._id, createdTests[1]._id, createdTests[2]._id, createdTests[3]._id] } }
    );
    
    await Lab.updateOne(
      { _id: createdLabs[1]._id },
      { $set: { tests: [createdTests[0]._id, createdTests[1]._id, createdTests[3]._id] } }
    );

    // Add blog posts
    const blogPosts = [
      {
        title: 'Understanding Heart Health: Tips for a Healthy Heart',
        content: 'Your heart works hard for you nonstop for your whole life. So show it some TLC. Making small changes in your habits can make a big difference to your heart...',
        author: adminUser._id,
        category: 'Health Tips',
        tags: ['heart health', 'cardiology', 'prevention'],
        readTime: 7,
        isPublished: true
      },
      {
        title: 'The Importance of Regular Check-ups',
        content: 'Regular health check-ups are important even if you feel healthy. They help in identifying health issues before they start. Early detection gives you the best chance for getting the right treatment quickly...',
        author: adminUser._id,
        category: 'Disease Prevention',
        tags: ['check-ups', 'prevention', 'health screening'],
        readTime: 5,
        isPublished: true
      },
      {
        title: 'Managing Stress in Modern Life',
        content: 'Stress is a natural physical and mental reaction to life experiences. Everyone expresses stress from time to time. Anything from everyday responsibilities like work and family to serious life events such as a new diagnosis, war, or the death of a loved one can trigger stress...',
        author: adminUser._id,
        category: 'Mental Health',
        tags: ['stress management', 'mental health', 'wellness'],
        readTime: 8,
        isPublished: true
      }
    ];

    const createdBlogPosts = await BlogPost.insertMany(blogPosts);
    console.log(`${createdBlogPosts.length} blog posts added`);

    console.log('Database seeded successfully!');
    
    // Disconnect from database
    await mongoose.disconnect();
    console.log('Database disconnected after seeding');
    
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
