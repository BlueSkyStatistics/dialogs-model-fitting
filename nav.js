// const i18next = require("i18next");
const nav = () => ([
    {
        "name": i18next.t('modelfitting_top_level_title', {ns: 'menutoolbar'}),
        "tab": "model_fitting",
        "buttons": [
            
            {
                "name": i18next.t('modelfitting_Contrasts', {ns: 'menutoolbar'}),
                "icon": "icon-brightness-and-contrast",
                "children": [
                    "./contrastsDisplay",
                    "./contrastsSet"
                ]
            },
            "./glzm",
            {
                "name": i18next.t('modelfitting_IRT', {ns: 'menutoolbar'}),
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
                "name": i18next.t('modelfitting_KNN', {ns: 'menutoolbar'}),
                "icon": "icon-network",
                "children": [
                    "./kNearestNeighbhors",
                    "./KNNPredict"
                ]
            },
        {
                "name": i18next.t('modelfitting_Regression', {ns: 'menutoolbar'}),
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
                "name": i18next.t('modelfitting_Nonlinear_Regression', {ns: 'menutoolbar'}),
                "icon": "icon-logistic_white_comp",
                "children": [
        
                ]
            },		        
            "./mixedModelsBasic",
            "./naiveBayes",
            {
                "name": i18next.t('modelfitting_Neural_Nets', {ns: 'menutoolbar'}),
                "icon": "icon-brain",
                "children": [
                    "./multiLayerPerceptron",
                    "./neuralNets"
                ]
            },
            "./sem",  
            {
                "name": i18next.t('modelfitting_Trees', {ns: 'menutoolbar'}),
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
        "name": i18next.t('modelfitting_File', {ns: 'menutoolbar'}),
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
])

module.exports = {
    nav: nav(),
    render: () => nav()
}
