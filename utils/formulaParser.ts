export function evaluateFormula(formula: string, cells: { [key: string]: string }) {
  try {
    if (!formula.startsWith("=")) {
      return formula;
    }

    let expr = formula.slice(1); // remove '='

    // Handle SUM(A1,A2)
    const sumMatch = expr.match(/^SUM\(([^)]+)\)$/);

    if (sumMatch) {
      const refs = sumMatch[1].split(",");
      let sum = 0;

      refs.forEach((ref) => {
        const value = Number(cells[ref.trim()] || 0);
        sum += value;
      });

      return sum.toString();
    }

    // Replace cell references with numbers
    expr = expr.replace(/[A-Z][0-9]+/g, (match) => {
      return cells[match] || "0";
    });

    // Evaluate arithmetic expression
    const result = Function(`return ${expr}`)();

    return result.toString();

  } catch {
    return "ERROR";
  }
}