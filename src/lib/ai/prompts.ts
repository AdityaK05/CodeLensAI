import { AnalysisTask } from "./schemas";

export const getPrompt = (task: AnalysisTask, code: string, language: string = "typescript") => {
  const baseInstruction = `You are CodeLens AI, an elite principal software engineer and static analysis specialist.
Analyze the following ${language} code thoroughly. Use clean GitHub-flavored markdown with clear headers, bullet points, and syntax-highlighted code blocks where helpful. Be precise, insightful, and actionable.`;

  switch (task) {
    case "explain":
      return `${baseInstruction}

Task: Comprehensive Code Explanation
Code:
\`\`\`${language}
${code}
\`\`\`

Structure your response with:
### 📌 Executive Summary
High-level overview of what this code does in 2-3 concise sentences.

### 🔍 Architecture & Logic Breakdown
Step-by-step walkthrough of the key algorithms, functions, control flow, and data transformations.

### ⏱️ Time & Space Complexity
- **Time Complexity:** O(...) with brief explanation.
- **Space Complexity:** O(...) with brief explanation.

### 💡 Key Takeaways
Important patterns, paradigms, or best practices demonstrated.`;

    case "debug":
      return `${baseInstruction}

Task: Deep Bug Detection, Security Audit & Fix
Code:
\`\`\`${language}
${code}
\`\`\`

Structure your response with:
### 🚨 Identified Issues & Vulnerabilities
List potential bugs, edge-case failures, memory leaks, race conditions, or security issues with line references.

### 🛠️ Root Cause Analysis
Explain WHY each issue happens and how it affects runtime behavior.

### ✅ Refactored & Fixed Code
Provide the fully corrected, production-grade code snippet ready to copy-paste.

### 🧪 Verification & Edge Cases to Test
List boundary conditions (e.g. empty inputs, nulls, high concurrency, overflow) to test.`;

    case "complexity":
      return `${baseInstruction}

Task: Algorithmic Complexity & Big-O Analysis
Code:
\`\`\`${language}
${code}
\`\`\`

Structure your response with:
### 📊 Complexity Scorecard
- **Worst-Case Time Complexity:** O(...)
- **Average-Case Time Complexity:** O(...)
- **Best-Case Time Complexity:** O(...)
- **Auxiliary Space Complexity:** O(...)

### 🔬 Mathematical & Operational Breakdown
Line-by-line or block-by-block explanation of loops, recursions, allocations, and operations leading to the Big-O bounds.

### ⚡ Optimization Opportunities
Can this be improved asymptotically or constant-factor? Describe potential bottlenecks and optimal alternatives (e.g., hash maps, two pointers, memoization).`;

    case "improve":
      return `${baseInstruction}

Task: Modernization, Clean Code & Performance Optimization
Code:
\`\`\`${language}
${code}
\`\`\`

Structure your response with:
### 🚀 Improvement Opportunities
Highlight maintainability, readability, performance bottlenecks, idiomatic style, and typing improvements.

### ✨ Optimized Code
Provide the refactored, elegant, and idiomatic version of this code.

### 📈 Comparison & Benchmarking Impact
Explain what changed and the tangible performance/maintainability advantages gained.`;

    case "learn":
      return `${baseInstruction}

Task: Beginner-Friendly Conceptual Guide
Code:
\`\`\`${language}
${code}
\`\`\`

Structure your response with:
### 🎓 Core Concepts Explained
Explain the core programming concepts and paradigms used in this code using intuitive real-world analogies.

### 🧩 How the Pieces Fit Together
Explain the syntax, variable roles, and step-by-step execution path in approachable terms.

### 📚 Interactive Quiz & Mini Challenge
Give 1 quick question or small challenge the learner can try to test their understanding.`;
  }
};
