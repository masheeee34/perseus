type LogCategory = 'auth' | 'order' | 'error' | 'system' | 'chat' | 'cart' | 'changelog';

const BRIDGE_PORT = process.env.BRIDGE_PORT || 3001;

class PerseusLogger {
  public static sendLog(category: LogCategory, message: string, data?: any): void {
    // Fire-and-forget : ne bloque JAMAIS l'API handler qui l'appelle
    const EXTERNAL_URL = process.env.EXTERNAL_BRIDGE_URL || 'https://masheee-perseus.hf.space';
    const bridgeUrl =
      typeof window === 'undefined'
        ? (process.env.EXTERNAL_BRIDGE === 'true' ? EXTERNAL_URL : `http://127.0.0.1:${BRIDGE_PORT}`)
        : '/bridge';

    fetch(`${bridgeUrl}/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category,
        message,
        data,
        timestamp: new Date().toISOString(),
      }),
      // Timeout de 3s pour ne pas bloquer les API handlers
      signal: AbortSignal.timeout(3000),
    }).catch(() => {
      // Silencieux — le bridge peut ne pas encore être prêt
      console.warn(`[Logger] Bridge indisponible pour log: [${category}] ${message}`);
    });
  }

  static auth(msg: string, data?: any)      { this.sendLog('auth', msg, data); }
  static order(msg: string, data?: any)     { this.sendLog('order', msg, data); }
  static error(msg: string, data?: any)     { this.sendLog('error', msg, data); }
  static system(msg: string, data?: any)    { this.sendLog('system', msg, data); }
  static chat(msg: string, data?: any)      { this.sendLog('chat', msg, data); }
  static cart(msg: string, data?: any)      { this.sendLog('cart', msg, data); }
}

export default PerseusLogger;
