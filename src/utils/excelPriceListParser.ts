import * as XLSX from 'xlsx';

export interface ParsedPriceListTest {
  id?: string;
  name: string;
  code?: string;
  department?: string;
  category: string;
  rate: number;
  discountPercent?: number;
  discountedPrice?: number;
  sampleType: 'Blood' | 'Urine' | 'Saliva' | 'Stool' | 'Swab' | 'Tissue' | 'Other';
  turnaroundTime: string;
  duration: string;
  description: string;
  iqCategory?: string;
  selected?: boolean;
}

export interface ParseResult {
  sheetNames: string[];
  selectedSheet: string;
  totalRawRows: number;
  tests: ParsedPriceListTest[];
  duplicatesCount: number;
  departments: string[];
  stats: {
    minRate: number;
    maxRate: number;
    avgRate: number;
    totalTests: number;
  };
  headerRowIndex: number;
  detectedColumns: {
    name: string | null;
    rate: string | null;
    dept: string | null;
    code: string | null;
    category: string | null;
  };
}

export interface ParserOptions {
  sheetName?: string;
  defaultDiscount?: number;
  defaultTurnaround?: string;
  defaultDuration?: string;
  forcedSampleType?: 'Auto' | 'Blood' | 'Urine' | 'Saliva' | 'Stool' | 'Swab' | 'Tissue' | 'Other';
}

/**
 * Normalizes common medical department abbreviations to standard display titles
 */
export function normalizeDepartment(raw?: string): string {
  if (!raw) return 'Biochemistry';
  const str = String(raw).trim().toUpperCase();

  if (str.startsWith('BIOCHEM')) return 'Biochemistry';
  if (str.startsWith('HAEMAT')) return 'Hematology';
  if (str.includes('CLINICAL PATH')) return 'Clinical Pathology';
  if (str.startsWith('CYTOGEN')) return 'Cytogenetics';
  if (str.startsWith('CYTOPAT')) return 'Cytopathology';
  if (str.includes('CYTOMET')) return 'Flow Cytometry';
  if (str.startsWith('HORMON')) return 'Endocrinology';
  if (str.includes('HISTOPATH') || str === 'HISTOPATH') return 'Histopathology';
  if (str.startsWith('IMMUNO')) return 'Immunology & Serology';
  if (str.startsWith('MICRO')) return 'Microbiology';
  if (str.startsWith('MOLECUL')) return 'Molecular Diagnostics';
  if (str.startsWith('CARDIO')) return 'Cardiology';
  if (str.includes('PACKAGE')) return 'Health Packages';

  // Capitalize words nicely for any unexpected department
  return str
    .toLowerCase()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Infers sample type based on medical test name & department
 */
export function inferSampleType(testName: string, department?: string): 'Blood' | 'Urine' | 'Saliva' | 'Stool' | 'Swab' | 'Tissue' | 'Other' {
  const combined = (testName + ' ' + (department || '')).toUpperCase();

  if (combined.includes('URIN')) return 'Urine';
  if (
    combined.includes('BIOPSY') ||
    combined.includes('TISSUE') ||
    combined.includes('HISTOPATH') ||
    combined.includes('CARCINOMA') ||
    combined.includes('SLIDE') ||
    combined.includes('ASPIRAT')
  ) {
    return 'Tissue';
  }
  if (combined.includes('SWAB') || combined.includes('NASAL') || combined.includes('THROAT')) {
    return 'Swab';
  }
  if (combined.includes('STOOL') || combined.includes('FAECAL') || combined.includes('FECAL')) {
    return 'Stool';
  }
  if (combined.includes('SALIVA')) return 'Saliva';
  if (
    combined.includes('CSF') ||
    combined.includes('FLUID') ||
    combined.includes('SYNOVIAL') ||
    combined.includes('ASCITIC') ||
    combined.includes('PLEURAL')
  ) {
    return 'Other';
  }

  return 'Blood';
}

/**
 * Finds the actual header row in an Excel sheet (scans first 15 rows for columns)
 */
function findHeaderRow(rows: any[][]): {
  headerIndex: number;
  colMap: { nameCol: number; rateCol: number; deptCol: number; codeCol: number; catCol: number; sNoCol: number };
  detectedHeaders: { [key: string]: string };
} {
  let bestIndex = -1;
  let bestScore = -1;
  let bestColMap = { nameCol: -1, rateCol: -1, deptCol: -1, codeCol: -1, catCol: -1, sNoCol: -1 };
  let bestDetected: { [key: string]: string } = {};

  const maxScan = Math.min(15, rows.length);

  for (let r = 0; r < maxScan; r++) {
    const row = rows[r];
    if (!Array.isArray(row) || row.length === 0) continue;

    let score = 0;
    let nameCol = -1;
    let rateCol = -1;
    let deptCol = -1;
    let codeCol = -1;
    let catCol = -1;
    let sNoCol = -1;
    const detected: { [key: string]: string } = {};

    row.forEach((cell, idx) => {
      if (cell === null || cell === undefined) return;
      const val = String(cell).toLowerCase().trim();

      if (
        (val.includes('test name') || val.includes('testname') || val === 'name' || val === 'investigation') &&
        nameCol === -1
      ) {
        nameCol = idx;
        detected.name = String(cell);
        score += 5;
      } else if (
        (val.includes('rate') || val.includes('price') || val.includes('mrp') || val.includes('cost') || val.includes('charges')) &&
        rateCol === -1
      ) {
        rateCol = idx;
        detected.rate = String(cell);
        score += 5;
      } else if (
        (val.includes('dept') || val.includes('department') || val.includes('discipline')) &&
        deptCol === -1
      ) {
        deptCol = idx;
        detected.dept = String(cell);
        score += 3;
      } else if (
        (val.includes('code') || val.includes('testcode')) &&
        codeCol === -1
      ) {
        codeCol = idx;
        detected.code = String(cell);
        score += 2;
      } else if (
        (val.includes('category') || val.includes('iq category')) &&
        catCol === -1
      ) {
        catCol = idx;
        detected.category = String(cell);
        score += 2;
      } else if (
        (val.includes('s. no') || val.includes('s.no') || val.includes('sr') || val.includes('sl')) &&
        sNoCol === -1
      ) {
        sNoCol = idx;
        score += 1;
      }
    });

    // Valid header row must contain at least Test Name and Rate/Price
    if (nameCol !== -1 && rateCol !== -1 && score > bestScore) {
      bestScore = score;
      bestIndex = r;
      bestColMap = { nameCol, rateCol, deptCol, codeCol, catCol, sNoCol };
      bestDetected = detected;
    }
  }

  // Fallback if no header row found
  if (bestIndex === -1 && rows.length > 0) {
    bestIndex = 0;
    bestColMap = { nameCol: 3, rateCol: 4, deptCol: 2, codeCol: 1, catCol: 5, sNoCol: 0 };
  }

  return {
    headerIndex: bestIndex,
    colMap: bestColMap,
    detectedHeaders: bestDetected,
  };
}

/**
 * Parses raw Excel rows into structured tests
 */
export function parsePriceListRows(
  rows: any[][],
  sheetNames: string[] = ['Sheet1'],
  selectedSheet: string = 'Sheet1',
  options: ParserOptions = {}
): ParseResult {
  const { headerIndex, colMap, detectedHeaders } = findHeaderRow(rows);

  const defaultDiscount = options.defaultDiscount || 0;
  const defaultTurnaround = options.defaultTurnaround || '24 hours';
  const defaultDuration = options.defaultDuration || '15 mins';

  const rawTests: ParsedPriceListTest[] = [];
  const seenNames = new Map<string, number>();
  let duplicatesCount = 0;

  const departmentsSet = new Set<string>();
  let minRate = Infinity;
  let maxRate = -Infinity;
  let sumRate = 0;

  for (let i = headerIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !Array.isArray(row) || row.length === 0) continue;

    const rawName = row[colMap.nameCol];
    if (!rawName) continue;

    const name = String(rawName).trim();
    if (!name || name.length < 2) continue;

    // Filter out total or summary rows
    if (/^(total|subtotal|grand total|notes|terms)/i.test(name)) continue;

    const rawRate = row[colMap.rateCol];
    if (rawRate === undefined || rawRate === null || String(rawRate).trim() === '') continue;

    const numericRate = Number(String(rawRate).replace(/[^0-9.]/g, ''));
    if (isNaN(numericRate) || numericRate <= 0) continue;

    const rate = Math.round(numericRate);
    const rawDept = colMap.deptCol !== -1 && row[colMap.deptCol] ? String(row[colMap.deptCol]).trim() : '';
    const rawCode = colMap.codeCol !== -1 && row[colMap.codeCol] ? String(row[colMap.codeCol]).trim() : '';
    const rawCat = colMap.catCol !== -1 && row[colMap.catCol] ? String(row[colMap.catCol]).trim() : '';

    const category = normalizeDepartment(rawDept);
    departmentsSet.add(category);

    const sampleType =
      options.forcedSampleType && options.forcedSampleType !== 'Auto'
        ? options.forcedSampleType
        : inferSampleType(name, rawDept);

    const discountedPrice = defaultDiscount > 0 ? Math.round(rate * (1 - defaultDiscount / 100)) : rate;

    const normalizedNameKey = name.toUpperCase().replace(/\s+/g, ' ');

    if (seenNames.has(normalizedNameKey)) {
      duplicatesCount++;
      // Update with the latest rate/code
      const existingIdx = seenNames.get(normalizedNameKey)!;
      rawTests[existingIdx].rate = Math.max(rawTests[existingIdx].rate, rate);
      if (rawCode && !rawTests[existingIdx].code) {
        rawTests[existingIdx].code = rawCode;
      }
      continue;
    }

    const testItem: ParsedPriceListTest = {
      name,
      code: rawCode,
      department: rawDept || category,
      category,
      rate,
      discountPercent: defaultDiscount,
      discountedPrice,
      sampleType,
      turnaroundTime: defaultTurnaround,
      duration: defaultDuration,
      description: `Diagnostic pathology and laboratory test for ${name}. Accurate analysis with validated standard ranges.`,
      iqCategory: rawCat,
      selected: true,
    };

    seenNames.set(normalizedNameKey, rawTests.length);
    rawTests.push(testItem);

    if (rate < minRate) minRate = rate;
    if (rate > maxRate) maxRate = rate;
    sumRate += rate;
  }

  const totalTests = rawTests.length;
  const avgRate = totalTests > 0 ? Math.round(sumRate / totalTests) : 0;

  return {
    sheetNames,
    selectedSheet,
    totalRawRows: rows.length,
    tests: rawTests,
    duplicatesCount,
    departments: Array.from(departmentsSet).sort(),
    stats: {
      minRate: minRate === Infinity ? 0 : minRate,
      maxRate: maxRate === -Infinity ? 0 : maxRate,
      avgRate,
      totalTests,
    },
    headerRowIndex: headerIndex,
    detectedColumns: {
      name: detectedHeaders.name || null,
      rate: detectedHeaders.rate || null,
      dept: detectedHeaders.dept || null,
      code: detectedHeaders.code || null,
      category: detectedHeaders.category || null,
    },
  };
}

/**
 * Parses an Excel file (File object) in the browser
 */
export async function parsePriceListFile(file: File, options: ParserOptions = {}): Promise<ParseResult> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });

  const sheetNames = workbook.SheetNames;
  const targetSheet = options.sheetName && sheetNames.includes(options.sheetName) ? options.sheetName : sheetNames[0];

  const worksheet = workbook.Sheets[targetSheet];
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

  return parsePriceListRows(rows, sheetNames, targetSheet, options);
}

/**
 * Parses an ArrayBuffer of an Excel file
 */
export function parsePriceListBuffer(buffer: ArrayBuffer, options: ParserOptions = {}): ParseResult {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetNames = workbook.SheetNames;
  const targetSheet = options.sheetName && sheetNames.includes(options.sheetName) ? options.sheetName : sheetNames[0];

  const worksheet = workbook.Sheets[targetSheet];
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

  return parsePriceListRows(rows, sheetNames, targetSheet, options);
}

/**
 * 1-Click Loader for the bundled "IQDx PRICE LIST H(2026-27).xlsx" file
 */
export async function loadBundledIQDxPriceList(options: ParserOptions = {}): Promise<ParseResult> {
  const response = await fetch('/IQDx_PRICE_LIST_2026-27.xlsx');
  if (!response.ok) {
    throw new Error('Failed to load bundled IQDx price list. Please upload the file directly.');
  }
  const buffer = await response.arrayBuffer();
  return parsePriceListBuffer(buffer, options);
}

/**
 * Downloads a sample Excel price list template matching the IQDx format
 */
export function downloadSamplePriceListTemplate(): void {
  const templateData = [
    ['Directory of Services'],
    ['PRICE LIST TEMPLATE (2026-27)'],
    ['Address: Laboratory Diagnostic Facility | Ph. No.- 9876543210'],
    ['S. No', 'Testcode', 'Dept.', 'Test Name', 'Rate', 'IQ Category'],
    [1, '1001', 'BIOCHEMISTRY', 'FASTING BLOOD SUGAR (FBS)', 80, 'IQ1'],
    [2, '1002', 'BIOCHEMISTRY', 'LIPID PROFILE', 650, 'IQ1'],
    [3, '1003', 'BIOCHEMISTRY', 'LIVER FUNCTION TEST (LFT)', 550, 'IQ1'],
    [4, '1004', 'HAEMATOLOGY', 'COMPLETE BLOOD COUNT (CBC)', 350, 'IQ1'],
    [5, '1005', 'HAEMATOLOGY', 'ERYTHROCYTE SEDIMENTATION RATE (ESR)', 100, 'IQ1'],
    [6, '1006', 'CLINICAL PATHOLOGY', 'URINE ROUTINE & MICROSCOPY', 120, 'IQ1'],
    [7, '1007', 'HORMONE ASSAYS', 'THYROID PROFILE TOTAL (T3, T4, TSH)', 450, 'IQ2'],
    [8, '1008', 'IMMUNOLOGY - SEROLOGY', 'DENGUE NS1 ANTIGEN', 600, 'IQ2'],
    [9, '1009', 'MICROBIOLOGY', 'BLOOD CULTURE & SENSITIVITY', 900, 'IQ2'],
    [10, '1010', 'HISTOPATHOLOGY', 'SMALL BIOPSY HISTOPATHOLOGY', 750, 'IQ3'],
  ];

  const ws = XLSX.utils.aoa_to_sheet(templateData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'PriceList');

  // Set column widths
  ws['!cols'] = [
    { wch: 8 },  // S. No
    { wch: 12 }, // Testcode
    { wch: 25 }, // Dept.
    { wch: 40 }, // Test Name
    { wch: 12 }, // Rate
    { wch: 15 }, // Category
  ];

  XLSX.writeFile(wb, 'Ekitsa_Lab_Price_List_Template.xlsx');
}
