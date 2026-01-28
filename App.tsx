
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
} from './constants';
import { 
  Member, InventoryItem, AuditLog, Meeting, SupplierOffer, Infraction, 
  AccountingTransaction, Location, Shift, DailyReport, WastageLog, 
  InventoryTransfer
} from './types';
import { 
  analyzeSupplierROI, checkEqualityAudit, summarizeAssembly, 
  generateDailyStrategicFlash, explainAccountingTransaction
} from './geminiService';

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

  // Estados Operativos
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wastageLogs] = useState<WastageLog[]>([
    { id: 'w1', productName: 'Jamón de Pavo', quantity: 1.5, costUSD: 11.25, category: 'Vencimiento', description: 'Producto olvidado en fondo de nevera Sede Ruiz Pineda', locationId: 'loc1', memberId: '2', memberName: 'Juan B.', timestamp: '2024-05-18T09:00:00Z' }
  ]);
  const [selectedFinancialTerm, setSelectedFinancialTerm] = useState<any | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const myShiftToday = useMemo(() => currentMember ? shifts.find(s => s.memberId === currentMember.id && s.date === todayStr) : null, [currentMember, shifts, todayStr]);

  const membersAtLocation = (locId: string) => shifts.filter(s => s.locationId === locId && s.date === todayStr).length;

  const generateFlash = async () => {
    setIsGeneratingFlash(true);
    const content = await generateDailyStrategicFlash("$450.00", "Stock Crítico", "Rotación Activa", exchangeRate, "$12.50");
    setDailyReports(prev => [{
      id: 'dr-' + Date.now(),
      date: todayStr,
      content,
      summary: "Flash Estratégico",
      metrics: { totalSalesUSD: 450, topLocation: "Sede Ruiz Pineda", criticalStockItem: "Queso Blanco", wastageLossUSD: 12.5, netUtilityUSD: 90 }
    }, ...prev]);
    setIsGeneratingFlash(false);
  };

  const handlePOSSale = async () => {
    if (!currentMember || cart.length === 0) return;
    const totalUSD = cart.reduce((s, i) => s + (i.weight * i.priceUSD), 0);
    setTransactions(prev => [{
      id: 'sale-' + Date.now(),
      type: 'Ingreso',
      category: 'Venta POS',
      amountUSD: totalUSD,
      amountVES: totalUSD * exchangeRate,
      descriptionTechnical: `Venta POS: ${cart.map(c => c.name).join(', ')}`,
      memberExecutor: currentMember.name,
      timestamp: new Date().toISOString()
    }, ...prev]);
    setCart([]);
    alert(`Venta por $${totalUSD.toFixed(2)} procesada exitosamente.`);
  };

  // PORTADA DE ACCESO (LOGIN)
  if (!currentMember) {
    return (
      <div className="min-h-screen bg-white flex overflow-hidden font-['Inter']">
        <div className="hidden lg:flex w-5/12 bg-[#064e3b] relative flex-col justify-between p-16 text-white border-r border-white/5 shadow-2xl">
           <div className="absolute inset-0 bg-gradient-to-br from-[#064e3b] to-[#ea580c] opacity-30"></div>
           <div className="relative z-10">
              <div className="flex items-center gap-4 mb-12">
                 <ColibriLogo className="w-10 h-10 text-white" />
                 <h2 className="text-xl font-black tracking-tighter uppercase italic leading-none">Los Colibrís <br/><span className="text-[10px] font-medium tracking-[0.3em] opacity-60">Gobernanza Horizontal</span></h2>
              </div>
              <h1 className="text-6xl font-black tracking-tighter leading-[0.9] mb-8">Poder <br/>Común <br/>Digital.</h1>
              <div className="w-20 h-2 bg-orange-colibri mb-10 rounded-full"></div>
              <p className="text-lg font-medium text-emerald-50 max-w-sm leading-relaxed opacity-80">
                La plataforma de los 12 socios para gestionar con transparencia radical y eficiencia IA.
              </p>
           </div>
           <div className="relative z-10 flex gap-10 border-t border-white/10 pt-10">
              <div>
                 <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-2 block">Unidad Ruiz Pineda</span>
                 <span className="text-sm font-bold opacity-70">Operativa 100%</span>
              </div>
              <div>
                 <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-2 block">Unidad Pueblo Nuevo</span>
                 <span className="text-sm font-bold opacity-70">Operativa 100%</span>
              </div>
           </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 bg-slate-50 overflow-y-auto">
           <div className="w-full max-w-xl">
              <div className="text-center mb-10">
                 <div className="lg:hidden flex justify-center mb-6">
                    <ColibriLogo className="w-12 h-12 text-emerald-colibri" />
                 </div>
                 <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Acceso de Socios</h3>
                 <p className="text-sm text-slate-500 font-medium">Seleccione su identidad para entrar al ecosistema.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                 {members.map(m => (
                    <button 
                       key={m.id} 
                       onClick={() => setCurrentMember(m)} 
                       className="group bg-white p-6 rounded-3xl border border-slate-200 hover:border-emerald-colibri hover:shadow-lg transition-all flex flex-col items-center text-center active:scale-95"
                    >
                       <img src={m.avatar} className="w-16 h-16 rounded-full border-2 border-slate-100 mb-3 group-hover:scale-110 transition-transform" alt="" />
                       <span className="font-bold text-[11px] text-slate-800 leading-none mb-1">{m.name}</span>
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Auditor</span>
                    </button>
                 ))}
              </div>
              
              <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] flex items-center justify-between gap-6 shadow-xl">
                 <div className="flex-1">
                    <h4 className="text-xs font-black flex items-center gap-2 mb-2 uppercase tracking-widest"><ShieldCheck size={14} className="text-emerald-400" /> Pacto de Igualdad</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">"Todos los socios tienen el mismo acceso a la información financiera y operativa."</p>
                 </div>
                 <ArrowRight className="text-white/20" size={32} />
              </div>
           </div>
        </div>
      </div>
    );
  }

  // INTERFAZ PRINCIPAL
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#fbfbfb] text-slate-900 font-['Inter'] overflow-hidden">
      
      {/* SIDEBAR REFINADO PARA MÓVIL */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <ColibriLogo className="w-6 h-6 text-emerald-colibri" />
             <h1 className="font-black text-xs tracking-tighter uppercase italic">Los Colibrís</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-slate-900"><X size={18}/></button>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
          <NavItem active={activeView === 'dashboard'} onClick={() => { setActiveView('dashboard'); setIsSidebarOpen(false); }} icon={<TrendingUp size={16}/>} label="Panel Central" />
          <NavItem active={activeView === 'inventory'} onClick={() => { setActiveView('inventory'); setIsSidebarOpen(false); }} icon={<ShoppingCart size={16}/>} label="Almacén Maestro" />
          <NavItem active={activeView === 'pos'} onClick={() => { setActiveView('pos'); setIsSidebarOpen(false); }} icon={<Calculator size={16}/>} label="Venta Mostrador" />
          <NavItem active={activeView === 'recepcion'} onClick={() => { setActiveView('recepcion'); setIsSidebarOpen(false); }} icon={<PackageCheck size={16}/>} label="Recepción Ética" />
          <NavItem active={activeView === 'suppliers'} onClick={() => { setActiveView('suppliers'); setIsSidebarOpen(false); }} icon={<Truck size={16}/>} label="Proveedores ROI" />
          <NavItem active={activeView === 'meetings'} onClick={() => { setActiveView('meetings'); setIsSidebarOpen(false); }} icon={<FileSearch size={16}/>} label="Asambleas IA" />
          <NavItem active={activeView === 'wastage'} onClick={() => { setActiveView('wastage'); setIsSidebarOpen(false); }} icon={<Scale size={16}/>} label="Control Mermas" />
          <NavItem active={activeView === 'ethics'} onClick={() => { setActiveView('ethics'); setIsSidebarOpen(false); }} icon={<Gavel size={16}/>} label="Gestión Ética" />
          <NavItem active={activeView === 'accounting'} onClick={() => { setActiveView('accounting'); setIsSidebarOpen(false); }} icon={<Wallet size={16}/>} label="Contabilidad" />
          <NavItem active={activeView === 'ai-assistant'} onClick={() => { setActiveView('ai-assistant'); setIsSidebarOpen(false); }} icon={<Sparkles size={16}/>} label="Cerebro IA" />
        </nav>
        <div className="p-6 border-t border-slate-50 flex items-center gap-3 shrink-0">
          <img src={currentMember.avatar} className="w-9 h-9 rounded-full border border-emerald-100" alt="" />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-slate-800 truncate leading-none mb-1">{currentMember.name}</span>
            <button onClick={() => setCurrentMember(null)} className="text-[8px] font-black uppercase text-slate-400 hover:text-red-500 tracking-widest text-left">Salir</button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative">
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-10 sticky top-0 z-40 shrink-0">
           <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-1.5 text-slate-500"><Menu size={20}/></button>
              <h2 className="text-sm font-black tracking-tight capitalize text-slate-800">{activeView.replace('-', ' ')}</h2>
              <div className="hidden sm:flex items-center gap-2 text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-widest border border-emerald-100">
                <MapPin size={10} /> {myShiftToday ? locations.find(l => l.id === myShiftToday.locationId)?.name : 'Monitor Bi-Sede'}
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                 <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">VES/USD</span>
                 <span className="text-xs font-black text-emerald-700 font-mono leading-none">{exchangeRate}</span>
              </div>
              <button onClick={() => setExchangeRate(prev => prev + 1)} className="p-1.5 bg-slate-50 text-slate-500 rounded-lg border border-slate-100 hover:bg-emerald-colibri hover:text-white transition-all">
                 <RefreshCw size={14} />
              </button>
           </div>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8 pb-20">
          
          {activeView === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               {/* Resumen Bi-Sede Grid */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard title="Capital Bi-Sede" value="$15.4k" subValue="Inventario + Caja" icon={<Wallet className="text-blue-500" />} color="blue" />
                  <StatCard title="Ventas Hoy" value={`$${transactions.filter(t => t.category === 'Venta POS').reduce((s, t) => s + t.amountUSD, 0).toFixed(2)}`} subValue="Ingresos Totales" icon={<TrendingUp className="text-emerald-500" />} color="emerald" />
                  <StatCard title="Mermas" value={`$12.50`} subValue="Pérdidas Auditadas" icon={<Scale className="text-orange-500" />} color="orange" />
                  <StatCard title="Fondo Salud" value="$1.2k" subValue="Fondo Reservado" icon={<Heart className="text-red-500" />} color="red" />
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                     {/* MONITOR SEDE 1 */}
                     <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex-1">
                           <div className="flex items-center gap-2 mb-3">
                              <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase border border-emerald-100">Unidad 1</span>
                              <h4 className="text-xl font-black tracking-tight text-slate-900">Sede Ruiz Pineda</h4>
                           </div>
                           <p className="text-xs text-slate-500 mb-5 max-w-xs font-medium leading-relaxed">Operación activa. 6 socios presentes. Stock saludable.</p>
                           <div className="flex gap-3">
                              <button onClick={() => setActiveView('pos')} className="bg-emerald-colibri text-white px-5 py-2.5 rounded-xl font-bold text-[9px] uppercase tracking-widest shadow-md">Venta RP</button>
                              <button onClick={() => setActiveView('inventory')} className="bg-white text-emerald-colibri border border-emerald-100 px-5 py-2.5 rounded-xl font-bold text-[9px] uppercase tracking-widest">Stock RP</button>
                           </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center min-w-[120px]">
                           <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Socios hoy</p>
                           <p className="text-xl font-black text-slate-800">{membersAtLocation('loc1')}</p>
                        </div>
                     </div>

                     {/* MONITOR SEDE 2 */}
                     <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex-1">
                           <div className="flex items-center gap-2 mb-3">
                              <span className="text-[8px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full uppercase border border-orange-100">Unidad 2</span>
                              <h4 className="text-xl font-black tracking-tight text-slate-900">Sede Pueblo Nuevo</h4>
                           </div>
                           <p className="text-xs text-slate-500 mb-5 max-w-xs font-medium leading-relaxed">Operación activa. 6 socios presentes. Alerta: Bajo stock Queso Blanco.</p>
                           <div className="flex gap-3">
                              <button onClick={() => setActiveView('pos')} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-[9px] uppercase tracking-widest shadow-md">Venta PN</button>
                              <button onClick={() => setActiveView('inventory')} className="bg-white text-slate-900 border border-slate-100 px-5 py-2.5 rounded-xl font-bold text-[9px] uppercase tracking-widest">Stock PN</button>
                           </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center min-w-[120px]">
                           <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Socios hoy</p>
                           <p className="text-xl font-black text-slate-800">{membersAtLocation('loc2')}</p>
                        </div>
                     </div>

                     {dailyReports.length > 0 && (
                        <div className="bg-[#f0f9ff] p-6 rounded-[2.5rem] border border-blue-100 shadow-sm">
                           <h5 className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2"><Zap size={12} /> Informe Estratégico IA</h5>
                           <p className="text-sm font-medium text-blue-800 italic leading-relaxed">"{dailyReports[0].content}"</p>
                        </div>
                     )}
                  </div>

                  <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl flex flex-col justify-between overflow-hidden relative">
                     <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-6">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                           <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Auditando Ecosistema</span>
                        </div>
                        <h4 className="text-xl font-black mb-6 tracking-tight">Presencia Bi-Sede</h4>
                        <div className="space-y-4 mb-8">
                           {locations.map(loc => (
                              <div key={loc.id} className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-between items-center group">
                                 <div>
                                    <p className="font-bold text-xs tracking-tight">{loc.name}</p>
                                    <p className="text-[8px] text-white/30 uppercase font-black mt-1">Socios: {membersAtLocation(loc.id)}</p>
                                 </div>
                                 <div className="flex -space-x-2">
                                    {shifts.filter(s => s.locationId === loc.id && s.date === todayStr).slice(0, 3).map((s, i) => (
                                       <div key={i} className="w-7 h-7 rounded-full border-2 border-slate-900 bg-emerald-colibri flex items-center justify-center text-[8px] font-black">
                                          {members.find(m => m.id === s.memberId)?.name.charAt(0)}
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           ))}
                        </div>
                        <button onClick={generateFlash} disabled={isGeneratingFlash} className="w-full py-4 bg-emerald-colibri hover:bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50">
                           <Zap size={16} className={isGeneratingFlash ? 'animate-spin' : ''} /> {isGeneratingFlash ? 'Generando...' : 'Reporte Maestro IA'}
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeView === 'inventory' && (
             <div className="space-y-6 animate-in fade-in duration-500">
                <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] flex flex-col sm:flex-row justify-between items-center gap-6">
                   <div>
                      <h3 className="text-2xl font-black tracking-tight mb-2">Inventario Maestro Unificado</h3>
                      <p className="text-xs text-slate-400 font-medium">Control total de stock en Ruiz Pineda y Pueblo Nuevo.</p>
                   </div>
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-right">
                      <span className="text-[8px] font-black uppercase text-emerald-400 mb-1 block">Valor Bi-Sede</span>
                      <span className="text-xl font-mono font-black tracking-tighter">${inventory.reduce((s, i) => s + (i.stockRuizPineda + i.stockPuebloNuevo) * i.priceUSD, 0).toLocaleString()}</span>
                   </div>
                </div>
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
                   <table className="w-full text-left text-[11px]">
                      <thead>
                         <tr className="font-black text-slate-400 uppercase tracking-widest bg-slate-50 border-b border-slate-50">
                            <th className="p-5">Producto</th>
                            <th className="p-5">Ruiz Pineda (kg)</th>
                            <th className="p-5">Pueblo Nuevo (kg)</th>
                            <th className="p-5 text-right">Costo Est (USD)</th>
                            <th className="p-5">Auditor</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {inventory.map(item => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-all">
                               <td className="p-5 font-bold text-slate-800">{item.name}</td>
                               <td className="p-5 font-mono text-slate-600">{item.stockRuizPineda.toFixed(1)}</td>
                               <td className="p-5 font-mono text-slate-600">{item.stockPuebloNuevo.toFixed(1)}</td>
                               <td className="p-5 text-right font-mono font-black text-emerald-600">
                                  ${((item.stockRuizPineda + item.stockPuebloNuevo) * item.priceUSD).toLocaleString()}
                               </td>
                               <td className="p-5 text-[8px] font-black text-slate-300 uppercase">{item.lastModifiedBy}</td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          )}

          {activeView === 'pos' && (
             <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in">
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 h-fit">
                   {inventory.map(item => (
                      <button key={item.id} onClick={() => alert(`Añadir ${item.name}`)} className="bg-white p-5 rounded-3xl border border-slate-100 hover:border-emerald-colibri shadow-sm transition-all text-left flex flex-col justify-between group">
                         <img src={item.image} className="w-full h-24 object-cover rounded-2xl mb-4 grayscale group-hover:grayscale-0 transition-all" alt=""/>
                         <div className="space-y-1">
                            <h4 className="text-xs font-black text-slate-800 leading-tight">{item.name}</h4>
                            <p className="text-sm font-black text-emerald-600 font-mono">${item.priceUSD.toFixed(2)}</p>
                            <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest">Global: {(item.stockRuizPineda + item.stockPuebloNuevo).toFixed(1)}kg</span>
                         </div>
                      </button>
                   ))}
                </div>
                <div className="w-full lg:w-80 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col p-6 h-[500px]">
                   <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2"><Receipt size={14} className="text-emerald-500" /> Registro</h3>
                   <div className="flex-1 overflow-y-auto text-slate-400 text-center flex flex-col items-center justify-center space-y-4">
                      <ScanLine size={48} className="opacity-10" />
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Sin productos</p>
                   </div>
                   <div className="pt-6 border-t border-slate-100">
                      <div className="flex justify-between items-end mb-6">
                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total</span>
                         <span className="text-2xl font-black font-mono leading-none">$0.00</span>
                      </div>
                      <button className="w-full py-4 bg-emerald-colibri text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg opacity-50">Procesar Venta</button>
                   </div>
                </div>
             </div>
          )}

          {activeView === 'ai-assistant' && <AIAssistantSection currentMember={currentMember} />}
          {activeView === 'accounting' && <AccountingSection transactions={transactions} locations={locations} FINANCIAL_TERMS={FINANCIAL_TERMS} setSelectedFinancialTerm={setSelectedFinancialTerm} exchangeRate={exchangeRate} />}

        </div>
      </main>
    </div>
  );
};

// Componentes UI Reutilizables
const NavItem = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-[10px] font-black transition-all group uppercase tracking-[0.2em] overflow-hidden ${active ? 'bg-emerald-colibri text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
    <span className={`${active ? 'scale-110' : 'opacity-60'}`}>{icon}</span>
    <span className="truncate">{label}</span>
  </button>
);

const StatCard = ({ title, value, subValue, icon, color }: { title: string, value: string, subValue: string, icon: React.ReactNode, color: string }) => (
  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm transition-all group overflow-hidden relative">
    <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600 border border-slate-50 mb-4 w-fit`}>
      {React.cloneElement(icon as React.ReactElement<any>, { size: 18 })}
    </div>
    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">{title}</p>
    <h4 className="text-xl font-black text-slate-900 tracking-tighter mb-1 font-mono leading-none">{value}</h4>
    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 truncate">
       <div className={`w-1.5 h-1.5 rounded-full bg-${color === 'red' ? 'red' : 'emerald'}-500`}></div> {subValue}
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
    } catch (e) { setResult('Error de conexión IA.'); }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="bg-slate-900 p-8 rounded-3xl text-white flex flex-col md:flex-row justify-between items-center gap-6">
        <h3 className="text-xl font-black flex items-center gap-3 tracking-tight"><Sparkles className="text-emerald-400" size={24} /> Cerebro IA</h3>
        <div className="flex bg-white/5 p-1.5 rounded-xl border border-white/10 overflow-x-auto max-w-full">
           {['roi', 'audit', 'summary'].map(m => (
             <button key={m} onClick={() => setMode(m as any)} className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${mode === m ? 'bg-emerald-colibri text-white' : 'text-slate-500 hover:text-white'}`}>{m === 'roi' ? 'ROI' : m === 'audit' ? 'IGUALDAD' : 'ACTAS'}</button>
           ))}
        </div>
      </div>
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <textarea 
          placeholder="Escriba aquí para que el Cerebro IA analice ofertas, actas o procesos..." 
          className="w-full h-[200px] p-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm resize-none focus:ring-0 font-medium" 
          value={inputText} 
          onChange={e => setInputText(e.target.value)} 
        />
        <button onClick={handleAIAction} disabled={loading || !inputText} className="w-full py-4 bg-emerald-colibri hover:bg-emerald-700 text-white font-black rounded-xl shadow-lg text-sm flex items-center justify-center gap-4 transition-all">
           {loading ? 'Procesando...' : <><Activity size={18} /> Ejecutar Análisis Maestro</>}
        </button>
        {result && (
          <div className="p-6 bg-emerald-50 rounded-2xl border-l-4 border-emerald-500 text-emerald-900 font-medium animate-in fade-in">
             <p className="text-sm leading-relaxed italic opacity-95">"{result}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

const AccountingSection = ({ transactions, locations, FINANCIAL_TERMS, setSelectedFinancialTerm, exchangeRate }: any) => (
  <div className="space-y-8 animate-in fade-in">
    <div className="bg-emerald-colibri text-white p-8 rounded-[2.5rem] relative overflow-hidden">
       <div className="relative z-10">
          <h3 className="text-2xl font-black tracking-tight mb-2 uppercase italic">Pedagogía Contable</h3>
          <p className="text-xs text-emerald-50 opacity-80 leading-relaxed max-w-md italic mb-8">"En Los Colibrís todos sabemos a dónde va cada centavo."</p>
          <div className="flex flex-wrap gap-2">
             {FINANCIAL_TERMS.map((t: any, idx: number) => (
                <button key={idx} onClick={() => setSelectedFinancialTerm(t)} className={`px-4 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all ${t.isHealth ? 'bg-red-500 border-red-400' : 'bg-white/10 hover:bg-white/20 border-white/20'}`}>
                   {t.term}
                </button>
             ))}
          </div>
       </div>
       <Wallet size={150} className="text-white opacity-5 absolute right-[-20px] bottom-[-40px]" />
    </div>
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
       <h3 className="text-sm font-black flex items-center gap-3 tracking-widest mb-6 text-slate-900 uppercase italic">
          <Repeat className="text-emerald-colibri" size={16} /> Movimientos del Libro Maestro
       </h3>
       <div className="space-y-4">
          {transactions.slice(0, 8).map((t: any) => {
            const locName = locations.find((l: any) => l.id === t.locationId)?.name || 'Ecosistema';
            return (
              <div key={t.id} className="p-4 border border-slate-50 rounded-2xl bg-slate-50/20 flex justify-between items-center gap-4">
                 <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg shadow-sm ${t.type === 'Ingreso' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                       {t.type === 'Ingreso' ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}
                    </div>
                    <div>
                       <h4 className="text-[11px] font-black text-slate-900 leading-none mb-1 truncate max-w-[150px]">{t.descriptionTechnical}</h4>
                       <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{locName} • {t.memberExecutor}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className={`text-sm font-black font-mono leading-none mb-0.5 ${t.type === 'Ingreso' ? 'text-emerald-colibri' : 'text-red-500'}`}>
                       {t.type === 'Ingreso' ? '+' : '-'}${t.amountUSD.toFixed(2)}
                    </p>
                    <p className="text-[7px] font-black text-slate-300 uppercase">{new Date(t.timestamp).toLocaleDateString()}</p>
                 </div>
              </div>
            );
          })}
       </div>
    </div>
  </div>
);

export default App;
