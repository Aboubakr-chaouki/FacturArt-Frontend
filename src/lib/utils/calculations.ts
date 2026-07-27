export interface DocumentLineBase {
  quantity: number;
  unitPrice: number;
  tvaRate: number;
}

export const calculateDocumentTotal = (lines: DocumentLineBase[] = []) => {
  return lines.reduce((acc, line) => {
    const quantity = Number(line.quantity) || 0;
    const unitPrice = Number(line.unitPrice) || 0;
    const tvaRate = Number(line.tvaRate) || 0;
    const ht = quantity * unitPrice;
    const tva = ht * (tvaRate / 100);
    return acc + ht + tva;
  }, 0);
};
