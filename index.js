const API_BASE =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2109-CPU-RM-WEB-PT/events";

const state = {
  events: [],
  selectedEvent: null,
};

function createElement(tag, classNames = [], text = "") {
  const el = document.createElement(tag);
  if (classNames.length) el.classList.add(...classNames);
  if (text) el.textContent = text;
  return el;
}

async function fetchAllEvents() {
  try {
    const res = await fetch(API_BASE);
    const json = await res.json();
    state.events = json.data;
    render();
  } catch (err) {
    console.error("Failed to fetch events:", err);
  }
}

async function fetchEventById(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    const json = await res.json();
    state.selectedEvent = json.data;
    render();
  } catch (err) {
    console.error("Failed to fetch single event:", err);
  }
}

function renderPartyList() {
  const listContainer = createElement("div");
  const heading = createElement("h2", [], "Upcoming Parties");
  listContainer.appendChild(heading);

  if (state.events.length === 0) {
    listContainer.appendChild(createElement("p", [], "No parties found."));
    return listContainer;
  }

  state.events.forEach((event) => {
    const btn = createElement("button", ["party-button"], event.name);

    if (state.selectedEvent?.id === event.id) {
      btn.classList.add("selected");
    }

    btn.addEventListener("click", () => fetchEventById(event.id));
    listContainer.appendChild(btn);
  });

  return listContainer;
}

function renderPartyDetails() {
  const detailsContainer = createElement("div");
  const heading = createElement("h2", [], "Party Details");
  detailsContainer.appendChild(heading);

  const event = state.selectedEvent;

  if (!event) {
    detailsContainer.appendChild(
      createElement("p", [], "Select a party to see details.")
    );
    return detailsContainer;
  }

  const formattedDate = new Date(event.date).toISOString().split("T")[0];

  const title = createElement("h3", [], `${event.name} #${event.id}`);
  const date = createElement("p", [], formattedDate);
  const location = createElement("p");
  location.innerHTML = `<em>${event.location}</em>`;
  const description = createElement("p", [], event.description);

  detailsContainer.append(title, date, location, description);

  return detailsContainer;
}

function render() {
  const root = document.getElementById("app");
  root.innerHTML = "";

  const layout = createElement("div", ["layout"]);

  layout.appendChild(renderPartyList());
  layout.appendChild(renderPartyDetails());

  root.appendChild(createElement("h1", [], "Party Planner"));
  root.appendChild(layout);
}

document.addEventListener("DOMContentLoaded", () => {
  render();
  fetchAllEvents();
});
