import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { departmentService, doctorService, appointmentService } from '../../services/api';
import { Department } from '../../store/slices/departmentSlice';
import { Doctor } from '../../store/slices/doctorSlice';
import { PageLoader, ErrorState, EmptyState } from '../../components/FeedbackStates';
import { useToast } from '../../components/Toast';
import { useNavigate } from 'react-router-dom';
import { 
  Check, Calendar, Clock, ChevronRight, ChevronLeft, 
  Search, ShieldAlert, HeartPulse, Stethoscope, Landmark 
} from 'lucide-react';

export const BookAppointmentPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Booking Flow State
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingTime, setBookingTime] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string>('');
  
  // Search state for doctors (Step 2)
  const [doctorQuery, setDoctorQuery] = useState<string>('');

  // Queries
  const { data: departments, isLoading: deptsLoading } = useQuery({
    queryKey: ['bookingDepts'],
    queryFn: departmentService.getAll,
  });

  const { data: doctors, isLoading: doctorsLoading } = useQuery({
    queryKey: ['bookingDoctors'],
    queryFn: doctorService.getAll,
  });

  // Mutations
  const bookingMutation = useMutation({
    mutationFn: appointmentService.create,
    onSuccess: () => {
      toast({
        title: 'Appointment Booked!',
        description: 'Your slot has been reserved. Attending doctor has been notified.',
        variant: 'success'
      });
      navigate('/patient/appointments');
    },
    onError: (err: any) => {
      toast({
        title: 'Booking Failed',
        description: err.message || 'Unable to schedule slot. Try again.',
        variant: 'danger'
      });
    }
  });

  if (deptsLoading || doctorsLoading) return <PageLoader message="Initializing booking stepper..." />;

  // Step 2: Filter Doctors based on Selected Department OR search input query
  const filteredDoctors = (doctors || []).filter((doc: Doctor) => {
    // If user typed search query, search globally by name across all departments
    if (doctorQuery) {
      return doc.fullName.toLowerCase().includes(doctorQuery.toLowerCase()) || 
             doc.specialization.toLowerCase().includes(doctorQuery.toLowerCase());
    }
    // Else, filter strictly to selected department from Step 1
    if (selectedDept) {
      return doc.departmentId === selectedDept.id;
    }
    return true;
  });

  const handleDeptSelect = (dept: Department) => {
    setSelectedDept(dept);
    setSelectedDoctor(null); // Reset doctor
    setStep(2);
  };

  const handleDoctorSelect = (doc: Doctor) => {
    setSelectedDoctor(doc);
    // Find matching department if user searched globally
    if (!selectedDept) {
      const docDept = departments?.find((d: Department) => d.id === doc.departmentId);
      if (docDept) setSelectedDept(docDept);
    }
    setStep(3);
  };

  const handleDateTimeSelect = () => {
    if (!bookingDate || !bookingTime) {
      toast({ title: 'Input Required', description: 'Please select a date and slot.', variant: 'warning' });
      return;
    }
    setStep(4);
  };

  const handleSymptomsSubmit = () => {
    if (symptoms.trim().length < 3) {
      toast({ title: 'Invalid Symptoms', description: 'Please describe symptoms in at least 3 characters.', variant: 'warning' });
      return;
    }
    setStep(5);
  };

  const handleConfirmBooking = () => {
    bookingMutation.mutate({
      patientId: user!.id,
      doctorId: selectedDoctor!.id,
      appointmentDate: bookingDate,
      appointmentTime: bookingTime,
      symptoms: symptoms,
    });
  };

  // Mock standard time slots
  const timeSlots = ['09:00', '10:00', '11:30', '14:00', '15:30', '16:30'];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* 1. STEPPER INDICATOR */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between overflow-x-auto text-[10px] sm:text-xs select-none gap-4">
        {[
          { num: 1, name: 'Specialty' },
          { num: 2, name: 'Doctor' },
          { num: 3, name: 'Date & Time' },
          { num: 4, name: 'Symptoms' },
          { num: 5, name: 'Review' },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2 shrink-0">
            <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold border transition-colors ${
              step === s.num ? 'bg-primary text-white border-primary' :
              step > s.num ? 'bg-emerald-50 text-emerald-600 border-emerald-300' :
              'bg-slate-50 text-slate-400 border-slate-200'
            }`}>
              {step > s.num ? <Check className="h-3 w-3" /> : s.num}
            </span>
            <span className={`font-semibold ${step === s.num ? 'text-slate-800' : 'text-slate-400'}`}>
              {s.name}
            </span>
            {s.num < 5 && <ChevronRight className="h-3.5 w-3.5 text-slate-300" />}
          </div>
        ))}
      </div>

      {/* 2. DYNAMIC STEPS DISPLAY WORKSPACE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6 min-h-[350px] flex flex-col justify-between">
        
        {/* ==================================================== */}
        {/* STEP 1: SELECT SPECIALTY / DEPARTMENT */}
        {/* ==================================================== */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in flex-1">
            <div className="border-b pb-3">
              <h2 className="text-base font-bold text-slate-800">Select Specialty Unit</h2>
              <p className="text-xs text-slate-400 mt-0.5">Choose medical department or proceed to global doctor search below.</p>
            </div>

            {/* Quick search shortcut */}
            <div className="flex gap-2 mb-2">
              <button 
                onClick={() => setStep(2)}
                className="flex-1 py-3 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100/50 text-xs font-semibold text-slate-600 transition-colors flex items-center justify-center gap-2"
              >
                <Search className="h-4.5 w-4.5 text-primary" />
                <span>Search All Attending Doctors Directly</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {departments?.map((dept: Department) => (
                <div
                  key={dept.id}
                  onClick={() => handleDeptSelect(dept)}
                  className="p-4 rounded-xl border border-slate-200 hover:border-primary hover:shadow-sm cursor-pointer transition-all flex items-start gap-3.5 group bg-slate-50/20"
                >
                  <div className="p-2.5 bg-primary/5 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                    <HeartPulse className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700 leading-tight group-hover:text-primary transition-colors">{dept.name}</h4>
                    <p className="text-slate-400 leading-normal mt-1">{dept.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* STEP 2: SELECT DOCTOR */}
        {/* ==================================================== */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in flex-1">
            <div className="border-b pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  {selectedDept ? `Consultants in ${selectedDept.name}` : 'Find attending doctor'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Select attending clinical consultant.</p>
              </div>

              {/* Global search input */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search doctor by name..."
                  value={doctorQuery}
                  onChange={(e) => setDoctorQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs transition-all focus:outline-none focus:border-primary"
                />
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            {filteredDoctors.length === 0 ? (
              <EmptyState description="No doctors matching criteria found in unit." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {filteredDoctors.map((doc: Doctor) => (
                  <div
                    key={doc.id}
                    onClick={() => handleDoctorSelect(doc)}
                    className="p-4 bg-slate-50/20 border border-slate-200 rounded-xl hover:border-primary cursor-pointer transition-all flex gap-3.5"
                  >
                    <div className="h-14 w-14 rounded-full bg-slate-100 border overflow-hidden shrink-0">
                      {doc.avatarUrl ? (
                        <img src={doc.avatarUrl} alt={doc.fullName} className="h-full w-full object-cover" />
                      ) : (
                        <Stethoscope className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div>
                        <h4 className="font-bold text-slate-800 leading-tight truncate">{doc.fullName}</h4>
                        <span className="text-[10px] text-slate-400 font-semibold">{doc.specialization} ({doc.qualification})</span>
                      </div>
                      <div className="flex gap-4 border-t border-slate-100 pt-1.5">
                        <span className="text-[10px] text-slate-500 font-medium">Fee: <strong className="text-slate-700">${doc.consultationFee}</strong></span>
                        <span className="text-[10px] text-slate-500 font-medium">Exp: <strong className="text-slate-700">{doc.experience} Yrs</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* STEP 3: CHOOSE DATE & TIME */}
        {/* ==================================================== */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in flex-1">
            <div className="border-b pb-3">
              <h2 className="text-base font-bold text-slate-800">Select Date & Time Slot</h2>
              <p className="text-xs text-slate-400 mt-0.5">Dr. {selectedDoctor?.fullName} ({selectedDoctor?.specialization})</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Date Input */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-500 uppercase tracking-wider">Select Preferred Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  min={new Date().toISOString().split('T')[0]} // Block past dates
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-primary font-semibold text-slate-700 bg-slate-50/20"
                />
              </div>

              {/* Time Slots grid */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-500 uppercase tracking-wider">Select Consultation Slot</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setBookingTime(slot)}
                      className={`py-2.5 rounded-lg border text-center font-bold transition-all ${
                        bookingTime === slot 
                          ? 'bg-primary text-white border-primary shadow-sm shadow-primary/10' 
                          : 'border-slate-200 hover:border-primary text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{slot}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* STEP 4: SYMPTOMS INPUT */}
        {/* ==================================================== */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in flex-1">
            <div className="border-b pb-3">
              <h2 className="text-base font-bold text-slate-800">Describe Symptoms</h2>
              <p className="text-xs text-slate-400 mt-0.5">Please provide assessment notes for Dr. {selectedDoctor?.fullName}.</p>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-bold text-slate-500 uppercase tracking-wider">Symptoms / Notes</label>
              <textarea
                rows={5}
                placeholder="e.g. Mild shortness of breath and coughing at night for the past 3 days."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-slate-700 bg-slate-50/20 font-medium"
              />
              <span className="text-[10px] text-slate-400 font-medium">This information is secured under hospital privacy rules.</span>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* STEP 5: REVIEW & CONFIRM */}
        {/* ==================================================== */}
        {step === 5 && (
          <div className="space-y-6 animate-fade-in flex-1">
            <div className="border-b pb-3">
              <h2 className="text-base font-bold text-slate-800">Review Booking Details</h2>
              <p className="text-xs text-slate-400 mt-0.5">Ensure all details match before confirmation.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl space-y-3 leading-relaxed">
                <div>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Attending Doctor</span>
                  <span className="font-bold text-slate-700 text-sm">Dr. {selectedDoctor?.fullName}</span>
                  <span className="block text-[10px] text-slate-400">{selectedDoctor?.specialization} | {selectedDoctor?.qualification}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Consultation Fee</span>
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <Landmark className="h-4 w-4 text-slate-400" />
                    <span>${selectedDoctor?.consultationFee} USD (Payable at clinic)</span>
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl space-y-3 leading-relaxed">
                <div>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Consultation Date & Time</span>
                  <span className="font-bold text-slate-700 text-sm flex items-center gap-1.5 mt-0.5">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{bookingDate} at {bookingTime}</span>
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Reason for Checkup</span>
                  <p className="text-slate-500 italic mt-0.5">"{symptoms}"</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEPPER NAVIGATION CONTROLS FOOTER */}
        <div className="border-t border-slate-100 pt-4 flex justify-between shrink-0 text-xs mt-6">
          {step > 1 ? (
            <button
              onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4 | 5)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg font-bold text-slate-600 transition-colors flex items-center gap-1.5"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            step === 3 ? (
              <button
                onClick={handleDateTimeSelect}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold shadow-md transition-colors flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : step === 4 ? (
              <button
                onClick={handleSymptomsSubmit}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold shadow-md transition-colors flex items-center gap-1.5"
              >
                <span>Review Booking</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <div /> // Steps 1 and 2 advance automatically on item click!
            )
          ) : (
            <button
              onClick={handleConfirmBooking}
              disabled={bookingMutation.isPending}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-md transition-colors disabled:bg-slate-300"
            >
              {bookingMutation.isPending ? 'Processing Booking...' : 'Confirm Consultation Booking'}
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
export default BookAppointmentPage;
