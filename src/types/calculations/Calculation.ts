import type { ComponentType } from "react";

// "general" : calculs qui ne dépendent d'aucune fiche matériel (ex: conversion de magnitudes).
export type CalculationCategory = "instrument" | "eyepiece" | "photo" | "general";

// Valeurs numériques résolues pour les variables d'un calcul, indexées par clé de variable (voir
// le catalogue src/helpers/calculations/variables.ts). Une clé absente = valeur pas encore connue.
export type CalculationValues = Record<string, number>;

export interface CalculationVisualizationProps {
  value: number;
  values: CalculationValues;
  // Permet à une visualisation interactive (jauge déplaçable) de réécrire une entrée du calcul en
  // retour, pour visualiser immédiatement le matériel nécessaire pour atteindre une valeur cible.
  onValuesChange?: (values: Partial<CalculationValues>) => void;
}

export interface CalculationDefinition {
  id: string;
  category: CalculationCategory;
  // Clés de variables nécessaires (catalogue partagé), dans l'ordre d'affichage des champs.
  inputs: string[];
  // Formule LaTeX affichée en tête de la fiche (voir FormulaCard, rendu via react-native-mathjax).
  formulaLatex: string;
  // Pure : ne dépend que des valeurs fournies, jamais d'un hook ou d'un import circulaire vers le
  // registre. Une dépendance à un autre calcul (ex: champ réel a besoin du grossissement) s'exprime
  // simplement en import ant/appelant directement la fonction `compute` de ce calcul.
  compute: (values: CalculationValues) => number | null;
  // Formatage complet du résultat, symbole/unité inclus, avec le séparateur décimal de `language`.
  formatResult: (value: number, language: string) => string;
  // Carte de visualisation optionnelle sous le résultat. Aucune par défaut (voir §ci-dessous).
  Visualization?: ComponentType<CalculationVisualizationProps>;
}
