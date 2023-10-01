const nav = {
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
                "./KNN",
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
                "./quantileregression",
                "./nonLinearReg"
            ]
        },
        {
            "name": "Non Linear Regression",
            "icon": "icon-linear_regression_white_comp",
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
                "./decisionTrees",
                "./extremeGradientBoosting",
                "./optimalNoTrees",                
                "./randomForest",
                "./tuneRandomForest"
            ]
        },
        "./saveAModel",
        "./loadAModel"
        
    ]
}

module.exports.nav = nav
