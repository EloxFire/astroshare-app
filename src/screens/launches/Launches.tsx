import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { globalStyles } from "../../styles/global";
import { i18n } from "../../helpers/scripts/i18n";
import PageTitle from "../../components/commons/PageTitle";
import axios from "axios";
import { launcheScreenStyles } from "../../styles/launches/launches";
import { app_colors } from "../../helpers/constants";
import LaunchCard from "../../components/cards/LaunchCard";
import SimpleButton from "../../components/commons/buttons/SimpleButton";

export default function LaunchesScreen({ navigation }: any) {

  const [loading, setLoading] = useState(false)
  const [launches, setLaunches] = useState<any>([])

  useEffect(() => {
    getLaunches()    
  }, [])

  const getLaunches = async () => {
    // setLoading(true)
    // const response = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/launches`)
    // setLaunches(response.data.data)
    // setLoading(false)
    setLaunches([{
      "id": "cd199e27-63cd-409c-817c-5c38039b17cd",
      "url": "https://ll.thespacedevs.com/2.3.0/launches/cd199e27-63cd-409c-817c-5c38039b17cd/",
      "name": "Vulcan VC2S | Certification Flight 2",
      "response_mode": "normal",
      "slug": "vulcan-vc2s-certification-flight-2",
      "launch_designator": null,
      "status": {
          "id": 1,
          "name": "Go for Launch",
          "abbrev": "Go",
          "description": "Current T-0 confirmed by official or reliable sources."
      },
      "last_updated": "2024-09-30T12:57:32Z",
      "net": "2024-10-04T10:00:00Z",
      "net_precision": {
          "id": 1,
          "name": "Minute",
          "abbrev": "MIN",
          "description": "The T-0 is accurate to the minute."
      },
      "window_end": "2024-10-04T13:00:00Z",
      "window_start": "2024-10-04T10:00:00Z",
      "image": {
          "id": 1863,
          "name": "Vulcan VC2S at SLC-41",
          "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/vulcan_image_20240107162928.jpeg",
          "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305193953.jpeg",
          "credit": "United Launch Alliance",
          "license": {
              "id": 10,
              "name": "ULA Image Use Policy",
              "priority": 3,
              "link": "https://www.ulalaunch.com/terms-and-conditions"
          },
          "single_use": false,
          "variants": []
      },
      "infographic": null,
      "probability": null,
      "weather_concerns": null,
      "failreason": "",
      "hashtag": null,
      "launch_service_provider": {
          "response_mode": "list",
          "id": 124,
          "url": "https://ll.thespacedevs.com/2.3.0/agencies/124/",
          "name": "United Launch Alliance",
          "abbrev": "ULA",
          "type": {
              "id": 3,
              "name": "Commercial"
          }
      },
      "rocket": {
          "id": 8277,
          "configuration": {
              "response_mode": "list",
              "id": 201,
              "url": "https://ll.thespacedevs.com/2.3.0/launcher_configurations/201/",
              "name": "Vulcan VC2S",
              "families": [
                  {
                      "response_mode": "list",
                      "id": 170,
                      "name": "Vulcan"
                  }
              ],
              "full_name": "Vulcan VC2S",
              "variant": "VC2S"
          }
      },
      "mission": {
          "id": 6858,
          "name": "Certification Flight 2",
          "type": "Test Flight",
          "description": "Replacement Vulcan test launch with inert payload, experiments, and demonstrations for certification with the USSF after delays caused by payload testing of the Sierra Space Dreamchaser CRS SNC-1 mission, the original planned payload.",
          "image": null,
          "orbit": {
              "id": 8,
              "name": "Low Earth Orbit",
              "abbrev": "LEO",
              "celestial_body": {
                  "response_mode": "list",
                  "id": 1,
                  "name": "Earth"
              }
          },
          "agencies": [
              {
                  "response_mode": "normal",
                  "id": 124,
                  "url": "https://ll.thespacedevs.com/2.3.0/agencies/124/",
                  "name": "United Launch Alliance",
                  "abbrev": "ULA",
                  "type": {
                      "id": 3,
                      "name": "Commercial"
                  },
                  "featured": true,
                  "country": [
                      {
                          "id": 2,
                          "name": "United States of America",
                          "alpha_2_code": "US",
                          "alpha_3_code": "USA",
                          "nationality_name": "American",
                          "nationality_name_composed": "Americano"
                      }
                  ],
                  "description": "United Launch Alliance (ULA) is a joint venture of Lockheed Martin Space Systems and Boeing Defense, Space & Security. ULA was formed in December 2006 by combining the teams at these companies which provide spacecraft launch services to the government of the United States. ULA launches from both coasts of the US. They launch their Atlas V vehicle from LC-41 in Cape Canaveral and LC-3E at Vandeberg. Their Delta IV launches from LC-37 at Cape Canaveral and LC-6 at Vandenberg.",
                  "administrator": "CEO: Tory Bruno",
                  "founding_year": 2006,
                  "launchers": "Atlas | Delta IV | Vulcan",
                  "spacecraft": "CST-100 Starliner",
                  "parent": null,
                  "image": {
                      "id": 30,
                      "name": "[AUTO] United Launch Alliance - image",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/united_launch_a_image_20210412201210.png",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305184706.png",
                      "credit": null,
                      "license": {
                          "id": 1,
                          "name": "Unknown",
                          "priority": 9,
                          "link": null
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "logo": {
                      "id": 191,
                      "name": "[AUTO] United Launch Alliance - logo",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/united2520launch2520alliance_logo_20210412195953.png",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305185148.png",
                      "credit": null,
                      "license": {
                          "id": 1,
                          "name": "Unknown",
                          "priority": 9,
                          "link": null
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "social_logo": {
                      "id": 97,
                      "name": "[AUTO] United Launch Alliance - social_logo",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/united2520launch2520alliance_nation_20230531043703.jpg",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305184852.jpeg",
                      "credit": null,
                      "license": {
                          "id": 1,
                          "name": "Unknown",
                          "priority": 9,
                          "link": null
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "total_launch_count": 163,
                  "consecutive_successful_launches": 163,
                  "successful_launches": 163,
                  "failed_launches": 0,
                  "pending_launches": 44,
                  "consecutive_successful_landings": 0,
                  "successful_landings": 0,
                  "failed_landings": 0,
                  "attempted_landings": 0,
                  "successful_landings_spacecraft": 0,
                  "failed_landings_spacecraft": 0,
                  "attempted_landings_spacecraft": 0,
                  "successful_landings_payload": 0,
                  "failed_landings_payload": 0,
                  "attempted_landings_payload": 0,
                  "info_url": "http://www.ulalaunch.com/",
                  "wiki_url": "http://en.wikipedia.org/wiki/United_Launch_Alliance",
                  "social_media_links": []
              }
          ],
          "info_urls": [],
          "vid_urls": []
      },
      "pad": {
          "id": 29,
          "url": "https://ll.thespacedevs.com/2.3.0/pads/29/",
          "active": true,
          "agencies": [],
          "name": "Space Launch Complex 41",
          "image": {
              "id": 1394,
              "name": "Atlas V 541 on the pad (Mars 2020/Perseverance rover & Ingenuity helicopter)",
              "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/atlas2520v252_image_20200729144937.jpg",
              "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305192627.jpeg",
              "credit": "United Launch Alliance",
              "license": {
                  "id": 10,
                  "name": "ULA Image Use Policy",
                  "priority": 3,
                  "link": "https://www.ulalaunch.com/terms-and-conditions"
              },
              "single_use": false,
              "variants": []
          },
          "description": "",
          "info_url": null,
          "wiki_url": "https://en.wikipedia.org/wiki/Cape_Canaveral_Air_Force_Station_Space_Launch_Complex_41",
          "map_url": "https://www.google.com/maps?q=28.58341025,-80.58303644",
          "latitude": 28.58341025,
          "longitude": -80.58303644,
          "country": {
              "id": 2,
              "name": "United States of America",
              "alpha_2_code": "US",
              "alpha_3_code": "USA",
              "nationality_name": "American",
              "nationality_name_composed": "Americano"
          },
          "map_image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/map_images/pad_29_20200803143528.jpg",
          "total_launch_count": 113,
          "orbital_launch_attempt_count": 113,
          "fastest_turnaround": "P15DT22H26M17S",
          "location": {
              "response_mode": "normal",
              "id": 12,
              "url": "https://ll.thespacedevs.com/2.3.0/locations/12/",
              "name": "Cape Canaveral SFS, FL, USA",
              "celestial_body": {
                  "response_mode": "normal",
                  "id": 1,
                  "name": "Earth",
                  "type": {
                      "id": 1,
                      "name": "Planet"
                  },
                  "diameter": 12742000.0,
                  "mass": 5.972168e+24,
                  "gravity": 9.80655,
                  "length_of_day": "1 00:00:00",
                  "atmosphere": true,
                  "image": {
                      "id": 2040,
                      "name": "Earth (Apollo 17)",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/earth_2528apol_image_20240402194304.jpeg",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/earth_2528apol_image_thumbnail_20240402194305.jpeg",
                      "credit": "NASA",
                      "license": {
                          "id": 4,
                          "name": "NASA Image and Media Guidelines",
                          "priority": 0,
                          "link": "https://www.nasa.gov/nasa-brand-center/images-and-media/"
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "description": "Earth is the third planet from the Sun and the only astronomical object known to harbor life.",
                  "wiki_url": "https://en.wikipedia.org/wiki/Earth",
                  "total_attempted_launches": 6965,
                  "successful_launches": 6429,
                  "failed_launches": 536,
                  "total_attempted_landings": 988,
                  "successful_landings": 949,
                  "failed_landings": 39
              },
              "active": true,
              "country": {
                  "id": 2,
                  "name": "United States of America",
                  "alpha_2_code": "US",
                  "alpha_3_code": "USA",
                  "nationality_name": "American",
                  "nationality_name_composed": "Americano"
              },
              "description": "Cape Canaveral Space Force Station (CCSFS) is an installation of the United States Space Force's Space Launch Delta 45, located on Cape Canaveral in Brevard County, Florida.",
              "image": {
                  "id": 2200,
                  "name": "Cape Canaveral & KSC seen from orbit (STS-43)",
                  "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/cape_canaveral__image_20240918151615.jpg",
                  "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/cape_canaveral__image_thumbnail_20240918151616.jpeg",
                  "credit": "NASA",
                  "license": {
                      "id": 4,
                      "name": "NASA Image and Media Guidelines",
                      "priority": 0,
                      "link": "https://www.nasa.gov/nasa-brand-center/images-and-media/"
                  },
                  "single_use": true,
                  "variants": []
              },
              "map_image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/map_images/location_12_20200803142519.jpg",
              "longitude": -80.577778,
              "latitude": 28.488889,
              "timezone_name": "America/New_York",
              "total_launch_count": 976,
              "total_landing_count": 57
          }
      },
      "webcast_live": false,
      "program": [],
      "orbital_launch_attempt_count": 6773,
      "location_launch_attempt_count": 978,
      "pad_launch_attempt_count": 114,
      "agency_launch_attempt_count": 164,
      "orbital_launch_attempt_count_year": 184,
      "location_launch_attempt_count_year": 51,
      "pad_launch_attempt_count_year": 4,
      "agency_launch_attempt_count_year": 5
  },
  {
      "id": "9d576892-dcf0-472b-92d1-37053ff549ab",
      "url": "https://ll.thespacedevs.com/2.3.0/launches/9d576892-dcf0-472b-92d1-37053ff549ab/",
      "name": "Falcon 9 Block 5 | Starlink Group 10-10",
      "response_mode": "normal",
      "slug": "falcon-9-block-5-starlink-group-10-10",
      "launch_designator": null,
      "status": {
          "id": 8,
          "name": "To Be Confirmed",
          "abbrev": "TBC",
          "description": "Awaiting official confirmation - current date is known with some certainty."
      },
      "last_updated": "2024-09-30T16:29:30Z",
      "net": "2024-10-05T07:43:00Z",
      "net_precision": {
          "id": 2,
          "name": "Hour",
          "abbrev": "HR",
          "description": "The T-0 is accurate to the hour."
      },
      "window_end": "2024-10-05T11:43:00Z",
      "window_start": "2024-10-05T07:43:00Z",
      "image": {
          "id": 1296,
          "name": "Starlink night fairing",
          "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/falcon2520925_image_20221009234147.png",
          "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305192320.png",
          "credit": "SpaceX",
          "license": {
              "id": 5,
              "name": "CC BY-NC 2.0",
              "priority": 1,
              "link": "https://creativecommons.org/licenses/by-nc/2.0/"
          },
          "single_use": false,
          "variants": []
      },
      "infographic": null,
      "probability": null,
      "weather_concerns": null,
      "failreason": "",
      "hashtag": null,
      "launch_service_provider": {
          "response_mode": "list",
          "id": 121,
          "url": "https://ll.thespacedevs.com/2.3.0/agencies/121/",
          "name": "SpaceX",
          "abbrev": "SpX",
          "type": {
              "id": 3,
              "name": "Commercial"
          }
      },
      "rocket": {
          "id": 8363,
          "configuration": {
              "response_mode": "list",
              "id": 164,
              "url": "https://ll.thespacedevs.com/2.3.0/launcher_configurations/164/",
              "name": "Falcon 9",
              "families": [
                  {
                      "response_mode": "list",
                      "id": 1,
                      "name": "Falcon"
                  },
                  {
                      "response_mode": "list",
                      "id": 176,
                      "name": "Falcon 9"
                  }
              ],
              "full_name": "Falcon 9 Block 5",
              "variant": "Block 5"
          }
      },
      "mission": {
          "id": 6944,
          "name": "Starlink Group 10-10",
          "type": "Communications",
          "description": "A batch of satellites for the Starlink mega-constellation - SpaceX's project for space-based Internet communication system.",
          "image": null,
          "orbit": {
              "id": 8,
              "name": "Low Earth Orbit",
              "abbrev": "LEO",
              "celestial_body": {
                  "response_mode": "list",
                  "id": 1,
                  "name": "Earth"
              }
          },
          "agencies": [
              {
                  "response_mode": "normal",
                  "id": 121,
                  "url": "https://ll.thespacedevs.com/2.3.0/agencies/121/",
                  "name": "SpaceX",
                  "abbrev": "SpX",
                  "type": {
                      "id": 3,
                      "name": "Commercial"
                  },
                  "featured": true,
                  "country": [
                      {
                          "id": 2,
                          "name": "United States of America",
                          "alpha_2_code": "US",
                          "alpha_3_code": "USA",
                          "nationality_name": "American",
                          "nationality_name_composed": "Americano"
                      }
                  ],
                  "description": "Space Exploration Technologies Corp., known as SpaceX, is an American aerospace manufacturer and space transport services company headquartered in Hawthorne, California. It was founded in 2002 by entrepreneur Elon Musk with the goal of reducing space transportation costs and enabling the colonization of Mars. SpaceX operates from many pads, on the East Coast of the US they operate from SLC-40 at Cape Canaveral Space Force Station and historic LC-39A at Kennedy Space Center. They also operate from SLC-4E at Vandenberg Space Force Base, California, usually for polar launches. Another launch site is being developed at Boca Chica, Texas.",
                  "administrator": "CEO: Elon Musk",
                  "founding_year": 2002,
                  "launchers": "Falcon | Starship",
                  "spacecraft": "Dragon",
                  "parent": null,
                  "image": {
                      "id": 29,
                      "name": "[AUTO] SpaceX - image",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/spacex_image_20190207032501.jpeg",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305184704.jpeg",
                      "credit": null,
                      "license": {
                          "id": 1,
                          "name": "Unknown",
                          "priority": 9,
                          "link": null
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "logo": {
                      "id": 186,
                      "name": "[AUTO] SpaceX - logo",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/spacex_logo_20220826094919.png",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305185138.png",
                      "credit": null,
                      "license": {
                          "id": 1,
                          "name": "Unknown",
                          "priority": 9,
                          "link": null
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "social_logo": {
                      "id": 94,
                      "name": "[AUTO] SpaceX - social_logo",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/spacex_nation_20230531064544.jpg",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305184848.jpeg",
                      "credit": null,
                      "license": {
                          "id": 1,
                          "name": "Unknown",
                          "priority": 9,
                          "link": null
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "total_launch_count": 407,
                  "consecutive_successful_launches": 24,
                  "successful_launches": 395,
                  "failed_launches": 12,
                  "pending_launches": 117,
                  "consecutive_successful_landings": 11,
                  "successful_landings": 358,
                  "failed_landings": 25,
                  "attempted_landings": 382,
                  "successful_landings_spacecraft": 47,
                  "failed_landings_spacecraft": 0,
                  "attempted_landings_spacecraft": 47,
                  "successful_landings_payload": 0,
                  "failed_landings_payload": 0,
                  "attempted_landings_payload": 0,
                  "info_url": "http://www.spacex.com/",
                  "wiki_url": "http://en.wikipedia.org/wiki/SpaceX",
                  "social_media_links": []
              }
          ],
          "info_urls": [],
          "vid_urls": []
      },
      "pad": {
          "id": 80,
          "url": "https://ll.thespacedevs.com/2.3.0/pads/80/",
          "active": true,
          "agencies": [
              {
                  "response_mode": "normal",
                  "id": 121,
                  "url": "https://ll.thespacedevs.com/2.3.0/agencies/121/",
                  "name": "SpaceX",
                  "abbrev": "SpX",
                  "type": {
                      "id": 3,
                      "name": "Commercial"
                  },
                  "featured": true,
                  "country": [
                      {
                          "id": 2,
                          "name": "United States of America",
                          "alpha_2_code": "US",
                          "alpha_3_code": "USA",
                          "nationality_name": "American",
                          "nationality_name_composed": "Americano"
                      }
                  ],
                  "description": "Space Exploration Technologies Corp., known as SpaceX, is an American aerospace manufacturer and space transport services company headquartered in Hawthorne, California. It was founded in 2002 by entrepreneur Elon Musk with the goal of reducing space transportation costs and enabling the colonization of Mars. SpaceX operates from many pads, on the East Coast of the US they operate from SLC-40 at Cape Canaveral Space Force Station and historic LC-39A at Kennedy Space Center. They also operate from SLC-4E at Vandenberg Space Force Base, California, usually for polar launches. Another launch site is being developed at Boca Chica, Texas.",
                  "administrator": "CEO: Elon Musk",
                  "founding_year": 2002,
                  "launchers": "Falcon | Starship",
                  "spacecraft": "Dragon",
                  "parent": null,
                  "image": {
                      "id": 29,
                      "name": "[AUTO] SpaceX - image",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/spacex_image_20190207032501.jpeg",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305184704.jpeg",
                      "credit": null,
                      "license": {
                          "id": 1,
                          "name": "Unknown",
                          "priority": 9,
                          "link": null
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "logo": {
                      "id": 186,
                      "name": "[AUTO] SpaceX - logo",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/spacex_logo_20220826094919.png",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305185138.png",
                      "credit": null,
                      "license": {
                          "id": 1,
                          "name": "Unknown",
                          "priority": 9,
                          "link": null
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "social_logo": {
                      "id": 94,
                      "name": "[AUTO] SpaceX - social_logo",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/spacex_nation_20230531064544.jpg",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305184848.jpeg",
                      "credit": null,
                      "license": {
                          "id": 1,
                          "name": "Unknown",
                          "priority": 9,
                          "link": null
                      },
                      "single_use": true,
                      "variants": []
                  }
              }
          ],
          "name": "Space Launch Complex 40",
          "image": {
              "id": 2113,
              "name": "F9 liftoff from SLC-40 (SES-24)",
              "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/f9_liftoff_from_image_20240621050513.jpeg",
              "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/f9_liftoff_from_image_thumbnail_20240621050514.jpeg",
              "credit": "SpaceX",
              "license": {
                  "id": 5,
                  "name": "CC BY-NC 2.0",
                  "priority": 1,
                  "link": "https://creativecommons.org/licenses/by-nc/2.0/"
              },
              "single_use": false,
              "variants": []
          },
          "description": "",
          "info_url": null,
          "wiki_url": "https://en.wikipedia.org/wiki/Cape_Canaveral_Air_Force_Station_Space_Launch_Complex_40",
          "map_url": "https://www.google.com/maps?q=28.56194122,-80.57735736",
          "latitude": 28.56194122,
          "longitude": -80.57735736,
          "country": {
              "id": 2,
              "name": "United States of America",
              "alpha_2_code": "US",
              "alpha_3_code": "USA",
              "nationality_name": "American",
              "nationality_name_composed": "Americano"
          },
          "map_image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/map_images/pad_80_20200803143323.jpg",
          "total_launch_count": 263,
          "orbital_launch_attempt_count": 263,
          "fastest_turnaround": "P2DT19H40M",
          "location": {
              "response_mode": "normal",
              "id": 12,
              "url": "https://ll.thespacedevs.com/2.3.0/locations/12/",
              "name": "Cape Canaveral SFS, FL, USA",
              "celestial_body": {
                  "response_mode": "normal",
                  "id": 1,
                  "name": "Earth",
                  "type": {
                      "id": 1,
                      "name": "Planet"
                  },
                  "diameter": 12742000.0,
                  "mass": 5.972168e+24,
                  "gravity": 9.80655,
                  "length_of_day": "1 00:00:00",
                  "atmosphere": true,
                  "image": {
                      "id": 2040,
                      "name": "Earth (Apollo 17)",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/earth_2528apol_image_20240402194304.jpeg",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/earth_2528apol_image_thumbnail_20240402194305.jpeg",
                      "credit": "NASA",
                      "license": {
                          "id": 4,
                          "name": "NASA Image and Media Guidelines",
                          "priority": 0,
                          "link": "https://www.nasa.gov/nasa-brand-center/images-and-media/"
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "description": "Earth is the third planet from the Sun and the only astronomical object known to harbor life.",
                  "wiki_url": "https://en.wikipedia.org/wiki/Earth",
                  "total_attempted_launches": 6965,
                  "successful_launches": 6429,
                  "failed_launches": 536,
                  "total_attempted_landings": 988,
                  "successful_landings": 949,
                  "failed_landings": 39
              },
              "active": true,
              "country": {
                  "id": 2,
                  "name": "United States of America",
                  "alpha_2_code": "US",
                  "alpha_3_code": "USA",
                  "nationality_name": "American",
                  "nationality_name_composed": "Americano"
              },
              "description": "Cape Canaveral Space Force Station (CCSFS) is an installation of the United States Space Force's Space Launch Delta 45, located on Cape Canaveral in Brevard County, Florida.",
              "image": {
                  "id": 2200,
                  "name": "Cape Canaveral & KSC seen from orbit (STS-43)",
                  "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/cape_canaveral__image_20240918151615.jpg",
                  "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/cape_canaveral__image_thumbnail_20240918151616.jpeg",
                  "credit": "NASA",
                  "license": {
                      "id": 4,
                      "name": "NASA Image and Media Guidelines",
                      "priority": 0,
                      "link": "https://www.nasa.gov/nasa-brand-center/images-and-media/"
                  },
                  "single_use": true,
                  "variants": []
              },
              "map_image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/map_images/location_12_20200803142519.jpg",
              "longitude": -80.577778,
              "latitude": 28.488889,
              "timezone_name": "America/New_York",
              "total_launch_count": 976,
              "total_landing_count": 57
          }
      },
      "webcast_live": false,
      "program": [
          {
              "response_mode": "normal",
              "id": 25,
              "url": "https://ll.thespacedevs.com/2.3.0/programs/25/",
              "name": "Starlink",
              "image": {
                  "id": 1890,
                  "name": "Starlink stack in space before deployment",
                  "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/starlink_program_20231228154508.jpeg",
                  "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305194044.jpeg",
                  "credit": "SpaceX",
                  "license": {
                      "id": 5,
                      "name": "CC BY-NC 2.0",
                      "priority": 1,
                      "link": "https://creativecommons.org/licenses/by-nc/2.0/"
                  },
                  "single_use": true,
                  "variants": []
              },
              "info_url": "https://starlink.com",
              "wiki_url": "https://en.wikipedia.org/wiki/Starlink",
              "description": "Starlink is a satellite internet constellation operated by American aerospace company SpaceX",
              "agencies": [
                  {
                      "response_mode": "list",
                      "id": 121,
                      "url": "https://ll.thespacedevs.com/2.3.0/agencies/121/",
                      "name": "SpaceX",
                      "abbrev": "SpX",
                      "type": {
                          "id": 3,
                          "name": "Commercial"
                      }
                  }
              ],
              "start_date": "2018-02-22T14:17:00Z",
              "end_date": null,
              "mission_patches": [
                  {
                      "id": 7,
                      "name": "Space X Starlink Mission Patch",
                      "priority": 10,
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/mission_patch_images/space2520x252_mission_patch_20221011205756.png",
                      "agency": {
                          "response_mode": "list",
                          "id": 121,
                          "url": "https://ll.thespacedevs.com/2.3.0/agencies/121/",
                          "name": "SpaceX",
                          "abbrev": "SpX",
                          "type": {
                              "id": 3,
                              "name": "Commercial"
                          }
                      },
                      "response_mode": "normal"
                  }
              ],
              "type": {
                  "id": 3,
                  "name": "Communication Constellation"
              }
          }
      ],
      "orbital_launch_attempt_count": 6773,
      "location_launch_attempt_count": 978,
      "pad_launch_attempt_count": 264,
      "agency_launch_attempt_count": 408,
      "orbital_launch_attempt_count_year": 184,
      "location_launch_attempt_count_year": 51,
      "pad_launch_attempt_count_year": 46,
      "agency_launch_attempt_count_year": 97
  },
  {
      "id": "e1ffdd01-c146-44d0-a250-b845dc2eb20d",
      "url": "https://ll.thespacedevs.com/2.3.0/launches/e1ffdd01-c146-44d0-a250-b845dc2eb20d/",
      "name": "Falcon 9 Block 5 | Hera",
      "response_mode": "normal",
      "slug": "falcon-9-block-5-hera",
      "launch_designator": null,
      "status": {
          "id": 8,
          "name": "To Be Confirmed",
          "abbrev": "TBC",
          "description": "Awaiting official confirmation - current date is known with some certainty."
      },
      "last_updated": "2024-09-01T02:02:34Z",
      "net": "2024-10-07T14:52:00Z",
      "net_precision": {
          "id": 1,
          "name": "Minute",
          "abbrev": "MIN",
          "description": "The T-0 is accurate to the minute."
      },
      "window_end": "2024-10-07T14:52:00Z",
      "window_start": "2024-10-07T14:52:00Z",
      "image": {
          "id": 1736,
          "name": "[AUTO] Falcon 9 - image",
          "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/falcon_9_image_20230807133459.jpeg",
          "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305193628.jpeg",
          "credit": null,
          "license": {
              "id": 1,
              "name": "Unknown",
              "priority": 9,
              "link": null
          },
          "single_use": true,
          "variants": []
      },
      "infographic": null,
      "probability": null,
      "weather_concerns": null,
      "failreason": "",
      "hashtag": null,
      "launch_service_provider": {
          "response_mode": "list",
          "id": 121,
          "url": "https://ll.thespacedevs.com/2.3.0/agencies/121/",
          "name": "SpaceX",
          "abbrev": "SpX",
          "type": {
              "id": 3,
              "name": "Commercial"
          }
      },
      "rocket": {
          "id": 7689,
          "configuration": {
              "response_mode": "list",
              "id": 164,
              "url": "https://ll.thespacedevs.com/2.3.0/launcher_configurations/164/",
              "name": "Falcon 9",
              "families": [
                  {
                      "response_mode": "list",
                      "id": 1,
                      "name": "Falcon"
                  },
                  {
                      "response_mode": "list",
                      "id": 176,
                      "name": "Falcon 9"
                  }
              ],
              "full_name": "Falcon 9 Block 5",
              "variant": "Block 5"
          }
      },
      "mission": {
          "id": 6496,
          "name": "Hera",
          "type": "Robotic Exploration",
          "description": "Hera is a space mission in development at the European Space Agency in its Space Safety program. Its primary objective is to study the Didymos binary asteroid system that was impacted by DART and contribute to validation of the kinetic impact method to deviate a near-Earth asteroid in a colliding trajectory with Earth. It will measure the size and the morphology of the crater created by and momentum transferred by an artificial projectile impacting an asteroid, which will allow measuring the efficiency of the deflection produced by the impact. It will also analyze the expanding debris cloud caused by the impact.",
          "image": null,
          "orbit": {
              "id": 21,
              "name": "Asteroid",
              "abbrev": "Asteroid",
              "celestial_body": {
                  "response_mode": "list",
                  "id": 1,
                  "name": "Earth"
              }
          },
          "agencies": [
              {
                  "response_mode": "normal",
                  "id": 27,
                  "url": "https://ll.thespacedevs.com/2.3.0/agencies/27/",
                  "name": "European Space Agency",
                  "abbrev": "ESA",
                  "type": {
                      "id": 2,
                      "name": "Multinational"
                  },
                  "featured": false,
                  "country": [
                      {
                          "id": 1,
                          "name": "France",
                          "alpha_2_code": "FR",
                          "alpha_3_code": "FRA",
                          "nationality_name": "French",
                          "nationality_name_composed": "Franco"
                      },
                      {
                          "id": 3,
                          "name": "Italy",
                          "alpha_2_code": "IT",
                          "alpha_3_code": "ITA",
                          "nationality_name": "Italian",
                          "nationality_name_composed": "Italo"
                      },
                      {
                          "id": 4,
                          "name": "Germany",
                          "alpha_2_code": "DE",
                          "alpha_3_code": "DEU",
                          "nationality_name": "German",
                          "nationality_name_composed": "Germano"
                      },
                      {
                          "id": 7,
                          "name": "Spain",
                          "alpha_2_code": "ES",
                          "alpha_3_code": "ESP",
                          "nationality_name": "Spanish",
                          "nationality_name_composed": "Hispano"
                      },
                      {
                          "id": 8,
                          "name": "Switzerland",
                          "alpha_2_code": "CH",
                          "alpha_3_code": "CHE",
                          "nationality_name": "Swiss",
                          "nationality_name_composed": "Swiss"
                      },
                      {
                          "id": 10,
                          "name": "United Kingdom",
                          "alpha_2_code": "GB",
                          "alpha_3_code": "GBR",
                          "nationality_name": "British",
                          "nationality_name_composed": "Brito"
                      },
                      {
                          "id": 11,
                          "name": "Austria",
                          "alpha_2_code": "AT",
                          "alpha_3_code": "AUT",
                          "nationality_name": "Austrian",
                          "nationality_name_composed": "Austro"
                      },
                      {
                          "id": 15,
                          "name": "Sweden",
                          "alpha_2_code": "SE",
                          "alpha_3_code": "SWE",
                          "nationality_name": "Swedish",
                          "nationality_name_composed": "Swedo"
                      },
                      {
                          "id": 23,
                          "name": "Portugal",
                          "alpha_2_code": "PT",
                          "alpha_3_code": "PRT",
                          "nationality_name": "Portuguese",
                          "nationality_name_composed": "Luso"
                      },
                      {
                          "id": 27,
                          "name": "Netherlands",
                          "alpha_2_code": "NL",
                          "alpha_3_code": "NLD",
                          "nationality_name": "Dutch",
                          "nationality_name_composed": "Dutch"
                      },
                      {
                          "id": 31,
                          "name": "Hungary",
                          "alpha_2_code": "HU",
                          "alpha_3_code": "HUN",
                          "nationality_name": "Hungarian",
                          "nationality_name_composed": "Hungarian"
                      },
                      {
                          "id": 39,
                          "name": "Poland",
                          "alpha_2_code": "PL",
                          "alpha_3_code": "POL",
                          "nationality_name": "Polish",
                          "nationality_name_composed": "Polono"
                      },
                      {
                          "id": 45,
                          "name": "Denmark",
                          "alpha_2_code": "DK",
                          "alpha_3_code": "DNK",
                          "nationality_name": "Danish",
                          "nationality_name_composed": "Dano"
                      },
                      {
                          "id": 46,
                          "name": "Czechia",
                          "alpha_2_code": "CZ",
                          "alpha_3_code": "CZE",
                          "nationality_name": "Czech",
                          "nationality_name_composed": "Czech"
                      },
                      {
                          "id": 47,
                          "name": "Romania",
                          "alpha_2_code": "RO",
                          "alpha_3_code": "ROU",
                          "nationality_name": "Romanian",
                          "nationality_name_composed": "Romanian"
                      },
                      {
                          "id": 49,
                          "name": "Norway",
                          "alpha_2_code": "NO",
                          "alpha_3_code": "NOR",
                          "nationality_name": "Norwegian",
                          "nationality_name_composed": "Norwegian"
                      },
                      {
                          "id": 77,
                          "name": "Finland",
                          "alpha_2_code": "FI",
                          "alpha_3_code": "FIN",
                          "nationality_name": "Finnish",
                          "nationality_name_composed": "Finno"
                      },
                      {
                          "id": 78,
                          "name": "Greece",
                          "alpha_2_code": "GR",
                          "alpha_3_code": "GRC",
                          "nationality_name": "Greek",
                          "nationality_name_composed": "Greco"
                      },
                      {
                          "id": 80,
                          "name": "Estonia",
                          "alpha_2_code": "EE",
                          "alpha_3_code": "EST",
                          "nationality_name": "Estonian",
                          "nationality_name_composed": "Estonian"
                      },
                      {
                          "id": 81,
                          "name": "Ireland",
                          "alpha_2_code": "IE",
                          "alpha_3_code": "IRL",
                          "nationality_name": "Irish",
                          "nationality_name_composed": "Irish"
                      },
                      {
                          "id": 85,
                          "name": "Luxembourg",
                          "alpha_2_code": "LU",
                          "alpha_3_code": "LUX",
                          "nationality_name": "Luxembourger",
                          "nationality_name_composed": "Luxembourgish"
                      },
                      {
                          "id": 20,
                          "name": "Belgium",
                          "alpha_2_code": "BE",
                          "alpha_3_code": "BEL",
                          "nationality_name": "Belgian",
                          "nationality_name_composed": "Belgo"
                      }
                  ],
                  "description": "The European Space Agency is an intergovernmental organisation of 22 member states. Established in 1975 and headquartered in Paris, France, ESA has a worldwide staff of about 2,000 employees.\r\n\r\nESA's space flight programme includes human spaceflight (mainly through participation in the International Space Station program); the launch and operation of unmanned exploration missions to other planets and the Moon; Earth observation, science and telecommunication; designing launch vehicles; and maintaining a major spaceport, the Guiana Space Centre at Kourou, French Guiana.",
                  "administrator": "Director General: Josef Aschbacher",
                  "founding_year": 1975,
                  "launchers": "",
                  "spacecraft": "",
                  "parent": null,
                  "image": null,
                  "logo": {
                      "id": 130,
                      "name": "[AUTO] European Space Agency - logo",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/european2520space2520agency_logo_20221130101442.png",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305184947.png",
                      "credit": null,
                      "license": {
                          "id": 1,
                          "name": "Unknown",
                          "priority": 9,
                          "link": null
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "social_logo": null,
                  "total_launch_count": 7,
                  "consecutive_successful_launches": 5,
                  "successful_launches": 6,
                  "failed_launches": 1,
                  "pending_launches": 0,
                  "consecutive_successful_landings": 0,
                  "successful_landings": 0,
                  "failed_landings": 0,
                  "attempted_landings": 0,
                  "successful_landings_spacecraft": 0,
                  "failed_landings_spacecraft": 0,
                  "attempted_landings_spacecraft": 0,
                  "successful_landings_payload": 0,
                  "failed_landings_payload": 0,
                  "attempted_landings_payload": 0,
                  "info_url": "http://www.esa.int/",
                  "wiki_url": "http://en.wikipedia.org/wiki/European_Space_Agency",
                  "social_media_links": []
              }
          ],
          "info_urls": [],
          "vid_urls": []
      },
      "pad": {
          "id": 80,
          "url": "https://ll.thespacedevs.com/2.3.0/pads/80/",
          "active": true,
          "agencies": [
              {
                  "response_mode": "normal",
                  "id": 121,
                  "url": "https://ll.thespacedevs.com/2.3.0/agencies/121/",
                  "name": "SpaceX",
                  "abbrev": "SpX",
                  "type": {
                      "id": 3,
                      "name": "Commercial"
                  },
                  "featured": true,
                  "country": [
                      {
                          "id": 2,
                          "name": "United States of America",
                          "alpha_2_code": "US",
                          "alpha_3_code": "USA",
                          "nationality_name": "American",
                          "nationality_name_composed": "Americano"
                      }
                  ],
                  "description": "Space Exploration Technologies Corp., known as SpaceX, is an American aerospace manufacturer and space transport services company headquartered in Hawthorne, California. It was founded in 2002 by entrepreneur Elon Musk with the goal of reducing space transportation costs and enabling the colonization of Mars. SpaceX operates from many pads, on the East Coast of the US they operate from SLC-40 at Cape Canaveral Space Force Station and historic LC-39A at Kennedy Space Center. They also operate from SLC-4E at Vandenberg Space Force Base, California, usually for polar launches. Another launch site is being developed at Boca Chica, Texas.",
                  "administrator": "CEO: Elon Musk",
                  "founding_year": 2002,
                  "launchers": "Falcon | Starship",
                  "spacecraft": "Dragon",
                  "parent": null,
                  "image": {
                      "id": 29,
                      "name": "[AUTO] SpaceX - image",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/spacex_image_20190207032501.jpeg",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305184704.jpeg",
                      "credit": null,
                      "license": {
                          "id": 1,
                          "name": "Unknown",
                          "priority": 9,
                          "link": null
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "logo": {
                      "id": 186,
                      "name": "[AUTO] SpaceX - logo",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/spacex_logo_20220826094919.png",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305185138.png",
                      "credit": null,
                      "license": {
                          "id": 1,
                          "name": "Unknown",
                          "priority": 9,
                          "link": null
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "social_logo": {
                      "id": 94,
                      "name": "[AUTO] SpaceX - social_logo",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/spacex_nation_20230531064544.jpg",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305184848.jpeg",
                      "credit": null,
                      "license": {
                          "id": 1,
                          "name": "Unknown",
                          "priority": 9,
                          "link": null
                      },
                      "single_use": true,
                      "variants": []
                  }
              }
          ],
          "name": "Space Launch Complex 40",
          "image": {
              "id": 2113,
              "name": "F9 liftoff from SLC-40 (SES-24)",
              "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/f9_liftoff_from_image_20240621050513.jpeg",
              "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/f9_liftoff_from_image_thumbnail_20240621050514.jpeg",
              "credit": "SpaceX",
              "license": {
                  "id": 5,
                  "name": "CC BY-NC 2.0",
                  "priority": 1,
                  "link": "https://creativecommons.org/licenses/by-nc/2.0/"
              },
              "single_use": false,
              "variants": []
          },
          "description": "",
          "info_url": null,
          "wiki_url": "https://en.wikipedia.org/wiki/Cape_Canaveral_Air_Force_Station_Space_Launch_Complex_40",
          "map_url": "https://www.google.com/maps?q=28.56194122,-80.57735736",
          "latitude": 28.56194122,
          "longitude": -80.57735736,
          "country": {
              "id": 2,
              "name": "United States of America",
              "alpha_2_code": "US",
              "alpha_3_code": "USA",
              "nationality_name": "American",
              "nationality_name_composed": "Americano"
          },
          "map_image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/map_images/pad_80_20200803143323.jpg",
          "total_launch_count": 263,
          "orbital_launch_attempt_count": 263,
          "fastest_turnaround": "P2DT19H40M",
          "location": {
              "response_mode": "normal",
              "id": 12,
              "url": "https://ll.thespacedevs.com/2.3.0/locations/12/",
              "name": "Cape Canaveral SFS, FL, USA",
              "celestial_body": {
                  "response_mode": "normal",
                  "id": 1,
                  "name": "Earth",
                  "type": {
                      "id": 1,
                      "name": "Planet"
                  },
                  "diameter": 12742000.0,
                  "mass": 5.972168e+24,
                  "gravity": 9.80655,
                  "length_of_day": "1 00:00:00",
                  "atmosphere": true,
                  "image": {
                      "id": 2040,
                      "name": "Earth (Apollo 17)",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/earth_2528apol_image_20240402194304.jpeg",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/earth_2528apol_image_thumbnail_20240402194305.jpeg",
                      "credit": "NASA",
                      "license": {
                          "id": 4,
                          "name": "NASA Image and Media Guidelines",
                          "priority": 0,
                          "link": "https://www.nasa.gov/nasa-brand-center/images-and-media/"
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "description": "Earth is the third planet from the Sun and the only astronomical object known to harbor life.",
                  "wiki_url": "https://en.wikipedia.org/wiki/Earth",
                  "total_attempted_launches": 6965,
                  "successful_launches": 6429,
                  "failed_launches": 536,
                  "total_attempted_landings": 988,
                  "successful_landings": 949,
                  "failed_landings": 39
              },
              "active": true,
              "country": {
                  "id": 2,
                  "name": "United States of America",
                  "alpha_2_code": "US",
                  "alpha_3_code": "USA",
                  "nationality_name": "American",
                  "nationality_name_composed": "Americano"
              },
              "description": "Cape Canaveral Space Force Station (CCSFS) is an installation of the United States Space Force's Space Launch Delta 45, located on Cape Canaveral in Brevard County, Florida.",
              "image": {
                  "id": 2200,
                  "name": "Cape Canaveral & KSC seen from orbit (STS-43)",
                  "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/cape_canaveral__image_20240918151615.jpg",
                  "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/cape_canaveral__image_thumbnail_20240918151616.jpeg",
                  "credit": "NASA",
                  "license": {
                      "id": 4,
                      "name": "NASA Image and Media Guidelines",
                      "priority": 0,
                      "link": "https://www.nasa.gov/nasa-brand-center/images-and-media/"
                  },
                  "single_use": true,
                  "variants": []
              },
              "map_image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/map_images/location_12_20200803142519.jpg",
              "longitude": -80.577778,
              "latitude": 28.488889,
              "timezone_name": "America/New_York",
              "total_launch_count": 976,
              "total_landing_count": 57
          }
      },
      "webcast_live": false,
      "program": [],
      "orbital_launch_attempt_count": 6774,
      "location_launch_attempt_count": 979,
      "pad_launch_attempt_count": 265,
      "agency_launch_attempt_count": 409,
      "orbital_launch_attempt_count_year": 185,
      "location_launch_attempt_count_year": 52,
      "pad_launch_attempt_count_year": 47,
      "agency_launch_attempt_count_year": 98
  },
  {
      "id": "525ed290-dd97-4187-9118-d71f0b8285be",
      "url": "https://ll.thespacedevs.com/2.3.0/launches/525ed290-dd97-4187-9118-d71f0b8285be/",
      "name": "Falcon 9 Block 5 | OneWeb 20",
      "response_mode": "normal",
      "slug": "falcon-9-block-5-oneweb-20",
      "launch_designator": null,
      "status": {
          "id": 8,
          "name": "To Be Confirmed",
          "abbrev": "TBC",
          "description": "Awaiting official confirmation - current date is known with some certainty."
      },
      "last_updated": "2024-09-30T12:02:57Z",
      "net": "2024-10-09T06:49:00Z",
      "net_precision": {
          "id": 1,
          "name": "Minute",
          "abbrev": "MIN",
          "description": "The T-0 is accurate to the minute."
      },
      "window_end": "2024-10-09T07:23:00Z",
      "window_start": "2024-10-09T06:44:00Z",
      "image": {
          "id": 1287,
          "name": "[AUTO] Falcon 9 Block 5 | OneWeb 17 - image",
          "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/falcon2520925_image_20240101100955.jpeg",
          "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305192303.jpeg",
          "credit": null,
          "license": {
              "id": 1,
              "name": "Unknown",
              "priority": 9,
              "link": null
          },
          "single_use": true,
          "variants": []
      },
      "infographic": null,
      "probability": null,
      "weather_concerns": null,
      "failreason": "",
      "hashtag": null,
      "launch_service_provider": {
          "response_mode": "list",
          "id": 121,
          "url": "https://ll.thespacedevs.com/2.3.0/agencies/121/",
          "name": "SpaceX",
          "abbrev": "SpX",
          "type": {
              "id": 3,
              "name": "Commercial"
          }
      },
      "rocket": {
          "id": 8309,
          "configuration": {
              "response_mode": "list",
              "id": 164,
              "url": "https://ll.thespacedevs.com/2.3.0/launcher_configurations/164/",
              "name": "Falcon 9",
              "families": [
                  {
                      "response_mode": "list",
                      "id": 1,
                      "name": "Falcon"
                  },
                  {
                      "response_mode": "list",
                      "id": 176,
                      "name": "Falcon 9"
                  }
              ],
              "full_name": "Falcon 9 Block 5",
              "variant": "Block 5"
          }
      },
      "mission": {
          "id": 6890,
          "name": "OneWeb 20",
          "type": "Communications",
          "description": "A batch of 20 satellites for the OneWeb satellite constellation, which is intended to provide global Internet broadband service for individual consumers. The constellation is planned to have around 648 microsatellites (of which 60 are spares), around 150 kg each, operating in Ku-band from low Earth orbit.",
          "image": null,
          "orbit": {
              "id": 13,
              "name": "Polar Orbit",
              "abbrev": "PO",
              "celestial_body": {
                  "response_mode": "list",
                  "id": 1,
                  "name": "Earth"
              }
          },
          "agencies": [
              {
                  "response_mode": "normal",
                  "id": 1081,
                  "url": "https://ll.thespacedevs.com/2.3.0/agencies/1081/",
                  "name": "Eutelsat OneWeb",
                  "abbrev": "OneWeb",
                  "type": {
                      "id": 3,
                      "name": "Commercial"
                  },
                  "featured": false,
                  "country": [
                      {
                          "id": 10,
                          "name": "United Kingdom",
                          "alpha_2_code": "GB",
                          "alpha_3_code": "GBR",
                          "nationality_name": "British",
                          "nationality_name_composed": "Brito"
                      }
                  ],
                  "description": "Eutelsat OneWeb is a subsidiary of Eutelsat Group providing broadband satellite Internet services in low Earth orbit (LEO). The company is headquartered in London, and has offices in Virginia, US and a satellite manufacturing facility in Florida – Airbus OneWeb Satellites – that is a joint venture with Airbus Defence and Space.",
                  "administrator": "CEO: Eva Berneke",
                  "founding_year": 2012,
                  "launchers": "",
                  "spacecraft": "OneWeb Internet",
                  "parent": null,
                  "image": null,
                  "logo": {
                      "id": 132,
                      "name": "[AUTO] Eutelsat OneWeb - logo",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/eutelsat2520oneweb_logo_20231228160405.png",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305184951.png",
                      "credit": null,
                      "license": {
                          "id": 1,
                          "name": "Unknown",
                          "priority": 9,
                          "link": null
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "social_logo": {
                      "id": 55,
                      "name": "[AUTO] Eutelsat OneWeb - social_logo",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/eutelsat2520oneweb_nation_20231228160405.jpg",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305184753.jpeg",
                      "credit": null,
                      "license": {
                          "id": 1,
                          "name": "Unknown",
                          "priority": 9,
                          "link": null
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "total_launch_count": 0,
                  "consecutive_successful_launches": 0,
                  "successful_launches": 0,
                  "failed_launches": 0,
                  "pending_launches": 0,
                  "consecutive_successful_landings": 0,
                  "successful_landings": 0,
                  "failed_landings": 0,
                  "attempted_landings": 0,
                  "successful_landings_spacecraft": 0,
                  "failed_landings_spacecraft": 0,
                  "attempted_landings_spacecraft": 0,
                  "successful_landings_payload": 0,
                  "failed_landings_payload": 0,
                  "attempted_landings_payload": 0,
                  "info_url": "https://www.oneweb.net/",
                  "wiki_url": "https://en.wikipedia.org/wiki/Eutelsat_OneWeb",
                  "social_media_links": []
              }
          ],
          "info_urls": [],
          "vid_urls": []
      },
      "pad": {
          "id": 16,
          "url": "https://ll.thespacedevs.com/2.3.0/pads/16/",
          "active": true,
          "agencies": [],
          "name": "Space Launch Complex 4E",
          "image": {
              "id": 1342,
              "name": "Falcon 9 Block 5 | SARah 2 & 3 from SLC-4E",
              "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/falcon2520925_image_20231223073520.jpeg",
              "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305192449.jpeg",
              "credit": "SpaceX",
              "license": {
                  "id": 5,
                  "name": "CC BY-NC 2.0",
                  "priority": 1,
                  "link": "https://creativecommons.org/licenses/by-nc/2.0/"
              },
              "single_use": false,
              "variants": []
          },
          "description": "Space Launch Complex 4 East (SLC-4E) is a launch site at Vandenberg Space Force Base, California, U.S.\r\n\r\nThe pad was previously used by Atlas and Titan rockets between 1963 and 2005. The pad was built for use by Atlas-Agena rockets, but was later rebuilt to handle Titan rockets.",
          "info_url": null,
          "wiki_url": "https://en.wikipedia.org/wiki/Vandenberg_Space_Launch_Complex_4#SLC-4E",
          "map_url": "https://www.google.com/maps?q=34.632,-120.611",
          "latitude": 34.632,
          "longitude": -120.611,
          "country": {
              "id": 2,
              "name": "United States of America",
              "alpha_2_code": "US",
              "alpha_3_code": "USA",
              "nationality_name": "American",
              "nationality_name_composed": "Americano"
          },
          "map_image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/map_images/pad_16_20200803143532.jpg",
          "total_launch_count": 160,
          "orbital_launch_attempt_count": 160,
          "fastest_turnaround": "P4DT12H",
          "location": {
              "response_mode": "normal",
              "id": 11,
              "url": "https://ll.thespacedevs.com/2.3.0/locations/11/",
              "name": "Vandenberg SFB, CA, USA",
              "celestial_body": {
                  "response_mode": "normal",
                  "id": 1,
                  "name": "Earth",
                  "type": {
                      "id": 1,
                      "name": "Planet"
                  },
                  "diameter": 12742000.0,
                  "mass": 5.972168e+24,
                  "gravity": 9.80655,
                  "length_of_day": "1 00:00:00",
                  "atmosphere": true,
                  "image": {
                      "id": 2040,
                      "name": "Earth (Apollo 17)",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/earth_2528apol_image_20240402194304.jpeg",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/earth_2528apol_image_thumbnail_20240402194305.jpeg",
                      "credit": "NASA",
                      "license": {
                          "id": 4,
                          "name": "NASA Image and Media Guidelines",
                          "priority": 0,
                          "link": "https://www.nasa.gov/nasa-brand-center/images-and-media/"
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "description": "Earth is the third planet from the Sun and the only astronomical object known to harbor life.",
                  "wiki_url": "https://en.wikipedia.org/wiki/Earth",
                  "total_attempted_launches": 6965,
                  "successful_launches": 6429,
                  "failed_launches": 536,
                  "total_attempted_landings": 988,
                  "successful_landings": 949,
                  "failed_landings": 39
              },
              "active": true,
              "country": {
                  "id": 2,
                  "name": "United States of America",
                  "alpha_2_code": "US",
                  "alpha_3_code": "USA",
                  "nationality_name": "American",
                  "nationality_name_composed": "Americano"
              },
              "description": "Vandenberg Space Force Base is a United States Space Force Base in Santa Barbara County, California. Established in 1941, Vandenberg Space Force Base is a space launch base, launching spacecraft from the Western Range, and also performs missile testing. The United States Space Force's Space Launch Delta 30 serves as the host delta for the base, equivalent to an Air Force air base wing. In addition to its military space launch mission, Vandenberg Space Force Base also hosts space launches for civil and commercial space entities, such as NASA and SpaceX.",
              "image": {
                  "id": 2226,
                  "name": "Vandenberg SFB imaged by Sentinel-2",
                  "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/vandenberg_sfb__image_20240920082910.jpeg",
                  "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/vandenberg_sfb__image_thumbnail_20240920082910.jpeg",
                  "credit": "Contains modified Copernicus Sentinel data 2020",
                  "license": {
                      "id": 33,
                      "name": "Copernicus Image Use Policy",
                      "priority": 0,
                      "link": "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32013R1159"
                  },
                  "single_use": true,
                  "variants": []
              },
              "map_image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/map_images/location_11_20200803142416.jpg",
              "longitude": -120.52023,
              "latitude": 34.75133,
              "timezone_name": "America/Los_Angeles",
              "total_launch_count": 772,
              "total_landing_count": 20
          }
      },
      "webcast_live": false,
      "program": [
          {
              "response_mode": "normal",
              "id": 26,
              "url": "https://ll.thespacedevs.com/2.3.0/programs/26/",
              "name": "OneWeb",
              "image": {
                  "id": 1867,
                  "name": "[AUTO] OneWeb - image",
                  "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/oneweb_program_20231228155842.jpeg",
                  "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305194000.jpeg",
                  "credit": null,
                  "license": {
                      "id": 1,
                      "name": "Unknown",
                      "priority": 9,
                      "link": null
                  },
                  "single_use": true,
                  "variants": []
              },
              "info_url": "https://oneweb.net/",
              "wiki_url": "https://en.wikipedia.org/wiki/Eutelsat_OneWeb",
              "description": "Satellite constellation in low Earth orbit that can provide high-speed broadband internet to rural and isolated areas.",
              "agencies": [
                  {
                      "response_mode": "list",
                      "id": 1081,
                      "url": "https://ll.thespacedevs.com/2.3.0/agencies/1081/",
                      "name": "Eutelsat OneWeb",
                      "abbrev": "OneWeb",
                      "type": {
                          "id": 3,
                          "name": "Commercial"
                      }
                  }
              ],
              "start_date": "2019-02-27T21:37:00Z",
              "end_date": null,
              "mission_patches": [],
              "type": {
                  "id": 3,
                  "name": "Communication Constellation"
              }
          }
      ],
      "orbital_launch_attempt_count": 6775,
      "location_launch_attempt_count": 773,
      "pad_launch_attempt_count": 161,
      "agency_launch_attempt_count": 410,
      "orbital_launch_attempt_count_year": 186,
      "location_launch_attempt_count_year": 34,
      "pad_launch_attempt_count_year": 33,
      "agency_launch_attempt_count_year": 99
  },
  {
      "id": "59548105-347d-4477-8747-7fc3f91016c5",
      "url": "https://ll.thespacedevs.com/2.3.0/launches/59548105-347d-4477-8747-7fc3f91016c5/",
      "name": "Falcon Heavy | Europa Clipper",
      "response_mode": "normal",
      "slug": "falcon-heavy-europa-clipper",
      "launch_designator": null,
      "status": {
          "id": 1,
          "name": "Go for Launch",
          "abbrev": "Go",
          "description": "Current T-0 confirmed by official or reliable sources."
      },
      "last_updated": "2024-09-17T02:44:32Z",
      "net": "2024-10-10T16:31:00Z",
      "net_precision": {
          "id": 1,
          "name": "Minute",
          "abbrev": "MIN",
          "description": "The T-0 is accurate to the minute."
      },
      "window_end": "2024-10-10T16:31:00Z",
      "window_start": "2024-10-10T16:31:00Z",
      "image": {
          "id": 1739,
          "name": "[AUTO] Falcon Heavy - image",
          "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/falcon_heavy_image_20220129192819.jpeg",
          "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305193632.jpeg",
          "credit": null,
          "license": {
              "id": 1,
              "name": "Unknown",
              "priority": 9,
              "link": null
          },
          "single_use": true,
          "variants": []
      },
      "infographic": null,
      "probability": null,
      "weather_concerns": null,
      "failreason": "",
      "hashtag": null,
      "launch_service_provider": {
          "response_mode": "list",
          "id": 121,
          "url": "https://ll.thespacedevs.com/2.3.0/agencies/121/",
          "name": "SpaceX",
          "abbrev": "SpX",
          "type": {
              "id": 3,
              "name": "Commercial"
          }
      },
      "rocket": {
          "id": 2663,
          "configuration": {
              "response_mode": "list",
              "id": 161,
              "url": "https://ll.thespacedevs.com/2.3.0/launcher_configurations/161/",
              "name": "Falcon Heavy",
              "families": [
                  {
                      "response_mode": "list",
                      "id": 1,
                      "name": "Falcon"
                  }
              ],
              "full_name": "Falcon Heavy",
              "variant": "Heavy"
          }
      },
      "mission": {
          "id": 1087,
          "name": "Europa Clipper",
          "type": "Planetary Science",
          "description": "Europa Clipper is the first dedicated mission to study Jupiter's moon Europa. Mission is developed by NASA and comprises of an orbiter spacecraft, which, while in orbit around Jupiter, will perform numerous flybys over Europa. Europa Clipper payload suit included high-resolution cameras and spectrometers for imaging Europa's surface and thin atmosphere, an ice-penetrating radar to search for subsurface water, and a magnetometer and gravity measurements to measure the moon's magnetic field and unlock clues about its ocean and deep interior.",
          "image": null,
          "orbit": {
              "id": 6,
              "name": "Heliocentric N/A",
              "abbrev": "Helio-N/A",
              "celestial_body": {
                  "response_mode": "list",
                  "id": 1,
                  "name": "Earth"
              }
          },
          "agencies": [],
          "info_urls": [],
          "vid_urls": []
      },
      "pad": {
          "id": 87,
          "url": "https://ll.thespacedevs.com/2.3.0/pads/87/",
          "active": true,
          "agencies": [
              {
                  "response_mode": "normal",
                  "id": 121,
                  "url": "https://ll.thespacedevs.com/2.3.0/agencies/121/",
                  "name": "SpaceX",
                  "abbrev": "SpX",
                  "type": {
                      "id": 3,
                      "name": "Commercial"
                  },
                  "featured": true,
                  "country": [
                      {
                          "id": 2,
                          "name": "United States of America",
                          "alpha_2_code": "US",
                          "alpha_3_code": "USA",
                          "nationality_name": "American",
                          "nationality_name_composed": "Americano"
                      }
                  ],
                  "description": "Space Exploration Technologies Corp., known as SpaceX, is an American aerospace manufacturer and space transport services company headquartered in Hawthorne, California. It was founded in 2002 by entrepreneur Elon Musk with the goal of reducing space transportation costs and enabling the colonization of Mars. SpaceX operates from many pads, on the East Coast of the US they operate from SLC-40 at Cape Canaveral Space Force Station and historic LC-39A at Kennedy Space Center. They also operate from SLC-4E at Vandenberg Space Force Base, California, usually for polar launches. Another launch site is being developed at Boca Chica, Texas.",
                  "administrator": "CEO: Elon Musk",
                  "founding_year": 2002,
                  "launchers": "Falcon | Starship",
                  "spacecraft": "Dragon",
                  "parent": null,
                  "image": {
                      "id": 29,
                      "name": "[AUTO] SpaceX - image",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/spacex_image_20190207032501.jpeg",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305184704.jpeg",
                      "credit": null,
                      "license": {
                          "id": 1,
                          "name": "Unknown",
                          "priority": 9,
                          "link": null
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "logo": {
                      "id": 186,
                      "name": "[AUTO] SpaceX - logo",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/spacex_logo_20220826094919.png",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305185138.png",
                      "credit": null,
                      "license": {
                          "id": 1,
                          "name": "Unknown",
                          "priority": 9,
                          "link": null
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "social_logo": {
                      "id": 94,
                      "name": "[AUTO] SpaceX - social_logo",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/spacex_nation_20230531064544.jpg",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305184848.jpeg",
                      "credit": null,
                      "license": {
                          "id": 1,
                          "name": "Unknown",
                          "priority": 9,
                          "link": null
                      },
                      "single_use": true,
                      "variants": []
                  }
              }
          ],
          "name": "Launch Complex 39A",
          "image": {
              "id": 2119,
              "name": "FH liftoff from LC-39A (GOES-U)",
              "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/fh_liftoff_from_image_20240626200232.jpeg",
              "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/fh_liftoff_from_image_thumbnail_20240626200233.jpeg",
              "credit": "SpaceX",
              "license": {
                  "id": 5,
                  "name": "CC BY-NC 2.0",
                  "priority": 1,
                  "link": "https://creativecommons.org/licenses/by-nc/2.0/"
              },
              "single_use": true,
              "variants": []
          },
          "description": "",
          "info_url": null,
          "wiki_url": "https://en.wikipedia.org/wiki/Kennedy_Space_Center_Launch_Complex_39#Launch_Pad_39A",
          "map_url": "https://www.google.com/maps?q=28.60822681,-80.60428186",
          "latitude": 28.60822681,
          "longitude": -80.60428186,
          "country": {
              "id": 2,
              "name": "United States of America",
              "alpha_2_code": "US",
              "alpha_3_code": "USA",
              "nationality_name": "American",
              "nationality_name_composed": "Americano"
          },
          "map_image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/map_images/pad_87_20200803143537.jpg",
          "total_launch_count": 185,
          "orbital_launch_attempt_count": 184,
          "fastest_turnaround": "P5DT23H16M",
          "location": {
              "response_mode": "normal",
              "id": 27,
              "url": "https://ll.thespacedevs.com/2.3.0/locations/27/",
              "name": "Kennedy Space Center, FL, USA",
              "celestial_body": {
                  "response_mode": "normal",
                  "id": 1,
                  "name": "Earth",
                  "type": {
                      "id": 1,
                      "name": "Planet"
                  },
                  "diameter": 12742000.0,
                  "mass": 5.972168e+24,
                  "gravity": 9.80655,
                  "length_of_day": "1 00:00:00",
                  "atmosphere": true,
                  "image": {
                      "id": 2040,
                      "name": "Earth (Apollo 17)",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/earth_2528apol_image_20240402194304.jpeg",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/earth_2528apol_image_thumbnail_20240402194305.jpeg",
                      "credit": "NASA",
                      "license": {
                          "id": 4,
                          "name": "NASA Image and Media Guidelines",
                          "priority": 0,
                          "link": "https://www.nasa.gov/nasa-brand-center/images-and-media/"
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "description": "Earth is the third planet from the Sun and the only astronomical object known to harbor life.",
                  "wiki_url": "https://en.wikipedia.org/wiki/Earth",
                  "total_attempted_launches": 6965,
                  "successful_launches": 6429,
                  "failed_launches": 536,
                  "total_attempted_landings": 988,
                  "successful_landings": 949,
                  "failed_landings": 39
              },
              "active": true,
              "country": {
                  "id": 2,
                  "name": "United States of America",
                  "alpha_2_code": "US",
                  "alpha_3_code": "USA",
                  "nationality_name": "American",
                  "nationality_name_composed": "Americano"
              },
              "description": "The John F. Kennedy Space Center, located on Merritt Island, Florida, is one of NASA's ten field centers. Since 1968, KSC has been NASA's primary launch center of American spaceflight, research, and technology. Launch operations for the Apollo, Skylab and Space Shuttle programs were carried out from Kennedy Space Center Launch Complex 39 and managed by KSC. Located on the east coast of Florida, KSC is adjacent to Cape Canaveral Space Force Station (CCSFS).",
              "image": {
                  "id": 2200,
                  "name": "Cape Canaveral & KSC seen from orbit (STS-43)",
                  "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/cape_canaveral__image_20240918151615.jpg",
                  "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/cape_canaveral__image_thumbnail_20240918151616.jpeg",
                  "credit": "NASA",
                  "license": {
                      "id": 4,
                      "name": "NASA Image and Media Guidelines",
                      "priority": 0,
                      "link": "https://www.nasa.gov/nasa-brand-center/images-and-media/"
                  },
                  "single_use": true,
                  "variants": []
              },
              "map_image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/map_images/location_27_20200803142447.jpg",
              "longitude": -80.650833,
              "latitude": 28.524167,
              "timezone_name": "America/New_York",
              "total_launch_count": 243,
              "total_landing_count": 0
          }
      },
      "webcast_live": false,
      "program": [],
      "orbital_launch_attempt_count": 6776,
      "location_launch_attempt_count": 244,
      "pad_launch_attempt_count": 186,
      "agency_launch_attempt_count": 411,
      "orbital_launch_attempt_count_year": 187,
      "location_launch_attempt_count_year": 18,
      "pad_launch_attempt_count_year": 18,
      "agency_launch_attempt_count_year": 100
  },
  {
      "id": "aa429cd7-a947-430a-9956-72dff1ab9c60",
      "url": "https://ll.thespacedevs.com/2.3.0/launches/aa429cd7-a947-430a-9956-72dff1ab9c60/",
      "name": "H3-22 | DSN 3 (Kirameki 3)",
      "response_mode": "normal",
      "slug": "h3-22-dsn-3-kirameki-3",
      "launch_designator": null,
      "status": {
          "id": 1,
          "name": "Go for Launch",
          "abbrev": "Go",
          "description": "Current T-0 confirmed by official or reliable sources."
      },
      "last_updated": "2024-09-27T08:15:47Z",
      "net": "2024-10-26T06:44:00Z",
      "net_precision": {
          "id": 1,
          "name": "Minute",
          "abbrev": "MIN",
          "description": "The T-0 is accurate to the minute."
      },
      "window_end": "2024-10-26T08:30:00Z",
      "window_start": "2024-10-26T06:44:00Z",
      "image": {
          "id": 1747,
          "name": "H3-22 liftoff (ALOS-3)",
          "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/h3-22_image_20230307130808.jpeg",
          "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305193645.jpeg",
          "credit": "JAXA",
          "license": {
              "id": 9,
              "name": "JAXA Image Usage Policy",
              "priority": 8,
              "link": "https://global.jaxa.jp/policy.html"
          },
          "single_use": false,
          "variants": []
      },
      "infographic": null,
      "probability": null,
      "weather_concerns": null,
      "failreason": "",
      "hashtag": null,
      "launch_service_provider": {
          "response_mode": "list",
          "id": 98,
          "url": "https://ll.thespacedevs.com/2.3.0/agencies/98/",
          "name": "Mitsubishi Heavy Industries",
          "abbrev": "MHI",
          "type": {
              "id": 3,
              "name": "Commercial"
          }
      },
      "rocket": {
          "id": 7772,
          "configuration": {
              "response_mode": "list",
              "id": 486,
              "url": "https://ll.thespacedevs.com/2.3.0/launcher_configurations/486/",
              "name": "H3-22",
              "families": [
                  {
                      "response_mode": "list",
                      "id": 86,
                      "name": "H3"
                  }
              ],
              "full_name": "H3-22",
              "variant": "22"
          }
      },
      "mission": {
          "id": 6290,
          "name": "DSN 3 (Kirameki 3)",
          "type": "Communications",
          "description": "DSN 3, also known as Kirameki 3, is a geostationary communications satellite to be used for military communications by the Japanese military.",
          "image": null,
          "orbit": {
              "id": 2,
              "name": "Geostationary Transfer Orbit",
              "abbrev": "GTO",
              "celestial_body": {
                  "response_mode": "list",
                  "id": 1,
                  "name": "Earth"
              }
          },
          "agencies": [
              {
                  "response_mode": "normal",
                  "id": 1073,
                  "url": "https://ll.thespacedevs.com/2.3.0/agencies/1073/",
                  "name": "DSN Corporation",
                  "abbrev": "",
                  "type": {
                      "id": 3,
                      "name": "Commercial"
                  },
                  "featured": false,
                  "country": [
                      {
                          "id": 28,
                          "name": "Japan",
                          "alpha_2_code": "JP",
                          "alpha_3_code": "JPN",
                          "nationality_name": "Japanese",
                          "nationality_name_composed": "Nippo"
                      }
                  ],
                  "description": "DSN Corporation Japanese: 株式会社ディー・エス・エヌ is a corporation owned by SKY Perfect JSAT Group, NEC and NTT Com. It was founded on December 19, 2012 for the sole purpose of acting as an investment vehicle in the private finance initiative that would handle the Japanese military X-band DSN satellite network from 2015 to 2031.",
                  "administrator": null,
                  "founding_year": 2012,
                  "launchers": "",
                  "spacecraft": "",
                  "parent": "SKY Perfect JSAT Group",
                  "image": null,
                  "logo": null,
                  "social_logo": null,
                  "total_launch_count": 0,
                  "consecutive_successful_launches": 0,
                  "successful_launches": 0,
                  "failed_launches": 0,
                  "pending_launches": 0,
                  "consecutive_successful_landings": 0,
                  "successful_landings": 0,
                  "failed_landings": 0,
                  "attempted_landings": 0,
                  "successful_landings_spacecraft": 0,
                  "failed_landings_spacecraft": 0,
                  "attempted_landings_spacecraft": 0,
                  "successful_landings_payload": 0,
                  "failed_landings_payload": 0,
                  "attempted_landings_payload": 0,
                  "info_url": "https://en.wikipedia.org/wiki/DSN_Corporation",
                  "wiki_url": null,
                  "social_media_links": []
              }
          ],
          "info_urls": [],
          "vid_urls": []
      },
      "pad": {
          "id": 209,
          "url": "https://ll.thespacedevs.com/2.3.0/pads/209/",
          "active": true,
          "agencies": [
              {
                  "response_mode": "normal",
                  "id": 37,
                  "url": "https://ll.thespacedevs.com/2.3.0/agencies/37/",
                  "name": "Japan Aerospace Exploration Agency",
                  "abbrev": "JAXA",
                  "type": {
                      "id": 1,
                      "name": "Government"
                  },
                  "featured": true,
                  "country": [
                      {
                          "id": 28,
                          "name": "Japan",
                          "alpha_2_code": "JP",
                          "alpha_3_code": "JPN",
                          "nationality_name": "Japanese",
                          "nationality_name_composed": "Nippo"
                      }
                  ],
                  "description": "The Japan Aerospace Exploration Agency (JAXA) is Japan's national aero-space agency. Through the merger of three previously independent organizations, JAXA was formed on 1 October 2003. JAXA is responsible for research, technology development and the launch of satellites into orbit, and is involved in many more advanced missions, such as asteroid exploration and possible manned exploration of the Moon. JAXA launch their Epsilon vehicle from the Uchinoura Space Center and their H-II vehicles from the Tanegashima Space Center.",
                  "administrator": "Administrator: Hiroshi Yamakawa",
                  "founding_year": 2003,
                  "launchers": "H-II",
                  "spacecraft": "",
                  "parent": null,
                  "image": {
                      "id": 16,
                      "name": "[AUTO] Japan Aerospace Exploration Agency - image",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/japan2520aerospace2520exploration2520agency_image_20190207032440.jpeg",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305184621.jpeg",
                      "credit": null,
                      "license": {
                          "id": 1,
                          "name": "Unknown",
                          "priority": 9,
                          "link": null
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "logo": {
                      "id": 151,
                      "name": "[AUTO] Japan Aerospace Exploration Agency - logo",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/japan2520aerospace2520exploration2520agency_logo_20190207032440.png",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305185023.png",
                      "credit": null,
                      "license": {
                          "id": 1,
                          "name": "Unknown",
                          "priority": 9,
                          "link": null
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "social_logo": {
                      "id": 69,
                      "name": "[AUTO] Japan Aerospace Exploration Agency - social_logo",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/japan2520aerospace2520exploration2520agency_nation_20230531052930.png",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305184813.png",
                      "credit": null,
                      "license": {
                          "id": 1,
                          "name": "Unknown",
                          "priority": 9,
                          "link": null
                      },
                      "single_use": true,
                      "variants": []
                  }
              }
          ],
          "name": "Yoshinobu Launch Complex LP-2",
          "image": {
              "id": 1751,
              "name": "H-IIB 304 liftoff from LP-2 (HTV-3)",
              "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/h-iib_304_lifto_image_20240325125154.jpg",
              "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/h-iib_304_lifto_image_thumbnail_20240325125154.jpeg",
              "credit": "JAXA",
              "license": {
                  "id": 9,
                  "name": "JAXA Image Usage Policy",
                  "priority": 8,
                  "link": "https://global.jaxa.jp/policy.html"
              },
              "single_use": false,
              "variants": []
          },
          "description": "",
          "info_url": null,
          "wiki_url": "https://en.wikipedia.org/wiki/Yoshinobu_Launch_Complex",
          "map_url": "https://www.google.com/maps?q=30.400938,130.97564",
          "latitude": 30.400938,
          "longitude": 130.97564,
          "country": {
              "id": 28,
              "name": "Japan",
              "alpha_2_code": "JP",
              "alpha_3_code": "JPN",
              "nationality_name": "Japanese",
              "nationality_name_composed": "Nippo"
          },
          "map_image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/map_images/pad_yoshinobu_launch_complex_lp-2_20230707124715.jpg",
          "total_launch_count": 12,
          "orbital_launch_attempt_count": 12,
          "fastest_turnaround": "P135DT2H43M47S",
          "location": {
              "response_mode": "normal",
              "id": 26,
              "url": "https://ll.thespacedevs.com/2.3.0/locations/26/",
              "name": "Tanegashima Space Center, Japan",
              "celestial_body": {
                  "response_mode": "normal",
                  "id": 1,
                  "name": "Earth",
                  "type": {
                      "id": 1,
                      "name": "Planet"
                  },
                  "diameter": 12742000.0,
                  "mass": 5.972168e+24,
                  "gravity": 9.80655,
                  "length_of_day": "1 00:00:00",
                  "atmosphere": true,
                  "image": {
                      "id": 2040,
                      "name": "Earth (Apollo 17)",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/earth_2528apol_image_20240402194304.jpeg",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/earth_2528apol_image_thumbnail_20240402194305.jpeg",
                      "credit": "NASA",
                      "license": {
                          "id": 4,
                          "name": "NASA Image and Media Guidelines",
                          "priority": 0,
                          "link": "https://www.nasa.gov/nasa-brand-center/images-and-media/"
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "description": "Earth is the third planet from the Sun and the only astronomical object known to harbor life.",
                  "wiki_url": "https://en.wikipedia.org/wiki/Earth",
                  "total_attempted_launches": 6965,
                  "successful_launches": 6429,
                  "failed_launches": 536,
                  "total_attempted_landings": 988,
                  "successful_landings": 949,
                  "failed_landings": 39
              },
              "active": true,
              "country": {
                  "id": 28,
                  "name": "Japan",
                  "alpha_2_code": "JP",
                  "alpha_3_code": "JPN",
                  "nationality_name": "Japanese",
                  "nationality_name_composed": "Nippo"
              },
              "description": "The Tanegashima Space Center is the largest rocket-launch complex in Japan. It is located on the southeastern tip of Tanegashima, an island located south of Kyushu, an island and region and Japan. It was established in 1969 when the National Space Development Agency of Japan (NASDA) was formed, and is now run by JAXA. The activities that take place at TNSC include assembly, testing, launching, and tracking satellites, as well as rocket engine firing tests.",
              "image": {
                  "id": 2223,
                  "name": "Tanegashima Space Center",
                  "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/tanegashima_spa_image_20240920081514.jpg",
                  "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/tanegashima_spa_image_thumbnail_20240920081514.jpeg",
                  "credit": "JAXA",
                  "license": {
                      "id": 9,
                      "name": "JAXA Image Usage Policy",
                      "priority": 8,
                      "link": "https://global.jaxa.jp/policy.html"
                  },
                  "single_use": true,
                  "variants": []
              },
              "map_image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/map_images/location_26_20200803142507.jpg",
              "longitude": 130.97,
              "latitude": 30.4,
              "timezone_name": "Asia/Tokyo",
              "total_launch_count": 92,
              "total_landing_count": 0
          }
      },
      "webcast_live": false,
      "program": [],
      "orbital_launch_attempt_count": 6777,
      "location_launch_attempt_count": 93,
      "pad_launch_attempt_count": 13,
      "agency_launch_attempt_count": 53,
      "orbital_launch_attempt_count_year": 188,
      "location_launch_attempt_count_year": 5,
      "pad_launch_attempt_count_year": 3,
      "agency_launch_attempt_count_year": 5
  },
  {
      "id": "2de44368-01af-448f-b0fb-d7aacdd86c0e",
      "url": "https://ll.thespacedevs.com/2.3.0/launches/2de44368-01af-448f-b0fb-d7aacdd86c0e/",
      "name": "Ceres-1 | Unknown Payload",
      "response_mode": "normal",
      "slug": "ceres-1-unknown-payload",
      "launch_designator": null,
      "status": {
          "id": 2,
          "name": "To Be Determined",
          "abbrev": "TBD",
          "description": "Current date is a placeholder or rough estimation based on unreliable or interpreted sources."
      },
      "last_updated": "2024-09-27T16:46:14Z",
      "net": "2024-10-31T00:00:00Z",
      "net_precision": {
          "id": 7,
          "name": "Month",
          "abbrev": "M",
          "description": "The T-0 is expected in the given month."
      },
      "window_end": "2024-10-31T00:00:00Z",
      "window_start": "2024-10-31T00:00:00Z",
      "image": {
          "id": 1708,
          "name": "[AUTO] Ceres-1 - image",
          "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/ceres-1_image_20230722081939.jpeg",
          "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305193541.jpeg",
          "credit": null,
          "license": {
              "id": 1,
              "name": "Unknown",
              "priority": 9,
              "link": null
          },
          "single_use": true,
          "variants": []
      },
      "infographic": null,
      "probability": null,
      "weather_concerns": null,
      "failreason": "",
      "hashtag": null,
      "launch_service_provider": {
          "response_mode": "list",
          "id": 1021,
          "url": "https://ll.thespacedevs.com/2.3.0/agencies/1021/",
          "name": "Galactic Energy",
          "abbrev": "GE",
          "type": {
              "id": 3,
              "name": "Commercial"
          }
      },
      "rocket": {
          "id": 8318,
          "configuration": {
              "response_mode": "list",
              "id": 461,
              "url": "https://ll.thespacedevs.com/2.3.0/launcher_configurations/461/",
              "name": "Ceres-1",
              "families": [
                  {
                      "response_mode": "list",
                      "id": 2,
                      "name": "Ceres-1"
                  }
              ],
              "full_name": "Ceres-1",
              "variant": "Ceres-1"
          }
      },
      "mission": {
          "id": 6899,
          "name": "Unknown Payload",
          "type": "Unknown",
          "description": "Details TBD.",
          "image": null,
          "orbit": {
              "id": 25,
              "name": "Unknown",
              "abbrev": "N/A",
              "celestial_body": {
                  "response_mode": "list",
                  "id": 1,
                  "name": "Earth"
              }
          },
          "agencies": [],
          "info_urls": [],
          "vid_urls": []
      },
      "pad": {
          "id": 21,
          "url": "https://ll.thespacedevs.com/2.3.0/pads/21/",
          "active": true,
          "agencies": [],
          "name": "Launch Area 95A",
          "image": {
              "id": 1329,
              "name": "Ceres-1 liftoff from LA-95A (Jilin-1 High Resolution 03D-08, 51 to 54)",
              "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/ceres-1252025_image_20230703100031.jpeg",
              "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305192423.jpeg",
              "credit": "Galactic Energy",
              "license": {
                  "id": 1,
                  "name": "Unknown",
                  "priority": 9,
                  "link": null
              },
              "single_use": false,
              "variants": []
          },
          "description": "",
          "info_url": null,
          "wiki_url": "https://en.wikipedia.org/wiki/Jiuquan_Satellite_Launch_Center",
          "map_url": "https://www.google.com/maps?q=40.969117,100.343333",
          "latitude": 40.969117,
          "longitude": 100.343333,
          "country": {
              "id": 6,
              "name": "China",
              "alpha_2_code": "CN",
              "alpha_3_code": "CHN",
              "nationality_name": "Chinese",
              "nationality_name_composed": "Sino"
          },
          "map_image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/map_images/pad_21_20200803143253.jpg",
          "total_launch_count": 55,
          "orbital_launch_attempt_count": 55,
          "fastest_turnaround": "P2DT1H47M",
          "location": {
              "response_mode": "normal",
              "id": 17,
              "url": "https://ll.thespacedevs.com/2.3.0/locations/17/",
              "name": "Jiuquan Satellite Launch Center, People's Republic of China",
              "celestial_body": {
                  "response_mode": "normal",
                  "id": 1,
                  "name": "Earth",
                  "type": {
                      "id": 1,
                      "name": "Planet"
                  },
                  "diameter": 12742000.0,
                  "mass": 5.972168e+24,
                  "gravity": 9.80655,
                  "length_of_day": "1 00:00:00",
                  "atmosphere": true,
                  "image": {
                      "id": 2040,
                      "name": "Earth (Apollo 17)",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/earth_2528apol_image_20240402194304.jpeg",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/earth_2528apol_image_thumbnail_20240402194305.jpeg",
                      "credit": "NASA",
                      "license": {
                          "id": 4,
                          "name": "NASA Image and Media Guidelines",
                          "priority": 0,
                          "link": "https://www.nasa.gov/nasa-brand-center/images-and-media/"
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "description": "Earth is the third planet from the Sun and the only astronomical object known to harbor life.",
                  "wiki_url": "https://en.wikipedia.org/wiki/Earth",
                  "total_attempted_launches": 6965,
                  "successful_launches": 6429,
                  "failed_launches": 536,
                  "total_attempted_landings": 988,
                  "successful_landings": 949,
                  "failed_landings": 39
              },
              "active": true,
              "country": {
                  "id": 6,
                  "name": "China",
                  "alpha_2_code": "CN",
                  "alpha_3_code": "CHN",
                  "nationality_name": "Chinese",
                  "nationality_name_composed": "Sino"
              },
              "description": "Jiuquan Satellite Launch Center is a Chinese spaceport located between the Ejin, Alxa, Inner Mongolia and Hangtian Town, Jinta County, Jiuquan, Gansu Province. It is part of the Dongfeng Aerospace City (Base 10).",
              "image": {
                  "id": 1374,
                  "name": "Long March 2F/G liftoff (Shenzhou 16)",
                  "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/long2520march_image_20240101085213.jpeg",
                  "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305192548.jpeg",
                  "credit": "CMS",
                  "license": {
                      "id": 1,
                      "name": "Unknown",
                      "priority": 9,
                      "link": null
                  },
                  "single_use": false,
                  "variants": []
              },
              "map_image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/map_images/location_17_20200803142429.jpg",
              "longitude": 100.291111,
              "latitude": 40.958056,
              "timezone_name": "Asia/Shanghai",
              "total_launch_count": 231,
              "total_landing_count": 0
          }
      },
      "webcast_live": false,
      "program": [],
      "orbital_launch_attempt_count": 6785,
      "location_launch_attempt_count": 232,
      "pad_launch_attempt_count": 56,
      "agency_launch_attempt_count": 16,
      "orbital_launch_attempt_count_year": 196,
      "location_launch_attempt_count_year": 14,
      "pad_launch_attempt_count_year": 7,
      "agency_launch_attempt_count_year": 5
  },
  {
      "id": "f97bce95-052e-4fa9-80e8-dbedf16bc516",
      "url": "https://ll.thespacedevs.com/2.3.0/launches/f97bce95-052e-4fa9-80e8-dbedf16bc516/",
      "name": "Falcon 9 Block 5 | Dragon CRS-2 SpX-31",
      "response_mode": "normal",
      "slug": "falcon-9-block-5-dragon-crs-2-spx-31",
      "launch_designator": null,
      "status": {
          "id": 2,
          "name": "To Be Determined",
          "abbrev": "TBD",
          "description": "Current date is a placeholder or rough estimation based on unreliable or interpreted sources."
      },
      "last_updated": "2024-09-19T06:15:22Z",
      "net": "2024-10-31T00:00:00Z",
      "net_precision": {
          "id": 7,
          "name": "Month",
          "abbrev": "M",
          "description": "The T-0 is expected in the given month."
      },
      "window_end": "2024-10-31T00:00:00Z",
      "window_start": "2024-10-31T00:00:00Z",
      "image": {
          "id": 1390,
          "name": "F9B5 liftoff from 39A with Cargo Dragon",
          "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/falcon2520925_image_20210520085648.jpeg",
          "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305192619.jpeg",
          "credit": "SpaceX",
          "license": {
              "id": 5,
              "name": "CC BY-NC 2.0",
              "priority": 1,
              "link": "https://creativecommons.org/licenses/by-nc/2.0/"
          },
          "single_use": false,
          "variants": []
      },
      "infographic": null,
      "probability": null,
      "weather_concerns": null,
      "failreason": "",
      "hashtag": null,
      "launch_service_provider": {
          "response_mode": "list",
          "id": 121,
          "url": "https://ll.thespacedevs.com/2.3.0/agencies/121/",
          "name": "SpaceX",
          "abbrev": "SpX",
          "type": {
              "id": 3,
              "name": "Commercial"
          }
      },
      "rocket": {
          "id": 7744,
          "configuration": {
              "response_mode": "list",
              "id": 164,
              "url": "https://ll.thespacedevs.com/2.3.0/launcher_configurations/164/",
              "name": "Falcon 9",
              "families": [
                  {
                      "response_mode": "list",
                      "id": 1,
                      "name": "Falcon"
                  },
                  {
                      "response_mode": "list",
                      "id": 176,
                      "name": "Falcon 9"
                  }
              ],
              "full_name": "Falcon 9 Block 5",
              "variant": "Block 5"
          }
      },
      "mission": {
          "id": 6262,
          "name": "Dragon CRS-2 SpX-31",
          "type": "Resupply",
          "description": "31st commercial resupply services mission to the International Space Station operated by SpaceX. The flight will be conducted under the second Commercial Resupply Services contract with NASA.\r\n\r\nCargo Dragon 2 brings supplies and payloads, including critical materials to directly support science and research investigations that occur onboard the orbiting laboratory.",
          "image": null,
          "orbit": {
              "id": 8,
              "name": "Low Earth Orbit",
              "abbrev": "LEO",
              "celestial_body": {
                  "response_mode": "list",
                  "id": 1,
                  "name": "Earth"
              }
          },
          "agencies": [
              {
                  "response_mode": "normal",
                  "id": 44,
                  "url": "https://ll.thespacedevs.com/2.3.0/agencies/44/",
                  "name": "National Aeronautics and Space Administration",
                  "abbrev": "NASA",
                  "type": {
                      "id": 1,
                      "name": "Government"
                  },
                  "featured": true,
                  "country": [
                      {
                          "id": 2,
                          "name": "United States of America",
                          "alpha_2_code": "US",
                          "alpha_3_code": "USA",
                          "nationality_name": "American",
                          "nationality_name_composed": "Americano"
                      }
                  ],
                  "description": "The National Aeronautics and Space Administration is an independent agency of the executive branch of the United States federal government responsible for the civilian space program, as well as aeronautics and aerospace research. NASA have many launch facilities but most are inactive. The most commonly used pad will be LC-39B at Kennedy Space Center in Florida.",
                  "administrator": "Administrator: Bill Nelson",
                  "founding_year": 1958,
                  "launchers": "Space Shuttle | SLS",
                  "spacecraft": "Orion",
                  "parent": null,
                  "image": {
                      "id": 19,
                      "name": "[AUTO] National Aeronautics and Space Administration - image",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/national2520aeronautics2520and2520space2520administration_image_20190207032448.jpeg",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305184631.jpeg",
                      "credit": null,
                      "license": {
                          "id": 1,
                          "name": "Unknown",
                          "priority": 9,
                          "link": null
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "logo": {
                      "id": 161,
                      "name": "[AUTO] National Aeronautics and Space Administration - logo",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/national2520aeronautics2520and2520space2520administration_logo_20190207032448.png",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305185043.png",
                      "credit": null,
                      "license": {
                          "id": 1,
                          "name": "Unknown",
                          "priority": 9,
                          "link": null
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "social_logo": {
                      "id": 76,
                      "name": "[AUTO] National Aeronautics and Space Administration - social_logo",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/national2520aeronautics2520and2520space2520administration_nation_20230803040809.jpg",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305184823.jpeg",
                      "credit": null,
                      "license": {
                          "id": 1,
                          "name": "Unknown",
                          "priority": 9,
                          "link": null
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "total_launch_count": 141,
                  "consecutive_successful_launches": 11,
                  "successful_launches": 121,
                  "failed_launches": 20,
                  "pending_launches": 6,
                  "consecutive_successful_landings": 0,
                  "successful_landings": 0,
                  "failed_landings": 0,
                  "attempted_landings": 0,
                  "successful_landings_spacecraft": 178,
                  "failed_landings_spacecraft": 2,
                  "attempted_landings_spacecraft": 180,
                  "successful_landings_payload": 0,
                  "failed_landings_payload": 0,
                  "attempted_landings_payload": 0,
                  "info_url": "http://www.nasa.gov",
                  "wiki_url": "http://en.wikipedia.org/wiki/National_Aeronautics_and_Space_Administration",
                  "social_media_links": []
              }
          ],
          "info_urls": [],
          "vid_urls": []
      },
      "pad": {
          "id": 80,
          "url": "https://ll.thespacedevs.com/2.3.0/pads/80/",
          "active": true,
          "agencies": [
              {
                  "response_mode": "normal",
                  "id": 121,
                  "url": "https://ll.thespacedevs.com/2.3.0/agencies/121/",
                  "name": "SpaceX",
                  "abbrev": "SpX",
                  "type": {
                      "id": 3,
                      "name": "Commercial"
                  },
                  "featured": true,
                  "country": [
                      {
                          "id": 2,
                          "name": "United States of America",
                          "alpha_2_code": "US",
                          "alpha_3_code": "USA",
                          "nationality_name": "American",
                          "nationality_name_composed": "Americano"
                      }
                  ],
                  "description": "Space Exploration Technologies Corp., known as SpaceX, is an American aerospace manufacturer and space transport services company headquartered in Hawthorne, California. It was founded in 2002 by entrepreneur Elon Musk with the goal of reducing space transportation costs and enabling the colonization of Mars. SpaceX operates from many pads, on the East Coast of the US they operate from SLC-40 at Cape Canaveral Space Force Station and historic LC-39A at Kennedy Space Center. They also operate from SLC-4E at Vandenberg Space Force Base, California, usually for polar launches. Another launch site is being developed at Boca Chica, Texas.",
                  "administrator": "CEO: Elon Musk",
                  "founding_year": 2002,
                  "launchers": "Falcon | Starship",
                  "spacecraft": "Dragon",
                  "parent": null,
                  "image": {
                      "id": 29,
                      "name": "[AUTO] SpaceX - image",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/spacex_image_20190207032501.jpeg",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305184704.jpeg",
                      "credit": null,
                      "license": {
                          "id": 1,
                          "name": "Unknown",
                          "priority": 9,
                          "link": null
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "logo": {
                      "id": 186,
                      "name": "[AUTO] SpaceX - logo",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/spacex_logo_20220826094919.png",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305185138.png",
                      "credit": null,
                      "license": {
                          "id": 1,
                          "name": "Unknown",
                          "priority": 9,
                          "link": null
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "social_logo": {
                      "id": 94,
                      "name": "[AUTO] SpaceX - social_logo",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/spacex_nation_20230531064544.jpg",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305184848.jpeg",
                      "credit": null,
                      "license": {
                          "id": 1,
                          "name": "Unknown",
                          "priority": 9,
                          "link": null
                      },
                      "single_use": true,
                      "variants": []
                  }
              }
          ],
          "name": "Space Launch Complex 40",
          "image": {
              "id": 2113,
              "name": "F9 liftoff from SLC-40 (SES-24)",
              "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/f9_liftoff_from_image_20240621050513.jpeg",
              "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/f9_liftoff_from_image_thumbnail_20240621050514.jpeg",
              "credit": "SpaceX",
              "license": {
                  "id": 5,
                  "name": "CC BY-NC 2.0",
                  "priority": 1,
                  "link": "https://creativecommons.org/licenses/by-nc/2.0/"
              },
              "single_use": false,
              "variants": []
          },
          "description": "",
          "info_url": null,
          "wiki_url": "https://en.wikipedia.org/wiki/Cape_Canaveral_Air_Force_Station_Space_Launch_Complex_40",
          "map_url": "https://www.google.com/maps?q=28.56194122,-80.57735736",
          "latitude": 28.56194122,
          "longitude": -80.57735736,
          "country": {
              "id": 2,
              "name": "United States of America",
              "alpha_2_code": "US",
              "alpha_3_code": "USA",
              "nationality_name": "American",
              "nationality_name_composed": "Americano"
          },
          "map_image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/map_images/pad_80_20200803143323.jpg",
          "total_launch_count": 263,
          "orbital_launch_attempt_count": 263,
          "fastest_turnaround": "P2DT19H40M",
          "location": {
              "response_mode": "normal",
              "id": 12,
              "url": "https://ll.thespacedevs.com/2.3.0/locations/12/",
              "name": "Cape Canaveral SFS, FL, USA",
              "celestial_body": {
                  "response_mode": "normal",
                  "id": 1,
                  "name": "Earth",
                  "type": {
                      "id": 1,
                      "name": "Planet"
                  },
                  "diameter": 12742000.0,
                  "mass": 5.972168e+24,
                  "gravity": 9.80655,
                  "length_of_day": "1 00:00:00",
                  "atmosphere": true,
                  "image": {
                      "id": 2040,
                      "name": "Earth (Apollo 17)",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/earth_2528apol_image_20240402194304.jpeg",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/earth_2528apol_image_thumbnail_20240402194305.jpeg",
                      "credit": "NASA",
                      "license": {
                          "id": 4,
                          "name": "NASA Image and Media Guidelines",
                          "priority": 0,
                          "link": "https://www.nasa.gov/nasa-brand-center/images-and-media/"
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "description": "Earth is the third planet from the Sun and the only astronomical object known to harbor life.",
                  "wiki_url": "https://en.wikipedia.org/wiki/Earth",
                  "total_attempted_launches": 6965,
                  "successful_launches": 6429,
                  "failed_launches": 536,
                  "total_attempted_landings": 988,
                  "successful_landings": 949,
                  "failed_landings": 39
              },
              "active": true,
              "country": {
                  "id": 2,
                  "name": "United States of America",
                  "alpha_2_code": "US",
                  "alpha_3_code": "USA",
                  "nationality_name": "American",
                  "nationality_name_composed": "Americano"
              },
              "description": "Cape Canaveral Space Force Station (CCSFS) is an installation of the United States Space Force's Space Launch Delta 45, located on Cape Canaveral in Brevard County, Florida.",
              "image": {
                  "id": 2200,
                  "name": "Cape Canaveral & KSC seen from orbit (STS-43)",
                  "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/cape_canaveral__image_20240918151615.jpg",
                  "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/cape_canaveral__image_thumbnail_20240918151616.jpeg",
                  "credit": "NASA",
                  "license": {
                      "id": 4,
                      "name": "NASA Image and Media Guidelines",
                      "priority": 0,
                      "link": "https://www.nasa.gov/nasa-brand-center/images-and-media/"
                  },
                  "single_use": true,
                  "variants": []
              },
              "map_image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/map_images/location_12_20200803142519.jpg",
              "longitude": -80.577778,
              "latitude": 28.488889,
              "timezone_name": "America/New_York",
              "total_launch_count": 976,
              "total_landing_count": 57
          }
      },
      "webcast_live": false,
      "program": [
          {
              "response_mode": "normal",
              "id": 11,
              "url": "https://ll.thespacedevs.com/2.3.0/programs/11/",
              "name": "Commercial Resupply Services",
              "image": {
                  "id": 1878,
                  "name": "[AUTO] Commercial Resupply Services - image",
                  "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/commercial2520_program_20201129212219.png",
                  "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305194021.png",
                  "credit": null,
                  "license": {
                      "id": 1,
                      "name": "Unknown",
                      "priority": 9,
                      "link": null
                  },
                  "single_use": true,
                  "variants": []
              },
              "info_url": null,
              "wiki_url": "https://en.wikipedia.org/wiki/Commercial_Resupply_Services#Commercial_Resupply_Services",
              "description": "Commercial Resupply Services (CRS) are a series of flights awarded by NASA for the delivery of cargo and supplies to the International Space Station.The first CRS contracts were signed in 2008 and awarded $1.6 billion to SpaceX for twelve cargo Dragon and $1.9 billion to Orbital Sciences for eight Cygnus flights, covering deliveries to 2016. The Falcon 9 and Antares rockets were also developed under the CRS program to deliver cargo spacecraft to the ISS.",
              "agencies": [
                  {
                      "response_mode": "list",
                      "id": 44,
                      "url": "https://ll.thespacedevs.com/2.3.0/agencies/44/",
                      "name": "National Aeronautics and Space Administration",
                      "abbrev": "NASA",
                      "type": {
                          "id": 1,
                          "name": "Government"
                      }
                  },
                  {
                      "response_mode": "list",
                      "id": 257,
                      "url": "https://ll.thespacedevs.com/2.3.0/agencies/257/",
                      "name": "Northrop Grumman Space Systems",
                      "abbrev": "NGSS",
                      "type": {
                          "id": 3,
                          "name": "Commercial"
                      }
                  },
                  {
                      "response_mode": "list",
                      "id": 1020,
                      "url": "https://ll.thespacedevs.com/2.3.0/agencies/1020/",
                      "name": "Sierra Nevada Corporation",
                      "abbrev": "SNC",
                      "type": {
                          "id": 3,
                          "name": "Commercial"
                      }
                  },
                  {
                      "response_mode": "list",
                      "id": 121,
                      "url": "https://ll.thespacedevs.com/2.3.0/agencies/121/",
                      "name": "SpaceX",
                      "abbrev": "SpX",
                      "type": {
                          "id": 3,
                          "name": "Commercial"
                      }
                  }
              ],
              "start_date": "2008-12-23T00:00:00Z",
              "end_date": null,
              "mission_patches": [],
              "type": {
                  "id": 2,
                  "name": "Human Spaceflight"
              }
          },
          {
              "response_mode": "normal",
              "id": 17,
              "url": "https://ll.thespacedevs.com/2.3.0/programs/17/",
              "name": "International Space Station",
              "image": {
                  "id": 1874,
                  "name": "[AUTO] International Space Station - image",
                  "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/international2_program_20201129184745.png",
                  "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305194014.png",
                  "credit": null,
                  "license": {
                      "id": 1,
                      "name": "Unknown",
                      "priority": 9,
                      "link": null
                  },
                  "single_use": true,
                  "variants": []
              },
              "info_url": "https://www.nasa.gov/mission_pages/station/main/index.html",
              "wiki_url": "https://en.wikipedia.org/wiki/International_Space_Station_programme",
              "description": "The International Space Station programme is tied together by a complex set of legal, political and financial agreements between the sixteen nations involved in the project, governing ownership of the various components, rights to crewing and utilization, and responsibilities for crew rotation and resupply of the International Space Station. It was conceived in 1984 by President Ronald Reagan, during the Space Station Freedom project as it was originally called.",
              "agencies": [
                  {
                      "response_mode": "list",
                      "id": 16,
                      "url": "https://ll.thespacedevs.com/2.3.0/agencies/16/",
                      "name": "Canadian Space Agency",
                      "abbrev": "CSA",
                      "type": {
                          "id": 1,
                          "name": "Government"
                      }
                  },
                  {
                      "response_mode": "list",
                      "id": 27,
                      "url": "https://ll.thespacedevs.com/2.3.0/agencies/27/",
                      "name": "European Space Agency",
                      "abbrev": "ESA",
                      "type": {
                          "id": 2,
                          "name": "Multinational"
                      }
                  },
                  {
                      "response_mode": "list",
                      "id": 37,
                      "url": "https://ll.thespacedevs.com/2.3.0/agencies/37/",
                      "name": "Japan Aerospace Exploration Agency",
                      "abbrev": "JAXA",
                      "type": {
                          "id": 1,
                          "name": "Government"
                      }
                  },
                  {
                      "response_mode": "list",
                      "id": 44,
                      "url": "https://ll.thespacedevs.com/2.3.0/agencies/44/",
                      "name": "National Aeronautics and Space Administration",
                      "abbrev": "NASA",
                      "type": {
                          "id": 1,
                          "name": "Government"
                      }
                  },
                  {
                      "response_mode": "list",
                      "id": 63,
                      "url": "https://ll.thespacedevs.com/2.3.0/agencies/63/",
                      "name": "Russian Federal Space Agency (ROSCOSMOS)",
                      "abbrev": "RFSA",
                      "type": {
                          "id": 1,
                          "name": "Government"
                      }
                  }
              ],
              "start_date": "1998-11-20T06:40:00Z",
              "end_date": null,
              "mission_patches": [],
              "type": {
                  "id": 2,
                  "name": "Human Spaceflight"
              }
          }
      ],
      "orbital_launch_attempt_count": 6785,
      "location_launch_attempt_count": 984,
      "pad_launch_attempt_count": 267,
      "agency_launch_attempt_count": 416,
      "orbital_launch_attempt_count_year": 196,
      "location_launch_attempt_count_year": 57,
      "pad_launch_attempt_count_year": 49,
      "agency_launch_attempt_count_year": 105
  },
  {
      "id": "a9fa3ed5-4988-4a72-b262-454e7b03ab50",
      "url": "https://ll.thespacedevs.com/2.3.0/launches/a9fa3ed5-4988-4a72-b262-454e7b03ab50/",
      "name": "Falcon 9 Block 5 | Koreasat 6A",
      "response_mode": "normal",
      "slug": "falcon-9-block-5-koreasat-6a",
      "launch_designator": null,
      "status": {
          "id": 2,
          "name": "To Be Determined",
          "abbrev": "TBD",
          "description": "Current date is a placeholder or rough estimation based on unreliable or interpreted sources."
      },
      "last_updated": "2024-09-27T09:10:13Z",
      "net": "2024-10-31T00:00:00Z",
      "net_precision": {
          "id": 7,
          "name": "Month",
          "abbrev": "M",
          "description": "The T-0 is expected in the given month."
      },
      "window_end": "2024-10-31T00:00:00Z",
      "window_start": "2024-10-31T00:00:00Z",
      "image": {
          "id": 1736,
          "name": "[AUTO] Falcon 9 - image",
          "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/falcon_9_image_20230807133459.jpeg",
          "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305193628.jpeg",
          "credit": null,
          "license": {
              "id": 1,
              "name": "Unknown",
              "priority": 9,
              "link": null
          },
          "single_use": true,
          "variants": []
      },
      "infographic": null,
      "probability": null,
      "weather_concerns": null,
      "failreason": "",
      "hashtag": null,
      "launch_service_provider": {
          "response_mode": "list",
          "id": 121,
          "url": "https://ll.thespacedevs.com/2.3.0/agencies/121/",
          "name": "SpaceX",
          "abbrev": "SpX",
          "type": {
              "id": 3,
              "name": "Commercial"
          }
      },
      "rocket": {
          "id": 8058,
          "configuration": {
              "response_mode": "list",
              "id": 164,
              "url": "https://ll.thespacedevs.com/2.3.0/launcher_configurations/164/",
              "name": "Falcon 9",
              "families": [
                  {
                      "response_mode": "list",
                      "id": 1,
                      "name": "Falcon"
                  },
                  {
                      "response_mode": "list",
                      "id": 176,
                      "name": "Falcon 9"
                  }
              ],
              "full_name": "Falcon 9 Block 5",
              "variant": "Block 5"
          }
      },
      "mission": {
          "id": 6611,
          "name": "Koreasat 6A",
          "type": "Communications",
          "description": "The Koreasat 6A spacecraft, built by Thales Alenia Space, will have 20 transponders for fixed satellite services and six for TV broadcasting to replace the Koreasat 6 launched in 2010.\r\n\r\nKoreasat 6A will be based on the manufacturer’s Spacebus 4000B2 platform and is expected to weigh about 3.5 metric tons at launch. It will be designed to operate for at least 15 years.",
          "image": null,
          "orbit": {
              "id": 2,
              "name": "Geostationary Transfer Orbit",
              "abbrev": "GTO",
              "celestial_body": {
                  "response_mode": "list",
                  "id": 1,
                  "name": "Earth"
              }
          },
          "agencies": [],
          "info_urls": [],
          "vid_urls": []
      },
      "pad": {
          "id": 72,
          "url": "https://ll.thespacedevs.com/2.3.0/pads/72/",
          "active": true,
          "agencies": [],
          "name": "Unknown Pad",
          "image": null,
          "description": null,
          "info_url": null,
          "wiki_url": "",
          "map_url": "https://www.google.com/maps?q=28.458,-80.528",
          "latitude": 28.458,
          "longitude": -80.528,
          "country": {
              "id": 2,
              "name": "United States of America",
              "alpha_2_code": "US",
              "alpha_3_code": "USA",
              "nationality_name": "American",
              "nationality_name_composed": "Americano"
          },
          "map_image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/map_images/pad_72_20200803143403.jpg",
          "total_launch_count": 0,
          "orbital_launch_attempt_count": 0,
          "fastest_turnaround": null,
          "location": {
              "response_mode": "normal",
              "id": 12,
              "url": "https://ll.thespacedevs.com/2.3.0/locations/12/",
              "name": "Cape Canaveral SFS, FL, USA",
              "celestial_body": {
                  "response_mode": "normal",
                  "id": 1,
                  "name": "Earth",
                  "type": {
                      "id": 1,
                      "name": "Planet"
                  },
                  "diameter": 12742000.0,
                  "mass": 5.972168e+24,
                  "gravity": 9.80655,
                  "length_of_day": "1 00:00:00",
                  "atmosphere": true,
                  "image": {
                      "id": 2040,
                      "name": "Earth (Apollo 17)",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/earth_2528apol_image_20240402194304.jpeg",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/earth_2528apol_image_thumbnail_20240402194305.jpeg",
                      "credit": "NASA",
                      "license": {
                          "id": 4,
                          "name": "NASA Image and Media Guidelines",
                          "priority": 0,
                          "link": "https://www.nasa.gov/nasa-brand-center/images-and-media/"
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "description": "Earth is the third planet from the Sun and the only astronomical object known to harbor life.",
                  "wiki_url": "https://en.wikipedia.org/wiki/Earth",
                  "total_attempted_launches": 6965,
                  "successful_launches": 6429,
                  "failed_launches": 536,
                  "total_attempted_landings": 988,
                  "successful_landings": 949,
                  "failed_landings": 39
              },
              "active": true,
              "country": {
                  "id": 2,
                  "name": "United States of America",
                  "alpha_2_code": "US",
                  "alpha_3_code": "USA",
                  "nationality_name": "American",
                  "nationality_name_composed": "Americano"
              },
              "description": "Cape Canaveral Space Force Station (CCSFS) is an installation of the United States Space Force's Space Launch Delta 45, located on Cape Canaveral in Brevard County, Florida.",
              "image": {
                  "id": 2200,
                  "name": "Cape Canaveral & KSC seen from orbit (STS-43)",
                  "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/cape_canaveral__image_20240918151615.jpg",
                  "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/cape_canaveral__image_thumbnail_20240918151616.jpeg",
                  "credit": "NASA",
                  "license": {
                      "id": 4,
                      "name": "NASA Image and Media Guidelines",
                      "priority": 0,
                      "link": "https://www.nasa.gov/nasa-brand-center/images-and-media/"
                  },
                  "single_use": true,
                  "variants": []
              },
              "map_image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/map_images/location_12_20200803142519.jpg",
              "longitude": -80.577778,
              "latitude": 28.488889,
              "timezone_name": "America/New_York",
              "total_launch_count": 976,
              "total_landing_count": 57
          }
      },
      "webcast_live": false,
      "program": [],
      "orbital_launch_attempt_count": 6785,
      "location_launch_attempt_count": 984,
      "pad_launch_attempt_count": 2,
      "agency_launch_attempt_count": 416,
      "orbital_launch_attempt_count_year": 196,
      "location_launch_attempt_count_year": 57,
      "pad_launch_attempt_count_year": 2,
      "agency_launch_attempt_count_year": 105
  },
  {
      "id": "ae15ed89-63fa-4256-8b71-cb3c30e23e31",
      "url": "https://ll.thespacedevs.com/2.3.0/launches/ae15ed89-63fa-4256-8b71-cb3c30e23e31/",
      "name": "Falcon 9 Block 5 | Sirius SXM-9",
      "response_mode": "normal",
      "slug": "falcon-9-block-5-sirius-sxm-9",
      "launch_designator": null,
      "status": {
          "id": 2,
          "name": "To Be Determined",
          "abbrev": "TBD",
          "description": "Current date is a placeholder or rough estimation based on unreliable or interpreted sources."
      },
      "last_updated": "2024-08-24T03:51:46Z",
      "net": "2024-10-31T00:00:00Z",
      "net_precision": {
          "id": 7,
          "name": "Month",
          "abbrev": "M",
          "description": "The T-0 is expected in the given month."
      },
      "window_end": "2024-10-31T00:00:00Z",
      "window_start": "2024-10-31T00:00:00Z",
      "image": {
          "id": 1736,
          "name": "[AUTO] Falcon 9 - image",
          "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/falcon_9_image_20230807133459.jpeg",
          "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/255bauto255d__image_thumbnail_20240305193628.jpeg",
          "credit": null,
          "license": {
              "id": 1,
              "name": "Unknown",
              "priority": 9,
              "link": null
          },
          "single_use": true,
          "variants": []
      },
      "infographic": null,
      "probability": null,
      "weather_concerns": null,
      "failreason": "",
      "hashtag": null,
      "launch_service_provider": {
          "response_mode": "list",
          "id": 121,
          "url": "https://ll.thespacedevs.com/2.3.0/agencies/121/",
          "name": "SpaceX",
          "abbrev": "SpX",
          "type": {
              "id": 3,
              "name": "Commercial"
          }
      },
      "rocket": {
          "id": 8289,
          "configuration": {
              "response_mode": "list",
              "id": 164,
              "url": "https://ll.thespacedevs.com/2.3.0/launcher_configurations/164/",
              "name": "Falcon 9",
              "families": [
                  {
                      "response_mode": "list",
                      "id": 1,
                      "name": "Falcon"
                  },
                  {
                      "response_mode": "list",
                      "id": 176,
                      "name": "Falcon 9"
                  }
              ],
              "full_name": "Falcon 9 Block 5",
              "variant": "Block 5"
          }
      },
      "mission": {
          "id": 6870,
          "name": "Sirius SXM-9",
          "type": "Communications",
          "description": "SXM-9 is the 10th high-powered, digital, audio radio satellite built by Maxar (SSL) for SiriusXM. The SXM-9 satellite will be based on Maxar’s proven 1300-class platform and built at the company’s manufacturing facility in Palo Alto, California. It is expected that SXM-9 will launch in 2024.  SXM-9 has a large, mesh, unfurlable reflector almost 10 meters in diameter that allows SiriusXM programming to reach its radios, including those in moving vehicles.",
          "image": null,
          "orbit": {
              "id": 2,
              "name": "Geostationary Transfer Orbit",
              "abbrev": "GTO",
              "celestial_body": {
                  "response_mode": "list",
                  "id": 1,
                  "name": "Earth"
              }
          },
          "agencies": [],
          "info_urls": [],
          "vid_urls": []
      },
      "pad": {
          "id": 72,
          "url": "https://ll.thespacedevs.com/2.3.0/pads/72/",
          "active": true,
          "agencies": [],
          "name": "Unknown Pad",
          "image": null,
          "description": null,
          "info_url": null,
          "wiki_url": "",
          "map_url": "https://www.google.com/maps?q=28.458,-80.528",
          "latitude": 28.458,
          "longitude": -80.528,
          "country": {
              "id": 2,
              "name": "United States of America",
              "alpha_2_code": "US",
              "alpha_3_code": "USA",
              "nationality_name": "American",
              "nationality_name_composed": "Americano"
          },
          "map_image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/map_images/pad_72_20200803143403.jpg",
          "total_launch_count": 0,
          "orbital_launch_attempt_count": 0,
          "fastest_turnaround": null,
          "location": {
              "response_mode": "normal",
              "id": 12,
              "url": "https://ll.thespacedevs.com/2.3.0/locations/12/",
              "name": "Cape Canaveral SFS, FL, USA",
              "celestial_body": {
                  "response_mode": "normal",
                  "id": 1,
                  "name": "Earth",
                  "type": {
                      "id": 1,
                      "name": "Planet"
                  },
                  "diameter": 12742000.0,
                  "mass": 5.972168e+24,
                  "gravity": 9.80655,
                  "length_of_day": "1 00:00:00",
                  "atmosphere": true,
                  "image": {
                      "id": 2040,
                      "name": "Earth (Apollo 17)",
                      "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/earth_2528apol_image_20240402194304.jpeg",
                      "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/earth_2528apol_image_thumbnail_20240402194305.jpeg",
                      "credit": "NASA",
                      "license": {
                          "id": 4,
                          "name": "NASA Image and Media Guidelines",
                          "priority": 0,
                          "link": "https://www.nasa.gov/nasa-brand-center/images-and-media/"
                      },
                      "single_use": true,
                      "variants": []
                  },
                  "description": "Earth is the third planet from the Sun and the only astronomical object known to harbor life.",
                  "wiki_url": "https://en.wikipedia.org/wiki/Earth",
                  "total_attempted_launches": 6965,
                  "successful_launches": 6429,
                  "failed_launches": 536,
                  "total_attempted_landings": 988,
                  "successful_landings": 949,
                  "failed_landings": 39
              },
              "active": true,
              "country": {
                  "id": 2,
                  "name": "United States of America",
                  "alpha_2_code": "US",
                  "alpha_3_code": "USA",
                  "nationality_name": "American",
                  "nationality_name_composed": "Americano"
              },
              "description": "Cape Canaveral Space Force Station (CCSFS) is an installation of the United States Space Force's Space Launch Delta 45, located on Cape Canaveral in Brevard County, Florida.",
              "image": {
                  "id": 2200,
                  "name": "Cape Canaveral & KSC seen from orbit (STS-43)",
                  "image_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/cape_canaveral__image_20240918151615.jpg",
                  "thumbnail_url": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/images/cape_canaveral__image_thumbnail_20240918151616.jpeg",
                  "credit": "NASA",
                  "license": {
                      "id": 4,
                      "name": "NASA Image and Media Guidelines",
                      "priority": 0,
                      "link": "https://www.nasa.gov/nasa-brand-center/images-and-media/"
                  },
                  "single_use": true,
                  "variants": []
              },
              "map_image": "https://thespacedevs-prod.nyc3.digitaloceanspaces.com/media/map_images/location_12_20200803142519.jpg",
              "longitude": -80.577778,
              "latitude": 28.488889,
              "timezone_name": "America/New_York",
              "total_launch_count": 976,
              "total_landing_count": 57
          }
      },
      "webcast_live": false,
      "program": [],
      "orbital_launch_attempt_count": 6785,
      "location_launch_attempt_count": 984,
      "pad_launch_attempt_count": 2,
      "agency_launch_attempt_count": 416,
      "orbital_launch_attempt_count_year": 196,
      "location_launch_attempt_count_year": 57,
      "pad_launch_attempt_count_year": 2,
      "agency_launch_attempt_count_year": 105
  }])
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('home.buttons.launches_screen.title')}
        subtitle={i18n.t('home.buttons.launches_screen.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={launcheScreenStyles.content}>
          {
            !loading ?
              launches.length > 0 ?
                launches.map((launch: any, index: number) => (
                  <LaunchCard key={index} launch={launch} navigation={navigation} />
                ))
                :
                <SimpleButton disabled text="Aucun lancements trouvés..."/>
            :
            <ActivityIndicator size="large" color={app_colors.white} />
          }
        </View>
      </ScrollView>
    </View>
  );
}
