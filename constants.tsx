
import React from 'react';
import { Member, InventoryItem, Meeting, SupplierOffer, Infraction, AccountingTransaction, Location, Shift } from './types';

export const INITIAL_EXCHANGE_RATE = 400;

export const ColibriLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
    <path d="M30 50C30 50 45 35 60 50C75 65 50 80 50 80C50 80 25 65 30 50Z" fill="#059669" />
    <path d="M60 50L85 40L75 55L60 50Z" fill="#f97316" />
    <circle cx="50" cy="50" r="10" stroke="#059669" strokeWidth="1" />
  </svg>
);

export const FINANCIAL_TERMS = [
  { 
    id: 'activos',
    term: "ACTIVOS", 
    value: "$15,400",
    valueVES: "6,160,000 VES",
    definition: "Es todo lo que la cooperativa tiene hoy: la mercancía en las neveras, las rebanadoras y el dinero en la caja." 
  },
  { 
    id: 'pasivos',
    term: "PASIVOS", 
    value: "$2,100",
    valueVES: "840,000 VES",
    definition: "Son las facturas que aún debemos a los proveedores de jamón y los servicios del mes." 
  },
  { 
    id: 'patrimonio',
    term: "PATRIMONIO", 
    value: "$13,300",
    valueVES: "5,320,000 VES",
    definition: "Es lo que realmente es nuestro. Si pagáramos todas las deudas hoy, esto es lo que nos quedaría a todos los socios." 
  },
  { 
    id: 'amortizacion',
    term: "AMORTIZACIÓN", 
    value: "$450",
    valueVES: "180,000 VES",
    definition: "Es el \"pote\" que estamos llenando poco a poco para que, cuando una nevera se dañe, tengamos el dinero para comprar otra sin pedir prestado." 
  },
  { 
    id: 'roi-social',
    term: "ROI SOCIAL", 
    value: "12 Familias",
    valueVES: "Impacto Colectivo",
    definition: "Más allá del dinero, es el impacto en nuestras vidas: este mes cubrimos 3 emergencias médicas y entregamos 12 bolsas de comida a bajo costo." 
  },
  {
    id: 'salud',
    term: "ESTADO DE SALUD",
    value: "DESVÍO CRÍTICO",
    valueVES: "Alerta Roja",
    isHealth: true,
    alertTitle: "¡Atención Socios! Las deudas con proveedores de charcutería subieron de $500 a $850 esta semana (un 70% de aumento). Esto es una Alerta de Desvío.",
    definition: "Esto significa que estamos comprometiendo el dinero de mañana para pagar lo de hoy. La IA sugiere frenar compras no esenciales hasta que el balance vuelva a verde.",
    transparency: "Último registro de deuda: Juan B. en Sede Ruiz Pineda."
  }
];

export const HEALTH_LEVELS = [
  { color: 'bg-emerald-500', label: 'Verde', meaning: 'Todo en orden', action: 'Seguir con la operación normal.' },
  { color: 'bg-yellow-500', label: 'Amarillo', meaning: 'Crecimiento de deudas', action: 'Revisar gastos de papelería o servicios.' },
  { color: 'bg-red-500', label: 'Rojo', meaning: 'Desvío Crítico', action: 'Convocar reunión de emergencia de los 12 socios.' },
];

export const MOCK_LOCATIONS: Location[] = [
  { id: 'loc1', name: 'Ruiz Pineda', address: 'Av. Principal Ruiz Pineda, Sector 2' },
  { id: 'loc2', name: 'Pueblo Nuevo', address: 'Calle 5 con Carrera 10, Pueblo Nuevo' },
];

export const MOCK_MEMBERS: Member[] = [
  { id: '1', name: 'Carlos G.', joinDate: '2021-02-10', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CarlosG', status: 'active', vacationDays: 12, personalHealthFundUSD: 400, debtUSD: 0 },
  { id: '2', name: 'Juan B.', joinDate: '2022-06-10', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JuanB', status: 'active', vacationDays: 10, personalHealthFundUSD: 300, debtUSD: 45 },
  { id: '3', name: 'María L.', joinDate: '2023-12-01', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MariaL', status: 'active', vacationDays: 20, personalHealthFundUSD: 120, debtUSD: 0 },
  { id: '4', name: 'Pedro S.', joinDate: '2024-05-20', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PedroS', status: 'active', vacationDays: 5, personalHealthFundUSD: 150, debtUSD: 40 },
  { id: '5', name: 'Elena M.', joinDate: '2022-01-15', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ElenaM', status: 'active', vacationDays: 15, personalHealthFundUSD: 500, debtUSD: 0 },
  { id: '6', name: 'Roberto V.', joinDate: '2023-03-22', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RobertoV', status: 'active', vacationDays: 8, personalHealthFundUSD: 200, debtUSD: 15 },
  { id: '7', name: 'Sofía R.', joinDate: '2021-11-05', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SofiaR', status: 'active', vacationDays: 18, personalHealthFundUSD: 450, debtUSD: 0 },
  { id: '8', name: 'Luis F.', joinDate: '2024-02-28', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LuisF', status: 'active', vacationDays: 4, personalHealthFundUSD: 100, debtUSD: 10 },
  { id: '9', name: 'Carmen T.', joinDate: '2022-09-12', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CarmenT', status: 'active', vacationDays: 14, personalHealthFundUSD: 350, debtUSD: 0 },
  { id: '10', name: 'Andrés P.', joinDate: '2023-07-19', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AndresP', status: 'active', vacationDays: 9, personalHealthFundUSD: 180, debtUSD: 5 },
  { id: '11', name: 'Lucía H.', joinDate: '2021-05-30', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LuciaH', status: 'active', vacationDays: 16, personalHealthFundUSD: 420, debtUSD: 0 },
  { id: '12', name: 'Ricardo J.', joinDate: '2024-08-01', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RicardoJ', status: 'active', vacationDays: 2, personalHealthFundUSD: 50, debtUSD: 0 },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { 
    id: 'p1', 
    name: 'Jamón de Espalda', 
    category: 'Embutidos', 
    priceUSD: 6.0, 
    supplierCostUSD: 4.5, 
    stockRuizPineda: 25.5, 
    stockPuebloNuevo: 12.0, 
    image: 'https://images.unsplash.com/photo-1524438418049-ab2acb7aa48f?auto=format&fit=crop&q=80&w=200',
    lastModifiedBy: 'Elena M.'
  },
  { 
    id: 'p2', 
    name: 'Queso Amarillo', 
    category: 'Lácteos', 
    priceUSD: 7.5, 
    supplierCostUSD: 5.2, 
    stockRuizPineda: 18.0, 
    stockPuebloNuevo: 4.5, 
    image: 'https://images.unsplash.com/photo-1485962391905-dc37bb36704b?auto=format&fit=crop&q=80&w=200',
    lastModifiedBy: 'Carlos G.'
  },
  { 
    id: 'p3', 
    name: 'Mortadela Especial', 
    category: 'Embutidos', 
    priceUSD: 4.0, 
    supplierCostUSD: 2.8, 
    stockRuizPineda: 30.0, 
    stockPuebloNuevo: 25.0, 
    image: 'https://images.unsplash.com/photo-1593347093155-7977a643d937?auto=format&fit=crop&q=80&w=200',
    lastModifiedBy: 'Juan B.'
  },
  { 
    id: 'p4', 
    name: 'Queso Blanco Duro', 
    category: 'Lácteos', 
    priceUSD: 5.2, 
    supplierCostUSD: 3.5, 
    stockRuizPineda: 45.0, 
    stockPuebloNuevo: 60.0, 
    image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&q=80&w=200',
    lastModifiedBy: 'María L.'
  },
  { 
    id: 'p5', 
    name: 'Salchichón Gallegos', 
    category: 'Embutidos', 
    priceUSD: 11.5, 
    supplierCostUSD: 8.0, 
    stockRuizPineda: 5.0, 
    stockPuebloNuevo: 8.0, 
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=200',
    lastModifiedBy: 'Pedro S.'
  },
  { 
    id: 'p6', 
    name: 'Jamón de Pavo', 
    category: 'Embutidos', 
    priceUSD: 10.5, 
    supplierCostUSD: 7.5, 
    stockRuizPineda: 12.0, 
    stockPuebloNuevo: 3.5, 
    image: 'https://images.unsplash.com/photo-1534177714502-0a42004d42c1?auto=format&fit=crop&q=80&w=200',
    lastModifiedBy: 'Roberto V.'
  },
  { 
    id: 'p7', 
    name: 'Chorizo Ahumado', 
    category: 'Embutidos', 
    priceUSD: 7.2, 
    supplierCostUSD: 5.0, 
    stockRuizPineda: 15.0, 
    stockPuebloNuevo: 20.0, 
    image: 'https://images.unsplash.com/photo-1592663527359-cf6642f54cff?auto=format&fit=crop&q=80&w=200',
    lastModifiedBy: 'Sofía R.'
  },
  { 
    id: 'p8', 
    name: 'Mantequilla con Sal', 
    category: 'Lácteos', 
    priceUSD: 2.9, 
    supplierCostUSD: 1.8, 
    stockRuizPineda: 40.0, 
    stockPuebloNuevo: 40.0, 
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=200',
    lastModifiedBy: 'Luis F.'
  }
];

// Generar matriz de turnos para los próximos 7 días
const generateShifts = (): Shift[] => {
  const shifts: Shift[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let d = 0; d < 7; d++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + d);
    const dateStr = currentDate.toISOString().split('T')[0];

    // Distribuir 12 socios entre 2 sedes (6 por sede usualmente)
    MOCK_MEMBERS.forEach((m, idx) => {
      const locationId = ((idx + d) % 2 === 0) ? 'loc1' : 'loc2';
      shifts.push({
        id: `s-${dateStr}-${m.id}`,
        memberId: m.id,
        locationId,
        date: dateStr,
        status: 'pending'
      });
    });
  }
  return shifts;
};

export const MOCK_SHIFTS: Shift[] = generateShifts();

export const MOCK_INFRACTIONS: Infraction[] = [
  { id: 'i1', memberId: '2', memberName: 'Juan B.', type: 'Leve', description: 'Llegada tarde a asamblea ordinaria (30 min).', date: '2024-03-15', reporterName: 'Elena M.' },
];

export const MOCK_TRANSACTIONS: AccountingTransaction[] = [
  {
    id: 't1',
    type: 'Egreso',
    category: 'Compra Charcutería',
    amountUSD: 150,
    amountVES: 60000,
    descriptionTechnical: 'Reposición Inventario Jamón de Espalda',
    memberExecutor: 'Elena M.',
    timestamp: '2024-05-18T10:00:00Z'
  },
  {
    id: 't2',
    type: 'Egreso',
    category: 'Mantenimiento',
    amountUSD: 120,
    amountVES: 48000,
    descriptionTechnical: 'Reparación de Rebanadora (Mantenimiento Preventivo)',
    memberExecutor: 'Juan B.',
    timestamp: '2024-05-19T14:30:00Z'
  },
  {
    id: 't3',
    type: 'Ingreso',
    category: 'Otro',
    amountUSD: 850,
    amountVES: 340000,
    descriptionTechnical: 'Ventas Totales Fin de Semana',
    memberExecutor: 'María L.',
    timestamp: '2024-05-20T19:00:00Z'
  }
];

export const MOCK_MEETINGS: Meeting[] = [
  {
    id: 'm1',
    date: '2024-05-10',
    title: 'Asamblea Mensual: Revisión de Metas',
    summaryIA: 'Se revisaron los niveles de inventario y se acordó el mantenimiento de la rebanadora principal.',
    decisions: ['Aprobar gasto mantenimiento rebanadora', 'Mantener tasa en 400 VES'],
    fullMinutes: 'Contenido completo...',
    attendees: ['Elena M.', 'Juan B.', 'María L.', 'Pedro S.'],
    isCritical: false
  }
];

export const MOCK_SUPPLIER_OFFERS: SupplierOffer[] = [
  { id: 's1', supplierName: 'Embutidos Del Norte', productName: 'Queso Amarillo', priceUSD: 5.50, deliveryTimeDays: 2, qualityRating: 4 },
  { id: 's2', supplierName: 'Distribuidora Láctea B', productName: 'Queso Amarillo', priceUSD: 5.10, deliveryTimeDays: 3, qualityRating: 5 },
];
