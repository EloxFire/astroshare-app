export const astroGearTranslations = {
  telescopes: {
    types: {
      refractor: "Réfracteur",
      reflector: "Réflecteur",
      catadioptric: "Catadioptrique",
      other: "Autre",
    },
    // Based on telescope constructions defined in constants.ts
    constructions: {
      newtonian: "Newton",
      dobsonian: "Dobson",
      schmidt_cassegrain: "Schmidt-Cassegrain",
      maksutov: "Maksutov",
      other: "Autre",
    },
    // Based on telescope usages defined in constants.ts
    usages: {
      planetary: "Planétaire",
      deep_sky: "Grand champ",
      astrophotography: "Astrophotographie",
      lunar: "Lunaire",
      solar: "Solaire",
      other: "Autre",
    }
  },
  cameras: {
    types: {
      dedicated: "Caméra dédiée",
      dslr: "Reflex numérique (DSLR)",
      mobile: "Caméra de smartphone",
      other: "Autre",
    }
  },
  mounts: {
    types: {
      equatorial: "Équatoriale",
      azimuthal: "Azimutale",
      altazimuthal: "Altazimutale",
      other: "Autre",
    }
  }
}