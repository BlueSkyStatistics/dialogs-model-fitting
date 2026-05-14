const nav = [
    {
        "id": "menu-modelfitting",
        "buttons": [
            
            {
                "id": "menu-modelfitting-contrasts",
                "icon": "icon-brightness-and-contrast",
                "children": [
                    "./contrastsDisplay",
                    "./contrastsSet"
                ]
            },
            "./glzm",
            {
                "id": "menu-modelfitting-irt",
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
                "id": "menu-modelfitting-knn",
                "icon": "icon-network",
                "children": [
                    "./kNearestNeighbhors",
                    "./KNNPredict"
                ]
            },
        {
                "id": "menu-modelfitting-regression",
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
                "id": "menu-modelfitting-nonlinearregression",
                "icon": "icon-logistic_white_comp",
                "children": [
        
                ]
            },		        
            "./mixedModelsBasic",
            "./naiveBayes",
            {
                "id": "menu-modelfitting-neuralnets",
                "icon": "icon-brain",
                "children": [
                    "./multiLayerPerceptron",
                    "./neuralNets"
                ]
            },
            "./sem",  
            {
                "id": "menu-modelfitting-trees",
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
        "id": "menu-file",
        "buttons": [
            {
                "id": "menu-file-model",
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
