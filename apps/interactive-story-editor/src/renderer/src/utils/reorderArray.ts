export const reorderArray = <T extends { id: string; }>(referenceArray: { id: string }[], unorderedArray: T[]): T[] => {
  const nameOrder = new Map(referenceArray.map((item, index) => [item.id, index]));

  return unorderedArray
      // Ensure only matching items are included
      .filter(item => nameOrder.has(item.id))
      .sort((a, b) => (nameOrder.get(a.id) ?? 0) - (nameOrder.get(b.id) ?? 0));
}
