import { i18n } from "../../helpers/scripts/i18n";

type BaseAchievement = {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
  current?: number;
  target?: number;
};

export type AchievementCategory = {
  id: string;
  title: string;
  items: BaseAchievement[];
};

type DashboardStats = {
  messierObservedCount: number;
  messierPhotographedCount: number;
  messierSketchedCount: number;
  typeObservedCounts: Record<string, number>;
  typeObservedTotals?: Record<string, number>;
  notesCount: number;
  plannerSearchCount: number;
  highMagObservedCount: number;
  highMagPhotographedCount: number;
  observedPlanets: string[];
};

const buildStep = (
  prefix: string,
  thresholds: number[],
  current: number,
  {
    suffix,
    descriptionBuilder,
    titleBuilder,
    currentValue,
  }: {
    suffix?: string;
    descriptionBuilder?: (target: number) => string;
    titleBuilder?: (target: number) => string;
    currentValue?: number;
  } = {}
) =>
  thresholds.map<BaseAchievement>((target) => ({
    id: `${prefix}_${target}`,
    title: titleBuilder ? titleBuilder(target) : `${target} ${suffix ?? ""}`.trim(),
    description: descriptionBuilder
      ? descriptionBuilder(target)
      : i18n.t("dashboard.achievements.reach", { count: target }),
    achieved: current >= target,
    current: currentValue ?? current,
    target,
  }));

export const buildAchievementsCategories = (stats: DashboardStats): AchievementCategory[] => {
  const messierSteps = [1, 5, 10, 25, 50, 75, 100, 110];
  const typeSteps = [1, 5, 20, 50, 75];
  const miscSteps = [1, 5, 20, 50, 100];
  const challengeSteps = [1, 5, 10, 15];
  const solarSystemPlanets = ["mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune"] as const;

  const observedTypes = {
    star: stats.typeObservedCounts["star"] || 0,
    galaxy: stats.typeObservedCounts["galaxy"] || 0,
    nebula: stats.typeObservedCounts["nebula"] || 0,
    cluster: stats.typeObservedCounts["cluster"] || 0,
  };

  return [
    {
      id: "messier",
      title: i18n.t("dashboard.pages.achievements.categories.messier"),
      items: [
        ...buildStep("messier_observed", messierSteps, stats.messierObservedCount, {
          titleBuilder: (target) =>
            i18n.t("dashboard.achievements.messier.observed", { count: target }),
          descriptionBuilder: (target) =>
            i18n.t("dashboard.achievements.messierDescriptions.observed", { count: target }),
        }),
        ...buildStep("messier_photo", messierSteps, stats.messierPhotographedCount, {
          titleBuilder: (target) =>
            i18n.t("dashboard.achievements.messier.photographed", { count: target }),
          descriptionBuilder: (target) =>
            i18n.t("dashboard.achievements.messierDescriptions.photographed", { count: target }),
        }),
        ...buildStep("messier_sketched", messierSteps, stats.messierSketchedCount, {
          titleBuilder: (target) =>
            i18n.t("dashboard.achievements.messier.sketched", { count: target }),
          descriptionBuilder: (target) =>
            i18n.t("dashboard.achievements.messierDescriptions.sketched", { count: target }),
        }),
      ],
    },
    {
      id: "exploration",
      title: i18n.t("dashboard.pages.achievements.categories.exploration"),
      items: [
        ...["star", "galaxy", "nebula", "cluster"].flatMap((type) =>
          buildStep(
            `explore_${type}`,
            typeSteps,
            observedTypes[type as keyof typeof observedTypes],
            {
              titleBuilder: (target) =>
                i18n.t(`dashboard.achievements.exploration.${type}`, { count: target }),
              descriptionBuilder: (target) =>
                i18n.t(`dashboard.achievements.explorationDescriptions.${type}`, { count: target }),
            }
          )
        ),
        ...buildStep("notes_count", miscSteps, stats.notesCount, {
          titleBuilder: (target) =>
            i18n.t("dashboard.achievements.exploration.notes", { count: target }),
          descriptionBuilder: (target) =>
            i18n.t("dashboard.achievements.explorationDescriptions.notes", { count: target }),
        }),
        ...buildStep("planner_searches", miscSteps, stats.plannerSearchCount, {
          titleBuilder: (target) =>
            i18n.t("dashboard.achievements.exploration.planner", { count: target }),
          descriptionBuilder: (target) =>
            i18n.t("dashboard.achievements.explorationDescriptions.planner", { count: target }),
        }),
      ],
    },
    {
      id: "solar_system",
      title: i18n.t("dashboard.pages.achievements.categories.solarSystem"),
      items: solarSystemPlanets.map((planet) => ({
        id: `planet_${planet}`,
        title: i18n.t(`common.planets.${planet.charAt(0).toUpperCase()}${planet.slice(1)}`),
        description: i18n.t("dashboard.achievements.solarSystem.observePlanet", {
          planet: i18n.t(`common.planets.${planet.charAt(0).toUpperCase()}${planet.slice(1)}`),
        }),
        achieved: stats.observedPlanets.includes(planet),
        current: stats.observedPlanets.includes(planet) ? 1 : 0,
        target: 1,
      })),
    },
    {
      id: "challenges",
      title: i18n.t("dashboard.pages.achievements.categories.challenges"),
      items: [
        ...buildStep(
          "challenge_observed_mag10",
          challengeSteps,
          stats.highMagObservedCount,
          {
            titleBuilder: (target) => i18n.t("dashboard.achievements.challenges.title", { count: target }),
            descriptionBuilder: (target) =>
              i18n.t("dashboard.achievements.challenges.observedDescription", { count: target }),
            currentValue: stats.highMagObservedCount,
          }
        ),
        ...buildStep(
          "challenge_photo_mag10",
          challengeSteps,
          stats.highMagPhotographedCount,
          {
            titleBuilder: (target) => i18n.t("dashboard.achievements.challenges.title", { count: target }),
            descriptionBuilder: (target) =>
              i18n.t("dashboard.achievements.challenges.photographedDescription", { count: target }),
            currentValue: stats.highMagPhotographedCount,
          }
        ),
      ],
    },
  ];
};
