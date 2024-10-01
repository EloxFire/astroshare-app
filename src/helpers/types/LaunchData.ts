export type LaunchData = {
  id: string;
  url: string;
  name: string;
  response_mode: string;
  slug: string;
  launch_designator: string | null;
  status: {
    id: number;
    name: string;
    abbrev: string;
    description: string;
  };
  last_updated: string;
  net: string;
  net_precision: {
    id: number;
    name: string;
    abbrev: string;
    description: string;
  };
  window_end: string;
  window_start: string;
  image: {
    id: number;
    name: string;
    image_url: string;
    thumbnail_url: string;
    credit: string;
    license: {
      id: number;
      name: string;
      priority: number;
      link: string;
    };
    single_use: boolean;
    variants: any[];
  };
  infographic: string | null;
  probability: number | null;
  weather_concerns: string | null;
  failreason: string;
  hashtag: string | null;
  launch_service_provider: {
    response_mode: string;
    id: number;
    url: string;
    name: string;
    abbrev: string;
    type: {
      id: number;
      name: string;
    };
  };
  rocket: {
    id: number;
    configuration: {
      response_mode: string;
      id: number;
      url: string;
      name: string;
      families: {
        response_mode: string;
        id: number;
        name: string;
      }[];
      full_name: string;
      variant: string;
    };
  };
  mission: {
    id: number;
    name: string;
    type: string;
    description: string;
    image: string | null;
    orbit: {
      id: number;
      name: string;
      abbrev: string;
      celestial_body: {
        response_mode: string;
        id: number;
        name: string;
      };
    };
    agencies: {
      response_mode: string;
      id: number;
      url: string;
      name: string;
      abbrev: string;
      type: {
        id: number;
        name: string;
      };
      featured: boolean;
      country: {
        id: number;
        name: string;
        alpha_2_code: string;
        alpha_3_code: string;
        nationality_name: string;
        nationality_name_composed: string;
      }[];
      description: string;
      administrator: string;
      founding_year: number;
      launchers: string;
      spacecraft: string;
      parent: string | null;
      image: {
        id: number;
        name: string;
        image_url: string;
        thumbnail_url: string;
        credit: string | null;
        license: {
          id: number;
          name: string;
          priority: number;
          link: string | null;
        };
        single_use: boolean;
        variants: any[];
      };
      logo: {
        id: number;
        name: string;
        image_url: string;
        thumbnail_url: string;
        credit: string | null;
        license: {
          id: number;
          name: string;
          priority: number;
          link: string | null;
        };
        single_use: boolean;
        variants: any[];
      };
      social_logo: {
        id: number;
        name: string;
        image_url: string;
        thumbnail_url: string;
        credit: string | null;
        license: {
          id: number;
          name: string;
          priority: number;
          link: string | null;
        };
        single_use: boolean;
        variants: any[];
      };
      total_launch_count: number;
      consecutive_successful_launches: number;
      successful_launches: number;
      failed_launches: number;
      pending_launches: number;
      consecutive_successful_landings: number;
      successful_landings: number;
      failed_landings: number;
      attempted_landings: number;
      successful_landings_spacecraft: number;
      failed_landings_spacecraft: number;
      attempted_landings_spacecraft: number;
      successful_landings_payload: number;
      failed_landings_payload: number;
      attempted_landings_payload: number;
      info_url: string;
      wiki_url: string;
      social_media_links: any[];
    }[];
    info_urls: any[];
    vid_urls: any[];
  };
  pad: {
    id: number;
    url: string;
    active: boolean;
    agencies: {
      response_mode: string;
      id: number;
      url: string;
      name: string;
      abbrev: string;
      type: {
        id: number;
        name: string;
      };
      featured: boolean;
      country: {
        id: number;
        name: string;
        alpha_2_code: string;
        alpha_3_code: string;
        nationality_name: string;
        nationality_name_composed: string;
      }[];
      description: string;
      administrator: string;
      founding_year: number;
      launchers: string;
      spacecraft: string;
      parent: string | null;
      image: {
        id: number;
        name: string;
        image_url: string;
        thumbnail_url: string;
        credit: string | null;
        license: {
          id: number;
          name: string;
          priority: number;
          link: string | null;
        };
        single_use: boolean;
        variants: any[];
      };
      logo: {
        id: number;
        name: string;
        image_url: string;
        thumbnail_url: string;
        credit: string | null;
        license: {
          id: number;
          name: string;
          priority: number;
          link: string | null;
        };
        single_use: boolean;
        variants: any[];
      };
      social_logo: {
        id: number;
        name: string;
        image_url: string;
        thumbnail_url: string;
        credit: string | null;
        license: {
          id: number;
          name: string;
          priority: number;
          link: string | null;
        };
        single_use: boolean;
        variants: any[];
      };
    }[];
    name: string;
    image: {
      id: number;
      name: string;
      image_url: string;
      thumbnail_url: string;
      credit: string;
      license: {
        id: number;
        name: string;
        priority: number;
        link: string;
      };
      single_use: boolean;
      variants: any[];
    };
    description: string;
    info_url: string | null;
    wiki_url: string;
    map_url: string;
    latitude: number;
    longitude: number;
    country: {
      id: number;
      name: string;
      alpha_2_code: string;
      alpha_3_code: string;
      nationality_name: string;
      nationality_name_composed: string;
    };
    map_image: string;
    total_launch_count: number;
    orbital_launch_attempt_count: number;
    fastest_turnaround: string;
    location: {
      response_mode: string;
      id: number;
      url: string;
      name: string;
      celestial_body: {
        response_mode: string;
        id: number;
        name: string;
        type: {
          id: number;
          name: string;
        };
        diameter: number;
        mass: number;
        gravity: number;
        length_of_day: string;
        atmosphere: boolean;
        image: {
          id: number;
          name: string;
          image_url: string;
          thumbnail_url: string;
          credit: string;
          license: {
            id: number;
            name: string;
            priority: number;
            link: string;
          };
          single_use: boolean;
          variants: any[];
        };
        description: string;
        wiki_url: string;
        total_attempted_launches: number;
        successful_launches: number;
        failed_launches: number;
        total_attempted_landings: number;
        successful_landings: number;
        failed_landings: number;
      };
      active: boolean;
      country: {
        id: number;
        name: string;
        alpha_2_code: string;
        alpha_3_code: string;
        nationality_name: string;
        nationality_name_composed: string;
      };
      description: string;
      image: {
        id: number;
        name: string;
        image_url: string;
        thumbnail_url: string;
        credit: string;
        license: {
          id: number;
          name: string;
          priority: number;
          link: string;
        };
        single_use: boolean;
        variants: any[];
      };
      map_image: string;
      longitude: number;
      latitude: number;
      timezone_name: string;
      total_launch_count: number;
      total_landing_count: number;
    };
  };
  webcast_live: boolean;
  program: {
    response_mode: string;
    id: number;
    url: string;
    name: string;
    image: {
      id: number;
      name: string;
      image_url: string;
      thumbnail_url: string;
      credit: string;
      license: {
        id: number;
        name: string;
        priority: number;
        link: string;
      };
      single_use: boolean;
      variants: any[];
    };
    info_url: string;
    wiki_url: string;
    description: string;
    agencies: {
      response_mode: string;
      id: number;
      url: string;
      name: string;
      abbrev: string;
      type: {
        id: number;
        name: string;
      };
    }[];
    start_date: string;
    end_date: string | null;
    mission_patches: {
      id: number;
      name: string;
      priority: number;
      image_url: string;
      agency: {
        response_mode: string;
        id: number;
        url: string;
        name: string;
        abbrev: string;
        type: {
          id: number;
          name: string;
        };
      };
      response_mode: string;
    }[];
    type: {
      id: number;
      name: string;
    };
  }[];
  orbital_launch_attempt_count: number;
  location_launch_attempt_count: number;
  pad_launch_attempt_count: number;
  agency_launch_attempt_count: number;
  orbital_launch_attempt_count_year: number;
  location_launch_attempt_count_year: number;
  pad_launch_attempt_count_year: number;
  agency_launch_attempt_count_year: number;
};
