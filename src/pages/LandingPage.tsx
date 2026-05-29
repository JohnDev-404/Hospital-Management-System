import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';import { 
  Stethoscope, 
  Calendar, 
  Users, 
  Clock, 
  ArrowRight,
  Shield,
  FileText,
  Activity,
  Search,
  Loader2,
  Heart,
  
  Star,
  Phone,
  Mail,
  MapPin,
  ChevronUp,
  Quote,
  
} from 'lucide-react';

// Installations required:
// npm install framer-motion
// npm install lucide-react
// npm install react-router-dom

// Animation variants for scroll animations
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const cardHover = {
  hover: { 
    scale: 1.05, 
    transition: { duration: 0.3 },
    boxShadow: "0px 20px 40px rgba(0,0,0,0.1)"
  }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [queueStatus, setQueueStatus] = useState<{
    position: number;
    waitTime: number;
    patientName: string;
  } | null>(null);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackQueue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber) return;
    
    setTrackingLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setQueueStatus({
      position: Math.floor(Math.random() * 20) + 1,
      waitTime: Math.floor(Math.random() * 30) + 5,
      patientName: 'John Doe',
    });
    setTrackingLoading(false);
  };

  const features = [
    {
      icon: Calendar,
      title: 'Smart Appointment Scheduling',
      description: 'Book, reschedule, or cancel appointments with ease. Real-time availability checking.',
      color: 'from-blue-500 to-cyan-500',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format',
    },
    {
      icon: Users,
      title: 'Queue Management System',
      description: 'Efficient patient queue with priority levels (Normal, Urgent, Emergency).',
      color: 'from-green-500 to-emerald-500',
      image: 'https://images.unsplash.com/photo-1584515933487-779824d2930e?w=600&auto=format',
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Live queue position updates and wait time estimates.',
      color: 'from-purple-500 to-pink-500',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format',
    },
    {
      icon: Shield,
      title: 'Role-Based Access',
      description: 'Secure access for Super Admin, Admin, Receptionists, and Doctors.',
      color: 'from-red-500 to-rose-500',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&auto=format',
    },
    {
      icon: FileText,
      title: 'Medical Records',
      description: 'Secure storage of patient medical history and consultation notes.',
      color: 'from-orange-500 to-amber-500',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format',
    },
    {
      icon: Activity,
      title: 'Analytics Dashboard',
      description: 'Real-time insights on patient flow, wait times, and staff performance.',
      color: 'from-indigo-500 to-blue-500',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Cardiologist',
      content: 'This system has revolutionized how I manage my patient queue. The real-time updates are fantastic!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format',
    },
    {
      name: 'Michael Chen',
      role: 'Patient',
      content: 'Booking appointments is so easy now. I love being able to track my queue position from home.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Hospital Administrator',
      content: 'The analytics dashboard gives us incredible insights into our operations.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format',
    },
  ];

  const doctors = [
    {
      name: 'Dr. James Wilson',
      specialty: 'Cardiologist',
      experience: '15+ years',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format',
    },
    {
      name: 'Dr. Emma Thompson',
      specialty: 'Neurologist',
      experience: '12+ years',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&auto=format',
    },
    {
      name: 'Dr. Robert Chen',
      specialty: 'Pediatrician',
      experience: '10+ years',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format',
    },
    {
      name: 'Dr. Maria Garcia',
      specialty: 'Dermatologist',
      experience: '8+ years',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&auto=format',
    },
  ];

  const stats = [
    { value: '500+', label: 'Patients Served', icon: Users, trend: '+25%', color: 'from-blue-500 to-cyan-500' },
    { value: '1000+', label: 'Appointments', icon: Calendar, trend: '+15%', color: 'from-green-500 to-emerald-500' },
    { value: '98%', label: 'Satisfaction Rate', icon: Star, trend: '+5%', color: 'from-yellow-500 to-orange-500' },
    { value: '15+', label: 'Doctors', icon: Stethoscope, trend: '+3', color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation Bar with Animation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-lg z-50"
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">HospitalMS</span>
          </motion.div>
          <div className="hidden md:flex items-center gap-6">
            {['Home', 'Book Appointment', 'Track Queue'].map((item) => (
              <motion.button
                key={item}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`)}
                className="text-gray-600 hover:text-gray-800 transition-colors font-medium"
              >
                {item}
              </motion.button>
            ))}
          </div>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
            >
              Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Register
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Animated Background */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 animate-gradient"></div>
        
        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20"
              initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
              animate={{
                y: [null, -100, 100],
                x: [null, 50, -50],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
        
        {/* Hero Background Image */}
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&auto=format" 
            alt="Hospital background"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-6 relative">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <motion.div >
              <motion.div 
                
                className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm mb-6"
              >
                <Heart className="w-4 h-4" />
                Your Health, Our Priority
              </motion.div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Modern Hospital{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Queue & Appointment
                </span>{' '}
                Management
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Streamline patient flow, reduce wait times, and improve healthcare delivery
                with our comprehensive hospital management solution.
              </p>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/book-appointment')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  Book Appointment
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/track-queue')}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-all flex items-center gap-2"
                >
                  Track Queue
                </motion.button>
              </div>
            </motion.div>

            {/* Enhanced Queue Status Widget */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center animate-pulse">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Check Queue Status</h3>
                  <p className="text-gray-500 text-sm">Enter your token number</p>
                </div>
              </div>
              <form onSubmit={handleTrackQueue}>
                <input
                  type="text"
                  placeholder="Enter Token Number or Phone Number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={trackingLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium"
                >
                  {trackingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  Track Now
                </motion.button>
              </form>

              <AnimatePresence>
                {queueStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl"
                  >
                    <p className="text-sm text-gray-600">Patient: {queueStatus.patientName}</p>
                    <p className="text-3xl font-bold text-blue-600">Position: #{queueStatus.position}</p>
                    <p className="text-sm text-gray-600">Est. Wait Time: {queueStatus.waitTime} minutes</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${100 - (queueStatus.position / 20) * 100}%` }}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section with Counter Animation */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-xl transition-all"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r ${stat.color} rounded-2xl mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                  <div className="text-xs text-green-600 mt-1">{stat.trend}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section with Images */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your hospital efficiently
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover="hover"
                  variants={cardHover}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-20`}></div>
                  </div>
                  <div className="p-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-r ${feature.color}`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Meet Our Expert Doctors Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Expert Doctors</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experienced professionals dedicated to your health
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors.map((doctor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                  <p className="text-gray-500 text-sm">{doctor.experience}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                  >
                    Book Appointment
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple steps to get started with our hospital management system
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Book Appointment', description: 'Choose your doctor and time slot online', icon: Calendar, image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&auto=format' },
              { step: '02', title: 'Get Token Number', description: 'Receive unique token for tracking', icon: Clock, image: 'https://images.unsplash.com/photo-1584515933487-779824d2930e?w=400&auto=format' },
              { step: '03', title: 'Track Queue', description: 'Monitor your position in real-time', icon: Activity, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white text-6xl font-bold opacity-50">{item.step}</div>
                  </div>
                  <div className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section with Avatars */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Trusted by healthcare professionals and patients alike
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-xl transition-all relative"
              >
                <Quote className="absolute top-6 right-6 w-8 h-8 text-gray-300" />
                <div className="flex items-center gap-4 mb-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg" />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Animated Background */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20"></div>
          <motion.div
            animate={{ x: [0, 100, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 opacity-10"
          >
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&auto=format')] bg-cover"></div>
          </motion.div>
        </div>
        <div className="container mx-auto px-6 text-center relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-blue-100 mb-8 max-w-2xl mx-auto"
          >
            Join thousands of healthcare providers using our platform to manage their operations.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register')}
            className="px-8 py-3 bg-white text-blue-600 rounded-xl hover:shadow-xl transition-all font-semibold"
          >
            Register Now
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope className="w-6 h-6 text-blue-400" />
                <span className="text-white font-semibold text-lg">HospitalMS</span>
              </div>
              <p className="text-sm">Modern hospital management solution for better healthcare delivery.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/')} className="hover:text-white transition-colors">Home</button></li>
                <li><button onClick={() => navigate('/book-appointment')} className="hover:text-white transition-colors">Book Appointment</button></li>
                <li><button onClick={() => navigate('/track-queue')} className="hover:text-white transition-colors">Track Queue</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +1 (555) 123-4567</li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@hospitalms.com</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> 123 Healthcare Ave, Medical City</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                {['Twitter', 'Facebook', 'LinkedIn'].map((social) => (
                  <motion.a
                    key={social}
                    whileHover={{ scale: 1.1 }}
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    {social[0]}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm">© 2024 HospitalMS. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-full shadow-lg z-50"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Add custom keyframe animations */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
      `}</style>
    </div>
  );
};