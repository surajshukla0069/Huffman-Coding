let encoderMap = {};
let decoderMap = {};

function buildFrequencyMap(text) {
  const freq = {};
  for (let ch of text) {
    freq[ch] = (freq[ch] || 0) + 1;
  }
  return freq;
}

function buildHuffmanTree(freqMap) {
  const pq = Object.entries(freqMap).map(([ch, freq]) => ({ ch, freq, left: null, right: null }));
  pq.sort((a, b) => a.freq - b.freq);
  while (pq.length > 1) {
    const left = pq.shift();
    const right = pq.shift();
    const newNode = { ch: null, freq: left.freq + right.freq, left, right };
    pq.push(newNode);
    pq.sort((a, b) => a.freq - b.freq);
  }
  return pq[0];
}

function generateCodes(node, code) {
  if (!node) return;
  if (node.ch !== null) {
    encoderMap[node.ch] = code;
    decoderMap[code] = node.ch;
  }
  generateCodes(node.left, code + "0");
  generateCodes(node.right, code + "1");
}

function encodeText() {
  const text = document.getElementById("inputText").value;
  if (!text) {
    alert("Please enter some text to encode.");
    return;
  }

  encoderMap = {};
  decoderMap = {};

  const freqMap = buildFrequencyMap(text);
  const root = buildHuffmanTree(freqMap);
  generateCodes(root, "");

  let encoded = "";
  for (let ch of text) {
    encoded += encoderMap[ch];
  }

  const originalSize = text.length * 8;
  const encodedSize = encoded.length;
  const compression = ((encodedSize / originalSize) * 100).toFixed(2);

  document.getElementById("encodedOutput").innerText = encoded;
  document.getElementById("compressionOutput").innerText =
    `Original Size: ${originalSize} bits\nEncoded Size: ${encodedSize} bits\nCompression: ${compression}%`;

  document.getElementById("encodedBox").style.display = "block";
  document.getElementById("compressionBox").style.display = "block";
  document.getElementById("decodedBox").style.display = "none";
}

function decodeText() {
  const encoded = document.getElementById("encodedOutput").innerText;
  if (!encoded) {
    alert("Please encode text first to decode.");
    return;
  }

  let decoded = "";
  let current = "";
  for (let bit of encoded) {
    current += bit;
    if (decoderMap[current]) {
      decoded += decoderMap[current];
      current = "";
    }
  }

  document.getElementById("decodedOutput").innerText = decoded;
  document.getElementById("decodedBox").style.display = "block";
}

function copySimple(elementId) {
  const text = document.getElementById(elementId).innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert("Copied to clipboard!");
  });
}
