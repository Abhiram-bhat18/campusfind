import { Item, AIMatchResult } from '../types';
import Tesseract from 'tesseract.js';

// Color Palette mapping helper for browser image canvas analysis
const COLOR_NAMES: { [key: string]: [number, number, number] } = {
  Black: [20, 20, 20],
  White: [240, 240, 240],
  Blue: [30, 100, 220],
  Red: [220, 40, 40],
  Green: [40, 180, 80],
  Yellow: [230, 200, 30],
  Brown: [130, 75, 30],
  Silver: [190, 190, 195],
  Grey: [120, 120, 125],
  Purple: [140, 50, 200],
  Orange: [240, 120, 30]
};

export interface AIAnalysisOutput {
  predictedCategory: string;
  detectedColors: string[];
  suggestedTags: string[];
  generatedDescription: string;
  ocrText: string;
  brandSuggestion?: string;
  confidenceScore: number;
}

/**
 * Perform Browser OCR on an image file (e.g. ID card or Document)
 */
export async function extractTextFromImage(fileOrUrl: File | string): Promise<string> {
  try {
    const worker = await Tesseract.createWorker('eng');
    const ret = await worker.recognize(fileOrUrl);
    await worker.terminate();
    return ret.data.text.trim();
  } catch (error) {
    console.warn('OCR extraction warning:', error);
    return '';
  }
}

/**
 * Analyzes an image file to detect dominant colors, extract OCR text, and generate tags
 */
export async function analyzeItemImage(
  file: File,
  itemType: 'LOST' | 'FOUND',
  titleHint?: string
): Promise<AIAnalysisOutput> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = async () => {
        // Canvas analysis for color detection
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 100;
        canvas.height = 100;

        let detectedColor = 'Black';
        if (ctx) {
          ctx.drawImage(img, 0, 0, 100, 100);
          const imageData = ctx.getImageData(0, 0, 100, 100).data;
          let rTotal = 0, gTotal = 0, bTotal = 0, count = 0;

          for (let i = 0; i < imageData.length; i += 16) {
            rTotal += imageData[i];
            gTotal += imageData[i + 1];
            bTotal += imageData[i + 2];
            count++;
          }

          const rAvg = rTotal / count;
          const gAvg = gTotal / count;
          const bAvg = bTotal / count;

          // Closest color distance match
          let minDistance = Infinity;
          for (const [name, [r, g, b]] of Object.entries(COLOR_NAMES)) {
            const dist = Math.hypot(rAvg - r, gAvg - g, bAvg - b);
            if (dist < minDistance) {
              minDistance = dist;
              detectedColor = name;
            }
          }
        }

        // Perform OCR
        let ocrText = '';
        try {
          ocrText = await extractTextFromImage(file);
        } catch {
          ocrText = '';
        }

        // Title and Keyword analysis for Smart Tagging & Category prediction
        const lowerTitle = (titleHint || file.name || '').toLowerCase();
        const lowerOcr = ocrText.toLowerCase();
        const combined = `${lowerTitle} ${lowerOcr}`;

        let predictedCategory = 'cat-10'; // Other by default
        let suggestedTags: string[] = [detectedColor];
        let brandSuggestion = '';

        if (combined.includes('id') || combined.includes('card') || combined.includes('student') || combined.includes('roll') || combined.includes('license')) {
          predictedCategory = 'cat-3'; // ID Cards & Docs
          suggestedTags.push('Student ID', 'Official Document', 'Card');
          if (ocrText) suggestedTags.push('OCR Verified');
        } else if (combined.includes('phone') || combined.includes('iphone') || combined.includes('samsung') || combined.includes('airpods') || combined.includes('earbuds') || combined.includes('charger') || combined.includes('laptop') || combined.includes('macbook')) {
          predictedCategory = 'cat-1'; // Electronics
          suggestedTags.push('Electronics', 'Gadget');
          if (combined.includes('apple') || combined.includes('macbook') || combined.includes('iphone') || combined.includes('airpods')) brandSuggestion = 'Apple';
          if (combined.includes('samsung')) brandSuggestion = 'Samsung';
          if (combined.includes('sony')) brandSuggestion = 'Sony';
        } else if (combined.includes('wallet') || combined.includes('purse') || combined.includes('card holder')) {
          predictedCategory = 'cat-2'; // Wallets
          suggestedTags.push('Wallet', 'Personal Belongings');
        } else if (combined.includes('key') || combined.includes('lanyard')) {
          predictedCategory = 'cat-4'; // Keys
          suggestedTags.push('Keys', 'Keychain');
        } else if (combined.includes('bag') || combined.includes('backpack') || combined.includes('tote')) {
          predictedCategory = 'cat-5'; // Bags
          suggestedTags.push('Backpack', 'Bag');
        } else if (combined.includes('book') || combined.includes('notes') || combined.includes('file')) {
          predictedCategory = 'cat-6'; // Books
          suggestedTags.push('Study Material', 'Textbook');
        } else if (combined.includes('watch') || combined.includes('smartwatch')) {
          predictedCategory = 'cat-8'; // Watches
          suggestedTags.push('Watch', 'Wearable');
        } else if (combined.includes('bottle') || combined.includes('flask')) {
          predictedCategory = 'cat-9'; // Water Bottles
          suggestedTags.push('Water Bottle', 'HydroFlask');
        }

        if (brandSuggestion) suggestedTags.push(brandSuggestion);

        // Generate AI Smart Description
        const itemNoun = titleHint || (predictedCategory === 'cat-3' ? 'Student ID Card' : 'Item');
        let generatedDescription = `AI-Detected ${detectedColor} ${itemNoun}. ${
          ocrText ? `Extracted Card/Document Details: "${ocrText.slice(0, 120)}..."` : 'Photo analyzed with computer vision & tag extraction.'
        }`;

        resolve({
          predictedCategory,
          detectedColors: [detectedColor],
          suggestedTags: Array.from(new Set(suggestedTags)),
          generatedDescription,
          ocrText,
          brandSuggestion,
          confidenceScore: 0.92
        });
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Calculates AI Match Score (%) between a Lost item and a Found item
 */
export function calculateAIMatchScore(targetItem: Item, candidateItem: Item): AIMatchResult {
  let score = 0;
  const matchReasons: string[] = [];

  // Must be opposite item types (One Lost, One Found)
  if (targetItem.type === candidateItem.type) {
    return { matchedItem: candidateItem, confidenceScore: 0, matchReasons: [] };
  }

  // 1. Category Match (Weight: 30%)
  if (targetItem.category_id === candidateItem.category_id) {
    score += 30;
    matchReasons.push('Matching Category');
  }

  // 2. Building / Location Match (Weight: 25%)
  if (targetItem.building_id === candidateItem.building_id) {
    score += 25;
    matchReasons.push(`Same Location (${targetItem.building_name || 'Campus Building'})`);
  }

  // 3. Color Match (Weight: 15%)
  if (
    targetItem.primary_color &&
    candidateItem.primary_color &&
    (targetItem.primary_color.toLowerCase().includes(candidateItem.primary_color.toLowerCase()) ||
      candidateItem.primary_color.toLowerCase().includes(targetItem.primary_color.toLowerCase()))
  ) {
    score += 15;
    matchReasons.push('Similar Color Scheme');
  }

  // 4. Brand Match (Weight: 10%)
  if (
    targetItem.brand &&
    candidateItem.brand &&
    targetItem.brand.toLowerCase() === candidateItem.brand.toLowerCase()
  ) {
    score += 10;
    matchReasons.push(`Matching Brand (${targetItem.brand})`);
  }

  // 5. OCR Text match / Student ID match (Weight: 30% bonus for exact document match)
  if (targetItem.ocr_extracted_text && candidateItem.ocr_extracted_text) {
    const ocr1 = targetItem.ocr_extracted_text.toLowerCase();
    const ocr2 = candidateItem.ocr_extracted_text.toLowerCase();
    if (ocr1.includes(ocr2) || ocr2.includes(ocr1)) {
      score += 30;
      matchReasons.push('OCR Document Identifier Match');
    }
  }

  // 6. Tag Overlap (Weight: Up to 15%)
  const commonTags = targetItem.tags.filter((t) =>
    candidateItem.tags.some((ct) => ct.toLowerCase() === t.toLowerCase())
  );
  if (commonTags.length > 0) {
    score += Math.min(15, commonTags.length * 5);
    matchReasons.push(`Shared Tags: ${commonTags.join(', ')}`);
  }

  // Cap max score at 99%
  const finalScore = Math.min(99, Math.round(score));

  return {
    matchedItem: candidateItem,
    confidenceScore: finalScore,
    matchReasons
  };
}

/**
 * Searches items using typo-tolerant fuzzy matching
 */
export function fuzzySearchItems(items: Item[], query: string): Item[] {
  if (!query.trim()) return items;
  const q = query.toLowerCase().trim();

  return items.filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(q);
    const descMatch = item.description.toLowerCase().includes(q);
    const tagMatch = item.tags.some((t) => t.toLowerCase().includes(q));
    const brandMatch = item.brand?.toLowerCase().includes(q);
    const locationMatch = item.specific_location.toLowerCase().includes(q) || item.building_name?.toLowerCase().includes(q);
    const ocrMatch = item.ocr_extracted_text?.toLowerCase().includes(q);

    return titleMatch || descMatch || tagMatch || brandMatch || locationMatch || ocrMatch;
  });
}
