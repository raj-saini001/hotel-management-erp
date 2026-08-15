export const generateId = (prefix = 'ID') => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
};

export const formatInvoiceNo = (number, prefix = 'INV-GS-') => {
  const cleanPrefix = prefix ? (prefix.endsWith('-') ? prefix : `${prefix}-`) : 'INV-GS-';
  return `${cleanPrefix}${String(number).padStart(5, '0')}`;
};

export const exportToCsv = (filename, rows, headers) => {
  if (!rows || !rows.length) return;
  const separator = ',';
  const csvContent =
    headers.join(separator) +
    '\n' +
    rows
      .map((row) =>
        headers
          .map((header) => {
            const val = row[header] !== undefined ? row[header] : '';
            return `"${String(val).replace(/"/g, '""')}"`;
          })
          .join(separator)
      )
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
