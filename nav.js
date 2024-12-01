const {t} = global.i18next
const nav = () => ([
    {
        "name": t('modelfitting_top_level_title'),// {ns: 'menutoolbar'}),
        "tab": "model_fitting",
        "buttons": [
            
            {
                "name": t('modelfitting_Contrasts'),// {ns: 'menutoolbar'}),
                "icon": "icon-brightness-and-contrast",
                "children": [
                    "./contrastsDisplay",
                    "./contrastsSet"
                ]
            },
            "./glzm",
            {
                "name": t('modelfitting_IRT'),// {ns: 'menutoolbar'}),
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
                "name": t('modelfitting_KNN'),// {ns: 'menutoolbar'}),
                "icon": "icon-network",
                "children": [
                    "./kNearestNeighbhors",
                    "./KNNPredict"
                ]
            },
        {
                "name": t('modelfitting_Regression'),// {ns: 'menutoolbar'}),
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
                "name": t('modelfitting_Nonlinear_Regression'),// {ns: 'menutoolbar'}),
                "icon": "icon-logistic_white_comp",
                "children": [
        
                ]
            },		        
            "./mixedModelsBasic",
            "./naiveBayes",
            {
                "name": t('modelfitting_Neural_Nets'),// {ns: 'menutoolbar'}),
                "icon": "icon-brain",
                "children": [
                    "./multiLayerPerceptron",
                    "./neuralNets"
                ]
            },
            "./sem",  
            {
                "name": t('modelfitting_Trees'),// {ns: 'menutoolbar'}),
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
        "name": t('modelfitting_File'),// {ns: 'menutoolbar'}),
        "tab": "file",
        "buttons": [
            {
                "name": t('modelfitting_File_Model'),// {ns: 'menutoolbar'}),
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
