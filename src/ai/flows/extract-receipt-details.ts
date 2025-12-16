
'use server';
/**
 * @fileOverview An AI flow to extract details from a receipt image.
 *
 * - extractReceiptDetails - A function that handles the receipt scanning process.
 * - ExtractReceiptDetailsInput - The input type for the extractReceiptDetails function.
 * - ExtractReceiptDetailsOutput - The return type for the extractReceiptDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { Category } from '@/lib/types';

const categories: Category[] = [
  "Food",
  "Travel",
  "Bills",
  "Shopping",
  "Health",
  "Income",
];

const ExtractReceiptDetailsInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a receipt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractReceiptDetailsInput = z.infer<typeof ExtractReceiptDetailsInputSchema>;

const ExtractReceiptDetailsOutputSchema = z.object({
  name: z.string().describe('The name of the vendor or merchant.'),
  amount: z.number().describe('The total amount of the transaction.'),
  date: z.string().describe('The date of the transaction in YYYY-MM-DD format.'),
  category: z.string().describe('The suggested spending category from the list provided.'),
});
export type ExtractReceiptDetailsOutput = z.infer<typeof ExtractReceiptDetailsOutputSchema>;

export async function extractReceiptDetails(input: ExtractReceiptDetailsInput): Promise<ExtractReceiptDetailsOutput> {
  return extractReceiptDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractReceiptDetailsPrompt',
  input: {schema: ExtractReceiptDetailsInputSchema},
  output: {schema: ExtractReceiptDetailsOutputSchema},
  prompt: `You are an intelligent receipt scanner. Analyze the following receipt image and extract the transaction details.

  Identify the merchant name, the total amount, and the date of the transaction.
  
  Based on the merchant and items, suggest a spending category from the following list: ${categories.join(", ")}.

  Return the date in YYYY-MM-DD format. If you cannot determine a field, return an empty string or 0.

  Receipt Image: {{media url=imageDataUri}}`,
});

const extractReceiptDetailsFlow = ai.defineFlow(
  {
    name: 'extractReceiptDetailsFlow',
    inputSchema: ExtractReceiptDetailsInputSchema,
    outputSchema: ExtractReceiptDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    
    // Fallback if AI returns a non-listed category
    if (!categories.includes(output!.category as Category)) {
        output!.category = 'Shopping';
    }

    return output!;
  }
);
