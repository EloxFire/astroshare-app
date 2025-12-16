export const observationPlannerTranslations = {
  window: {
    title: "Observation window",
    subtitle: "Pick when you plan to observe.",
    start: "Start",
    end: "End",
    resetTonight: "Back to now +3h",
  },
  filters: {
    title: "Refine suggestions",
    subtitle: "Limit objects based on your setup and sky.",
    magnitude: "Magnitude limit",
    minAltitude: "Min altitude (°)",
    maxSize: "Max size (arcmin)",
    helper: "Add your field of view to check if targets fit the frame.",
    reset: "Reset filters",
    refresh: "Update list",
    targets: {
      planets: "Planets",
      stars: "Bright stars",
      dso: "Deep sky",
    },
    fov: {
      width: "FOV (°) - width",
      height: "FOV (°) - height",
    },
  },
  results: {
    title: "Optimized order",
    subtitle: "Sorted by best altitude inside your window.",
    empty: "No objects match this time span with these filters.",
    order: "Order",
    altitude: "Alt.",
    bestAt: "Best",
    visibility: "Visible %{percent}%",
    magnitude: "Mag",
    size: "Size",
    fov: {
      ok: "Fits the frame",
      ko: "Too wide",
    },
    details: "View details",
  },
};
