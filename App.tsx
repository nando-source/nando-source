
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, TrendingUp, ShieldCheck, Bell, ShoppingCart, Activity, Menu, History,
  DollarSign, Heart, Calendar, AlertTriangle, FileText, LogOut, ChevronRight,
  Sparkles, Package, UserCheck, CheckCircle2, Gavel, Wallet, Info, 
  ArrowUpCircle, ArrowDownCircle, Repeat, Lightbulb, PlayCircle, MapPin, 
  Clock, Zap, Calculator, Trash2, RefreshCw, Scale, X, Stethoscope, 
  MoveHorizontal, ArrowRightLeft, Truck, UsersRound, FileSearch, 
  PackageCheck, Receipt, BarChart3, Plus, ScanLine, ArrowRight, Eye, Download,
  Star, ClipboardCheck, ShoppingBag, Search
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

interface CartItem extends InventoryItem {
  quantity: number;
}

const App: React.FC = () => {
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [exchangeRate, setExchangeRate] = useState(INITIAL_EXCHANGE_RATE);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // States for demo interactions
  const [inventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [transactions] = useState<AccountingTransaction[]>(MOCK_TRANSACTIONS);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
  const [isGeneratingFlash, setIsGeneratingFlash] = useState(false);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const myShiftToday = useMemo(() => currentMember ? MOCK_SHIFTS.find(s => s.memberId === currentMember.id && s.date === todayStr) : null, [currentMember, todayStr]);

  const addToCart = (product: InventoryItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 0.5 } : i);
      }
      return [...prev, { ...product, quantity: 0.5 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + (item.priceUSD * item.quantity), 0), [cart]);

  const generateFlash = async () => {
    setIsGeneratingFlash(true);
    const content = "Análisis del Día: Las ventas en Ruiz Pineda superan el promedio por 15%. Se detecta baja rotación en Salchichón Gallegos; se sugiere combo con Queso Blanco para maximizar ROI Social. El Fondo de Salud ha crecido $45 hoy.";
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
                Gestión transparente de charcutería y comunidad para los 12 socios propietarios. Sin rangos, solo propósito.
              </p>
           </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 overflow-y-auto">
           <div className="w-full max-w-md">
              <div className="text-center mb-8">
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Acceso Universal</h3>
                 <p className="text-xs text-slate-500 font-medium italic">Seleccione su perfil de socio para entrar al ecosistema.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                 {MOCK_MEMBERS.map(m => (
                    <button key={m.id} onClick={() => setCurrentMember(m)} className="group bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-colibri flex flex-col items-center text-center transition-all active:scale-95">
                       <img src={m.avatar} className="w-12 h-12 rounded-full mb-2" alt="" />
                       <span className="font-bold text-[10px] text-slate-800 truncate w-full">{m.name}</span>
                    </button>
                 ))}
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#fbfbfb] text-slate-900 font-['Inter'] overflow-hidden">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-100 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <ColibriLogo className="w-6 h-6 text-emerald-colibri" />
             <h1 className="font-black text-[11px] tracking-widest uppercase italic text-slate-900">Los Colibrís</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-300"><X size={20}/></button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
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

        <div className="p-5 border-t border-slate-50">
          <div className="flex items-center gap-3">
            <img src={currentMember.avatar} className="w-10 h-10 rounded-full border border-slate-100" alt="" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold text-slate-800 truncate leading-none mb-1">{currentMember.name}</span>
              <button onClick={() => setCurrentMember(null)} className="text-[8px] font-black uppercase text-red-500/60 tracking-widest text-left">Salir</button>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative bg-[#fcfcfc]">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 md:px-10 sticky top-0 z-40">
           <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-400"><Menu size={20}/></button>
              <div>
                <h2 className="text-[12px] font-black tracking-[0.2em] uppercase text-slate-900">{activeView.replace('-', ' ')}</h2>
              </div>
           </div>
           <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">VES/USD</span>
              <span className="text-sm font-black text-emerald-700 font-mono">{exchangeRate}</span>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-10 max-w-7xl mx-auto w-full space-y-8 pb-32">
          
          {activeView === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard title="Patrimonio" value="$15.4k" subValue="+12%" icon={<Wallet />} color="blue" />
                  <StatCard title="Ventas Hoy" value={`$${transactions.filter(t => t.category === 'Venta POS').reduce((s, t) => s + t.amountUSD, 0).toFixed(2)}`} subValue="42 ops" icon={<TrendingUp />} color="emerald" />
                  <StatCard title="Mermas" value="$12.50" subValue="2 alertas" icon={<Scale />} color="orange" />
                  <StatCard title="Fondo Salud" value="$1.2k" subValue="Activo" icon={<Heart />} color="red" />
               </div>
               
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row items-center gap-6">
                       <div className="w-full md:w-32 h-32 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                          <img src="https://images.unsplash.com/photo-1544025162-d76694265947?w=300" className="w-full h-full object-cover" alt="" />
                       </div>
                       <div>
                          <span className="text-[8px] font-black text-emerald-600 uppercase">Unidad Ruiz Pineda</span>
                          <h4 className="text-lg font-black text-slate-900 mb-2">Estado: Operativo 100%</h4>
                          <p className="text-xs text-slate-500 mb-4">Stock de quesos optimizado. Turno de tarde cubierto por 3 socios.</p>
                          <button onClick={() => setActiveView('pos')} className="bg-emerald-colibri text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Abrir POS RP</button>
                       </div>
                    </div>
                  </div>
                  <div className="bg-slate-900 p-6 rounded-3xl text-white">
                     <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4">Análisis IA</h4>
                     <p className="text-xs italic leading-relaxed mb-6">"Socios, el consumo de embutidos subirá este fin de semana. Ruiz Pineda tiene stock suficiente, pero Pueblo Nuevo requiere reposición."</p>
                     <button onClick={generateFlash} disabled={isGeneratingFlash} className="w-full py-3 bg-emerald-colibri rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2">
                        {isGeneratingFlash ? <RefreshCw className="animate-spin" size={14}/> : <Zap size={14}/>} Generar Reporte
                     </button>
                  </div>
               </div>
            </div>
          )}

          {activeView === 'inventory' && (
             <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden animate-in fade-in">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                   <h3 className="text-sm font-black uppercase">Maestro de Inventario</h3>
                   <Plus className="text-emerald-colibri cursor-pointer" />
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase">
                         <tr>
                            <th className="p-4">Producto</th>
                            <th className="p-4">RP (kg)</th>
                            <th className="p-4">PN (kg)</th>
                            <th className="p-4 text-right">Precio USD</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-[11px] font-medium">
                         {inventory.map(i => (
                            <tr key={i.id} className="hover:bg-slate-50">
                               <td className="p-4 font-bold">{i.name}</td>
                               <td className="p-4">{i.stockRuizPineda.toFixed(1)}</td>
                               <td className="p-4">{i.stockPuebloNuevo.toFixed(1)}</td>
                               <td className="p-4 text-right font-black text-emerald-600">${i.priceUSD.toFixed(2)}</td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          )}

          {activeView === 'wastage' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
              <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-fit">
                <h3 className="text-sm font-black mb-6 flex items-center gap-2 uppercase tracking-widest"><Trash2 className="text-red-500" /> Registro de Merma</h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400">Producto</label>
                    <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium">
                      {inventory.map(i => <option key={i.id}>{i.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400">Cantidad</label>
                      <input type="number" placeholder="0.00" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400">Motivo</label>
                      <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                        <option>Vencimiento</option>
                        <option>Deterioro</option>
                        <option>Merma Operativa</option>
                      </select>
                    </div>
                  </div>
                  <button className="w-full py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Confirmar Pérdida</button>
                </div>
              </div>
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2"><History size={16}/> Auditoría de Mermas (Hoy)</h3>
                 <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="p-4 border border-slate-50 rounded-2xl bg-red-50/20 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                         <div>
                            <p className="text-[11px] font-black text-slate-900">Merma Operativa - Queso Blanco</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Socio: María L. • Ruiz Pineda • Hace 2 horas</p>
                         </div>
                         <div className="text-left sm:text-right">
                            <p className="text-sm font-black text-red-600 font-mono">-$12.40</p>
                            <p className="text-[8px] font-black text-slate-300 uppercase">Impacto ROI: -0.2%</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          )}

          {activeView === 'recepcion' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
              <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-fit">
                <h3 className="text-sm font-black mb-6 flex items-center gap-2 uppercase tracking-widest"><PackageCheck className="text-emerald-colibri" /> Recepción de Mercancía</h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400">Proveedor</label>
                    <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                      {MOCK_SUPPLIER_OFFERS.map(s => <option key={s.id}>{s.supplierName}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400">Costo Factura (USD)</label>
                    <input type="number" placeholder="$0.00" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs" />
                  </div>
                  <button className="w-full py-4 bg-emerald-colibri text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Registrar Entrada</button>
                </div>
              </div>
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Últimos Ingresos de Proveedores</h3>
                 <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="p-4 border border-slate-50 rounded-2xl bg-emerald-50/20 flex justify-between items-center">
                         <div className="flex items-center gap-3">
                           <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><ArrowRightLeft size={16}/></div>
                           <div>
                              <p className="text-[11px] font-black text-slate-900">Embutidos Del Norte</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase">Auditado por Elena M. • Hace 1 día</p>
                           </div>
                         </div>
                         <div className="text-right">
                            <p className="text-sm font-black text-emerald-600 font-mono">+$450.00</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          )}

          {activeView === 'pos' && (
            <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in h-[calc(100vh-180px)] overflow-hidden">
               <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-20">
                     {inventory.map(item => (
                        <button key={item.id} onClick={() => addToCart(item)} className="bg-white p-4 rounded-3xl border border-slate-100 hover:border-emerald-colibri flex flex-col h-48 group">
                           <div className="w-full h-24 bg-slate-50 rounded-2xl mb-3 overflow-hidden">
                              <img src={item.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                           </div>
                           <h4 className="text-[10px] font-black text-slate-800 leading-tight mb-1 truncate">{item.name}</h4>
                           <div className="flex justify-between items-end mt-auto">
                              <p className="text-xs font-black text-emerald-600 font-mono">${item.priceUSD.toFixed(2)}</p>
                              <Plus size={14} className="text-slate-300" />
                           </div>
                        </button>
                     ))}
                  </div>
               </div>
               <div className="w-full lg:w-80 shrink-0 bg-white border border-slate-100 rounded-3xl shadow-xl flex flex-col p-5">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2"><Receipt size={16}/> Carrito de Venta</h3>
                  <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-1 custom-scrollbar">
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center opacity-20"><ShoppingBag size={40}/><p className="text-[9px] font-black uppercase mt-2">Vacío</p></div>
                    ) : cart.map(item => (
                      <div key={item.id} className="p-3 bg-slate-50 rounded-2xl flex justify-between items-center group">
                         <div className="flex items-center gap-2">
                           <button onClick={() => removeFromCart(item.id)} className="text-red-300 hover:text-red-500"><X size={12}/></button>
                           <div><p className="text-[10px] font-black text-slate-800 truncate max-w-[80px]">{item.name}</p><p className="text-[8px] font-medium text-slate-400">{item.quantity} kg</p></div>
                         </div>
                         <p className="text-[10px] font-black font-mono text-slate-700">${(item.quantity * item.priceUSD).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-slate-50 space-y-4">
                     <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black uppercase text-slate-900">Total VES</span>
                        <span className="text-xl font-black font-mono text-emerald-700">{(cartTotal * exchangeRate).toLocaleString()}</span>
                     </div>
                     <button disabled={cart.length === 0} className="w-full py-3 bg-emerald-colibri text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 disabled:opacity-30">Confirmar</button>
                  </div>
               </div>
            </div>
          )}

          {activeView === 'suppliers' && (
            <div className="space-y-8 animate-in fade-in">
               <div className="bg-[#0f172a] p-8 rounded-[2rem] text-white">
                  <h3 className="text-2xl font-black italic tracking-tight mb-2">Comparador ROI Maestro</h3>
                  <p className="text-xs text-slate-400">Analizamos el retorno social y económico para los 12 socios.</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {MOCK_SUPPLIER_OFFERS.map(s => (
                    <div key={s.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                       <div className="space-y-4">
                          <span className="text-[8px] font-black text-slate-300 uppercase">{s.supplierName}</span>
                          <h4 className="text-base font-black text-slate-900">{s.productName}</h4>
                          <div className="flex items-center gap-4">
                             <div><p className="text-[8px] font-black text-slate-400 uppercase">Precio</p><p className="text-xl font-black text-emerald-600 font-mono">${s.priceUSD.toFixed(2)}</p></div>
                             <div><p className="text-[8px] font-black text-slate-400 uppercase">Entrega</p><p className="text-sm font-black text-slate-700">{s.deliveryTimeDays} d</p></div>
                          </div>
                          <div className="flex gap-0.5">
                             {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < s.qualityRating ? "#f97316" : "none"} className={i < s.qualityRating ? "text-orange-500" : "text-slate-200"} />)}
                          </div>
                       </div>
                       <button className="w-full mt-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-emerald-colibri transition-all">Solicitar Cotización</button>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeView === 'meetings' && (
            <div className="space-y-6 animate-in fade-in">
               <div className="flex justify-between items-center border-b border-slate-100 pb-6">
                  <h3 className="text-xl font-black tracking-tight">Registro de Asambleas</h3>
                  <button className="bg-emerald-colibri text-white px-6 py-2 rounded-2xl font-black text-[9px] uppercase tracking-widest">Nueva Acta</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {MOCK_MEETINGS.map(m => (
                    <div key={m.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                       <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black rounded-full uppercase">{m.date}</span>
                          <span className="text-[10px] font-bold text-slate-300 uppercase">N° 0{m.id.replace('m', '')}</span>
                       </div>
                       <h4 className="text-lg font-black text-slate-900 leading-tight">{m.title}</h4>
                       <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-50">
                          <h5 className="text-[8px] font-black text-emerald-600 uppercase mb-1">Resumen IA</h5>
                          <p className="text-[10px] font-medium text-emerald-900 leading-relaxed italic">"{m.summaryIA}"</p>
                       </div>
                       <div className="flex flex-wrap gap-2">
                          {m.decisions.map((d, i) => (
                             <div key={i} className="px-2 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-bold text-slate-600">✓ {d}</div>
                          ))}
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeView === 'ethics' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div className="space-y-6">
                     <div className="flex items-center gap-3 text-red-500"><Heart size={24} fill="currentColor" /><h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Fondo Salud</h3></div>
                     <div className="text-center py-6 border-y border-slate-50">
                        <p className="text-[10px] font-black text-slate-300 uppercase mb-2">Total Reserva</p>
                        <h4 className="text-4xl font-black font-mono tracking-tighter text-slate-900">$1,240<span className="text-2xl text-slate-300">.50</span></h4>
                     </div>
                     <p className="text-xs font-medium text-slate-500 leading-relaxed italic">"Este fondo es alimentado por el 1% de cada venta. Protege a los 12 socios."</p>
                  </div>
                  <button className="w-full mt-6 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase border border-red-100">Solicitar Ayuda</button>
               </div>
               
               <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-between">
                  <div className="space-y-6">
                     <div className="flex items-center justify-between"><h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2"><UsersRound size={20} className="text-emerald-400" /> Socios Activos</h3><span className="text-3xl font-black italic text-emerald-400">12</span></div>
                     <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {MOCK_MEMBERS.map(m => (
                          <div key={m.id} className="flex items-center justify-between p-2 bg-white/5 border border-white/10 rounded-xl">
                             <div className="flex items-center gap-3">
                                <img src={m.avatar} className="w-6 h-6 rounded-full border border-white/20" alt="" />
                                <p className="text-[10px] font-black truncate max-w-[80px]">{m.name}</p>
                             </div>
                             <span className="text-[7px] font-black text-emerald-400 uppercase">Socio</span>
                          </div>
                        ))}
                     </div>
                  </div>
                  <button className="w-full mt-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase">Auditara Tiempos</button>
               </div>

               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div className="space-y-6">
                     <div className="flex items-center gap-3 text-orange-500"><Gavel size={24} /><h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Justicia Ética</h3></div>
                     <div className="space-y-4">
                        {MOCK_INFRACTIONS.map(i => (
                          <div key={i.id} className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-2xl space-y-2">
                             <span className="text-[8px] font-black text-orange-700 uppercase bg-orange-100 px-2 py-0.5 rounded">Falta {i.type}</span>
                             <h5 className="text-[10px] font-black text-slate-900">{i.memberName}</h5>
                             <p className="text-[9px] text-slate-600 font-medium italic leading-relaxed">"{i.description}"</p>
                          </div>
                        ))}
                     </div>
                  </div>
                  <button className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase">Denunciar Falta</button>
               </div>
            </div>
          )}

          {activeView === 'accounting' && (
            <div className="space-y-6 animate-in fade-in">
               <div className="bg-emerald-colibri text-white p-8 rounded-[2.5rem] relative overflow-hidden">
                  <h3 className="text-3xl font-black italic tracking-tighter leading-none mb-4">Libro Contable Maestro</h3>
                  <p className="text-xs text-emerald-50 opacity-70 leading-relaxed max-w-md italic mb-6">Pedagogía financiera para los 12 socios: transparencia total sobre cada centavo.</p>
                  <Wallet size={120} className="text-white opacity-5 absolute right-[-10px] bottom-[-20px]" />
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {FINANCIAL_TERMS.slice(0, 3).map(term => (
                    <div key={term.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{term.term}</span>
                       <h4 className="text-2xl font-black text-slate-900 font-mono tracking-tighter my-2">{term.value}</h4>
                       <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{term.definition}</p>
                    </div>
                  ))}
               </div>

               <div className="bg-white p-6 rounded-3xl border border-slate-100">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2"><History size={16}/> Historial de Transacciones Bi-Sede</h3>
                  <div className="space-y-3">
                     {transactions.map(t => (
                       <div key={t.id} className="p-4 border border-slate-50 rounded-2xl bg-slate-50/20 flex justify-between items-center gap-4">
                          <div className="flex items-center gap-3">
                             <div className={`p-2 rounded-lg ${t.type === 'Ingreso' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>{t.type === 'Ingreso' ? <ArrowUpCircle size={14}/> : <ArrowDownCircle size={14}/>}</div>
                             <div>
                                <h4 className="text-[11px] font-black text-slate-900 truncate max-w-[120px]">{t.descriptionTechnical}</h4>
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Socio: {t.memberExecutor}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className={`text-sm font-black font-mono ${t.type === 'Ingreso' ? 'text-emerald-colibri' : 'text-red-500'}`}>{t.type === 'Ingreso' ? '+' : '-'}${t.amountUSD.toFixed(2)}</p>
                             <p className="text-[8px] font-black text-slate-300 uppercase">{new Date(t.timestamp).toLocaleDateString()}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {activeView === 'ai-assistant' && (
            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3"><Sparkles className="text-emerald-400" size={24} /><h3 className="text-xl font-black italic tracking-tighter uppercase">Cerebro IA Colibrí</h3></div>
                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 w-full md:w-auto overflow-x-auto">
                   {['ROI', 'AUDITORÍA', 'RESUMEN'].map(m => (
                     <button key={m} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${m === 'ROI' ? 'bg-emerald-colibri text-white' : 'text-slate-500 hover:text-white'}`}>{m}</button>
                   ))}
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6">
                <textarea placeholder="Pregunte sobre el ROI de proveedores, audite una acción de un socio o cargue un acta para resumir..." className="w-full h-48 p-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-medium resize-none focus:outline-none focus:ring-1 focus:ring-emerald-200 leading-relaxed" />
                <button className="w-full py-4 bg-emerald-colibri text-white font-black rounded-2xl shadow-xl text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Activity size={18} /> Ejecutar Análisis Maestro
                </button>
                <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 text-emerald-900 italic font-medium opacity-50"><p className="text-xs leading-relaxed text-center">"Ingrese datos para que la inteligencia colectiva procese una respuesta."</p></div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

/* HELPER COMPONENTS */

const NavItem = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl text-[10px] font-black transition-all uppercase tracking-[0.15em] ${active ? 'bg-emerald-colibri text-white shadow-xl shadow-emerald-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
    <span className={`${active ? 'scale-110' : 'opacity-40'} transition-all`}>{icon}</span>
    <span className="truncate leading-none">{label}</span>
  </button>
);

const StatCard = ({ title, value, subValue, icon, color }: { title: string, value: string, subValue: string, icon: React.ReactNode, color: string }) => (
  <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm transition-all group hover:shadow-xl overflow-hidden">
    <div className={`p-3 rounded-2xl bg-${color}-50 text-${color}-600 border border-${color}-100/50 mb-4 w-fit shadow-inner`}>
      {React.cloneElement(icon as React.ReactElement<any>, { size: 18 })}
    </div>
    <div className="space-y-1">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{title}</p>
      <h4 className="text-2xl font-black text-slate-900 tracking-tighter font-mono leading-none">{value}</h4>
      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 leading-none pt-1">
         <div className={`w-1.5 h-1.5 rounded-full bg-${color === 'red' ? 'red' : 'emerald'}-500 shadow-sm`}></div> {subValue}
      </p>
    </div>
  </div>
);

export default App;
