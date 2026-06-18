const seedContainer = document.querySelector("#seedtts-samples");
const emphasisContainer = document.querySelector("#emphasis-samples");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function emphasisMarkup(text) {
  return escapeHtml(text).replace(/\*([^*]+)\*/g, "<strong>$1</strong>");
}

function modelLabelMarkup(label) {
  const value = String(label).trim();

  if (
    value === "F5TTS-SFT" ||
    value === "𝓜<sub>TTS-SFT</sub>" ||
    value === "𝓜ₜₜₛ₋ₛꜰₜ" ||
    value.includes("TTS-SFT")
  ) {
    return `<span class="model-label"><span class="mathcal-m">𝓜</span><sub>TTS-SFT</sub></span>`;
  }

  if (
    value === "F5TTS-DP-SFT" ||
    value === "𝓜<sub>TTS-DP-SFT</sub>" ||
    value === "𝓜ₜₜₛ₋ᴅₚ₋ₛꜰₜ" ||
    value.includes("TTS-DP-SFT")
  ) {
    return `<span class="model-label"><span class="mathcal-m">𝓜</span><sub>TTS-DP-SFT</sub></span>`;
  }

  if (value === "F5TTS-DP-GRPO") {
    return "EmphTTS";
  }

  return escapeHtml(value);
}

function audioPlayer(audio) {
  return `<audio controls preload="none" src="${escapeHtml(audio.src)}"></audio>`;
}

function sampleBlock(sample, kind) {
  const text = kind === "emphasis" ? emphasisMarkup(sample.text) : escapeHtml(sample.text);

  const headers = sample.audio
    .map((audio) => `<th scope="col">${modelLabelMarkup(audio.label)}</th>`)
    .join("");

  const players = sample.audio
    .map((audio) => `<td>${audioPlayer(audio)}</td>`)
    .join("");

  return `
    <article class="sample-block">
      <div class="target-row">
        <div class="sample-index">Sample ${String(sample.number).padStart(2, "0")}</div>
        <p>${text}</p>
      </div>
      <div class="table-wrap">
        <table class="demo-table">
          <thead>
            <tr>${headers}</tr>
          </thead>
          <tbody>
            <tr>${players}</tr>
          </tbody>
        </table>
      </div>
    </article>
  `;
}

function renderSamples(container, samples, kind) {
  container.innerHTML = samples.map((sample) => sampleBlock(sample, kind)).join("");
}

async function loadSamples() {
  const response = await fetch("assets/samples.json");

  if (!response.ok) {
    throw new Error(`Could not load assets/samples.json: ${response.status}`);
  }

  const data = await response.json();

  renderSamples(seedContainer, data.seedtts, "seedtts");
  renderSamples(emphasisContainer, data.emphasis, "emphasis");
}

loadSamples().catch((error) => {
  const message = `<p class="load-error">${escapeHtml(error.message)}</p>`;
  seedContainer.innerHTML = message;
  emphasisContainer.innerHTML = message;
});
