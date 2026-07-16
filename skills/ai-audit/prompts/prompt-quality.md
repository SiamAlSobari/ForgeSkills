# Prompt Quality & Format Prompt

Analyze source code to evaluate prompt engineering patterns, structure, formatting, Socratic tutoring design, and output validation setup.

## Categories

### 1. Incoherent Socratic Tutor Design (Socratic Tutor Pitfalls)
In Socratic tutoring, the model must guide the user rather than giving direct answers, but without entering infinite feedback loops or outputting unintelligible text. Look for:
- Prompts that lack turn constraints (e.g. "always ask a question") which might lead to infinite questioning loops.
- Prompts that say "do not answer" but do not provide instructions on how to handle simple/trivial questions (like "hello" or "who are you?"), causing the model to output strange Socratic replies to greetings.
```javascript
// Bad Socratic Prompt
const systemPrompt = "You are a Socratic tutor. Never give direct answers. Just ask questions."; // Trivial inputs like "what is your name?" will receive confusing questions.

// Good Socratic Prompt
const systemPrompt = `You are a Socratic tutor. 
1. If the user greets you or asks about your identity, respond naturally and briefly introduce your role.
2. For educational queries, do not give direct answers. Guide the user step-by-step using simple questions.
3. Keep questions clear, focused, and concise (one question at a time).`;
```

### 2. Missing Output Schema Enforcement
When prompt requests JSON format (e.g., "return JSON response"), verify if the code specifies schema validation (Zod, JSON Schema) or configures JSON mode, to prevent the LLM from outputting Markdown markers (like \`\`\`json) which crash standard JSON parsers.
```javascript
// Bad
const prompt = "Analyze the input and return a JSON list of keywords";
const res = await openai.chat.completions.create({ messages: [{ role: "user", content: prompt }] });
const data = JSON.parse(res.choices[0].message.content); // Will crash if LLM returns markdown fences

// Good
const prompt = "Analyze the input and return a JSON list of keywords";
const res = await openai.chat.completions.create({
  messages: [{ role: "user", content: prompt }],
  response_format: { type: "json_object" } // Enforces JSON format
});
```

### 3. Weak Prompt Contextualization & Lack of System Instructions
Identify instances where system prompts are not properly distinguished from user queries, allowing user inputs to easily override the system prompt guidelines.
```javascript
// Bad
const prompt = `System: You are an math assistant. User: ${userInput}`;

// Good
const messages = [
  { role: "system", content: "You are a math assistant." },
  { role: "user", content: userInput }
];
```

## Output

For each finding:
```
Finding: [Issue Type]
Severity: [Critical|High|Medium|Low]
Confidence: [High|Medium|Low]
File: [path]
Line: [number]
Evidence: [code snippet]
Trigger: [when this bug occurs]
Impact: [what happens]
Recommendation: [fix]
```
