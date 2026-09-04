const catalog = [
  {title:"The Wild Robot",type:"Movie",year:"2024",genre:"Animation · Adventure",match:96,cls:"one",reason:"Because you liked imaginative worlds"},
  {title:"Severance",type:"Series",year:"2022",genre:"Sci-fi · Thriller",match:94,cls:"two",reason:"A strong match for your sci-fi taste"},
  {title:"Past Lives",type:"Movie",year:"2023",genre:"Drama · Romance",match:91,cls:"three",reason:"People with your taste loved this"},
  {title:"The Bear",type:"Series",year:"2022",genre:"Drama · Comedy",match:88,cls:"four",reason:"For your love of character-driven stories"},
  {title:"Dune: Part Two",type:"Movie",year:"2024",genre:"Sci-fi · Epic",match:97,cls:"five",reason:"Because you enjoyed complex sci-fi"},
  {title:"Dark Matter",type:"Series",year:"2024",genre:"Sci-fi · Mystery",match:93,cls:"six",reason:"A high-confidence sci-fi pick"},
  {title:"The Holdovers",type:"Movie",year:"2023",genre:"Drama · Comedy",match:86,cls:"seven",reason:"Similar tone to your recent favorites"},
  {title:"Silo",type:"Series",year:"2023",genre:"Sci-fi · Mystery",match:90,cls:"eight",reason:"Fans of Severance also watched this"}
];
const defaultHistory = [
  {title:"The Wild Robot",action:"Liked",date:"Today, 9:42 AM",cls:"one"},
  {title:"Severance",action:"Rated 5/5",date:"Yesterday, 8:12 PM",cls:"two"},
  {title:"Past Lives",action:"Saved",date:"Sep 2, 6:31 PM",cls:"three"},
  {title:"The Bear",action:"Viewed",date:"Sep 1, 9:05 PM",cls:"four"},
  {title:"Dune: Part Two",action:"Recommended",date:"Aug 31, 7:20 PM",cls:"five"}
];
let history = JSON.parse(localStorage.getItem("recomind-history") || "null") || defaultHistory;
let activeMode = localStorage.getItem("recomind-mode") || "content";
let activeFilter = "all";

const $ = (selector) => document.querySelector(selector);
function showToast(message = "Recommendation saved") {
  $("#toast b").textContent = message; $("#toast").classList.add("show");
  setTimeout(() => $("#toast").classList.remove("show"), 2200);
}
function renderCards(target, items) {
  $(target).innerHTML = items.map(item => `<article class="rec-card">
    <div class="poster ${item.cls}"><span class="poster-title">${item.title}</span><span class="poster-meta">${item.type} · ${item.year}</span></div>
    <div class="card-body"><h3>${item.title}</h3><p>${item.reason}</p><div class="card-foot"><span class="match">${item.match}% match</span><div class="actions"><button class="round-action" data-action="like" data-title="${item.title}" title="Like">♡</button><button class="round-action" data-action="save" data-title="${item.title}" title="Save">▣</button></div></div></div>
  </article>`).join("");
}
function filteredCatalog() {
  const query = ($("#search-input")?.value || "").toLowerCase();
  return catalog.filter(item => (activeFilter === "all" || item.type.toLowerCase() === activeFilter) && `${item.title} ${item.genre}`.toLowerCase().includes(query));
}
function renderDiscover() {
  const items = filteredCatalog(); renderCards("#discover-grid", items);
  $("#result-count").textContent = `${items.length} recommendations`;
}
function renderHistory() {
  const filter = $("#history-filter")?.value || "all";
  const items = filter === "all" ? history : history.filter(item => item.action.toLowerCase().includes(filter));
  $("#history-summary").textContent = `Your latest ${items.length} recommendations`;
  $("#history-list").innerHTML = items.map(item => `<div class="history-item"><div class="history-thumb poster ${item.cls}"></div><div class="history-info"><strong>${item.title}</strong><p>${item.action}</p></div><span class="history-action">${item.action === "Recommended" ? "AI pick" : "Your signal"}</span><span class="history-date">${item.date}</span></div>`).join("");
}
function setMode(mode) {
  activeMode = mode; localStorage.setItem("recomind-mode", mode);
  document.querySelectorAll(".mode-tab").forEach(tab => tab.classList.toggle("active", tab.dataset.mode === mode));
  const labels = {content:"content-based recommendations", collaborative:"people-like-you recommendations", hybrid:"hybrid recommendations"};
  $("#mode-label").textContent = labels[mode];
  renderCards("#recommendation-grid", mode === "collaborative" ? catalog.slice(2,6) : mode === "hybrid" ? [catalog[4],catalog[0],catalog[7],catalog[2]] : catalog.slice(0,4));
  if ($("#settings-mode")) $("#settings-mode").value = mode;
}
function navigate(view) {
  document.querySelectorAll(".view").forEach(section => section.classList.remove("active-view"));
  $(`#${view}-view`).classList.add("active-view");
  document.querySelectorAll(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.view === view));
  $("#breadcrumb-title").textContent = view.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase());
  if (view === "discover") renderDiscover(); if (view === "history") renderHistory();
  window.scrollTo({top:0, behavior:"smooth"});
}
document.addEventListener("click", event => {
  const nav = event.target.closest("[data-view]"); if (nav) navigate(nav.dataset.view);
  const mode = event.target.closest("[data-mode]"); if (mode) { setMode(mode.dataset.mode); if (mode.closest(".upgrade-card,.model-card")) { navigate("overview"); showToast("Hybrid recommendations activated"); } }
  const action = event.target.closest("[data-action]");
  if (action) {
    const title = action.dataset.title; const item = catalog.find(x => x.title === title);
    if (action.dataset.action === "save") { action.classList.toggle("saved"); if (action.classList.contains("saved")) { history.unshift({title, action:"Saved", date:"Just now", cls:item.cls}); localStorage.setItem("recomind-history", JSON.stringify(history)); $("#saved-count").textContent = Number($("#saved-count").textContent) + 1; renderHistory(); showToast(); } }
    if (action.dataset.action === "like") { action.classList.add("saved"); history.unshift({title, action:"Liked", date:"Just now", cls:item.cls}); localStorage.setItem("recomind-history", JSON.stringify(history)); $("#profile-likes").textContent = Number($("#profile-likes").textContent) + 1; renderHistory(); showToast("Taste signal added"); }
  }
  const toggle = event.target.closest("[data-toggle]"); if (toggle) toggle.classList.toggle("on");
});
document.querySelectorAll(".mode-tab").forEach(tab => tab.addEventListener("click", () => setMode(tab.dataset.mode)));
document.querySelectorAll(".filter-pill").forEach(pill => pill.addEventListener("click", () => { activeFilter = pill.dataset.filter; document.querySelectorAll(".filter-pill").forEach(p => p.classList.toggle("active", p === pill)); renderDiscover(); }));
$("#search-input").addEventListener("input", renderDiscover);
$("#history-filter").addEventListener("change", renderHistory);
$("#settings-mode").addEventListener("change", event => { setMode(event.target.value); showToast("Model preference updated"); });
$("#refresh-btn").addEventListener("click", () => { setMode(activeMode); showToast("Recommendations refreshed"); });
$("#clear-profile").addEventListener("click", () => { if (confirm("Reset your taste signals?")) { localStorage.removeItem("recomind-history"); history = defaultHistory; renderHistory(); showToast("Profile signals reset"); } });
$("#export-history").addEventListener("click", () => { const blob = new Blob([JSON.stringify(history, null, 2)], {type:"application/json"}); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "recomind-history.json"; link.click(); URL.revokeObjectURL(link.href); showToast("History exported"); });
setMode(activeMode); renderDiscover(); renderHistory();
