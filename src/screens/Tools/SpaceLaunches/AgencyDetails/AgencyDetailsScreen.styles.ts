import { app_colors } from "../../../../helpers/variables";

export const agencyDetailsScreenStyles = {
  loader: {
    marginTop: 40,
  },

  notFound: {
    fontSize: 14,
    fontFamily: "ZTNatureRegular" as const,
    color: app_colors.primary.medium,
    textAlign: "center" as const,
    paddingVertical: 30,
  },

  logo: {
    height: 100,
    width: 100,
    borderRadius: 100,
    marginBottom: 10,
    alignSelf: "center" as const,
  },

  tags: {
    display: "flex" as const,
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 6,
    justifyContent: "center" as const,
  },

  description: {
    fontSize: 14,
    fontFamily: "ZTNatureRegular" as const,
    color: app_colors.primary.main,
    lineHeight: 20,
  },
};
