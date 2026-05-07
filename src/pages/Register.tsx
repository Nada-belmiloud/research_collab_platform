import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, Lock, Briefcase, Loader2, ArrowRight, 
  ChevronLeft, GraduationCap, School, BookOpen, 
  FileText, FlaskConical, Award, Globe, Upload, CheckCircle2
} from 'lucide-react';
import api from "../api/api";

const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [roleGroup, setRoleGroup] = useState<'STUDENT' | 'TEACHER' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  

  const [formData, setFormData] = useState({
    // Base User Fields
    full_name: '',
    email: '',
    password: '',
    role: '' as string,
    
    // Student specific fields
    university: '',
    level: 'UNDERGRADUATE' as 'UNDERGRADUATE' | 'GRADUATE' | 'PHD',
    major: '',
    bio: '',
    experience: '',
    research_interests: '',
    skills: '',
  

    // Teacher specific fields
    experience_years: 0,
    grade: '',
    department: '',
  });

  

  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleRoleGroupSelect = (group: 'STUDENT' | 'TEACHER') => {
    setRoleGroup(group);
    if (group === 'STUDENT') {
      setFormData(prev => ({ ...prev, role: 'STUDENT' }));
    } else {
      // Default to PROFESSOR for teacher group, can be changed in step 3
      setFormData(prev => ({ ...prev, role: 'TEACHER' }));
    }
    setStep(2);
  };

  
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  try {
    await register({
      email: formData.email,
      full_name: formData.full_name,
      password: formData.password,
    });

    await login({
      email: formData.email,
      password: formData.password,
    });

    const completePayload =
      roleGroup === "STUDENT"
        ? {
            role: "STUDENT",
            research_interests: formData.research_interests,
          }
        : {
            role: formData.role, // ✅ PROFESSOR / DOCTOR / RESEARCHER / MCA
            experience_years: formData.experience_years,
            grade: formData.grade,
            department: formData.department,
            research_interests: formData.research_interests,
          };

    await api.patch("/auth/complete-registration", completePayload);

    navigate("/profile");

  } catch (err: any) {
    setError(
      err?.response?.data?.detail ||
      err?.message ||
      "Registration failed"
    );
  } finally {
    setIsLoading(false);
  }
};
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-texture py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl border border-brand-navy/5"
      >
        {/* Progress Bar */}
        <div className="flex justify-between mb-12 max-w-xs mx-auto">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= s ? 'bg-brand-navy text-white' : 'bg-brand-navy/5 text-brand-navy/30'
              }`}>
                {s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 mx-2 ${step > s ? 'bg-brand-navy' : 'bg-brand-navy/5'}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Role Group Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-12"
            >
              <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Join Research Lab</h2>
                <p className="text-brand-navy/60 font-sans font-light max-w-md mx-auto">
                  Select your primary role to begin your academic journey.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => handleRoleGroupSelect('STUDENT')}
                  className="group p-8 rounded-[2.5rem] border-2 border-brand-navy/5 hover:border-brand-orange hover:bg-brand-cream/30 transition-all text-left flex flex-col items-center md:items-start"
                >
                  <div className="w-16 h-16 bg-brand-navy/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Student</h3>
                  <p className="text-brand-navy/50 text-sm font-sans text-center md:text-left leading-relaxed">
                    Undergraduate, Graduate or PhD candidate seeking research opportunities.
                  </p>
                </button>

                <button
                  onClick={() => handleRoleGroupSelect('TEACHER')}
                  className="group p-8 rounded-[2.5rem] border-2 border-brand-navy/5 hover:border-brand-teal hover:bg-brand-cream/30 transition-all text-left flex flex-col items-center md:items-start"
                >
                  <div className="w-16 h-16 bg-brand-navy/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-teal group-hover:text-white transition-colors">
                    <School className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Teacher</h3>
                  <p className="text-brand-navy/50 text-sm font-sans text-center md:text-left leading-relaxed">
                    Professors, Researchers leading institutional studies.
                  </p>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Base User Info */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <button
                onClick={prevStep}
                className="flex items-center text-brand-navy/40 hover:text-brand-navy mb-8 transition-colors text-sm font-bold uppercase tracking-widest"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </button>

              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Account Essentials</h2>
                <p className="text-brand-navy/60 font-sans font-light">Set up your login credentials.</p>
              </div>

              <div className="space-y-6 max-w-md mx-auto">

              <div className="space-y-2">
    
                
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-navy/40 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-navy/30" />
                    <input
                      type="text"
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-brand-navy/5 border border-transparent rounded-2xl focus:border-brand-orange focus:bg-white outline-none transition-all font-sans"
                      placeholder="e.g. Dr. Jane Cooper"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-navy/40 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-navy/30" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 bg-brand-navy/5 border border-transparent rounded-2xl focus:border-brand-orange focus:bg-white outline-none transition-all font-sans"
                      placeholder="name@university.edu"
                    />
                  </div>
                </div>

                <div className="space-y-2">
  <label className="text-xs font-bold uppercase tracking-wider text-brand-navy/40 ml-1">
    Secure Password
  </label>
  <div className="relative">
    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-navy/30" />
    <input
      type="password"
      required
      value={formData.password}
      onChange={(e) =>
        setFormData({ ...formData, password: e.target.value })
      }
      className="w-full pl-12 pr-4 py-4 bg-brand-navy/5 border border-transparent rounded-2xl focus:border-brand-orange focus:bg-white outline-none transition-all font-sans"
      placeholder="••••••••"
    />
  </div>
</div>

                <button
                  onClick={nextStep}
                  disabled={!formData.full_name || !formData.email || !formData.password}
                  className="w-full bg-brand-navy text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-xl hover:bg-brand-teal transition-all active:scale-95 disabled:opacity-50 mt-8"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Profile Specific Fields */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button
                onClick={prevStep}
                className="flex items-center text-brand-navy/40 hover:text-brand-navy mb-8 transition-colors text-sm font-bold uppercase tracking-widest"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </button>

              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Research Profile</h2>
                <p className="text-brand-navy/60 font-sans font-light">Tell the community about your expertise.</p>
              </div>

              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {roleGroup === 'STUDENT' ? (
                  /* Student Profile Fields */
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-brand-navy/40 ml-1">University</label>
                        <div className="relative">
                          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-navy/30" />
                          <input
                            type="text"
                            required
                            value={formData.university}
                            onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-brand-navy/5 border border-transparent rounded-xl focus:border-brand-orange focus:bg-white outline-none transition-all font-sans text-sm"
                            placeholder="Harvard University"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-brand-navy/40 ml-1">Academic Level</label>
                        <select
                          value={formData.level}
                          onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                          className="w-full px-4 py-3 bg-brand-navy/5 border border-transparent rounded-xl focus:border-brand-orange focus:bg-white outline-none transition-all font-sans text-sm appearance-none cursor-pointer"
                        >
                          <option value="UNDERGRADUATE">Undergraduate</option>
                          <option value="GRADUATE">Graduate</option>
                          <option value="PHD">PhD Candidate</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-brand-navy/40 ml-1">Major / Discipline</label>
                        <div className="relative">
                          <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-navy/30" />
                          <input
                            type="text"
                            required
                            value={formData.major}
                            onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-brand-navy/5 border border-transparent rounded-xl focus:border-brand-orange focus:bg-white outline-none transition-all font-sans text-sm"
                            placeholder="Quantum Physics"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-brand-navy/40 ml-1">Professional Bio</label>
                        <textarea
                          required
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          className="w-full px-4 py-3 bg-brand-navy/5 border border-transparent rounded-xl focus:border-brand-orange focus:bg-white outline-none transition-all font-sans text-sm min-h-[100px]"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-brand-navy/40 ml-1">Research Interests</label>
                        <div className="relative">
                          <FlaskConical className="absolute left-4 top-4 w-4 h-4 text-brand-navy/30" />
                          <textarea
                            required
                            value={formData.research_interests}
                            onChange={(e) => setFormData({ ...formData, research_interests: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-brand-navy/5 border border-transparent rounded-xl focus:border-brand-orange focus:bg-white outline-none transition-all font-sans text-sm min-h-[100px]"
                            placeholder="AI, Biotechnology, Ethics..."
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-brand-navy/40 ml-1">Skills (Comma separated)</label>
                        <input
                          type="text"
                          required
                          value={formData.skills}
                          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                          className="w-full px-4 py-3 bg-brand-navy/5 border border-transparent rounded-xl focus:border-brand-orange focus:bg-white outline-none transition-all font-sans text-sm"
                          placeholder="Python, LaTeX, Statistics..."
                        />
                      </div>

                    </div>
                  </div>
                ) : (
                  /* Teacher Profile Fields */
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-brand-navy/40 ml-1">Formal Role</label>
                        <select
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="w-full px-4 py-3 bg-brand-navy/5 border border-transparent rounded-xl focus:border-brand-orange focus:bg-white outline-none transition-all font-sans text-sm appearance-none cursor-pointer"
                        >
                          <option value="PROFESSOR">Professor</option>
                          <option value="DOCTOR">Doctor</option>
                          <option value="RESEARCHER">Researcher</option>
                          <option value="MCA">MCA</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-brand-navy/40 ml-1">Department</label>
                        <div className="relative">
                          <FlaskConical className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-navy/30" />
                          <input
                            type="text"
                            required
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-brand-navy/5 border border-transparent rounded-xl focus:border-brand-orange focus:bg-white outline-none transition-all font-sans text-sm"
                            placeholder="Computer Science"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-brand-navy/40 ml-1">Academic Grade</label>
                        <div className="relative">
                          <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-navy/30" />
                          <input
                            type="text"
                            required
                            value={formData.grade}
                            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-brand-navy/5 border border-transparent rounded-xl focus:border-brand-orange focus:bg-white outline-none transition-all font-sans text-sm"
                            placeholder="Senior Faculty / Head of Dept"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-brand-navy/40 ml-1">Years of Experience</label>
                        <input
                          type="number"
                          required
                          value={formData.experience_years}
                          onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) })}
                          className="w-full px-4 py-3 bg-brand-navy/5 border border-transparent rounded-xl focus:border-brand-orange focus:bg-white outline-none transition-all font-sans text-sm"
                          min="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-brand-navy/40 ml-1">Research Focus</label>
                        <textarea
                          required
                          value={formData.research_interests}
                          onChange={(e) => setFormData({ ...formData, research_interests: e.target.value })}
                          className="w-full px-4 py-3 bg-brand-navy/5 border border-transparent rounded-xl focus:border-brand-orange focus:bg-white outline-none transition-all font-sans text-sm min-h-[150px]"
                          placeholder="Detail your primary areas of study and expertise..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-8">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full max-w-sm mx-auto bg-brand-navy text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-xl hover:bg-brand-teal transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Complete Registration</span>
                        <CheckCircle2 className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 text-center border-t border-brand-navy/5 pt-8">
          <p className="text-sm text-brand-navy/50 font-sans">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-orange font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
