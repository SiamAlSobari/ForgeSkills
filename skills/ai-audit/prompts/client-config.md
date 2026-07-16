# Client SDK Configuration Prompt

Review code to ensure AI client SDKs (OpenAI, Anthropic, Gemini, LangChain, etc.) are securely, stably, and correctly configured.

## Categories

### 1. Hardcoded Parameters and Values
Verify that API keys or private endpoint URLs are not hardcoded in the client initialization.
```javascript
// Bad
const openai = new OpenAI({ apiKey: "sk-proj-..." });

// Good
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
```

### 2. Missing Retry Policies & Timeout Settings
Ensure calls to external APIs have defined retry strategies or timeout limits to prevent the app from hanging indefinitely or failing on transient network errors.
```javascript
// Bad
const response = await openai.chat.completions.create({ ... });

// Good
const openai = new OpenAI({ 
  timeout: 10 * 1000, // 10 seconds
  maxRetries: 3 
});
```

### 3. Missing Exception & Error Handling
Identify situations where generative AI service calls are executed without proper try-catch structures.
```javascript
// Bad
const result = await model.generateContent(prompt);
return result.response.text();

// Good
try {
  const result = await model.generateContent(prompt);
  return result.response.text();
} catch (error) {
  logger.error("AI Generation failed", error);
  return getFallbackResponse();
}
```

### 4. Incorrect Parameter Configurations
Check parameters like temperature. Socratic Tutors or deterministic tasks should keep temperature low (e.g. <= 0.3) for stability. High temperature on structured answers can cause incoherent responses.
```javascript
// Bad
const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [...],
  temperature: 1.2 // Too high for structured or tutor responses, causes incoherence
});
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
