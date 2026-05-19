import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MoreVertical, Stethoscope, Mail, Phone } from 'lucide-react';

interface Doctor {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  isActive: boolean;
}

export const DoctorsManagement: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    password: '',
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    // Mock API call - replace with real API
    await new Promise(resolve => setTimeout(resolve, 500));
    setDoctors([
      {
        id: 1,
        username: 'dr_smith',
        fullName: 'Dr. Sarah Smith',
        email: 'sarah.smith@hospital.com',
        phone: '555-0123',
        specialization: 'Cardiology',
        isActive: true,
      },
      {
        id: 2,
        username: 'dr_johnson',
        fullName: 'Dr. Michael Johnson',
        email: 'michael.johnson@hospital.com',
        phone: '555-0124',
        specialization: 'Neurology',
        isActive: true,
      },
    ]);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save
    await new Promise(resolve => setTimeout(resolve, 500));
    setShowModal(false);
    setEditingDoctor(null);
    fetchDoctors(); // Refresh list
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this doctor?')) {
      await new Promise(resolve => setTimeout(resolve, 500));
      fetchDoctors(); // Refresh list
    }
  };

  const openModal = (doctor?: Doctor) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({
        username: doctor.username,
        fullName: doctor.fullName,
        email: doctor.email,
        phone: doctor.phone,
        specialization: doctor.specialization,
        password: '',
      });
    } else {
      setEditingDoctor(null);
      setFormData({
        username: '',
        fullName: '',
        email: '',
        phone: '',
        specialization: '',
        password: '',
      });
    }
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading doctors...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctors Management</h1>
          <p className="text-gray-600 mt-1">Add, edit, or remove doctor accounts</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Doctor
        </button>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{doctor.fullName}</h3>
                  <p className="text-sm text-gray-500">@{doctor.username}</p>
                </div>
              </div>
              <div className="relative group">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border hidden group-hover:block z-10">
                  <button
                    onClick={() => openModal(doctor)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(doctor.id)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{doctor.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{doctor.phone}</span>
              </div>
              <div className="mt-2 pt-2 border-t">
                <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                  {doctor.specialization}
                </span>
                {doctor.isActive ? (
                  <span className="inline-block ml-2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                    Active
                  </span>
                ) : (
                  <span className="inline-block ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                    Inactive
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization *
                    </label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  {!editingDoctor && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Temporary Password *
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                  )}
                </div>
                <div className="flex gap-3 mt-6">
                  <button type="submit" className="btn-primary flex-1">
                    {editingDoctor ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};