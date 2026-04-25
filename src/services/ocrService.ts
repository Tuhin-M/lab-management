import { createWorker } from 'tesseract.js';

export const ocrService = {
  /**
   * Processes an image and extracts text.
   * @param imageSource File object or image URL
   * @returns Extracted text string
   */
  async extractText(imageSource: File | string): Promise<string> {
    const worker = await createWorker('eng');
    const { data: { text } } = await worker.recognize(imageSource);
    await worker.terminate();
    return text;
  },

  /**
   * Attempts to parse medicine/test names from extracted text.
   * Simple heuristic: look for lines that look like prescriptions or results.
   */
  parseMedicines(text: string): string[] {
    const lines = text.split('\n');
    const medicineRegex = /\b(mg|g|mcg|ml|tab|cap|tablet|capsule|syrup|drops|ointment|gel|injection)\b/i;
    
    // 1. Clean lines and filter
    const potentialMedicines = lines
      .map(line => line.trim())
      .filter(line => {
        // Line should be long enough but not too long
        if (line.length < 3 || line.length > 50) return false;
        // Filter out purely numeric or special char lines
        if (/^[0-9./\-\s]+$/.test(line)) return false;
        // Keep if it has a dosage or looks like a proper name
        return medicineRegex.test(line) || /^[A-Z][a-zA-Z\s]+$/.test(line);
      });

    // 2. Remove duplicates and common header words
    const commonHeaders = ['prescription', 'patient', 'name', 'date', 'age', 'sex', 'history', 'rx', 'clinic', 'hospital'];
    const uniqueMatches = Array.from(new Set(potentialMedicines))
      .filter(line => !commonHeaders.some(header => line.toLowerCase().includes(header)));

    return uniqueMatches.slice(0, 12);
  }
};
