'use server';

/**
 * @fileOverview An AI agent that generates personalized practice tests for students.
 *
 * - generatePersonalizedPracticeTest - A function that generates a personalized practice test based on student weaknesses.
 * - PersonalizedPracticeTestInput - The input type for the generatePersonalizedPracticeTest function.
 * - PersonalizedPracticeTestOutput - The return type for the generatePersonalizedPracticeTest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedPracticeTestInputSchema = z.object({
  studentId: z.string().describe('The ID of the student.'),
  unit: z.number().describe('The unit number for which to generate the test.'),
  weakWords: z
    .array(z.string())
    .describe('An array of words the student is weak on.'),
});
export type PersonalizedPracticeTestInput = z.infer<
  typeof PersonalizedPracticeTestInputSchema
>;

const PersonalizedPracticeTestOutputSchema = z.object({
  testQuestions: z
    .array(
      z.object({
        word: z.string().describe('The word being tested.'),
        translation: z.string().describe('The correct translation of the word.'),
        options: z
          .array(z.string())
          .describe('Multiple choice options, including the correct translation.'),
      })
    )
    .describe('An array of personalized practice test questions.'),
});
export type PersonalizedPracticeTestOutput = z.infer<
  typeof PersonalizedPracticeTestOutputSchema
>;

export async function generatePersonalizedPracticeTest(
  input: PersonalizedPracticeTestInput
): Promise<PersonalizedPracticeTestOutput> {
  return personalizedPracticeTestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedPracticeTestPrompt',
  input: {schema: PersonalizedPracticeTestInputSchema},
  output: {schema: PersonalizedPracticeTestOutputSchema},
  prompt: `You are an expert vocabulary test generator. You will generate a personalized practice test for a student based on their weak words.

  Student ID: {{{studentId}}}
  Unit: {{{unit}}}
  Weak Words: {{#each weakWords}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Generate multiple-choice questions for each weak word. Each question should have one correct translation and three incorrect options.
  The options should be translations related to the unit.
  Make sure that only one answer is correct. 
  Return the results in JSON format.
  `,
});

const personalizedPracticeTestFlow = ai.defineFlow(
  {
    name: 'personalizedPracticeTestFlow',
    inputSchema: PersonalizedPracticeTestInputSchema,
    outputSchema: PersonalizedPracticeTestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
