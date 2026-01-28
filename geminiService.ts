
import { GoogleGenAI } from "@google/genai";

// Always initialize GoogleGenAI using the process.env.API_KEY environment variable.
const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeSupplierROI = async (data: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analiza la siguiente oferta de proveedores para la cooperativa de charcutería 'Los Colibrís'. 
    Sugiere la mejor option basándote en el equilibrio calidad/precio y maximización del retorno de inversión social.
    Datos: ${data}`,
    config: {
      systemInstruction: "Eres un analista de ROI experto en el mercado de alimentos venezolano. Tu objetivo es ayudar a una cooperativa horizontal a tomar decisiones de compra justas y eficientes.",
      temperature: 0.7,
    }
  });
  return response.text;
};

export const validateInventoryData = async (product: string, cost: number, quantity: number) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Valida la integridad de este registro de entrada de inventario:
    Producto: ${product}
    Costo USD: ${cost}
    Cantidad: ${quantity}
    ¿Parecen valores lógicos para una charcutería en Venezuela? Responde brevemente si es coherente o si hay una anomalía crítica.`,
    config: {
      systemInstruction: "Actúa como un supervisor de integridad de datos. Detecta precios de $0 o cantidades irreales y alerta a la cooperativa.",
      temperature: 0.1,
    }
  });
  return response.text;
};

export const checkEqualityAudit = async (action: string, actor: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Audita esta acción en el contexto de una cooperativa 100% horizontal: Socio '${actor}' intenta realizar '${action}'. ¿Viola esto los principios de igualdad o transparencia total? Responde brevemente.`,
    config: {
      systemInstruction: "Actúa como un auditor imparcial de una cooperativa horizontal. Si detectas que un socio intenta realizar una acción que no está respaldada por los estatutos o que no ha sido notificada al resto, genera una alerta roja inmediata.",
      temperature: 0.2,
    }
  });
  return response.text;
};

export const summarizeAssembly = async (text: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Resume los puntos clave y decisiones tomadas en esta acta de asamblea: ${text}`,
    config: {
      systemInstruction: "Resume actas de asamblea para que los socios ausentes estén al tanto de todo.",
    }
  });
  return response.text;
};

export const explainAccountingTransaction = async (technicalDescription: string, amount: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Explica en lenguaje muy sencillo y con analogías de una charcutería qué significa este movimiento contable: '${technicalDescription}' por un monto de '${amount}'. Máximo 2 párrafos cortos.`,
    config: {
      systemInstruction: "Eres un mentor de pedagogía contable para socios de una cooperativa. Tu misión es que cualquier persona, sin importar su nivel de estudios, entienda el flujo del dinero.",
      temperature: 0.5,
    }
  });
  return response.text;
};

export const getFinancialHealthReport = async (transactions: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analiza estas transacciones recientes y genera un breve informe de salud financiera (Máximo 3 oraciones). Di si estamos bien (Verde), en atención (Amarillo) o en alerta (Rojo) y por qué. Usa emojis. Transacciones: ${transactions}`,
    config: {
      systemInstruction: "Analista financiero de cooperativas. Resumen ejecutivo muy visual y directo.",
    }
  });
  return response.text;
};

export const generateDailyStrategicFlash = async (salesData: string, stockAlerts: string, tomorrowShifts: string, rate: number, wastageData: string = "") => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Genera el 'Flash Estratégico Diario' de Los Colibrís basado en estos datos:
    Ventas: ${salesData}
    Alertas Stock: ${stockAlerts}
    Mermas/Pérdidas del día: ${wastageData}
    Turnos Mañana: ${tomorrowShifts}
    Tasa Actual: ${rate} VES/USD`,
    config: {
      systemInstruction: "Eres el analista estratégico de una cooperativa horizontal. Tu tono es profesional, informativo y empoderador. Todos los socios son dueños por igual. Genera un informe de máximo 3 párrafos. MUY IMPORTANTE: Incluye un apartado de 'Análisis de Mermas' explicando pedagógicamente cómo las pérdidas del día afectan el beneficio neto y el ROI social.",
      temperature: 0.8,
    }
  });
  return response.text;
};
