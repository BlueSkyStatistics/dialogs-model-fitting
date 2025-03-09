/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */

const nav = [
    {
        "name": "Model Fitting",
        "tab": "model_fitting",
        "buttons": [
            
            {
                "name": "Contrasts",
                "icon": "icon-brightness-and-contrast",
                "children": [
                    "./contrastsDisplay",
                    "./contrastsSet"
                ]
            },
            "./glzm",
            {
                "name": "IRT",
                "icon": "icon-lamp",
                "children": [
                    "./IRT/partialCreditModel",
                    "./IRT/partialCreditMultiFacetedModel",   
                    "./IRT/ratingScaleModel",
                    "./IRT/ratingScaleMultiFacetedModel",			
                    "./IRT/simpleRaschModel",
                    "./IRT/simpleRaschMultiFacetedModel"
                ]
            },
            {
                "name": "KNN",
                "icon": "icon-network",
                "children": [
                    "./kNearestNeighbhors",
                    "./KNNPredict"
                ]
            },
        {
                "name": "Regression",
                "icon": "icon-linear_regression_white_comp",
                "children": [
                    "./linearRegressionFormula",
                    "./linearRegression",
                    "./linearRegressionLegacy",
                    "./logisticRegressionFormula",
                    "./logisticRegression",
                    "./multiNomialLogistic",
                    "./ordinalRegression",
                    "./QuantileRegression"
                ]
            },
            {
                "name": "Nonlinear Regression",
                "icon": "icon-logistic_white_comp",
                "children": [
        
                ]
            },		        
            "./mixedModelsBasic",
            "./naiveBayes",
            {
                "name": "Neural Nets",
                "icon": "icon-brain",
                "children": [
                    "./multiLayerPerceptron",
                    "./neuralNets"
                ]
            },
            "./sem",  
            {
                "name": "Trees",
                "icon": "icon-tree",
                "children": [
                    "./decisionTreesEZ",
                    "./extremeGradientBoosting",
                    "./optimalNoTrees",                
                    "./randomForest",
                    "./tuneRandomForest"
                ]
            }

            
        ]
    },
    {
        "name": "File",
        "tab": "file",
        "buttons": [
            {
                "name": "Model",
                "icon": "icon-package_install",
                "children": [
                    "./loadAModel",
                    "./saveAModel"
                ]
            }
        ]

    }
]

module.exports.nav = nav
