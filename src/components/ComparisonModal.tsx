import React from 'react';
import { X, Check, Minus } from 'lucide-react';
import { ALL_FEATURES_COMPARISON } from '../data/publisherData';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: string) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ isOpen, onClose, onSelectPlan }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B192C]/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border-2 border-[#0B192C]/10">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#0B192C]/10 bg-[#0B192C] text-white">
          <div>
            <h3 className="text-xl font-bold text-white">MetaPOS প্যাকেজ তুলনা (BDT Pricing)</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              বই কাউন্টার, ক্যাটালগ ও স্টক, ড্যাশবোর্ড এবং সাপোর্টের বিস্তারিত তুলনা।
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body: Scrollable Table */}
        <div className="overflow-y-auto p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-[#0B192C]/20 text-[#0B192C]">
                  <th className="py-3 px-4 font-bold text-sm w-1/3">ফিচার ক্যাটাগরি</th>
                  <th className="py-3 px-3 text-center font-bold">Nexus (৳১,৯৯০)</th>
                  <th className="py-3 px-3 text-center font-bold bg-[#ECFDF5] rounded-t-lg text-[#064E3B] border-x border-[#064E3B]/20">Spark (৳৪,৯৯০)</th>
                  <th className="py-3 px-3 text-center font-bold">Rise (৳১২,৫০০)</th>
                  <th className="py-3 px-3 text-center font-bold">Titan (কাস্টম)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B192C]/10">
                {ALL_FEATURES_COMPARISON.map((category) => (
                  <React.Fragment key={category.category}>
                    <tr className="bg-[#FAF9F5]">
                      <td colSpan={5} className="py-2.5 px-4 font-bold text-xs uppercase tracking-wider text-[#0B192C]">
                        {category.category}
                      </td>
                    </tr>
                    {category.features.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#FAF9F5]">
                        <td className="py-3 px-4 text-[#0B192C] font-semibold">{item.name}</td>
                        <td className="py-3 px-3 text-center">{renderCell(item.nexus)}</td>
                        <td className="py-3 px-3 text-center bg-[#ECFDF5]/60 font-bold border-x border-[#064E3B]/20">{renderCell(item.spark)}</td>
                        <td className="py-3 px-3 text-center">{renderCell(item.rise)}</td>
                        <td className="py-3 px-3 text-center">{renderCell(item.titan)}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#0B192C]/10 bg-[#FAF9F5] flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[#0B192C]/80 font-medium">
            বইমেলায় একাধিক স্টল বা বিশেষ কাস্টমাইজেশন প্রয়োজন হলে আমাদের বাংলা কাস্টমার টিমের সাথে কথা বলুন।
          </p>
          <button
            onClick={() => {
              onClose();
              onSelectPlan('Titan');
            }}
            className="rounded-xl bg-[#064E3B] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#043E2F]"
          >
            এন্টারপ্রাইজ বিশেষজ্ঞের সাথে কথা বলুন
          </button>
        </div>
      </div>
    </div>
  );
};

function renderCell(val: boolean | string) {
  if (val === true) {
    return <Check className="h-4 w-4 text-[#064E3B] mx-auto stroke-[3]" />;
  }
  if (val === false) {
    return <Minus className="h-4 w-4 text-[#0B192C]/30 mx-auto" />;
  }
  return <span className="text-[11px] font-bold text-[#0B192C]">{val}</span>;
}
