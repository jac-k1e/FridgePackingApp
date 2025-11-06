function getInputs() {
  return {
    unitWidth: parseFloat(document.getElementById('unitWidth').value),
    unitDepth: parseFloat(document.getElementById('unitDepth').value),
    sidePack: parseFloat(document.getElementById('sidePack').value),
    frontPack: parseFloat(document.getElementById('frontPack').value),
    rearPack: parseFloat(document.getElementById('rearPack').value),
    boxThickness: parseFloat(document.getElementById('boxThickness').value),
    epsVar: parseFloat(document.getElementById('epsVar').value),
    boxClear: parseFloat(document.getElementById('boxClear').value)
  };
}

function calculateBoxDimensions(inputs) {
  const width = inputs.unitWidth + 2 * inputs.sidePack + 2 * inputs.boxThickness + 2 * inputs.boxClear + 2 * inputs.epsVar;
  const depth = inputs.unitDepth + inputs.frontPack + inputs.rearPack + 2 * inputs.boxThickness + 2 * inputs.boxClear + 2 * inputs.epsVar;
  return { width, depth };
}

function drawLayout(containerWidth, boxWidth, boxDepth, units, orientation, label) {
  const canvas = document.getElementById('layoutCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const scale = canvas.width / containerWidth;
  const height = (orientation === "side") ? boxDepth : boxWidth;

  ctx.strokeStyle = "#333";
  ctx.strokeRect(0, 20, containerWidth * scale, height * scale);
  ctx.fillText(label, 5, height * scale + 35);

  for (let i = 0; i < units; i++) {
    const x = i * (orientation === "side" ? boxWidth : boxDepth) * scale;
    const w = (orientation === "side" ? boxWidth : boxDepth) * scale;
    const h = height * scale;
    ctx.fillStyle = label.includes("Trailer") ? "#FFD700" : (orientation === "side" ? "#87CEFA" : "#90EE90");
    ctx.fillRect(x, 20, w, h);
    ctx.strokeRect(x, 20, w, h);
    ctx.fillStyle = "#000";
    ctx.fillText(`Box ${i + 1}`, x + 5, 15);
  }
}

document.getElementById('calcForm').onsubmit = function (e) {
  e.preventDefault();
  const inputs = getInputs();
  const { width, depth } = calculateBoxDimensions(inputs);

  const railFit = 3 * width <= 114;
  const trailerFit = 2 * width <= 101.5;
  const totalRailWidth = (3 * width).toFixed(4);
  const totalTrailerWidth = (2 * width).toFixed(4);

  let result = `📦 Carton Width: ${width.toFixed(4)}", Depth: ${depth.toFixed(4)}"\n`;
  result += `🚂 Railcar 3-wide: ${railFit ? "✅ Fits" : "❌ Does not fit"} — Total width: ${totalRailWidth}"\n`;
  result += `🚛 Trailer 2-wide: ${trailerFit ? "✅ Fits" : "❌ Does not fit"} — Total width: ${totalTrailerWidth}"`;
  document.getElementById('result').textContent = result;

  drawLayout(114, width, depth, 3, "side", "Railcar (3-wide)");
};

document.getElementById('rotateButton').onclick = function () {
  const inputs = getInputs();
  const { width, depth } = calculateBoxDimensions(inputs);
  const railFit = 3 * depth <= 114;
  const totalRotatedDepth = (3 * depth).toFixed(4);

  let result = `🔄 Rotated Layout — Box Depth: ${depth.toFixed(4)}", Width: ${width.toFixed(4)}"\n`;
  result += `🚂 Railcar front-to-back: ${railFit ? "✅ Fits" : "❌ Does not fit"} — Total depth: ${totalRotatedDepth}"`;
  document.getElementById('result').textContent = result;

  drawLayout(114, width, depth, 3, "rotated", "Railcar (Rotated)");
};

document.getElementById('trailerButton').onclick = function () {
  const inputs = getInputs();
  const { width, depth } = calculateBoxDimensions(inputs);
  const trailerFit = 2 * width <= 101.5;
  const totalTrailerWidth = (2 * width).toFixed(4);

  let result = `🚛 Trailer Layout — Box Width: ${width.toFixed(4)}", Depth: ${depth.toFixed(4)}"\n`;
  result += `2-wide in 101.5" trailer: ${trailerFit ? "✅ Fits" : "❌ Does not fit"} — Total width: ${totalTrailerWidth}"`;
  document.getElementById('result').textContent = result;

  drawLayout(101.5, width, depth, 2, "side", "Trailer (2-wide)");
};
