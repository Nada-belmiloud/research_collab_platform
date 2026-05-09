import React, { useState, useEffect } from 'react';
import { applicationService } from '../services/api';
import { Application } from '../types';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { CheckCircle2, Clock, XCircle, FileText, ArrowRight, User, Terminal } from 'lucide-react';

const Applications: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (user?.role === 'teacher') {
          const response = await applicationService.getPendingApplications();
          setApplications(response.data);
        } else {
          const response = await applicationService.getMyApplications();
          setApplications(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch applications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user]);

  const handleStatusUpdate = async (
  id: string,
  status: 'approved' | 'rejected'
) => {
  try {
    const backendStatus =
      status === 'approved' ? 'ACCEPTED' : 'REJECTED';

    await applicationService.update(id, {
      status: backendStatus,
    });

    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: backendStatus } : app
      )
    );
  } catch (err) {
    console.error('Failed to update status', err);
  }
};

  return (
    <div className="min-h-screen bg-texture pb-32 pt-12">
      <div className="max-w-5xl mx-auto px-6">
        <header className="mb-16">
          <div className="inline-flex items-center space-x-2 bg-brand-navy/5 px-4 py-1.5 rounded-full mb-6">
            <Terminal className="w-4 h-4 text-brand-navy/40" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-navy/60">Registry Management</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif text-brand-navy mb-6">
            {user?.role === 'teacher' ? 'Received' : 'Sent'} <br /><span className="italic">Proposals</span>
          </h1>
          <p className="text-xl text-brand-navy/60 font-sans max-w-2xl font-light">
            Monitor the status of project applications and manage institutional commitments.
          </p>
        </header>

        {loading ? (
          <div className="space-y-6">
             {[1, 2, 3].map(i => <div key={i} className="h-32 bg-brand-navy/5 animate-pulse rounded-3xl" />)}
          </div>
        ) : (
          <div className="space-y-6">
            {applications.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-[3rem] border border-brand-navy/5">
                <FileText className="w-16 h-16 text-brand-navy/10 mx-auto mb-6" />
                <h3 className="text-2xl font-serif mb-2">No applications yet.</h3>
                <p className="text-brand-navy/40">Active projects are waiting for your contribution.</p>
              </div>
            ) : (
              applications.map((app) => {
                const status = getStatusStyles(app.status);
                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-8 rounded-[2.5rem] border border-brand-navy/5 shadow-xl shadow-brand-navy/5 flex flex-col md:flex-row md:items-center justify-between gap-8 group"
                  >
                    <div className="flex-grow max-w-xl">
                      <div className="flex items-center gap-4 mb-3">
                         <span className={`flex items-center px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${status.bg}`}>
                           <status.icon className="w-3 h-3 mr-2" />
                           {status.label}
                         </span>
                         <span className="text-xs text-brand-navy/30 font-medium">Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                      </div>
                      
                      <h3 className="text-2xl font-serif mb-2 group-hover:text-brand-orange transition-colors">{app.projectTitle}</h3>
                      <div className="flex items-center text-sm text-brand-navy/60 font-sans mb-4">
                        <User className="w-4 h-4 mr-2 text-brand-navy/30" />
                        <span>{user?.role === 'teacher' ? `Applicant: ${app.studentName}` : `Lead: Institutional Faculty`}</span>
                      </div>
                      <p className="text-xs text-brand-navy/40 line-clamp-2 italic font-sans font-light">
                        "{app.coverLetter}"
                      </p>
                    </div>

                    <div className="flex flex-shrink-0 gap-3">
                      {user?.role === 'teacher' && app.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(app.id, 'approved')}
                            className="px-6 py-3 bg-green-600 text-white rounded-2xl text-xs font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-600/10"
                          >
                            Accept Admission
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(app.id, 'rejected')}
                            className="px-6 py-3 bg-brand-navy/5 text-brand-navy rounded-2xl text-xs font-bold hover:bg-red-50 hover:text-red-600 transition-all"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button className="flex items-center space-x-2 text-brand-navy hover:text-brand-orange font-bold text-xs group/btn">
                          <span>View Details</span>
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
