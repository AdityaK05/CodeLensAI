export interface CodePreset {
  id: string;
  name: string;
  language: string;
  task: 'explain' | 'debug' | 'complexity' | 'improve' | 'learn';
  description: string;
  code: string;
}

export const CODE_PRESETS: CodePreset[] = [
  {
    id: "quicksort",
    name: "QuickSort with Edge Case",
    language: "typescript",
    task: "explain",
    description: "Classic recursive quicksort algorithm with pivot selection.",
    code: `function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) {
    return arr;
  }

  // Using last element as pivot
  const pivot = arr[arr.length - 1];
  const left: number[] = [];
  const right: number[] = [];

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}

// Example execution
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log("Sorted:", quickSort(numbers));`
  },
  {
    id: "race-condition",
    name: "Concurrency Race Condition",
    language: "python",
    task: "debug",
    description: "A multi-threaded counter demonstrating unsynchronized shared state.",
    code: `import threading
import time

shared_counter = 0

def worker():
    global shared_counter
    for _ in range(100000):
        # Unprotected read-modify-write causes subtle race condition
        current = shared_counter
        time.sleep(0.000001)
        shared_counter = current + 1

threads = [threading.Thread(target=worker) for _ in range(5)]
for t in threads:
    t.start()
for t in threads:
    t.join()

print(f"Final counter: {shared_counter} (Expected: 500000)")`
  },
  {
    id: "lru-cache",
    name: "LRU Cache O(1)",
    language: "typescript",
    task: "complexity",
    description: "Least Recently Used cache implementation using Map and linked structure.",
    code: `class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, V>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map<K, V>();
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;
    // Refresh position to mark as recently used
    const val = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  put(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Evict oldest (first inserted in Map iterator)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }
    this.cache.set(key, value);
  }
}`
  },
  {
    id: "memory-leak",
    name: "Event Listener Memory Leak",
    language: "javascript",
    task: "improve",
    description: "Common closure memory leak pattern in browser/Node event listeners.",
    code: `function setupListener(elementId) {
  const hugeDataPayload = new Array(1000000).fill("payload_cache_block");
  const el = document.getElementById(elementId);

  // Leak: handler closes over hugeDataPayload and is never deregistered
  el.addEventListener("click", () => {
    console.log("Element clicked, tag:", el.tagName);
    console.log("Payload length:", hugeDataPayload.length);
  });
}

function rebindComponent() {
  for (let i = 0; i < 50; i++) {
    setupListener("my-button");
  }
}`
  },
  {
    id: "bst-invert",
    name: "Invert Binary Tree",
    language: "cpp",
    task: "learn",
    description: "Classic recursive binary search tree inversion in C++.",
    code: `#include <iostream>
#include <utility>

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* invertTree(TreeNode* root) {
    if (root == nullptr) {
        return nullptr;
    }

    // Swap the left and right subtrees recursively
    TreeNode* temp = root->left;
    root->left = invertTree(root->right);
    root->right = invertTree(temp);

    return root;
}`
  }
];