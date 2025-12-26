
import React, { useState, useRef } from 'react';
import { MedicalRecord } from '../types';
import { summarizeRecord, analyzeMedicalImage } from '../services/geminiService';

interface VaultProps {
  records: MedicalRecord[];
  onAddRecord: (record: MedicalRecord) => void;
}

const Vault: React.FC<VaultProps> = ({ records, onAddRecord }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadText, setUploadText] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processAnalysisResult = (analysis: any, fileName?: string) => {
    const newRecord: MedicalRecord = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: analysis?.type || 'Consultation',
      facility: analysis?.facility || 'Unknown Facility',
      doctor: analysis?.doctor || 'Unknown Doctor',
      summary: analysis?.summary || 'New medical entry added.',
      insights: analysis?.insights || [],
      isDuplicate: analysis?.isDuplicatePotential || false,
      fileUrl: fileName
    };
    onAddRecord(newRecord);
  };

  const handleUpload = async () => {
    if (!uploadText) return;
    setIsUploading(true);
    const analysis = await summarizeRecord(uploadText);
    processAnalysisResult(analysis);
    setUploadText('');
    setIsUploading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = (reader.result as string).split(',')[1];
        const analysis = await analyzeMedicalImage(base64, file.type);
        if (analysis) {
          processAnalysisResult(analysis, file.name);
        }
      } catch (error) {
        console.error("File processing failed:", error);
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const filteredRecords = records.filter(r => 
    r.type.toLowerCase().includes(filter.toLowerCase()) || 
    r.facility.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-4 space-y-12">
      {/* Smart Input Section */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-[#004D40]/5 border-4 border-white">
        <div className="max-w-2xl mx-auto text-center space-y-2 mb-8">
          <div className="w-12 h-12 bg-[#A8E6CF] rounded-2xl flex items-center justify-center text-[#004D40] mx-auto mb-4 font-black">AI</div>
          <h2 className="text-2xl font-bold text-[#004D40]">Biological Manifest</h2>
          <p className="text-sm text-[#004D40]/60">Feed Gemini your clinical reports to harmonize your health timeline.</p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-4">
          <textarea 
            className="w-full p-6 bg-[#FFF8E1] border-2 border-[#A8E6CF]/30 rounded-3xl focus:ring-8 focus:ring-[#A8E6CF]/10 focus:bg-white focus:border-[#004D40] focus:outline-none transition-all resize-none text-[#004D40] placeholder:text-slate-300 font-bold"
            rows={3}
            placeholder="Clinical observations or medication changes..."
            value={uploadText}
            onChange={(e) => setUploadText(e.target.value)}
          />
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleUpload}
              disabled={isUploading || !uploadText}
              className="flex-[1.5] bg-[#004D40] hover:bg-[#004D40]/90 text-white font-black py-4 rounded-2xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#004D40]/20"
            >
              {isUploading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <svg className="w-5 h-5 text-[#A8E6CF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  Optimize Biology
                </>
              )}
            </button>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex-1 bg-white border-4 border-[#FFF8E1] text-[#004D40] font-black py-4 rounded-2xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg hover:bg-[#A8E6CF]/10"
            >
              <svg className="w-5 h-5 text-[#004D40]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
              PDF / Lab Scan
            </button>
            <input 
              type="file" 
              accept="image/*,application/pdf" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileUpload} 
            />
          </div>
        </div>
      </div>

      {/* Vertical Timeline View */}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12 px-4">
          <h2 className="text-2xl font-bold text-[#004D40]">Vitality Stream</h2>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Filter biology..." 
              className="pl-10 pr-4 py-3 bg-white border-2 border-[#A8E6CF]/30 rounded-2xl text-sm text-[#004D40] focus:ring-8 focus:ring-[#A8E6CF]/10 outline-none w-48 sm:w-64 transition-all"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <svg className="w-5 h-5 text-[#004D40]/30 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>

        <div className="relative border-l-4 border-[#A8E6CF]/30 ml-6 space-y-12">
          {filteredRecords.map((record) => (
            <div key={record.id} className="relative pl-12 group animate-in slide-in-from-left duration-500">
              {/* Timeline Bullet */}
              <div className="absolute -left-[13px] top-6 w-5 h-5 rounded-full bg-white border-4 border-[#004D40] z-10 shadow-lg group-hover:scale-125 transition-transform" />
              
              {/* Date Label */}
              <div className="absolute -left-28 top-5 w-24 text-right hidden sm:block">
                <p className="text-[10px] font-black text-[#004D40]/30 uppercase tracking-widest leading-none">{record.date.split(',')[1].trim()}</p>
                <p className="text-xs font-black text-[#004D40]/60">{record.date.split(',')[0]}</p>
              </div>

              {/* Event Card */}
              <div 
                onClick={() => setSelectedRecord(record)}
                className="bg-white p-7 rounded-[2rem] shadow-lg border-4 border-white hover:border-[#A8E6CF] hover:shadow-2xl hover:shadow-[#004D40]/5 cursor-pointer transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white bg-[#004D40] px-3 py-1 rounded-full border-2 border-white shadow-sm">
                      {record.type}
                    </span>
                    <h3 className="text-xl font-bold text-[#004D40] mt-4">{record.facility}</h3>
                    <p className="text-xs text-[#004D40]/50 font-bold uppercase tracking-tight">Lead: {record.doctor}</p>
                  </div>
                  {record.isDuplicate && (
                    <div className="bg-orange-100 text-orange-600 text-[9px] px-3 py-1 rounded-full font-black border border-orange-200">
                      BIO-OVERLAP DETECTED
                    </div>
                  )}
                </div>

                <div className="bg-[#FFF8E1] p-5 rounded-2xl mb-4 border-2 border-white">
                  <p className="text-sm text-[#004D40]/70 leading-relaxed line-clamp-2 font-medium italic">"{record.summary}"</p>
                </div>

                {record.insights && record.insights.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {record.insights.slice(0, 3).map((insight, idx) => (
                      <div key={idx} className="text-[10px] font-black bg-[#A8E6CF] text-[#004D40] px-3 py-2 rounded-xl border-2 border-white shadow-md flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#004D40]" />
                        {insight}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#004D40]/90 backdrop-blur-xl"
            onClick={() => setSelectedRecord(null)}
          />
          <div className="relative bg-[#FFF8E1] rounded-[3rem] max-w-2xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col border-8 border-white">
            <div className="p-8 border-b-4 border-white flex justify-between items-start bg-white/50">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#004D40] bg-[#A8E6CF] px-3 py-1 rounded-full">
                  Biology Confirmed
                </span>
                <h3 className="text-3xl font-black text-[#004D40] mt-4 leading-tight">{selectedRecord.facility}</h3>
                <p className="text-[#004D40]/40 font-black uppercase text-xs tracking-widest mt-1">Cycle: {selectedRecord.date}</p>
              </div>
              <button 
                onClick={() => setSelectedRecord(null)} 
                className="p-3 bg-[#004D40] text-white rounded-2xl transition-all shadow-xl shadow-[#004D40]/20"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
              <section>
                <h4 className="text-[10px] font-black text-[#004D40]/30 uppercase tracking-[0.2em] mb-4">Gemini Bio-Synthesis</h4>
                <div className="bg-white p-7 rounded-[2.5rem] border-4 border-[#A8E6CF]/10 text-sm text-[#004D40] leading-relaxed shadow-inner font-semibold">
                  {selectedRecord.summary}
                </div>
              </section>

              {selectedRecord.insights && selectedRecord.insights.length > 0 && (
                <section>
                  <h4 className="text-[10px] font-black text-[#004D40]/30 uppercase tracking-[0.2em] mb-4">Key Bio-Markers</h4>
                  <div className="grid gap-3">
                    {selectedRecord.insights.map((insight, idx) => (
                      <div key={idx} className="bg-[#004D40] p-5 rounded-2xl text-[#A8E6CF] flex gap-5 items-center font-black">
                        <span className="w-10 h-10 rounded-xl bg-[#A8E6CF] text-[#004D40] flex items-center justify-center text-xs shrink-0 shadow-lg">{idx + 1}</span>
                        {insight}
                      </div>
                    ))}
                  </div>
                </section>
              )}
              
              <section>
                <h4 className="text-[10px] font-black text-[#004D40]/30 uppercase tracking-[0.2em] mb-4">Atomic Source</h4>
                <div className="aspect-video bg-[#004D40] rounded-[2.5rem] border-8 border-white flex flex-col items-center justify-center relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#A8E6CF]/20 to-transparent pointer-events-none" />
                  <svg className="w-16 h-16 text-[#A8E6CF]/20 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.727 2.903a2 2 0 01-3.156.085l-2.083-2.083a2 2 0 00-2.828 0l-1.293 1.293a2 2 0 000 2.828l9.172 9.172a2 2 0 002.828 0l9.172-9.172a2 2 0 000-2.828l-1.293-1.293a2 2 0 00-1.022-.547z"></path></svg>
                  <p className="text-[10px] font-black text-[#A8E6CF]/30 uppercase">Vault-Secured Image</p>
                  <button className="mt-6 px-10 py-3 bg-[#A8E6CF] text-[#004D40] rounded-xl text-xs font-black hover:scale-105 transition-transform shadow-2xl">
                    View Lab Report
                  </button>
                </div>
              </section>
            </div>
            
            <div className="p-8 bg-white border-t-4 border-[#FFF8E1] flex gap-4">
              <button className="flex-1 bg-[#004D40] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-black transition-all">
                Export DNA
              </button>
              <button className="flex-1 bg-[#A8E6CF] text-[#004D40] py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-[#97d4bc] transition-all">
                Heal Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vault;
