'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';
import { Download, RefreshCw, Database, Lock, ArrowLeft, KeyRound } from 'lucide-react';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

interface Attendee {
  id?: string | number;
  name: string;
  designation: string;
  created_at?: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<boolean>(false);

  const [data, setData] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError(false);
      fetchData();
    } else {
      setAuthError(true);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: attendees, error: fetchError } = await supabase
        .from('attendees')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setData(attendees || []);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch data from Supabase');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (data.length === 0) {
      alert('Export karne ke liye koi data nahi hai!');
      return;
    }

    const excelData = data.map((item, index) => ({
      'S.No': index + 1,
      Name: item.name,
      Designation: item.designation,
      'Registered Date': item.created_at
        ? new Date(item.created_at).toLocaleString()
        : 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendees');

    XLSX.writeFile(
      workbook,
      `AI_Summit_Attendees_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-center mb-4 text-red-500">
            <Lock size={48} />
          </div>
          <h2 className="text-2xl font-bold text-center text-white mb-2">
            Admin Access Required
          </h2>
          <p className="text-xs text-zinc-400 text-center mb-6">
            Enter the admin password to access attendee records and export sheets.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter Password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 text-center text-lg tracking-widest"
              />
            </div>

            {authError && (
              <p className="text-xs text-red-400 text-center font-medium">
                ❌ Incorrect password! Please try again.
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound size={18} /> Unlock Dashboard
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs text-zinc-500 hover:text-zinc-300 inline-flex items-center gap-1 transition"
            >
              <ArrowLeft size={14} /> Back to Badge Generator
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-zinc-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-zinc-400 hover:text-white transition p-1 bg-zinc-800 rounded-lg border border-zinc-700"
              >
                <ArrowLeft size={18} />
              </Link>
              <h1 className="text-3xl font-bold text-red-500 flex items-center gap-3">
                <Database size={28} /> IxDF Admin Dashboard
              </h1>
            </div>
            <p className="text-sm text-zinc-400 mt-1 pl-9">
              Live registrations and attendee details from Supabase
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium py-2.5 px-4 rounded-xl flex items-center gap-2 border border-zinc-700 transition cursor-pointer"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>

            <button
              onClick={exportToExcel}
              disabled={loading || data.length === 0}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition shadow-lg shadow-green-900/20 cursor-pointer"
            >
              <Download size={18} /> Export Excel
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-500 text-red-200 p-4 rounded-xl mb-6 text-sm">
            ❌ <strong>Error:</strong> {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
            <span className="text-zinc-400 text-xs font-semibold uppercase">
              Total Attendees
            </span>
            <p className="text-3xl font-extrabold text-white mt-1">
              {data.length}
            </p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-800/60 text-zinc-400 uppercase text-[11px] font-semibold tracking-wider border-b border-zinc-800">
                  <th className="py-3.5 px-5">#</th>
                  <th className="py-3.5 px-5">Full Name</th>
                  <th className="py-3.5 px-5">Designation</th>
                  <th className="py-3.5 px-5">Date Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-zinc-500">
                      Loading data from Supabase...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-zinc-500">
                      No records found in database.
                    </td>
                  </tr>
                ) : (
                  data.map((item, idx) => (
                    <tr
                      key={item.id || idx}
                      className="hover:bg-zinc-800/40 transition"
                    >
                      <td className="py-4 px-5 text-zinc-500 font-mono">
                        {idx + 1}
                      </td>
                      <td className="py-4 px-5 font-medium text-white">
                        {item.name}
                      </td>
                      <td className="py-4 px-5">{item.designation}</td>
                      <td className="py-4 px-5 text-xs text-zinc-400">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleString()
                          : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}