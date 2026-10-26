export const formatINR = (amount, includeSymbol = true) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return includeSymbol ? '₹0' : '0';
  }
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  }).format(amount);
  return includeSymbol ? `₹${formatted}` : formatted;
};

// Backwards-compatible alias
export const formatCurrency = (amount) => formatINR(amount, true);

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return String(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  if (typeof timeStr === 'string' && timeStr.includes('T')) {
    const d = new Date(timeStr);
    return isNaN(d.getTime())
      ? timeStr
      : d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  }
  if (typeof timeStr === 'string' && /^\d{1,2}:\d{2}/.test(timeStr)) {
    const [hh, mm] = timeStr.split(':').map(Number);
    const period = hh >= 12 ? 'PM' : 'AM';
    const hour12 = hh % 12 || 12;
    return `${hour12}:${String(mm).padStart(2, '0')} ${period}`;
  }
  return timeStr;
};

export const formatMinutes = (minutes) => {
  const m = Number(minutes);
  if (!m || isNaN(m)) return '0 min';
  if (m < 60) return `${m} min`;
  const hours = Math.floor(m / 60);
  const remMinutes = m % 60;
  return remMinutes > 0 ? `${hours} h ${remMinutes} min` : `${hours} h`;
};

// Backwards-compatible alias
export const formatDuration = (minutes) => formatMinutes(minutes);
