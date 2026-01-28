
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, TrendingUp, ShieldCheck, Bell, ShoppingCart, Activity, Menu, History,
  DollarSign, Heart, Calendar, AlertTriangle, FileText, LogOut, ChevronRight,
  Sparkles, Package, UserCheck, CheckCircle2, Gavel, Wallet, Info, 
  ArrowUpCircle, ArrowDownCircle, Repeat, Lightbulb, PlayCircle, MapPin, 
  Clock, Zap, Calculator, Trash2, RefreshCw, Scale, X, Stethoscope, 
  MoveHorizontal, ArrowRightLeft, Truck, UsersRound, FileSearch, 
  PackageCheck, Receipt, BarChart3, Plus, ScanLine, ArrowRight, Eye, Download,
  Star, ClipboardCheck
} from 'lucide-react';
import { 
  ColibriLogo, INITIAL_EXCHANGE_RATE, MOCK_MEMBERS, MOCK_INVENTORY, 
  MOCK_MEETINGS, MOCK_SUPPLIER_OFFERS, MOCK_INFRACTIONS, MOCK_TRANSACTIONS,
  FINANCIAL_TERMS, MOCK_LOCATIONS, MOCK_SHIFTS
} from './constants.tsx';
import { 
  Member, InventoryItem, AuditLog, Meeting, SupplierOffer, Infraction, 
  AccountingTransaction, Location, Shift, DailyReport, WastageLog, 
  InventoryTransfer
} from './types.ts';
import { 
  analyzeSupplierROI, checkEqualityAudit, summarizeAssembly, 
  generateDailyStrategicFlash, explainAccountingTransaction
} from './geminiService.ts';

type View = 'dashboard' | 'inventory' | 'pos' | 'suppliers' | 'meetings' | 'wastage' | 'ethics' | 'accounting' | 'ai-assistant' | 'recepcion';

interface CartItem {
  id: string;
  name: string;
  priceUSD: number;
  weight: number; 
}

const App: React.FC = () => {
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [exchangeRate, setExchangeRate] = useState(INITIAL_EXCHANGE_RATE);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [members] = useState<Member[]>(MOCK_MEMBERS);
  const [locations] = useState<Location[]>(MOCK_LOCATIONS);
  const [shifts] = useState<Shift[]>(MOCK_SHIFTS);
  const [inventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [infractions] = useState<Infraction[]>(MOCK_INFRACTIONS);
  const [transactions, setTransactions] = useState<AccountingTransaction[]>(MOCK_TRANSACTIONS);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
  const [meetings] = useState<Meeting[]>(MOCK_MEETINGS);
  const [suppliers] = useState<SupplierOffer[]>(MOCK_SUPPLIER_OFFERS);
  const [isGeneratingFlash, setIsGeneratingFlash] = useState(false);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const myShiftToday = useMemo(() => currentMember ? shifts.find(s => s.memberId === currentMember.id && s.date === todayStr) : null, [currentMember, shifts, todayStr]);

  const membersAtLocation = (locId: string) => shifts.filter(s => s.locationId === locId && s.date === todayStr).length;

  const generateFlash = async () => {
    setIsGeneratingFlash(true);
    const content = await generateDailyStrategicFlash("$1,240.00", "Stock Crítico en PN", "Rotación Activa", exchangeRate, "$14.20");
    setDailyReports(prev => [{
      id: 'dr-' + Date.now(),
      date: todayStr,
      content,
      summary: "Flash Estratégico",
      metrics: { totalSalesUSD: 1240, topLocation: "Ruiz Pineda", criticalStockItem: "Queso Blanco", wastageLossUSD: 14.2, netUtilityUSD: 310 }
    }, ...prev]);
    setIsGeneratingFlash(false);
  };

  if (!currentMember) {
    return (
      <div className="min-h-screen bg-white flex overflow-hidden font-['Inter']">
        <div className="hidden lg:flex w-5/12 bg-[#064e3b] relative flex-col justify-between p-12 text-white border-r border-white/5 shadow-2xl">
           <div className="absolute inset-0 bg-gradient-to-br from-[#064e3b] to-[#ea580c] opacity-30"></div>
           <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                 <ColibriLogo className="w-8 h-8 text-white" />
                 <h2 className="text-lg font-black tracking-tighter uppercase italic leading-none">Los Colibrís <br/><span className="text-[9px] font-medium tracking-[0.3em] opacity-60 uppercase">Cooperativa Horizontal</span></h2>
              </div>
              <h1 className="text-5xl font-black tracking-tighter leading-[0.95] mb-6">Soberanía <br/>Alimentaria <br/>Digital.</h1>
              <div className="w-16 h-1.5 bg-orange-colibri mb-8 rounded-full"></div>
              <p className="text-base font-medium text-emerald-50 max-w-sm leading-relaxed opacity-70">
                Gestión transparente de charcutería y comunidad para los 12 socios propietarios.
              </p>
           </div>
           <div className="relative z-10 flex gap-8 border-t border-white/10 pt-8">
              <div>
                 <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400 mb-1 block">Unidad Ruiz Pineda</span>
                 <span className="text-xs font-bold opacity-60">Operativa</span>
              </div>
              <div>
                 <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400 mb-1 block">Unidad Pueblo Nuevo</span>
                 <span className="text-xs font-bold opacity-60">Operativa</span>
              </div>
           </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 overflow-y-auto">
           <div className="w-full max-w-md">
              <div className="text-center mb-8">
                 <div className="lg:hidden flex justify-center mb-4">
                    <ColibriLogo className="w-10 h-10 text-emerald-colibri" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Acceso de Socios</h3>
                 <p className="text-xs text-slate-500 font-medium">Seleccione su perfil para auditar el ecosistema.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                 {members.map(m => (
                    <button 
                       key={m.id} 
                       onClick={() => setCurrentMember(m)} 
                       className="group bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-colibri hover:shadow-md transition-all flex flex-col items-center text-center active:scale-95"
                    >
                       <img src={m.avatar} className="w-12 h-12 rounded-full border border-slate-100 mb-2 group-hover:scale-105 transition-transform" alt="" />
                       <span className="font-bold text-[10px] text-slate-800 leading-none mb-0.5">{m.name}</span>
                       <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest">Socio Auditor</span>
                    </button>
                 ))}
              </div>
              
              <div className="bg-slate-900 text-white p-6 rounded-3xl flex items-center justify-between gap-4 shadow-xl border border-white/5">
                 <div className="flex-1">
                    <h4 className="text-[9px] font-black flex items-center gap-2 mb-1.5 uppercase tracking-widest text-emerald-400"><ShieldCheck size={12} /> Transparencia Radical</h4>
                    <p className="text-[9px] text-slate-400 leading-relaxed font-medium">Cada movimiento es visible para todos en tiempo real.</p>
                 </div>
                 <ArrowRight className="text-white/10" size={24} />
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#fbfbfb] text-slate-900 font-['Inter'] overflow-hidden">
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-slate-100 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
             <ColibriLogo className="w-5 h-5 text-emerald-colibri" />
             <h1 className="font-black text-[10px] tracking-widest uppercase italic text-slate-900">Los Colibrís</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-300 hover:text-slate-900"><X size={16}/></button>
        </div>
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto custom-scrollbar overflow-x-hidden">
          <NavItem active={activeView === 'dashboard'} onClick={() => { setActiveView('dashboard'); setIsSidebarOpen(false); }} icon={<TrendingUp size={14}/>} label="Panel Central" />
          <NavItem active={activeView === 'inventory'} onClick={() => { setActiveView('inventory'); setIsSidebarOpen(false); }} icon={<ShoppingCart size={14}/>} label="Almacén Maestro" />
          <NavItem active={activeView === 'pos'} onClick={() => { setActiveView('pos'); setIsSidebarOpen(false); }} icon={<Calculator size={14}/>} label="Venta Mostrador" />
          <NavItem active={activeView === 'recepcion'} onClick={() => { setActiveView('recepcion'); setIsSidebarOpen(false); }} icon={<PackageCheck size={14}/>} label="Recepción Ética" />
          <NavItem active={activeView === 'suppliers'} onClick={() => { setActiveView('suppliers'); setIsSidebarOpen(false); }} icon={<Truck size={14}/>} label="Proveedores ROI" />
          <NavItem active={activeView === 'meetings'} onClick={() => { setActiveView('meetings'); setIsSidebarOpen(false); }} icon={<FileSearch size={14}/>} label="Asambleas IA" />
          <NavItem active={activeView === 'wastage'} onClick={() => { setActiveView('wastage'); setIsSidebarOpen(false); }} icon={<Scale size={14}/>} label="Control Mermas" />
          <NavItem active={activeView === 'ethics'} onClick={() => { setActiveView('ethics'); setIsSidebarOpen(false); }} icon={<Gavel size={14}/>} label="Gestión Ética" />
          <NavItem active={activeView === 'accounting'} onClick={() => { setActiveView('accounting'); setIsSidebarOpen(false); }} icon={<Wallet size={14}/>} label="Contabilidad" />
          <NavItem active={activeView === 'ai-assistant'} onClick={() => { setActiveView('ai-assistant'); setIsSidebarOpen(false); }} icon={<Sparkles size={14}/>} label="Cerebro IA" />
        </nav>
        <div className="p-5 border-t border-slate-50 flex items-center gap-3 shrink-0">
          <img src={currentMember.avatar} className="w-8 h-8 rounded-full border border-emerald-50 shadow-sm" alt="" />
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-bold text-slate-800 truncate leading-none mb-1">{currentMember.name}</span>
            <button onClick={() => setCurrentMember(null)} className="text-[7px] font-black uppercase text-slate-300 hover:text-red-500 tracking-[0.2em] text-left">Desconectar</button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative bg-[#fcfcfc]">
        <header className="h-14 bg-white border-b border-slate-50 flex items-center justify-between px-6 md:px-8 sticky top-0 z-40 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
           <div className="flex items-center gap-3">
              <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-1 text-slate-400"><Menu size={18}/></button>
              <h2 className="text-[11px] font-black tracking-widest uppercase text-slate-500">{activeView.replace('-', ' ')}</h2>
              <div className="hidden sm:flex items-center gap-1.5 text-[7px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase border border-emerald-100">
                <MapPin size={8} /> {myShiftToday ? locations.find(l => l.id === myShiftToday.locationId)?.name : 'Bi-Sede Online'}
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                 <span className="text-[6px] font-black text-slate-300 uppercase tracking-widest mb-0.5">VES/USD</span>
                 <span className="text-[11px] font-black text-emerald-700 font-mono leading-none">{exchangeRate}</span>
              </div>
              <button onClick={() => setExchangeRate(prev => prev + 1)} className="p-1.5 bg-slate-50 text-slate-400 rounded-md border border-slate-100 hover:text-emerald-600 transition-all">
                 <RefreshCw size={12} />
              </button>
           </div>
        </header>

        <div className="p-5 md:p-8 max-w-6xl mx-auto w-full space-y-6 pb-20">
          {activeView === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <StatCard title="Capital Global" value="$15.4k" subValue="Activos Bi-Sede" icon={<Wallet className="text-blue-500" />} color="blue" />
                  <StatCard title="Ventas Hoy" value={`$${transactions.filter(t => t.category === 'Venta POS').reduce((s, t) => s + t.amountUSD, 0).toFixed(2)}`} subValue="Impacto Unificado" icon={<TrendingUp className="text-emerald-500" />} color="emerald" />
                  <StatCard title="Mermas" value={`$12.50`} subValue="Pérdidas Auditadas" icon={<Scale className="text-orange-500" />} color="orange" />
                  <StatCard title="Fondo Salud" value="$1.2k" subValue="Reserva Social" icon={<Heart className="text-red-500" />} color="red" />
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                     <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex-1">
                           <div className="flex items-center gap-2 mb-2">
                              <span className="text-[7px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase border border-emerald-100">Unidad 01</span>
                              <h4 className="text-sm font-black text-slate-900">Sede Ruiz Pineda</h4>
                           </div>
                           <p className="text-[10px] text-slate-500 mb-4 max-w-xs leading-relaxed font-medium">Operación estable. {membersAtLocation('loc1')} socios activos hoy. Abastecimiento óptimo.</p>
                           <div className="flex gap-2">
                              <button onClick={() => setActiveView('pos')} className="bg-emerald-colibri text-white px-4 py-1.5 rounded-lg font-bold text-[8px] uppercase tracking-widest shadow active:scale-95">Venta RP</button>
                              <button onClick={() => setActiveView('inventory')} className="bg-slate-50 text-slate-500 border border-slate-100 px-4 py-1.5 rounded-lg font-bold text-[8px] uppercase tracking-widest">Stock RP</button>
                           </div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center min-w-[100px]">
                           <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">Socios On-Site</p>
                           <p className="text-lg font-black text-slate-800">{membersAtLocation('loc1')}</p>
                        </div>
                     </div>

                     <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex-1">
                           <div className="flex items-center gap-2 mb-2">
                              <span className="text-[7px] font-black text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded uppercase border border-orange-100">Unidad 02</span>
                              <h4 className="text-sm font-black text-slate-900">Sede Pueblo Nuevo</h4>
                           </div>
                           <p className="text-[10px] text-slate-500 mb-4 max-w-xs leading-relaxed font-medium">Operación activa. {membersAtLocation('loc2')} socios activos hoy. Pendiente reposición Queso.</p>
                           <div className="flex gap-2">
                              <button onClick={() => setActiveView('pos')} className="bg-slate-900 text-white px-4 py-1.5 rounded-lg font-bold text-[8px] uppercase tracking-widest shadow active:scale-95">Venta PN</button>
                              <button onClick={() => setActiveView('inventory')} className="bg-slate-50 text-slate-500 border border-slate-100 px-4 py-1.5 rounded-lg font-bold text-[8px] uppercase tracking-widest">Stock PN</button>
                           </div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center min-w-[100px]">
                           <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">Socios On-Site</p>
                           <p className="text-lg font-black text-slate-800">{membersAtLocation('loc2')}</p>
                        </div>
                     </div>

                     {dailyReports.length > 0 && (
                        <div className="bg-[#f0f9ff] p-5 rounded-2xl border border-blue-50 shadow-sm animate-in slide-in-from-left-2">
                           <h5 className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Zap size={10} /> Análisis Estratégico IA</h5>
                           <p className="text-[11px] font-medium text-blue-900 italic leading-relaxed">"{dailyReports[0].content}"</p>
                        </div>
                     )}
                  </div>

                  <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl flex flex-col justify-between overflow-hidden relative border border-white/5">
                     <div className="relative z-10">
                        <div className="flex items-center gap-1.5 mb-5">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                           <span className="text-[7px] font-black text-white/30 uppercase tracking-[0.2em]">Auditoría Viva Bi-Sede</span>
                        </div>
                        <h4 className="text-base font-black mb-4 tracking-tight">Presencia Global</h4>
                        <div className="space-y-3 mb-6">
                           {locations.map(loc => (
                              <div key={loc.id} className="bg-white/5 p-3 rounded-xl border border-white/10 flex justify-between items-center group">
                                 <div>
                                    <p className="font-bold text-[10px] tracking-tight">{loc.name}</p>
                                    <p className="text-[7px] text-white/20 uppercase font-black mt-0.5">Sede: 0{loc.id === 'loc1' ? '1' : '2'}</p>
                                 </div>
                                 <div className="flex -space-x-1.5">
                                    {shifts.filter(s => s.locationId === loc.id && s.date === todayStr).slice(0, 3).map((s, i) => (
                                       <div key={i} className="w-6 h-6 rounded-full border border-slate-900 bg-emerald-colibri flex items-center justify-center text-[7px] font-black shadow-sm group-hover:scale-105 transition-transform">
                                          {members.find(m => m.id === s.memberId)?.name.charAt(0)}
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           ))}
                        </div>
                        <button onClick={generateFlash} disabled={isGeneratingFlash} className="w-full py-3 bg-emerald-colibri hover:bg-emerald-600 text-white rounded-lg font-black text-[9px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50">
                           <Zap size={14} className={isGeneratingFlash ? 'animate-spin' : ''} /> {isGeneratingFlash ? 'Procesando...' : 'Reporte Maestro IA'}
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeView === 'ai-assistant' && <AIAssistantSection currentMember={currentMember} />}
          {activeView === 'accounting' && <AccountingSection transactions={transactions} locations={locations} FINANCIAL_TERMS={FINANCIAL_TERMS} exchangeRate={exchangeRate} />}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[9px] font-black transition-all group uppercase tracking-[0.15em] overflow-hidden ${active ? 'bg-emerald-colibri text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
    <span className={`${active ? 'scale-110' : 'opacity-60'}`}>{icon}</span>
    <span className="truncate leading-none">{label}</span>
  </button>
);

const StatCard = ({ title, value, subValue, icon, color }: { title: string, value: string, subValue: string, icon: React.ReactNode, color: string }) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm transition-all group overflow-hidden relative">
    <div className={`p-2.5 rounded-lg bg-${color}-50 text-${color}-600 border border-slate-50 mb-3 w-fit shadow-inner`}>
      {React.cloneElement(icon as React.ReactElement<any>, { size: 14 })}
    </div>
    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">{title}</p>
    <h4 className="text-lg font-black text-slate-900 tracking-tighter mb-1 font-mono leading-none">{value}</h4>
    <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1 leading-none truncate opacity-80">
       <div className={`w-1.5 h-1.5 rounded-full bg-${color === 'red' ? 'red' : 'emerald'}-500 shadow-sm shrink-0`}></div> {subValue}
    </p>
  </div>
);

const AIAssistantSection = ({ currentMember }: { currentMember: Member }) => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'roi' | 'audit' | 'summary'>('roi');

  const handleAIAction = async () => {
    if (!inputText) return;
    setLoading(true);
    try {
      let res = '';
      if (mode === 'roi') res = await analyzeSupplierROI(inputText);
      else if (mode === 'audit') res = await checkEqualityAudit(inputText, currentMember.name);
      else if (mode === 'summary') res = await summarizeAssembly(inputText);
      setResult(res);
    } catch (e) { setResult('Error Cerebro IA Colibrí.'); }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-16">
      <div className="bg-slate-900 p-6 rounded-2xl text-white flex flex-col md:flex-row justify-between items-center gap-4 border border-white/5 shadow-2xl">
        <h3 className="text-sm font-black flex items-center gap-2 tracking-widest uppercase italic"><Sparkles className="text-emerald-400" size={18} /> Cerebro IA</h3>
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 overflow-x-auto max-w-full">
           {['roi', 'audit', 'summary'].map(m => (
             <button key={m} onClick={() => setMode(m as any)} className={`px-4 py-2 rounded-md text-[8px] font-black uppercase tracking-widest transition-all ${mode === m ? 'bg-emerald-colibri text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>{m === 'roi' ? 'ROI' : m === 'audit' ? 'IGUALDAD' : 'ACTAS'}</button>
           ))}
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl space-y-4">
        <textarea 
          placeholder="Escriba aquí para que el Cerebro IA procese datos, audite o resuma actas de asamblea..." 
          className="w-full h-44 p-4 bg-slate-50 border border-slate-50 rounded-xl text-xs resize-none focus:outline-none focus:ring-1 focus:ring-emerald-200 font-medium leading-relaxed" 
          value={inputText} 
          onChange={e => setInputText(e.target.value)} 
        />
        <button onClick={handleAIAction} disabled={loading || !inputText} className="w-full py-3 bg-emerald-colibri hover:bg-emerald-700 text-white font-black rounded-lg shadow-xl text-xs flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50">
           {loading ? 'Consultando Nube IA...' : <><Activity size={16} /> Ejecutar Análisis Maestro</>}
        </button>
        {result && (
          <div className="p-4 bg-emerald-50 rounded-xl border-l-4 border-emerald-500 text-emerald-900 font-medium animate-in fade-in slide-in-from-bottom-2 shadow-inner">
             <p className="text-[11px] leading-relaxed italic opacity-90 whitespace-pre-wrap">"{result}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

const AccountingSection = ({ transactions, locations, FINANCIAL_TERMS, exchangeRate }: any) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="bg-emerald-colibri text-white p-6 rounded-2xl relative overflow-hidden">
       <div className="relative z-10">
          <h3 className="text-xl font-black tracking-tight mb-2 uppercase italic">Libro Contable Maestro</h3>
          <p className="text-[10px] text-emerald-50 opacity-70 leading-relaxed max-w-md italic mb-6">Pedagogía financiera para los 12 socios: transparencia total sobre el capital.</p>
       </div>
       <Wallet size={120} className="text-white opacity-5 absolute right-[-10px] bottom-[-20px]" />
    </div>
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
       <h3 className="text-[10px] font-black flex items-center gap-2 tracking-[0.2em] mb-4 text-slate-400 uppercase italic">
          <Repeat className="text-emerald-colibri" size={14} /> Movimientos Auditados Bi-Sede
       </h3>
       <div className="space-y-3">
          {transactions.slice(0, 8).map((t: any) => {
            const locName = locations.find((l: any) => l.id === t.locationId)?.name || 'Ecosistema';
            return (
              <div key={t.id} className="p-3 border border-slate-50 rounded-xl bg-slate-50/20 flex justify-between items-center gap-4">
                 <div className="flex items-center gap-3">
                    <div className={`p-2 rounded shadow-sm ${t.type === 'Ingreso' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                       {t.type === 'Ingreso' ? <ArrowUpCircle size={14} /> : <ArrowDownCircle size={14} />}
                    </div>
                    <div>
                       <h4 className="text-[10px] font-black text-slate-900 leading-none mb-0.5 truncate max-w-[120px]">{t.descriptionTechnical}</h4>
                       <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest">{locName} • Auditor: {t.memberExecutor}</p>
                    </div>
                 </div>
                 <div className="text-right flex flex-col items-end">
                    <p className={`text-xs font-black font-mono leading-none mb-0.5 ${t.type === 'Ingreso' ? 'text-emerald-colibri' : 'text-red-500'}`}>
                       {t.type === 'Ingreso' ? '+' : '-'}${t.amountUSD.toFixed(2)}
                    </p>
                    <p className="text-[7px] font-black text-slate-300 opacity-60 uppercase">{new Date(t.timestamp).toLocaleDateString()}</p>
                 </div>
              </div>
            );
          })}
       </div>
    </div>
  </div>
);

export default App;
