import { describe, it, expect } from 'vitest';
import { validateAnalyzeRequest } from '../analyze-request';

describe('Validate Analyze Request', () => {
  it('should validate a correct request', () => {
    const valid = {
      code: 'console.log("hello");',
      task: 'explain',
      language: 'javascript'
    };
    const result = validateAnalyzeRequest(valid);
    expect(result.success).toBe(true);
  });

  it('should fail on invalid task', () => {
    const invalid = {
      code: 'console.log("hello");',
      task: 'invalid-task',
      language: 'javascript'
    };
    const result = validateAnalyzeRequest(invalid);
    expect(result.success).toBe(false);
  });
});
