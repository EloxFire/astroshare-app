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
  screen: {
    modal: {
      sunAboveHorizon: {
        title: "Heads up",
        text: "The Sun will be above the horizon at the start of your observation session.\n\nThis can affect the visibility of celestial objects. Do you want to continue?",
        cancel: "Cancel",
        continue: "Continue",
      },
    },
    steps: {
      sessionDuration: "1. Session duration",
      objectTypes: "2. Object types",
      otherFilters: "3. Other filters (optional)",
      results: "4. Results",
    },
    labels: {
      startDateTime: "Start date & time",
      endDateTime: "End date & time",
      magnitude: "Magnitude",
      altitude: "Altitude",
      maxResults: "Max number of results",
      perObjectTime: "Time per object (minutes)",
    },
    placeholders: {
      minMag: "Min mag",
      maxMag: "Max mag",
      minAlt: "Min alt (°)",
      maxAlt: "Max alt (°)",
      maxResults: "Max results (default 10)",
      perObjectTime: "Default 5 min",
    },
    buttons: {
      search: "Start search",
      searchAgain: "Search again",
      clear: "Clear search",
    },
    messages: {
      empty: "No results match your criteria",
      recommended: "Recommended objects for your observation session:",
    },
    errors: {
      planning: "An error occurred while planning the observation.",
    },
  },
};
