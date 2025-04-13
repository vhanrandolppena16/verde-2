// ACcount.jsx

import React, { useEffect, useState } from 'react';
import { getAuth, updatePassword } from 'firebase/auth';
import {
  doc, getDoc, updateDoc
} from 'firebase/firestore';
import {
  getStorage, ref, uploadBytes, getDownloadURL, deleteObject
} from 'firebase/storage';
import { db } from '../../../firebase/firebase';

const AccountPage = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    language: 'english',
    profileImageUrl: '',
    newPassword: '',
    currentPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setForm((prev) => ({ ...prev, ...data }));
        setPreviewUrl(data.profileImageUrl);
      }
    };

    loadUserData();
  }, [user.uid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const storage = getStorage();
    const storageRef = ref(storage, `profile_pictures/${user.uid}.jpg`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await updateDoc(doc(db, 'users', user.uid), {
      profileImageUrl: url,
    });

    setPreviewUrl(url);
    setFile(null);
    setLoading(false);
  };

  const handleRemovePhoto = async () => {
    const storage = getStorage();
    const storageRef = ref(storage, `profile_pictures/${user.uid}.jpg`);
    await deleteObject(storageRef).catch(console.error);

    await updateDoc(doc(db, 'users', user.uid), {
      profileImageUrl: '',
    });

    setPreviewUrl('');
  };

  const handleUpdateInfo = async () => {
    setLoading(true);
    await updateDoc(doc(db, 'users', user.uid), {
      fullName: form.fullName,
      phone: form.phone,
      language: form.language
    });
    setLoading(false);
  };

  const handleUpdatePassword = async () => {
    if (form.newPassword) {
      try {
        await updatePassword(user, form.newPassword);
        alert('Password updated successfully');
      } catch (error) {
        alert('Error: Make sure user recently logged in');
      }
    }
  };

  useEffect(() => {
    document.title = "Account | Verde";
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-y-auto">
      <div className="flex flex-col items-center">
        {previewUrl ? (
          <img src={previewUrl} alt="Profile" className="w-28 h-28 rounded-full object-cover" />
        ) : (
          <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center">No Photo</div>
        )}

        <div className="flex gap-2 mt-3">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm"
          />
          <button
            className="bg-green-500 text-white px-3 py-1 rounded"
            onClick={handleUpload}
            disabled={loading || !file}
          >
            Upload New
          </button>
          <button
            className="bg-gray-300 px-3 py-1 rounded"
            onClick={handleRemovePhoto}
          >
            Remove
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <div className="mt-6 space-y-3">
        <h3 className="text-lg font-bold">Basic Information</h3>
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full border rounded p-2"
        />
        <button
          onClick={handleUpdateInfo}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Update Info
        </button>
      </div>

      {/* Password */}
      <div className="mt-6 space-y-3">
        <h3 className="text-lg font-bold">Change Password</h3>
        <input
          type="password"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          placeholder="New Password"
          className="w-full border rounded p-2"
        />
        <button
          onClick={handleUpdatePassword}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Update Password
        </button>
      </div>

      {/* Language */}
      <div className="mt-6 space-y-3">
        <h3 className="text-lg font-bold">Language</h3>
        <div className="flex gap-3">
          <button
            onClick={() => setForm((prev) => ({ ...prev, language: 'english' }))}
            className={`px-4 py-2 rounded-full ${form.language === 'english' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            English
          </button>
          <button
            onClick={() => setForm((prev) => ({ ...prev, language: 'filipino' }))}
            className={`px-4 py-2 rounded-full ${form.language === 'filipino' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            Filipino
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
