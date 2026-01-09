const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
  { name: 'Genetic Tests', description: 'Tests that analyze chromosomes, genes, or proteins' },
  // Blog categories
  { name: 'Health Tips', description: 'Articles providing health advice' },
  { name: 'Medical News', description: 'Latest updates in healthcare' },
  { name: 'Disease Prevention', description: 'Information on preventing diseases' },
  { name: 'Mental Health', description: 'Articles about psychological wellbeing' },
  { name: 'Nutrition', description: 'Information about food and diet' }
];

const seedDB = async () => {
  try {
    console.log('Starting seed...');

    // Clear existing data
    // Note: Deleting in order to respect foreign key constraints
    await prisma.bookingTest.deleteMany({});
    await prisma.testBooking.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.comment.deleteMany({});
    await prisma.blogPost.deleteMany({});
    await prisma.test.deleteMany({});
    await prisma.lab.deleteMany({});
    await prisma.appointment.deleteMany({});
    await prisma.doctor.deleteMany({});
    await prisma.specialty.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('Previous data cleared');

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@healthcare.com',
        password: 'password123', // In real app, this should be hashed
        role: 'ADMIN',
        address: {
          street: '123 Admin St',
          city: 'Admin City',
          state: 'AS',
          zipCode: '12345'
        }
      }
    });

    console.log('Admin user created');

    // Add specialties
    for (const spec of specialties) {
      await prisma.specialty.create({ data: spec });
    }
    console.log(`${specialties.length} specialties added`);

    // Add categories
    const createdCategories = [];
    for (const cat of categories) {
      const created = await prisma.category.create({ data: cat });
      createdCategories.push(created);
    }
    console.log(`${categories.length} categories added`);

    // Get created specialties for reference
    const dbSpecialties = await prisma.specialty.findMany();
    const cardiology = dbSpecialties.find(s => s.name === 'Cardiology');
    const dermatology = dbSpecialties.find(s => s.name === 'Dermatology');

    // Add doctors
    const doctors = [
      {
        name: 'Dr. John Smith',
        specialtyId: cardiology.id,
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
        specialtyId: dermatology.id,
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

    for (const doc of doctors) {
      await prisma.doctor.create({ data: doc });
    }
    console.log(`${doctors.length} doctors added`);

    // Add labs with varied ratings for sorting - All in Bengaluru
    const labsData = [
      {
        name: 'Apollo Diagnostics - Koramangala',
        description: 'Trusted nationwide chain with quick turnaround times and home collection. State-of-the-art equipment.',
        address: { street: '100 Feet Road, Koramangala', city: 'Bengaluru', state: 'KA', zipCode: '560034' },
        contactInfo: { phone: '080-4567-1234', email: 'koramangala@apollodiag.com', website: 'www.apollodiagnostics.in' },
        certifications: ['NABL', 'CAP', 'ISO 15189'],
        operatingHours: { weekdays: { open: '06:00', close: '22:00' }, weekends: { open: '07:00', close: '20:00' } },
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Dr. Lal PathLabs - Indiranagar',
        description: 'Premium diagnostics with over 200 test categories, express delivery, and digital reports.',
        address: { street: '12th Main, HAL 2nd Stage, Indiranagar', city: 'Bengaluru', state: 'KA', zipCode: '560038' },
        contactInfo: { phone: '080-4567-4321', email: 'indiranagar@lalpathlabs.com', website: 'www.lalpathlabs.com' },
        certifications: ['NABL', 'ISO 15189', 'CAP'],
        operatingHours: { weekdays: { open: '06:00', close: '21:00' }, weekends: { open: '07:00', close: '18:00' } },
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1581093458791-9f3f49e02c7a?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Thyrocare - Jayanagar',
        description: 'Budget-friendly lab specializing in preventive health packages with free home collection.',
        address: { street: '4th Block, Jayanagar', city: 'Bengaluru', state: 'KA', zipCode: '560011' },
        contactInfo: { phone: '080-4567-8888', email: 'jayanagar@thyrocare.com', website: 'www.thyrocare.com' },
        certifications: ['NABL'],
        operatingHours: { weekdays: { open: '07:00', close: '19:00' }, weekends: { open: '08:00', close: '16:00' } },
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'SRL Diagnostics - HSR Layout',
        description: 'Advanced molecular diagnostics and specialized cancer screening with expert pathologists.',
        address: { street: '27th Main, HSR Layout Sector 1', city: 'Bengaluru', state: 'KA', zipCode: '560102' },
        contactInfo: { phone: '080-4567-7777', email: 'hsr@srldiagnostics.com', website: 'www.srldiagnostics.com' },
        certifications: ['NABL', 'CAP', 'ISO 15189'],
        operatingHours: { weekdays: { open: '06:30', close: '20:30' }, weekends: { open: '07:30', close: '17:00' } },
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Metropolis Healthcare - Whitefield',
        description: 'International quality standards with global reference labs and specialist consultation.',
        address: { street: 'ITPL Main Road, Whitefield', city: 'Bengaluru', state: 'KA', zipCode: '560066' },
        contactInfo: { phone: '080-4567-6666', email: 'whitefield@metropolisindia.com', website: 'www.metropolisindia.com' },
        certifications: ['NABL', 'CAP', 'JCI'],
        operatingHours: { weekdays: { open: '06:00', close: '22:00' }, weekends: { open: '06:00', close: '20:00' } },
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Redcliffe Labs - Electronic City',
        description: 'Affordable testing with free home collection, same-day reports, and 24/7 support.',
        address: { street: 'Phase 1, Electronic City', city: 'Bengaluru', state: 'KA', zipCode: '560100' },
        contactInfo: { phone: '080-4567-5555', email: 'ecity@redcliffelabs.com', website: 'www.redcliffelabs.com' },
        certifications: ['NABL'],
        operatingHours: { weekdays: { open: '07:00', close: '21:00' }, weekends: { open: '08:00', close: '18:00' } },
        rating: 4.1,
        image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Neuberg Diagnostics - MG Road',
        description: 'Comprehensive diagnostic services with advanced imaging and pathology.',
        address: { street: 'MG Road, Near Trinity Circle', city: 'Bengaluru', state: 'KA', zipCode: '560001' },
        contactInfo: { phone: '080-4567-3333', email: 'mgroad@neubergdiagnostics.com', website: 'www.neubergdiagnostics.com' },
        certifications: ['NABL', 'ISO 15189'],
        operatingHours: { weekdays: { open: '06:00', close: '21:00' }, weekends: { open: '07:00', close: '19:00' } },
        rating: 4.4,
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Vijaya Diagnostic Centre - Malleshwaram',
        description: 'Trusted diagnostic center with experienced technicians and quick report delivery.',
        address: { street: '8th Cross, Malleshwaram', city: 'Bengaluru', state: 'KA', zipCode: '560003' },
        contactInfo: { phone: '080-4567-2222', email: 'malleshwaram@vijayadiagnostic.com', website: 'www.vijayadiagnostic.com' },
        certifications: ['NABL', 'CAP'],
        operatingHours: { weekdays: { open: '06:30', close: '20:00' }, weekends: { open: '07:00', close: '17:00' } },
        rating: 4.2,
        image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Healthians - BTM Layout',
        description: 'Tech-enabled diagnostics with app-based booking and real-time tracking.',
        address: { street: '2nd Stage, BTM Layout', city: 'Bengaluru', state: 'KA', zipCode: '560076' },
        contactInfo: { phone: '080-4567-1111', email: 'btm@healthians.com', website: 'www.healthians.com' },
        certifications: ['NABL'],
        operatingHours: { weekdays: { open: '06:00', close: '22:00' }, weekends: { open: '06:00', close: '22:00' } },
        rating: 4.0,
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'iGenetic Diagnostics - Bannerghatta Road',
        description: 'Specialized in genetic testing, prenatal screening, and personalized medicine.',
        address: { street: 'Arekere, Bannerghatta Road', city: 'Bengaluru', state: 'KA', zipCode: '560076' },
        contactInfo: { phone: '080-4567-9999', email: 'blr@igenetic.com', website: 'www.igenetic.com' },
        certifications: ['NABL', 'CAP', 'ISO 15189'],
        operatingHours: { weekdays: { open: '08:00', close: '20:00' }, weekends: { open: '09:00', close: '17:00' } },
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Manipal Hospitals Lab - Old Airport Road',
        description: 'Hospital-attached lab with emergency services and specialist consultations available.',
        address: { street: 'Old Airport Road', city: 'Bengaluru', state: 'KA', zipCode: '560017' },
        contactInfo: { phone: '080-4567-0000', email: 'lab@manipalhospitals.com', website: 'www.manipalhospitals.com' },
        certifications: ['NABL', 'NABH', 'JCI'],
        operatingHours: { weekdays: { open: '00:00', close: '23:59' }, weekends: { open: '00:00', close: '23:59' } },
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Orange Health Labs - Marathahalli',
        description: 'Quick 60-minute home collection with instant digital reports.',
        address: { street: 'Outer Ring Road, Marathahalli', city: 'Bengaluru', state: 'KA', zipCode: '560037' },
        contactInfo: { phone: '080-4567-8000', email: 'marathahalli@orangehealth.in', website: 'www.orangehealth.in' },
        certifications: ['NABL'],
        operatingHours: { weekdays: { open: '06:00', close: '23:00' }, weekends: { open: '06:00', close: '23:00' } },
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&q=80&w=800'
      }
    ];

    const createdLabs = [];
    for (const lab of labsData) {
      const created = await prisma.lab.create({ data: lab });
      createdLabs.push(created);
    }
    console.log(`${createdLabs.length} labs added`);

    // Get categories for tests
    const bloodTestsCat = createdCategories.find(c => c.name === 'Blood Tests');
    const imagingCat = createdCategories.find(c => c.name === 'Imaging');
    const allergyCat = createdCategories.find(c => c.name === 'Allergy Tests');
    const cancerCat = createdCategories.find(c => c.name === 'Cancer Screening');
    const geneticCat = createdCategories.find(c => c.name === 'Genetic Tests');

    // Add tests with varied prices, popularity, and home collection options for all sorting combinations
    const testsData = [
      // Blood Tests - varied prices and popularity
      {
        name: 'Complete Blood Count (CBC)',
        description: 'Measures several components and features of your blood including RBC, WBC, and platelets.',
        categoryId: bloodTestsCat.id,
        price: 299,
        timeRequired: '1 hour',
        reportTime: '6 hours',
        homeCollection: true,
        homeCollectionFee: 0,
        popularity: 98,
        labs: { connect: createdLabs.map(l => ({ id: l.id })) }
      },
      {
        name: 'Lipid Profile',
        description: 'Comprehensive cholesterol and triglyceride panel for heart health assessment.',
        categoryId: bloodTestsCat.id,
        price: 449,
        preparationNeeded: 'Fasting for 10-12 hours',
        timeRequired: '30 minutes',
        reportTime: '12 hours',
        homeCollection: true,
        homeCollectionFee: 50,
        popularity: 92,
        labs: { connect: [{ id: createdLabs[0].id }, { id: createdLabs[1].id }, { id: createdLabs[2].id }] }
      },
      {
        name: 'Thyroid Function Test (T3, T4, TSH)',
        description: 'Complete thyroid panel to check metabolism and hormone levels.',
        categoryId: bloodTestsCat.id,
        price: 599,
        timeRequired: '20 minutes',
        reportTime: '24 hours',
        homeCollection: true,
        homeCollectionFee: 0,
        popularity: 88,
        labs: { connect: createdLabs.slice(0, 6).map(l => ({ id: l.id })) }
      },
      {
        name: 'HbA1c (Glycated Hemoglobin)',
        description: 'Measures average blood sugar levels over the past 2-3 months.',
        categoryId: bloodTestsCat.id,
        price: 399,
        timeRequired: '15 minutes',
        reportTime: '24 hours',
        homeCollection: true,
        homeCollectionFee: 25,
        popularity: 85,
        labs: { connect: createdLabs.slice(0, 5).map(l => ({ id: l.id })) }
      },
      {
        name: 'Liver Function Test (LFT)',
        description: 'Evaluates liver health by measuring enzymes, proteins, and bilirubin.',
        categoryId: bloodTestsCat.id,
        price: 549,
        timeRequired: '30 minutes',
        reportTime: '12 hours',
        homeCollection: true,
        homeCollectionFee: 0,
        popularity: 82,
        labs: { connect: createdLabs.slice(0, 4).map(l => ({ id: l.id })) }
      },
      {
        name: 'Kidney Function Test (KFT)',
        description: 'Assesses kidney health through creatinine, BUN, and electrolyte levels.',
        categoryId: bloodTestsCat.id,
        price: 499,
        timeRequired: '30 minutes',
        reportTime: '12 hours',
        homeCollection: true,
        homeCollectionFee: 50,
        popularity: 78,
        labs: { connect: createdLabs.slice(0, 5).map(l => ({ id: l.id })) }
      },
      {
        name: 'Vitamin D Test',
        description: 'Measures vitamin D levels to assess bone health and immune function.',
        categoryId: bloodTestsCat.id,
        price: 899,
        timeRequired: '15 minutes',
        reportTime: '48 hours',
        homeCollection: true,
        homeCollectionFee: 0,
        popularity: 90,
        labs: { connect: createdLabs.slice(0, 6).map(l => ({ id: l.id })) }
      },
      {
        name: 'Vitamin B12 Test',
        description: 'Detects vitamin B12 deficiency which can cause anemia and neurological issues.',
        categoryId: bloodTestsCat.id,
        price: 749,
        timeRequired: '15 minutes',
        reportTime: '24 hours',
        homeCollection: true,
        homeCollectionFee: 25,
        popularity: 75,
        labs: { connect: createdLabs.slice(0, 4).map(l => ({ id: l.id })) }
      },
      {
        name: 'Iron Studies (Serum Iron, TIBC, Ferritin)',
        description: 'Comprehensive iron panel to diagnose anemia and iron overload.',
        categoryId: bloodTestsCat.id,
        price: 999,
        timeRequired: '20 minutes',
        reportTime: '24 hours',
        homeCollection: true,
        homeCollectionFee: 0,
        popularity: 65,
        labs: { connect: createdLabs.slice(0, 3).map(l => ({ id: l.id })) }
      },
      {
        name: 'Complete Metabolic Panel',
        description: 'Comprehensive test covering glucose, electrolytes, kidney and liver function.',
        categoryId: bloodTestsCat.id,
        price: 1299,
        preparationNeeded: 'Fasting for 8 hours',
        timeRequired: '30 minutes',
        reportTime: '24 hours',
        homeCollection: true,
        homeCollectionFee: 0,
        popularity: 70,
        labs: { connect: createdLabs.slice(0, 4).map(l => ({ id: l.id })) }
      },
      // Imaging Tests - no home collection, varied prices
      {
        name: 'Chest X-Ray',
        description: 'Digital X-ray imaging to examine lungs, heart, and chest wall.',
        categoryId: imagingCat.id,
        price: 399,
        timeRequired: '15 minutes',
        reportTime: '2 hours',
        homeCollection: false,
        popularity: 95,
        labs: { connect: createdLabs.slice(0, 4).map(l => ({ id: l.id })) }
      },
      {
        name: 'Abdominal Ultrasound',
        description: 'Non-invasive imaging of liver, gallbladder, kidneys, and other abdominal organs.',
        categoryId: imagingCat.id,
        price: 999,
        preparationNeeded: 'Fasting for 6 hours, full bladder',
        timeRequired: '30 minutes',
        reportTime: '4 hours',
        homeCollection: false,
        popularity: 80,
        labs: { connect: createdLabs.slice(0, 3).map(l => ({ id: l.id })) }
      },
      {
        name: 'MRI Brain',
        description: 'Advanced magnetic resonance imaging for detailed brain examination.',
        categoryId: imagingCat.id,
        price: 7999,
        preparationNeeded: 'Remove all metallic objects',
        timeRequired: '45 minutes',
        reportTime: '24 hours',
        homeCollection: false,
        popularity: 55,
        labs: { connect: [{ id: createdLabs[0].id }, { id: createdLabs[2].id }] }
      },
      {
        name: 'CT Scan Chest',
        description: 'Computed tomography for detailed cross-sectional lung and chest images.',
        categoryId: imagingCat.id,
        price: 4999,
        timeRequired: '20 minutes',
        reportTime: '6 hours',
        homeCollection: false,
        popularity: 60,
        labs: { connect: [{ id: createdLabs[0].id }, { id: createdLabs[2].id }, { id: createdLabs[3].id }] }
      },
      {
        name: 'ECG (Electrocardiogram)',
        description: 'Records electrical activity of the heart to detect abnormalities.',
        categoryId: imagingCat.id,
        price: 249,
        timeRequired: '10 minutes',
        reportTime: '1 hour',
        homeCollection: true,
        homeCollectionFee: 100,
        popularity: 88,
        labs: { connect: createdLabs.slice(0, 6).map(l => ({ id: l.id })) }
      },
      {
        name: '2D Echocardiogram',
        description: 'Ultrasound imaging of heart structure and function.',
        categoryId: imagingCat.id,
        price: 2499,
        timeRequired: '30 minutes',
        reportTime: '4 hours',
        homeCollection: false,
        popularity: 72,
        labs: { connect: [{ id: createdLabs[0].id }, { id: createdLabs[2].id }] }
      },
      // Allergy Tests
      {
        name: 'Food Allergy Panel (30 Allergens)',
        description: 'Tests for common food allergies including nuts, dairy, gluten, and seafood.',
        categoryId: allergyCat.id,
        price: 2999,
        timeRequired: '20 minutes',
        reportTime: '72 hours',
        homeCollection: true,
        homeCollectionFee: 0,
        popularity: 68,
        labs: { connect: [{ id: createdLabs[0].id }, { id: createdLabs[1].id }, { id: createdLabs[5].id }] }
      },
      {
        name: 'Respiratory Allergy Panel',
        description: 'Tests for dust mites, pollen, mold, and pet dander allergies.',
        categoryId: allergyCat.id,
        price: 2499,
        timeRequired: '20 minutes',
        reportTime: '72 hours',
        homeCollection: true,
        homeCollectionFee: 50,
        popularity: 62,
        labs: { connect: [{ id: createdLabs[0].id }, { id: createdLabs[1].id }] }
      },
      {
        name: 'Total IgE',
        description: 'Measures immunoglobulin E levels to assess overall allergic tendency.',
        categoryId: allergyCat.id,
        price: 699,
        timeRequired: '15 minutes',
        reportTime: '24 hours',
        homeCollection: true,
        homeCollectionFee: 0,
        popularity: 58,
        labs: { connect: createdLabs.slice(0, 4).map(l => ({ id: l.id })) }
      },
      // Cancer Screening
      {
        name: 'PSA (Prostate Specific Antigen)',
        description: 'Screening test for prostate cancer in men over 50.',
        categoryId: cancerCat.id,
        price: 799,
        timeRequired: '15 minutes',
        reportTime: '24 hours',
        homeCollection: true,
        homeCollectionFee: 0,
        popularity: 72,
        labs: { connect: createdLabs.slice(0, 5).map(l => ({ id: l.id })) }
      },
      {
        name: 'CA-125 (Ovarian Cancer Marker)',
        description: 'Tumor marker test for ovarian cancer screening and monitoring.',
        categoryId: cancerCat.id,
        price: 1299,
        timeRequired: '15 minutes',
        reportTime: '48 hours',
        homeCollection: true,
        homeCollectionFee: 50,
        popularity: 55,
        labs: { connect: [{ id: createdLabs[0].id }, { id: createdLabs[2].id }, { id: createdLabs[5].id }] }
      },
      {
        name: 'CEA (Carcinoembryonic Antigen)',
        description: 'Marker for colorectal, lung, and other cancers.',
        categoryId: cancerCat.id,
        price: 999,
        timeRequired: '15 minutes',
        reportTime: '48 hours',
        homeCollection: true,
        homeCollectionFee: 0,
        popularity: 50,
        labs: { connect: [{ id: createdLabs[0].id }, { id: createdLabs[2].id }] }
      },
      // Genetic Tests - premium pricing
      {
        name: 'BRCA1 & BRCA2 Gene Test',
        description: 'Genetic test for hereditary breast and ovarian cancer risk.',
        categoryId: geneticCat.id,
        price: 15999,
        preparationNeeded: 'Genetic counseling recommended',
        timeRequired: '30 minutes',
        reportTime: '14 days',
        homeCollection: true,
        homeCollectionFee: 0,
        popularity: 45,
        labs: { connect: [{ id: createdLabs[0].id }, { id: createdLabs[5].id }] }
      },
      {
        name: 'Carrier Screening Panel',
        description: 'Tests for genetic conditions that could be passed to children.',
        categoryId: geneticCat.id,
        price: 9999,
        preparationNeeded: 'Genetic counseling recommended',
        timeRequired: '30 minutes',
        reportTime: '21 days',
        homeCollection: true,
        homeCollectionFee: 0,
        popularity: 35,
        labs: { connect: [{ id: createdLabs[0].id }] }
      },
      {
        name: 'Pharmacogenomics Panel',
        description: 'Analyzes how your genes affect drug response and metabolism.',
        categoryId: geneticCat.id,
        price: 12999,
        timeRequired: '30 minutes',
        reportTime: '14 days',
        homeCollection: true,
        homeCollectionFee: 0,
        popularity: 40,
        labs: { connect: [{ id: createdLabs[0].id }, { id: createdLabs[1].id }] }
      }
    ];

    for (const test of testsData) {
      await prisma.test.create({ data: test });
    }
    console.log(`${testsData.length} tests added`);

     // Add blog posts
     const healthTipsCat = createdCategories.find(c => c.name === 'Health Tips')?.name || 'Health Tips';

     const blogPosts = [
        {
          title: 'Understanding Heart Health: Tips for a Healthy Heart',
          content: 'Your heart works hard for you nonstop for your whole life. So show it some TLC. Making small changes in your habits can make a big difference to your heart...',
          authorId: adminUser.id,
          category: healthTipsCat,
          tags: ['heart health', 'cardiology', 'prevention'],
          readTime: 7,
          isPublished: true,
          coverImage: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=1000'
        },
        {
          title: 'The Importance of Regular Check-ups',
          content: 'Regular health check-ups are important even if you feel healthy. They help in identifying health issues before they start. Early detection gives you the best chance for getting the right treatment quickly...',
          authorId: adminUser.id,
          category: 'Disease Prevention',
          tags: ['check-ups', 'prevention', 'health screening'],
          readTime: 5,
          isPublished: true,
          coverImage: 'https://images.unsplash.com/photo-1576091160550-217358c7e618?auto=format&fit=crop&q=80&w=1000'
        }
      ];
  
    for (const post of blogPosts) {
      await prisma.blogPost.create({ data: post });
    }
    console.log(`${blogPosts.length} blog posts added`);

    // Add dummy reviews for labs
    const reviewsData = [
      // Apollo Diagnostics - Koramangala (lab 0)
      { userId: adminUser.id, labId: createdLabs[0].id, text: 'Excellent service! Got my reports within 6 hours. Very professional staff.', rating: 5 },
      { userId: adminUser.id, labId: createdLabs[0].id, text: 'Clean facility and friendly technicians. Highly recommend for blood tests.', rating: 5 },
      { userId: adminUser.id, labId: createdLabs[0].id, text: 'Good experience overall. Slight delay but staff was apologetic.', rating: 4 },
      
      // Dr. Lal PathLabs - Indiranagar (lab 1)
      { userId: adminUser.id, labId: createdLabs[1].id, text: 'Best lab in Bengaluru! Quick turnaround and accurate results every time.', rating: 5 },
      { userId: adminUser.id, labId: createdLabs[1].id, text: 'Very organized and systematic process. Digital reports are easy to access.', rating: 5 },
      { userId: adminUser.id, labId: createdLabs[1].id, text: 'Professional service. The phlebotomist was very gentle. Minimal pain during blood draw.', rating: 4 },
      
      // Thyrocare - Jayanagar (lab 2)
      { userId: adminUser.id, labId: createdLabs[2].id, text: 'Affordable prices and decent service. Good for basic health checkups.', rating: 4 },
      { userId: adminUser.id, labId: createdLabs[2].id, text: 'Value for money. Home collection was on time.', rating: 4 },
      
      // SRL Diagnostics - HSR Layout (lab 3)
      { userId: adminUser.id, labId: createdLabs[3].id, text: 'Advanced testing capabilities. Got specialized cancer markers done here.', rating: 5 },
      { userId: adminUser.id, labId: createdLabs[3].id, text: 'Impressive infrastructure. Staff explains test procedures well.', rating: 4 },
      { userId: adminUser.id, labId: createdLabs[3].id, text: 'Great for specialized tests. A bit expensive but worth it for accuracy.', rating: 4 },
      
      // Metropolis Healthcare - Whitefield (lab 4)
      { userId: adminUser.id, labId: createdLabs[4].id, text: 'International standard facility. CAP certified and it shows in their quality.', rating: 5 },
      { userId: adminUser.id, labId: createdLabs[4].id, text: 'Very hygienic environment. Parking can be an issue though.', rating: 4 },
      
      // Redcliffe Labs - Electronic City (lab 5)
      { userId: adminUser.id, labId: createdLabs[5].id, text: 'Same day reports as promised. Very convenient for working professionals.', rating: 4 },
      { userId: adminUser.id, labId: createdLabs[5].id, text: 'Budget-friendly with good quality. Will visit again.', rating: 4 },
      
      // Neuberg Diagnostics - MG Road (lab 6)
      { userId: adminUser.id, labId: createdLabs[6].id, text: 'Good lab with experienced technicians. Located conveniently near metro.', rating: 4 },
      { userId: adminUser.id, labId: createdLabs[6].id, text: 'Comprehensive health packages available. Staff is courteous.', rating: 4 },
      
      // Vijaya Diagnostic Centre - Malleshwaram (lab 7)
      { userId: adminUser.id, labId: createdLabs[7].id, text: 'Trusted name for diagnostics. Quick service and accurate reports.', rating: 4 },
      { userId: adminUser.id, labId: createdLabs[7].id, text: 'Old establishment with reliable service. Could improve waiting area.', rating: 3 },
      
      // Healthians - BTM Layout (lab 8)
      { userId: adminUser.id, labId: createdLabs[8].id, text: 'Love the app-based booking! Very tech-savvy experience.', rating: 4 },
      { userId: adminUser.id, labId: createdLabs[8].id, text: 'Home collection was seamless. Got real-time updates.', rating: 4 },
      
      // iGenetic Diagnostics - Bannerghatta Road (lab 9)
      { userId: adminUser.id, labId: createdLabs[9].id, text: 'Specialized genetic testing facility. Counselors explain everything clearly.', rating: 5 },
      { userId: adminUser.id, labId: createdLabs[9].id, text: 'Best for prenatal screening. Very supportive staff.', rating: 5 },
      
      // Manipal Hospitals Lab - Old Airport Road (lab 10)
      { userId: adminUser.id, labId: createdLabs[10].id, text: 'Hospital-attached lab with all facilities. Available 24x7 for emergencies.', rating: 5 },
      { userId: adminUser.id, labId: createdLabs[10].id, text: 'Trusted Manipal quality. Can consult doctors immediately if needed.', rating: 5 },
      { userId: adminUser.id, labId: createdLabs[10].id, text: 'Comprehensive testing. A bit crowded during peak hours.', rating: 4 },
      
      // Orange Health Labs - Marathahalli (lab 11)
      { userId: adminUser.id, labId: createdLabs[11].id, text: 'Lightning fast home collection! Within 60 minutes as promised.', rating: 5 },
      { userId: adminUser.id, labId: createdLabs[11].id, text: 'Modern and efficient. Digital reports are very detailed.', rating: 5 },
      { userId: adminUser.id, labId: createdLabs[11].id, text: 'Great for busy people. Love the quick turnaround time.', rating: 4 }
    ];

    for (const review of reviewsData) {
      await prisma.review.create({ data: review });
    }
    console.log(`${reviewsData.length} reviews added`);

    console.log('Database seeded successfully!');
    
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seedDB();
