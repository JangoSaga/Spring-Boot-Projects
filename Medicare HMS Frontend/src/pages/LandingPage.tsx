import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Activity, Calendar, Heart, Shield, Award, Users, 
  ChevronRight, Stethoscope, ChevronDown, Check, Star, 
  HelpCircle, PhoneCall, Mail, MapPin, ExternalLink, ArrowRight, UserPlus, LogIn 
} from 'lucide-react';
import { initialDepartments, initialDoctors } from '../services/mockData';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedDept, setSelectedDept] = useState<number | null>(1);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const departments = initialDepartments.slice(0, 6);
  const doctors = initialDoctors.slice(0, 4);

  // FAQ Data
  const faqs = [
    {
      q: "How do I schedule an appointment with a specialist?",
      a: "Simply register for a Patient Account, log in, navigate to the 'Book Appointment' section, choose your preferred department and doctor, and pick an available date and time slot."
    },
    {
      q: "Can I access my digital prescriptions and clinical summaries?",
      a: "Yes. Once a doctor completes your consultation, they write diagnostic notes and prescriptions which are saved to your electronic health record. You can view or download these records anytime from your Patient Portal."
    },
    {
      q: "What billing options and insurance models do you support?",
      a: "We support major health insurance networks. You can view fees directly in the Doctor profiles, and digital bills are automatically generated upon appointment completion."
    },
    {
      q: "Is there a portal support line for emergency guidance?",
      a: "Yes. Our support helpline (+1 800-MEDICARE) is active 24/7. However, for critical, life-threatening clinical emergencies, please call emergency services (911) immediately."
    }
  ];

  // Pricing Plans
  const pricingPlans = [
    {
      name: "Basic Consult",
      price: "$80",
      period: "per visit",
      desc: "For general health checks and routine family medicine.",
      features: [
        "Single general physician consultation",
        "Digital prescription logs",
        "E-mail & SMS confirmation support",
        "1-month follow-up medical window"
      ],
      popular: false
    },
    {
      name: "Specialist Care",
      price: "$150",
      period: "per visit",
      desc: "Direct access to board-certified medical specialists.",
      features: [
        "Consultation with any specialist",
        "Full digital health record storage",
        "Direct department coordinator support",
        "Priority scheduling queue",
        "Laboratory prescription orders"
      ],
      popular: true
    },
    {
      name: "Comprehensive Diagnostic",
      price: "$299",
      period: "package",
      desc: "Full clinical screening, blood panels, and cardiac checks.",
      features: [
        "Specialist consultation included",
        "Comprehensive blood panel & ECG report",
        "Complete physical health assessment",
        "Lifetime portal records hosting",
        "Dedicated nutritionist session"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-primary/20">
      
      {/* ==================================================== */}
      {/* NAVIGATION HEADER */}
      {/* ==================================================== */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
              <Activity className="h-5 w-5" />
            </div>
            <span className="font-heading font-extrabold text-slate-800 text-lg sm:text-xl tracking-wide">
              MediCare <span className="text-primary font-bold">HMS</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#departments" className="hover:text-primary transition-colors">Departments</a>
            <a href="#specialists" className="hover:text-primary transition-colors">Specialists</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQs</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              to="/login" 
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-700 hover:text-primary transition-colors hover:bg-slate-50 rounded-lg"
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Link>
            <Link 
              to="/register" 
              className="flex items-center gap-1.5 px-4.5 py-2 text-sm font-bold bg-primary hover:bg-primary-hover text-white rounded-lg transition-all shadow-md shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-[1px]"
            >
              <UserPlus className="h-4 w-4" />
              <span>Register</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ==================================================== */}
      {/* HERO SECTION */}
      {/* ==================================================== */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-24 bg-gradient-to-b from-white to-slate-50">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute top-1/4 right-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side info */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                <span>Next-Gen Hospital Management System</span>
              </div>

              <h1 className="font-heading font-extrabold text-slate-800 text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight">
                Advanced Clinical Care, <span className="text-primary">Digitally Simplified</span>
              </h1>

              <p className="text-slate-500 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Seamlessly schedule consultations, export secure electronic health summaries, manage inpatient queues, and streamline clinical workflows using our unified healthcare portal.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link 
                  to="/register" 
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/35 hover:-translate-y-[1px]"
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a 
                  href="#departments" 
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-sm"
                >
                  <span>Explore Specialties</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                <div>
                  <h4 className="text-2xl font-bold text-slate-800 font-heading">99.8%</h4>
                  <p className="text-xs text-slate-400 font-medium">Uptime Guarantee</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-800 font-heading">15,000+</h4>
                  <p className="text-xs text-slate-400 font-medium">Patients Onboarded</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-800 font-heading">256-bit</h4>
                  <p className="text-xs text-slate-400 font-medium">EHR Encryption</p>
                </div>
              </div>
            </div>

            {/* Right side Dashboard Preview Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glowing background highlights */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-emerald-500 opacity-20 blur-xl"></div>
                
                {/* Main Visual Glass Card */}
                <div className="relative bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden p-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-400"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                      <div className="h-3 w-3 rounded-full bg-green-400"></div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Portal Preview</span>
                  </div>

                  {/* Mock UI Content */}
                  <div className="mt-5 space-y-4">
                    <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Calendar className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-700">Dr. Sarah Jenkins</p>
                          <p className="text-[10px] text-slate-400 font-semibold">Cardiology Consult</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Active</span>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">Inpatient Queue Status</span>
                        <span className="text-[10px] text-slate-400 font-semibold">Live Updates</span>
                      </div>
                      <div className="flex gap-1.5">
                        <span className="h-2 w-1/3 bg-primary rounded-full"></span>
                        <span className="h-2 w-1/3 bg-primary rounded-full"></span>
                        <span className="h-2 w-1/3 bg-slate-200 rounded-full"></span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-medium">Estimated wait time: 14 mins</p>
                    </div>

                    <div className="p-4 bg-slate-900 text-white rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-heading">Secure Health Metrics</span>
                        <span className="text-[9px] text-slate-400 font-medium">Synced</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold font-heading">120/80</span>
                        <span className="text-[10px] text-slate-400 font-medium">mmHg (Normal BP)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* DEPARTMENTS SPOTLIGHT SECTION */}
      {/* ==================================================== */}
      <section id="departments" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
            <h2 className="font-heading font-extrabold text-slate-800 text-3xl sm:text-4xl">
              Specialized Medical Departments
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Medicare HMS hosts world-class clinical divisions, each fitted with advanced diagnostic gear and led by industry-leading physicians.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left selector menu */}
            <div className="md:col-span-4 space-y-2.5">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDept(dept.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                    selectedDept === dept.id
                      ? 'border-primary bg-primary-light text-primary shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="text-sm font-bold font-heading">{dept.name}</span>
                  <ChevronRight className={`h-4 w-4 transition-transform ${selectedDept === dept.id ? 'translate-x-1' : ''}`} />
                </button>
              ))}
            </div>

            {/* Right detail card */}
            <div className="md:col-span-8 bg-slate-50 border border-slate-200/80 p-6 sm:p-8 rounded-2xl min-h-[250px] flex flex-col justify-between">
              {selectedDept !== null ? (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Stethoscope className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 font-heading">
                          {departments.find(d => d.id === selectedDept)?.name} Department
                        </h3>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">
                          Code: {departments.find(d => d.id === selectedDept)?.code}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {departments.find(d => d.id === selectedDept)?.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <span className="text-xs text-slate-400 font-bold">
                      Full insurance coverage & direct booking applicable.
                    </span>
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline self-start"
                    >
                      <span>Book Department consultation</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 font-medium">
                  Select a clinical department to explore details
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* CLINICAL SPECIALISTS GALLERY */}
      {/* ==================================================== */}
      <section id="specialists" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
            <h2 className="font-heading font-extrabold text-slate-800 text-3xl sm:text-4xl">
              Meet Our Board-Certified Specialists
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Consult with top practitioners with extensive credentials, training, and a deep commitment to modern diagnostic medicine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doc) => (
              <div key={doc.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                    <img 
                      src={doc.avatarUrl} 
                      alt={doc.fullName} 
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs border px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-700">
                      {doc.experience} Yrs Exp
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-full">
                      {doc.departmentName}
                    </span>
                    <h3 className="font-heading font-bold text-slate-800 text-base leading-tight">
                      {doc.fullName}
                    </h3>
                    <p className="text-xs text-slate-500 leading-snug">
                      {doc.specialization}
                    </p>
                    <p className="text-[11px] text-slate-400 font-semibold italic">
                      {doc.qualification}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Consult Fee</span>
                    <span className="text-base font-bold text-slate-800">${doc.consultationFee}</span>
                  </div>
                  <Link
                    to="/login"
                    className="px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==================================================== */}
      {/* PRICING PLANS */}
      {/* ==================================================== */}
      <section id="pricing" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
            <h2 className="font-heading font-extrabold text-slate-800 text-3xl sm:text-4xl">
              Transparent, Market-Standard Pricing
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              We work with major insurance providers and offer direct patient care packages with clear pricing structures and zero hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, idx) => (
              <div 
                key={idx} 
                className={`border rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative ${
                  plan.popular 
                    ? 'border-primary bg-slate-50/50 shadow-md ring-1 ring-primary/30' 
                    : 'border-slate-200 bg-white'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}

                <div className="space-y-5">
                  <div>
                    <h3 className="font-heading font-bold text-slate-800 text-lg">{plan.name}</h3>
                    <p className="text-xs text-slate-400 font-semibold mt-1">{plan.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-800 font-heading">{plan.price}</span>
                    <span className="text-xs text-slate-400 font-semibold">/ {plan.period}</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-500">
                    {plan.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <Link
                    to="/register"
                    className={`w-full py-2.5 text-center rounded-xl text-xs font-bold block transition-all ${
                      plan.popular
                        ? 'bg-primary hover:bg-primary-hover text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    Select Plan & Register
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==================================================== */}
      {/* TESTIMONIALS SECTION */}
      {/* ==================================================== */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto mb-16">
            <h2 className="font-heading font-extrabold text-slate-800 text-3xl sm:text-4xl">
              Trusted by Thousands of Patients
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Read how our digital scheduling, real-time queues, and expert practitioners changed the care experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
              <div className="flex gap-0.5 text-yellow-400">
                <Star className="h-4.5 w-4.5 fill-current" />
                <Star className="h-4.5 w-4.5 fill-current" />
                <Star className="h-4.5 w-4.5 fill-current" />
                <Star className="h-4.5 w-4.5 fill-current" />
                <Star className="h-4.5 w-4.5 fill-current" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed italic">
                "Being able to review wait queues and book doctors from my phone saved me hours of waiting room delays. The diagnostic records are immediately updated in my portal."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
                  JD
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-700">John Doe</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">Cardiology Patient</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
              <div className="flex gap-0.5 text-yellow-400">
                <Star className="h-4.5 w-4.5 fill-current" />
                <Star className="h-4.5 w-4.5 fill-current" />
                <Star className="h-4.5 w-4.5 fill-current" />
                <Star className="h-4.5 w-4.5 fill-current" />
                <Star className="h-4.5 w-4.5 fill-current" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed italic">
                "Our pediatrician, Dr. Chen, is amazing. The interface is intuitive, making it straightforward to check scheduling times and book follow-up consultations."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
                  JS
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-700">Jane Smith</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">Parent</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-4">
              <div className="flex gap-0.5 text-yellow-400">
                <Star className="h-4.5 w-4.5 fill-current" />
                <Star className="h-4.5 w-4.5 fill-current" />
                <Star className="h-4.5 w-4.5 fill-current" />
                <Star className="h-4.5 w-4.5 fill-current" />
                <Star className="h-4.5 w-4.5 fill-current" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed italic">
                "The transparency in pricing is refreshing. Knowing doctor fees beforehand and receiving structured PDF prescriptions makes medical management very convenient."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
                  AP
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-700">Alexander Pierce</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">Neurology Patient</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================== */}
      {/* FAQ SECTION */}
      {/* ==================================================== */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center space-y-3 mb-16">
            <h2 className="font-heading font-extrabold text-slate-800 text-3xl sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Find quick answers to scheduling rules, clinical safety systems, and record management queries.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-700 text-sm focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4.5 w-4.5 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>

                <div 
                  className={`transition-all duration-250 ease-in-out ${
                    activeFaq === idx ? 'max-h-40 border-t border-slate-200/80 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                  }`}
                >
                  <p className="p-5 text-slate-500 text-xs leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==================================================== */}
      {/* FOOTER */}
      {/* ==================================================== */}
      <footer className="bg-slate-900 text-slate-400 py-16 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              <span className="font-heading font-extrabold text-white text-lg tracking-wide">
                MediCare HMS
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              An enterprise-grade platform dedicated to organizing clinic departments, physician queues, and modern patient records.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Core Portals</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-primary transition-colors">Admin Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Doctor Workspace</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Patient Account</Link></li>
              <li><Link to="/register" className="hover:text-primary transition-colors">Join as Doctor</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Contact Details</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <PhoneCall className="h-4.5 w-4.5 text-slate-500 shrink-0" />
                <span>+1 800-555-0199</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4.5 w-4.5 text-slate-500 shrink-0" />
                <span>support@medicare.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4.5 w-4.5 text-slate-500 shrink-0" />
                <span>789 Clinical Boulevard, Suite 100</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Clinical Security</h4>
            <p className="text-xs leading-relaxed text-slate-500">
              All therapeutic and medical records strictly align with HIPAA directives. System transmissions are securely encrypted with 256-bit protocols.
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} MediCare HMS. All clinical rights reserved.</span>
          <div className="flex gap-4 justify-center">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
export default LandingPage;
