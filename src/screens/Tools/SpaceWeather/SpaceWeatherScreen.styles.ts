import { app_colors, radius, typography, withOpacity } from "../../../helpers/variables";

export const spaceWeatherScreenStyles = {
  imageryContainer: {
    display: "flex" as const,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    gap: 20,

    image: {
      width: 350,
      height: 350,
      resizeMode: "cover" as const,
      borderWidth: 1,
      borderColor: app_colors.accent.light,
      borderRadius: radius.badge44,
      borderStyle: "dashed" as const,

      caption: {
        fontFamily: "ZTNatureBold",
        fontSize: 16,
        color: app_colors.primary.main,
      }
    },

    imageActions: {
      position: "absolute" as const,
      bottom: 10,
      right: 10,
      display: "flex" as const,
      flexDirection: "row" as const,
      gap: 8,

      button: {
        width: 36,
        height: 36,
        borderRadius: 18,
        display: "flex" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        backgroundColor: withOpacity(app_colors.black, 0.55),
      },
    },
  },

  scalesContainer: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,

    link: {
      color: app_colors.accent.main,
      fontFamily: "DMMonoRegular",
      fontSize: 12,
    },

    scales: {
      display: "flex" as const,
      flexDirection: 'row' as const,
      gap: 10
    }
  },

  eventsContainer: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,

    link: {
      color: app_colors.accent.main,
      fontFamily: "DMMonoRegular",
      fontSize: 12,
    },

    scales: {
      display: "flex" as const,
      flexDirection: 'column' as const,
      gap: 10
    }
  },

  magneticFieldContainer: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 20,

    values: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "flex-end" as const,
      gap: 20,

      text: {
        fontFamily: "ZTNatureRegular",
        fontSize: 16,
        color: app_colors.primary.main,
      },
      main: {
        fontFamily: "ZTNatureBold",
        fontSize: 30,
        color: app_colors.primary.main,
      },
      secondary: {
        fontFamily: "ZTNatureBold",
        fontSize: 16,
        color: app_colors.primary.main,
      },
      unit: {
        fontFamily: "ZTNatureBold",
        fontSize: 16,
        color: app_colors.primary.medium,
      },
    }
  },

  solarWindContainer: {
    marginTop: 20,
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 16,

    valueRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,

      value: {
        display: "flex" as const,
        flexDirection: "row" as const,
        gap: 5,
        alignItems: "baseline" as const,

        main: {
          fontFamily: "ZTNatureBold",
          fontSize: 30,
          color: app_colors.primary.main,
        },
        unit: {
          fontFamily: "ZTNatureBold",
          fontSize: 16,
          color: app_colors.primary.medium,
        },
      },
    },

    // Échelle à 4 paliers discrets (Lent/Modéré/Rapide/Très rapide) — contrairement au Bz (valeur
    // continue), le vent solaire n'est classé que par catégorie côté API (`level`), donc un
    // positionnement précis du marqueur dans son palier n'est pas possible : il est centré sur le
    // palier actif, comme un simple repère "vous êtes ici" plutôt qu'une position exacte.
    scale: {
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 8,

      track: {
        display: "flex" as const,
        flexDirection: "row" as const,
        gap: 3,

        segment: {
          flex: 1,
          height: 10,
          borderRadius: 5,
          backgroundColor: app_colors.accent.light,

          active: {
            backgroundColor: app_colors.yellow.main,
          },
        },
      },

      marker: {
        position: "absolute" as const,
        top: -2,
        bottom: -2,
        width: 3,
        marginLeft: -1.5,
        borderRadius: 1.5,
        backgroundColor: app_colors.primary.main,
      },

      labels: {
        display: "flex" as const,
        flexDirection: "row" as const,

        label: {
          flex: 1,
          textAlign: "center" as const,
          color: app_colors.primary.medium,
          fontSize: 12,
        },
      },
    },

    divider: {
      height: 1,
      backgroundColor: app_colors.primary.medium,
    },

    details: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,

      column: {
        display: "flex" as const,
        flexDirection: "column" as const,
        gap: 4,

        label: {
          color: app_colors.primary.medium,
          fontSize: 12,
        },
        value: {
          fontFamily: "ZTNatureBold",
          fontSize: 16,
          color: app_colors.primary.main,
        },
      },
    },

    description: {
      ...typography.dmMono.regular.cardBody,
      fontSize: 12,
      lineHeight: 12 * 1.4,
      color: app_colors.primary.medium,
    },
  },

  // Jauge divergente centrée sur 0 (-30 à +30) : même esprit structurel que bortleScale dans
  // ObservatoryDetails.styles.ts (piste + libellés d'extrêmes en dessous), mais une barre continue
  // plutôt que des segments discrets — le Bz est une valeur continue, pas un palier.
  bzScale: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 8,

    track: {
      height: 10,
      borderRadius: 5,
      backgroundColor: app_colors.accent.light,
      overflow: "hidden" as const,

      fill: {
        position: "absolute" as const,
        top: 0,
        bottom: 0,
        backgroundColor: app_colors.yellow.main,
      },

      marker: {
        position: "absolute" as const,
        top: -2,
        bottom: -2,
        width: 3,
        marginLeft: -1.5, // centre la barre sur sa position plutôt que de l'ancrer par son bord gauche
        borderRadius: 1.5,
        backgroundColor: app_colors.primary.main,
      },
    },

    extremes: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,

      text: {
        ...typography.dmMono.regular.rowMeta,
        color: app_colors.primary.medium,
      },
    },
  },

  wavelengthsRow: {
    content: {
      display: "flex" as const,
      flexDirection: "row" as const,
      gap: 14,
      paddingHorizontal: 2,
      paddingVertical: 4,
    },

    item: {
      display: "flex" as const,
      alignItems: "center" as const,
      gap: 4,
      width: 70,

      thumbnail: {
        width: 65,
        height: 65,
        resizeMode: "cover" as const,
        borderRadius: 65,
        borderWidth: 1.5,
        borderColor: app_colors.accent.light,
        borderStyle: "dashed" as const,
      },

      thumbnailActive: {
        borderColor: app_colors.accent.main,
        borderStyle: "solid" as const,
      },

      label: {
        ...typography.dmMono.regular.rowMeta,
        fontSize: 8,
        color: app_colors.primary.medium,
        textAlign: "center" as const,
      },
    },
  },

  kpCard: {
    backgroundColor: app_colors.primary.main,
    borderColor: app_colors.primary.main,

    valueRow: {
      display: "flex" as const,
      flexDirection: "row" as const,
      alignItems: "baseline" as const,
      gap: 5,
      borderBottomWidth: 1,
      borderBottomColor: app_colors.grey,
      paddingBottom: 4,

      value: {
        fontFamily: "ZTNatureBold",
        fontSize: 30,
        color: app_colors.yellow.main,
      },

      unit: {
        fontFamily: "ZTNatureBold",
        fontSize: 16,
        color: app_colors.grey,
      },

      // alignSelf: "center" plutôt que de compter sur le alignItems:"baseline" du parent : ce
      // dernier n'a de sens que pour du texte, pas pour cette View (icône + texte) — même leçon que
      // pour Badge plus haut dans la session.
      trend: {
        display: "flex" as const,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        gap: 4,
        marginLeft: "auto" as const,
        alignSelf: "center" as const,

        label: {
          ...typography.dmMono.regular.rowMeta,
          color: app_colors.yellow.main,
          fontSize: 12,
        },
      },
    }
  }
}