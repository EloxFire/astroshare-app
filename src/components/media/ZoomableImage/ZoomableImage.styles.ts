export const zoomableImageStyles = {
  imageWrapper: {
    flex: 1,
    width: "100%" as const,
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    overflow: "hidden" as const, // le contenu zoomé/déplacé ne doit pas déborder du cadre
  },

  image: {
    width: "100%" as const,
    aspectRatio: 1,
  },
};
