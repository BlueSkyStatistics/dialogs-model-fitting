
class sem extends baseModal {
    static dialogId = 'sem'
    static t = baseModal.makeT(sem.dialogId)

  constructor() {
    var config = {
            id: sem.dialogId,
      label: sem.t('title'),
      modalType: "two",
      parameterCount: 0,
      RCode: `
require(lavaan)
require(semPlot)  
require(semTools)  
#Making sure we initialize these objects as if there are errors, R retains original object value
if (exists('{{selected.modelname | safe}}_def')){rm({{selected.modelname | safe}}_def)}
if (exists('{{selected.modelname | safe}}')){rm({{selected.modelname | safe}})}
{{selected.modelname | safe}}_def <- '{{selected.sem | safe}}{{selected.sem2 | safe}}{{selected.modelTermsDst | safe}}{{selected.coVarDst | safe}}{{selected.sem3 | safe}}{{selected.mediationDestCtrl | safe}}'
\n{{selected.modelname | safe}} <- {{if (options.selected.useSemFunction)}}lavaan::sem{{#else}}lavaan::cfa{{/if}}({{selected.modelname | safe}}_def,    
    {{if (options.selected.family =="ML")}}estimator = "ML",
    {{/if}}{{if (options.selected.family =="MLM")}}estimator = "MLM",
    {{/if}}{{if (options.selected.family =="MLF")}}estimator = "MLF",
    {{/if}}{{if (options.selected.family =="MLR")}}estimator = "MLR",
    {{/if}}{{if (options.selected.family =="MLMV")}}estimator = "MLMV",
    {{/if}}{{if (options.selected.family =="MLMVS")}}estimator = "MLMVS",
    {{/if}}{{if (options.selected.family =="PML")}}estimator = "PML",
    {{/if}}{{if (options.selected.family =="GLS")}}estimator = "GLS",
    {{/if}}{{if (options.selected.family =="WLS")}}estimator = "WLS",
    {{/if}}{{if (options.selected.family =="DLS")}}estimator = "DLS",
    {{/if}}{{if (options.selected.family =="DWLS")}}estimator = "DWLS",
    {{/if}}{{if (options.selected.family =="WLSM")}}estimator = "WLSM",
    {{/if}}{{if (options.selected.family =="WLSMV")}}estimator = "WLSMV",
    {{/if}}{{if (options.selected.family =="WLSMVS")}}estimator = "WLSMVS",
    {{/if}}{{if (options.selected.family =="js")}}estimator = "js",
    {{/if}}{{if (options.selected.family =="jsa")}}estimator = "jsa",
    {{/if}}{{if (options.selected.family =="ULS")}}estimator = "ULS",
    {{/if}}{{if (options.selected.combokid !="")}}\nlikelihood = "{{selected.combokid | safe}}",
    {{/if}}{{if (options.selected.gpbox2 != "" )}}se ="{{selected.gpbox2 | safe}}", 
    {{/if}}{{if (options.selected.gpbox2 == "bootstrap" )}}bootstrap = {{selected.bootstratRep   | safe}},
    {{/if}}{{ if(options.selected.allLatentLoadingRemoved)}}std.lv = TRUE,
    {{/if}}{{ if(options.selected.multiGrpDependent !="")}} group = {{selected.multiGrpDependent | safe}},
    {{/if}}{{if (options.selected.groupEqualString != "")}} group.equal = c({{selected.groupEqualString | safe}}),
    {{/if}}missing = "{{selected.missing | safe}}", data = {{dataset.name}})
BSkySummaryRes <- summary({{selected.modelname | safe}}, fit.measures = TRUE{{if(options.selected.gpbox1 =="endo")}}, rsq = TRUE{{/if}} {{if (options.selected.gpbox2 == "bootstrap" )}},ci = TRUE{{/if}},standardized = TRUE)
print.lavaan.summary_bsky(BSkySummaryRes)
{{if (options.selected.gpbox2 == "bootstrap" )}}
BSkyParameterEst <- lavaan::parameterEstimates({{selected.modelname | safe}}, 
  level = 0.95, 
  boot.ci.type="{{selected.gpbox3 | safe}}")
BSkyFormat(as.data.frame(BSkyParameterEst), singleTableOutputHeader="Parameter Estimates")
{{/if}}
{{if (options.selected.addFitMeasures == "TRUE")}}
#Additional fit measures
BSkyfitMeasures <- fitMeasures({{selected.modelname | safe}})
BSkyFormat(as.data.frame(BSkyfitMeasures), singleTableOutputHeader="Additional Fit Measures")
{{/if}}
{{if (options.selected.mardiaSkew =="TRUE")}}
#Mardia's skew
BSkyMardiasSkew <- semTools::mardiaSkew(na.omit({{dataset.name}}[, c({{selected.allvars | safe}})]))
BSkyFormat(BSkyMardiasSkew, singleTableOutputHeader="Mardia's Skew")
{{/if}}
{{if (options.selected.mardiaKurt =="TRUE")}}
#Mardia's kurtosis
BSkyMardiasKurt <- semTools::mardiaKurtosis(na.omit({{dataset.name}}[, c({{selected.allvars | safe}})]))
BSkyFormat(BSkyMardiasKurt, singleTableOutputHeader="Mardia's Kurtosis")
{{/if}}
{{if (options.selected.endoExoString.length > 0 && options.selected.observed =="TRUE")}}
#Observed covariances  
BSKyObservedCov <- data.frame({{selected.modelname | safe}}@SampleStats@cov[[1]])
names(BSKyObservedCov) <- {{selected.modelname | safe}}@Data@ov[["name"]]
base::row.names(BSKyObservedCov) <- {{selected.modelname | safe}}@Data@ov[["name"]]
BSkyFormat(BSKyObservedCov, singleTableOutputHeader="Observed Covariances")
{{/if}}
{{if (options.selected.endoExoString.length == 0 && options.selected.observed =="TRUE")}}
cat ("Observed covariances cannot be displayed as there are no latent variables or structural parameters\n")
{{/if}}
{{if (options.selected.modelImplied =="TRUE")}}
BSkyCovFitted <- data.frame({{selected.modelname | safe}}@implied[["cov"]])
names(BSkyCovFitted) <- {{selected.modelname | safe}}@Data@ov[["name"]]
base::row.names(BSkyCovFitted) <- {{selected.modelname | safe}}@Data@ov[["name"]]
BSkyFormat(BSkyCovFitted, singleTableOutputHeader = "Model-implied (fitted) Covariances")
{{/if}}
{{if (options.selected.residual =="TRUE")}}
BSkyResiduals <- data.frame({{selected.modelname | safe}}@SampleStats@cov[[1]] - {{selected.modelname | safe}}@Fit@Sigma.hat[[1]])
names(BSkyResiduals) <- {{selected.modelname | safe}}@Data@ov[["name"]]
base::row.names(BSkyResiduals) <- {{selected.modelname | safe}}@Data@ov[["name"]]
BSkyFormat(BSkyResiduals, singleTableOutputHeader="Deviation between Observed and Fitted Covariances")
{{/if}}
{{if (options.selected.residualCovHeatmap =="TRUE")}}
#Heat map around the deviation matrix
library (gplots)
BSkyDisplay1 <- round(BSkyResiduals,digits = BSkyGetDecimalDigitSetting())
gplots::heatmap.2(as.matrix(BSkyResiduals), Rowv=FALSE, dendrogram="none", symm=TRUE, col=topo.colors(10), 
          distfun=function(c) as.dist(1 - c), trace="none", cellnote = BSkyDisplay1 ,
          main = "Deviation between Observed and \n Model-Implied Covariance Matrices",
          key=TRUE, density.info="none")
{{/if}}
{{if (options.selected.observedCorr =="TRUE")}}
BSKyObservedCorr <- data.frame(stats::cov2cor({{selected.modelname | safe}}@SampleStats@cov[[1]]))
names(BSKyObservedCorr) <- {{selected.modelname | safe}}@Data@ov[["name"]]
base::row.names(BSKyObservedCorr) <- {{selected.modelname | safe}}@Data@ov[["name"]]
BSkyFormat(BSKyObservedCorr, singleTableOutputHeader="Observed Correlations")
{{/if}}
{{if (options.selected.modelImpliedCorr =="TRUE")}}
BSkyCorrFitted <- data.frame(stats::cov2cor({{selected.modelname | safe}}@implied[["cov"]][[1]]))
names(BSkyCorrFitted) <- {{selected.modelname | safe}}@Data@ov[["name"]]
base::row.names(BSkyCorrFitted) <- {{selected.modelname | safe}}@Data@ov[["name"]]
BSkyFormat(BSkyCorrFitted, singleTableOutputHeader = "Model-implied (fitted) Correlations")
{{/if}}

{{if (options.selected.residualCorr =="TRUE")}}
BSkyCorrResiduals <- data.frame(stats::cov2cor({{selected.modelname | safe}}@SampleStats@cov[[1]]) - stats::cov2cor({{selected.modelname | safe}}@Fit@Sigma.hat[[1]]))
names(BSkyCorrResiduals) <- {{selected.modelname | safe}}@Data@ov[["name"]]
BSkyFormat(BSkyCorrResiduals, singleTableOutputHeader="Deviation between Observed and Fitted Correlations")
{{/if}}

{{if (options.selected.residualCorrHeatmap =="TRUE")}}
#We compute correlations and then the residuals
BSkyStdResiduals <- data.frame(stats::cov2cor({{selected.modelname | safe}}@SampleStats@cov[[1]]) - stats::cov2cor({{selected.modelname | safe}}@Fit@Sigma.hat[[1]]))
BSkyDisplay2 <- round(BSkyStdResiduals ,digits=BSkyGetDecimalDigitSetting())
gplots::heatmap.2(as.matrix(BSkyStdResiduals), Rowv=FALSE, dendrogram="none", symm=TRUE, col=topo.colors(10), 
          distfun=function(c) as.dist(1 - c), trace="none", cellnote = BSkyDisplay2,
          main = "Deviation between Observed and \n Model-Implied Correlation Matrices",
          key=TRUE, density.info="none")
{{/if}}

{{if (options.selected.modIndices =="TRUE")}}
#Modification indices
{{if (options.selected.highLowIndices =="TRUE")}}
BSkyFormat("Estimated Model")
BSkyModIndices <- lavaan::modificationIndices({{selected.modelname | safe}}, minimum.value = {{selected.threshold | safe}})
BSkyFormat(as.data.frame(BSkyModIndices), singleTableOutputHeader = "Modification Indices: threshold = {{selected.threshold | safe}}")
{{#else}}
BSkyModIndices <- lavaan::modificationIndices({{selected.modelname | safe}})
BSkyFormat(as.data.frame(BSkyModIndices), singleTableOutputHeader = "Modification Indices")
{{/if}}
{{/if}}
{{if (options.selected.stdall =="TRUE")}}
#Standardized solution (type ="std.all")
BSkyStdSol <- lavaan::standardizedSolution({{selected.modelname | safe}}, type ="std.all")
BSkyFormat(as.data.frame(BSkyStdSol), singleTableOutputHeader = "Standardized estimates based on variances of both observed and latent variables")
{{/if}}
{{if (options.selected.stdlv =="TRUE")}}
#Standardized solution (type ="std.lv")
BSkyStdSol <- lavaan::standardizedSolution({{selected.modelname | safe}}, type ="std.lv")
BSkyFormat(as.data.frame(BSkyStdSol), singleTableOutputHeader = "Standardized estimates based on variances of (continuous) latent variables only")
{{/if}}
{{if (options.selected.stdnox =="TRUE")}}
#Standardized solution (type ="std.nox")
BSkyStdSol <- lavaan::standardizedSolution({{selected.modelname | safe}}, type ="std.nox")
BSkyFormat(as.data.frame(BSkyStdSol), singleTableOutputHeader = "Standardized estimates based on observed and latent but not exogenous covariates")
{{/if}}

{{if (options.selected.showGraph)}} 
semPlot::semPaths({{selected.modelname | safe}}, {{if (options.selected.residuals =="TRUE")}} residuals = TRUE,{{#else}}residuals = FALSE,{{/if}} {{if (options.selected.intercepts =="TRUE")}} intercepts = TRUE,{{#else}}intercepts = FALSE,{{/if}} {{if (options.selected.includeThresholds =="TRUE")}} thresholds = TRUE,{{#else}}thresholds = FALSE,{{/if}}
    whatLabels = "{{if (options.selected.edgeLabels =="names")}}name{{/if}}{{if (options.selected.edgeLabels =="parameter estimates")}}est{{/if}}{{if (options.selected.edgeLabels =="standardized parameter estimates")}}std{{/if}}{{if (options.selected.edgeLabels =="parameter number")}}eq{{/if}}{{if (options.selected.edgeLabels =="hide")}}hide{{/if}}",
    layout = "{{selected.layout | safe}}",
    rotation = {{if (options.selected.rotate =="Exog. top")}}1{{/if}}{{if (options.selected.rotate =="Exog. left")}}2{{/if}}{{if (options.selected.rotate =="Exog. bottom")}}3{{/if}}{{if (options.selected.rotate =="Exog. right")}}4{{/if}},
    {{if (options.selected.manifestShapes != "default")}}shapeMan = "{{selected.manifestShapes | safe}}",{{/if}}
    {{if (options.selected.latentShapes != "default")}}shapeLat = "{{selected.latentShapes | safe}}"{{/if}}
    )
{{#else}}
cat("A path diagram is not displayed when there are higher order factors and structural parameters or when a grouping variable has been specified.\n")
{{/if}}
{{if (options.selected.factorScores == "TRUE")}}
BSky_Has_nas <- any(is.na({{dataset.name}}[, c({{selected.allvars | safe}})]))
# If 'BSky_Has_nas' is TRUE, it means the dataset contains NAs
if (BSky_Has_nas) {
  cat("The dataset contains missing values (NAs), we cannot save predicted values to the dataset, we will display predicted values in the output window.\n")
  cat("Displaying a large number of predicted values in the output window can cause performance problems.\n")
  BSkyFormat(as.data.frame(lavaan::lavPredict({{selected.modelname | safe}}, 
    type = "lv")), singleTableOutputHeader = "Predicted Factor Scores")
} else {
  BSkyFS <- lavaan::lavPredict({{selected.modelname | safe}}, 
    type = "lv")
    base::colnames(BSkyFS) <- base::paste("FS", base::colnames(BSkyFS), sep="_") 
  .GlobalEnv\${{dataset.name}} <- tibble::add_column ({{dataset.name}}, data.frame(BSkyFS))
  BSkyLoadRefresh("{{dataset.name}}")
}
{{/if}}
{{if (options.selected.indicators == "TRUE")}}
BSky_Has_nas <- base::any(base::is.na({{dataset.name}}[, c({{selected.allvars | safe}})]))
# If 'BSky_Has_nas' is TRUE, it means the dataset contains NAs
if (BSky_Has_nas) {
  cat("The dataset contains missing values (NAs), we cannot save predicted values to the dataset, we will display predicted values in the output window.\n")
  cat("NOTE::Displaying a large number of predicted values in the output window can cause performance problems.\n")
  BSkyFormat(as.data.frame(lavaan::lavPredict({{selected.modelname | safe}}, 
    type = "ov")), singleTableOutputHeader = "Predicted Indicators")
} else {
  BSkyI <- lavaan::lavPredict({{selected.modelname | safe}}, 
    type = "ov")
    base::colnames(BSkyI) <- base::paste("I", colnames(BSkyI),sep="_") 
  .GlobalEnv\${{dataset.name}} <- tibble::add_column({{dataset.name}}, data.frame(BSkyI))
  BSkyLoadRefresh("{{dataset.name}}")
}
{{/if}}
{{if (options.selected.dependentVars == "TRUE")}}
BSky_Has_nas <- base::any(is.na({{dataset.name}}[, c({{selected.allvars | safe}})]))
# If 'BSky_Has_nas' is TRUE, it means the dataset contains NAs
if (BSky_Has_nas) {
  cat("The dataset contains missing values (NAs), we cannot save predicted values to the dataset, we will display predicted values in the output window.\n")
  cat("NOTE::Displaying a large number of predicted values in the output window can cause performance problems.\n")
  BSkyFormat(lavaan::lavPredict({{selected.modelname | safe}}, 
    type = "yhat"), singleTableOutputHeader = "Predicted Dependent Variables") 
} else {
  BSkyDV <- lavaan::lavPredict({{selected.modelname | safe}}, 
    type = "yhat")
    base::colnames(BSkyDV) <- base::paste("DV", colnames(BSkyDV),sep="_") 
  .GlobalEnv\${{dataset.name}} <- tibble::add_column({{dataset.name}}, data.frame(BSkyDV))
  BSkyLoadRefresh("{{dataset.name}}")
}
{{/if}}

#Deleting temporary objects
if (exists('BSkySummaryRes'))rm(BSkySummaryRes)
if (exists('BSkyParameterEst'))rm(BSkyParameterEst)
if (exists('BSkyfitMeasures'))rm(BSkyfitMeasures)
if (exists('BSkyMardiasSkew'))rm(BSkyMardiasSkew)
if (exists('BSkyMardiasKurt'))rm(BSkyMardiasKurt)
if (exists('BSKyObservedCov'))rm(BSKyObservedCov)
if (exists('BSkyCovFitted'))rm(BSkyCovFitted)
if (exists('BSkyResiduals'))rm(BSkyResiduals)
if (exists('BSkyDisplay1'))rm(BSkyDisplay1)
if (exists('BSKyObservedCorr'))rm(BSKyObservedCorr)
if (exists('BSkyCorrFitted'))rm(BSkyCorrFitted)
if (exists('BSkyCorrResiduals'))rm(BSkyCorrResiduals)
if (exists('BSkyStdResiduals'))rm(BSkyStdResiduals)
if (exists('BSkyDisplay2'))rm(BSkyDisplay2)
if (exists('BSkyModIndices'))rm(BSkyModIndices)
if (exists('BSkyStdSol'))rm(BSkyStdSol)
if (exists('BSkyFS'))rm(BSkyFS)
if (exists('BSky_Has_nas'))rm(BSky_Has_nas)
if (exists('BSkyDV'))rm(BSkyDV)
`
    }
    var objects =
    {
      modelname: {
        el: new input(config, {
          no: 'modelname',
          label: sem.t('modelname'),
          placeholder: "",
          required: true,
          type: "character",
          extraction: "TextAsIs",
          value: "Sem1",
          overwrite: "dataset"
        })
      },
      content_var: { el: new srcVariableList(config, { action: "move", semMain: true }) },
      autoComputeCovar: {
        el: new checkbox(config, {
          label: sem.t('autoComputeCovar'),
          no: "autoComputeCovar",
          style: "mb-2",
          extraction: "Boolean",
          state: "checked",
          newline: "true",
          autoComputeCovar: true
        })
      },
      parameterizeFormula: {
        el: new checkbox(config, {
          label: sem.t('parameterizeFormula'),
          no: "chk1",
          style: "mb-2",
          extraction: "Boolean",
          state: "checked",
          parameterizeFormula: true
        })
      },
      //Note: Extraction has to be passed manually to semExtractData()
      sem: {
        el: new semControl(config, {
          no: "sem",
          label: sem.t('sem'),
          filter: "Numeric|Date|Logical|Scale|semFactor",
          extraction: "NoPrefix|UsePlus",
          placeHolderText: "Enter latent trait name",
          allowedSrcCtrls: ["semVars"],
          type: "latentLoading",
          required: false,
          //The below makes sure that we add the latent variables to the controls below
          suppCtrlIds: ["semSuppCtrl1", "modelTerms", "modelTerms1", "coVarTerms", "coVarTerms1"],
          //When deleting higher order factor variables, we need to remove higher order factor names from these controls
          ctrlsToDeleteFrom: ["sem2", "sem3", "mediationDestCtrl"],
        }), r: ['{{ var | safe}}']
      },
      semSuppCtrl1: {
        el: new semSuppCtrl(config, {
          action: "move",
          no: "semSuppCtrl1", label: sem.t('semSuppCtrl')
        })
      },  
      //Note: Extraction has to be passed manually to semExtractData()
      sem2: {
        el: new semControl(config, {
          label: sem.t('sem2'),
          no: "sem2",
          //This reduces the size of the semControl when in higher order factors and equality constraints
          style : "ms-list3",
          filter: "Numeric|Date|Logical|Scale|semFactor",
          placeHolderText: "Enter higher order factor name",
          type: "higherOrderFactor",
          extraction: "NoPrefix|UsePlus",
          allowedSrcCtrls: ["semsemSuppCtrl1"],
          required: false,
          suppCtrlIds: ["modelTerms", "modelTerms1", "coVarTerms", "coVarTerms1"],
          //When deleting higher order factor variables, we need to remove higher order factor names from these controls
          ctrlsToDeleteFrom: ["sem3", "mediationDestCtrl" ],
        }), r: ['{{ var | safe}}']
      },
      label1: {
        el: new labelVar(config, {
          label: sem.t('label1'),
        })
      },
      label2: {
        el: new labelVar(config, {
          label: sem.t('label1'),
        })
      },
      modelTerms: {
        el: new semModelTerms(config, {
          action: "move",
          no: "modelTerms", label: sem.t('modelTerms')
        })
      },
      modelTerms1: {
        el: new semModelTerms(config, {
          action: "move",
          no: "modelTerms1", label: sem.t('modelTerms1')
        })
      },
      //Note: Extraction has to be passed manually to semExtractData()
      modelTermsDst: {
        el: new semModelTermsDest(config, {
          action: "move",
          no: "modelTermsDst", label: sem.t('modelTermsDst'), 
          filter: "String|Numeric|Logical|Ordinal|Nominal|Scale", 
          extraction: "modelTerms", 
          firstModelTermCtrl: "modelTerms", 
          secondModelTermCtrl: "modelTerms1",
          suppCtrlAddIds: ["mediationSrcCtrl"],
          suppCtrlDeleteIds: ["mediationSrcCtrl", "mediationDestCtrl" ]
        })
      },
      coVarTerms: {
        el: new semModelTerms(config, {
          action: "move",
          no: "coVarTerms", label: sem.t('coVarTerms')
        })
      },
      coVarTerms1: {
        el: new semModelTerms(config, {
          action: "move",
          no: "coVarTerms1", label: sem.t('coVarTerms1')
        })
      },
      //Note: Extraction has to be passed manually to semExtractData()
      coVarDst: {
        el: new semModelTermsDest(config, {
          action: "move",
          no: "coVarDst", label: sem.t('coVarDst'), filter: "String|Numeric|Logical|Ordinal|Nominal|Scale", 
          extraction: "coVariances", 
          firstModelTermCtrl: "coVarTerms", 
          secondModelTermCtrl: "coVarTerms1"
        })
      },
      equalityConstraints1: {
        el: new equalityConstraints(config, {
          action: "move",
          no: "equalityConstraints1", label: sem.t('equalityConstraints1')
        })
      },
      //Note: Extraction has to be passed manually to semExtractData()
      sem3: {
        el: new semControl(config, {
          label: sem.t('sem3'),
          placeHolderText: "",
          type: "equalityConstraint",
          allowedSrcCtrls: ["semequalityConstraints1"],
          no: "sem3",
          //This reduces the size of the semControl when in higher order factors and equality constraints
          style : "ms-list3",
          equalityConstraints: true,
          filter: "Numeric|Date|Logical|Scale|semFactor|relation|covariance|structuralParameter",
          extraction: "equalityConstraints",
          required: false,
        }), r: ['{{ var | safe}}']
      },

      family: {
        el: new comboBoxWithChilderen(config, {
          no: 'family',
          nochild: 'combokid',
          label: sem.t('method'),
          multiple: false,
          extraction: "NoPrefix|UseComma",
          options: [
            { "name": "Automatic", "value": [] },
            { "name": "DLS", "value": [] },
            { "name": "DWLS", "value": [] },
            { "name": "GLS", "value": [] },
            { "name": "js", "value": [] },
            { "name": "jsa", "value": [] },
            { "name": "ML", "value": ["normal", "Wishart"] },
            { "name": "MLF", "value": [] },
            { "name": "MLM", "value": [] },
            { "name": "MLMV", "value": [] },
            { "name": "MLMVS", "value": [] },
            { "name": "MLR", "value": [] },
            { "name": "PML", "value": ["normal", "Wishart"] },
            { "name": "WLS", "value": [] },
              { "name": "WLSM", "value": [] },
            { "name": "WLSMV", "value": [] },
            { "name": "WLSMVS", "value": [] },
            { "name": "ULS", "value": [] },
          ]
        })
      },
      missing: {
        el: new selectVar(config, {
          no: 'missing',
          label: sem.t('missing'),
          multiple: false,
          width: "w-25",
          extraction: "NoPrefix|UseComma",
          options: ["listwise", "fiml", "fiml.x", "two.stage", "robust.two.stage", "pairwise", "available.cases", "doubly.robust"],
          default: "listwise"
        })
      },
      label3: {
        el: new labelVar(config, {
          label: sem.t('label3'),
        })
      },
      label4: {
        el: new labelVar(config, {
          label: sem.t('label4'),
          h: 4
        })
      },
      addFitMeasures: {
        el: new checkbox(config, {
          label: sem.t('addFitMeasures'),
          no: "addFitMeasures",
          style: "mb-2",
          extraction: "Boolean"
        })
      },
      mardiaSkew: {
        el: new checkbox(config, {
          label: sem.t('mardiaSkew'),
          no: "mardiaSkew",
          style: "mb-2",
          extraction: "Boolean",
        })
      },
      mardiaKurt: {
        el: new checkbox(config, {
          label: sem.t('mardiaKurt'),
          no: "mardiaKurt",
          style: "mb-2",
          extraction: "Boolean",
        })
      },
      label5: {
        el: new labelVar(config, {
          label: sem.t('label5'),
          h: 4
        })
      },
      observed: {
        el: new checkbox(config, {
          label: sem.t('observed'),
          no: "observed",
          style: "mb-2",
          state: "checked",
          extraction: "Boolean",
        })
      },
      modelImplied: {
        el: new checkbox(config, {
          label: sem.t('modelImplied'),
          no: "modelImplied",
          style: "mb-2",
          extraction: "Boolean",
        })
      },
      residual: {
        el: new checkbox(config, {
          label: sem.t('residual'),
          no: "residual",
          style: "mb-2",
          extraction: "Boolean",
        })
      },
      residualCovHeatmap: {
        el: new checkbox(config, {
          label: sem.t('residualCovHeatmap'),
          no: "residualCovHeatmap",
          style: "mb-2",
          extraction: "Boolean",
        })
      },
     observedCorr: {
        el: new checkbox(config, {
          label: sem.t('observedCorr'),
          no: "observedCorr",
          style: "mb-2",
          extraction: "Boolean",
        })
      },
      modelImpliedCorr: {
        el: new checkbox(config, {
          label: sem.t('modelImpliedCorr'),
          no: "modelImpliedCorr",
          style: "mb-2",
          extraction: "Boolean",
        })
      },
      residualCorr: {
        el: new checkbox(config, {
          label: sem.t('residualCorr'),
          no: "residualCorr",
          style: "mb-2",
          extraction: "Boolean",
        })
      },
      residualCorrHeatmap: {
        el: new checkbox(config, {
          label: sem.t('residualCorrHeatmap'),
          no: "residualCorrHeatmap",
          style: "mb-2",
          extraction: "Boolean",
        })
      },
      label8: {
        el: new labelVar(config, {
          label: sem.t('label8'),
          h: 4
        })
      },
      modIndices: {
        el: new checkbox(config, {
          label: sem.t('modIndices'),
          no: "modIndices",
          style: "mb-2",
          extraction: "Boolean",
        })
      },
      highLowIndices: {
        el: new checkbox(config, {
          label: sem.t('highLowIndices'),
          no: "highLowIndices",
          style: "ml-2",
          newline: true,
          extraction: "Boolean",
        })
      },
      threshold: {
        el: new inputSpinner(config, {
          no: 'threshold',
          label: sem.t('threshold'),
          min: 0,
          max: 99999999,
          style: "ml-2",
          step: 0.01,
          value: 3.84,
          extraction: "NoPrefix|UseComma"
        })
      },
      label6: {
        el: new labelVar(config, {
          label: sem.t('label6'),
          style: "mt-3",
          h: 4
        })
      },
      r2squareNone: {
        el: new radioButton(config, {
          label: sem.t('r2squareNone'),
          no: "gpbox1",
          increment: "r2squareNone",
          style: "mb-2",
          value: "none",
          extraction: "ValueAsIs",
          state: "checked",
        })
      },
      r2squareEndo: {
        el: new radioButton(config, {
          label: sem.t('r2squareEndo'),
          no: "gpbox1",
          increment: "r2squareEndo",
          value: "endo",
          state: "",
          extraction: "ValueAsIs"
        })
      },
      label7: {
        el: new labelVar(config, {
          label: sem.t('label7'),
          style: "mt-3",
          h: 4
        })
      },
      factorScores: {
        el: new checkbox(config, {
          label: sem.t('factorScores'),
          no: "factorScores",
          style: "mb-2",
          extraction: "Boolean",
        })
      },
      indicators: {
        el: new checkbox(config, {
          label: sem.t('indicators'),
          no: "indicators",
          style: "mb-2",
          extraction: "Boolean",
        })
      },
      dependentVars: {
        el: new checkbox(config, {
          label: sem.t('dependentVars'),
          no: "dependentVars",
          style: "mb-2",
          extraction: "Boolean",
        })
      },
      residuals: {
        el: new checkbox(config, {
          label: sem.t('residuals'),
          no: "residuals",
          newline: true,
          extraction: "Boolean"
        })
      },
      intercepts: {
        el: new checkbox(config, {
          label: sem.t('intercepts'),
          no: "intercepts",
          newline: true,
          extraction: "Boolean",
        })
      },
      includeThresholds: {
        el: new checkbox(config, {
          label: sem.t('includeThresholds'),
          no: "includeThresholds",
          newline: true,
          extraction: "Boolean",
        })
      },
      label101: {
        el: new labelVar(config, {
          label: sem.t('label101'),
          style: "mt-3",
          h: 4
        })
      },
      edgeLabels: {
        el: new comboBox(config, {
          no: "edgeLabels",
          label: sem.t('edgeLabels'),
          multiple: false,
          extraction: "NoPrefix|UseComma",
          options: ["label", "parameter estimates", "standardized parameter estimate", "parameter number", "hide"],
          default: "parameter estimates"
        })
      },
      label102: {
        el: new labelVar(config, {
          label: sem.t('label102'),
          style: "mt-3",
          h: 4
        })
      },
      layout: {
        el: new comboBox(config, {
          no: "layout",
          label: sem.t('layout'),
          multiple: false,
          extraction: "NoPrefix|UseComma",
          options: ["tree", "circle", "spring", "tree2"],
          default: "tree"
        })
      },
      rotate: {
        el: new comboBox(config, {
          no: "rotate",
          label: sem.t('rotate'),
          multiple: false,
          extraction: "NoPrefix|UseComma",
          options: ["Exog. top", "Exog. left", "Exog. bottom", "Exog. right"],
          default: "Exog. top"
        })
      },
      label103: {
        el: new labelVar(config, {
          label: sem.t('label101'),
          style: "mt-3",
          h: 4
        })
      },
      manifestShapes: {
        el: new comboBox(config, {
          no: "manifestShapes",
          label: sem.t('manifestShapes'),
          multiple: false,
          extraction: "NoPrefix|UseComma",
          options: ["default","circle", "rectangle", "square", "ellipse", "diamond"],
          default: "default"
        })
      },
      latentShapes: {
        el: new comboBox(config, {
          no: "latentShapes",
          label: sem.t('latentShapes'),
          multiple: false,
          extraction: "NoPrefix|UseComma",
          options: ["default","circle","rectangle", "square", "ellipse", "diamond"],
          default: "default"
        })
      },
      abbNodeLabels: {
        el: new inputSpinner(config, {
          no: 'abbNodeLabels',
          label: sem.t('abbNodeLabels'),
          min: 0,
          max: 99999999,
          step: 1,
          value: 5,
          extraction: "NoPrefix|UseComma"
        })
      },
      abbEdgeLabels: {
        el: new inputSpinner(config, {
          no: 'abbEdgeLabels',
          label: sem.t('abbEdgeLabels'),
          min: 0,
          max: 99999999,
          step: 0.01,
          value: 5,
          extraction: "NoPrefix|UseComma"
        })
      },
      label104: {
        el: new labelVar(config, {
          label: sem.t('label104'),
        })
      },
      stdall: {
        el: new checkbox(config, {
          label: sem.t('stdall'),
          no: "stdall",
          newline: true,
          extraction: "Boolean",
        })
      },
      stdlv: {
        el: new checkbox(config, {
          label: sem.t('stdlv'),
          no: "stdlv",
          newline: true,
          extraction: "Boolean",
        })
      },
      stnox: {
        el: new checkbox(config, {
          label: sem.t('stdnox'),
          no: "stdnox",
          newline: true,
          extraction: "Boolean",
        })
      },
      label105: {
        el: new labelVar(config, {
          label: sem.t('label105'),
        })
      },
      automatic: {
        el: new radioButton(config, {
          label: sem.t('automatic'),
          no: "gpbox2",
          increment: "automatic",
          value: "",
          extraction: "ValueAsIs",
          state: "checked",
        })
      },
      standard: {
        el: new radioButton(config, {
          label: sem.t('standard'),
          no: "gpbox2",
          increment: "standard",
          value: "standard",
          extraction: "ValueAsIs"
        })
      },
      robust: {
        el: new radioButton(config, {
          label: sem.t('robust'),
          no: "gpbox2",
          increment: "robust",
          value: "robust",
          extraction: "ValueAsIs",
        })
      },
      pseudoML: {
        el: new radioButton(config, {
          label: sem.t('pseudoML'),
          no: "gpbox2",
          increment: "pseudoML",
          value: "robust.huber.white",
          extraction: "ValueAsIs"
        })
      },
      bootstrap: {
        el: new radioButton(config, {
          label: sem.t('bootstrap'),
          no: "gpbox2",
          increment: "bootstrap",
          value: "bootstrap",
          //  dependant_objects: [],
          extraction: "ValueAsIs",
        })
      },
      label106: {
        el: new labelVar(config, {
          label: sem.t('label106'),
        })
      },
      percentiles: {
        el: new radioButton(config, {
          label: sem.t('percentiles'),
          no: "gpbox3",
          increment: "percentiles",
          value: "perc",
          extraction: "ValueAsIs",
          state: "checked",
        })
      },
      normal: {
        el: new radioButton(config, {
          label: sem.t('normal'),
          no: "gpbox3",
          increment: "normal",
          value: "norm",
          extraction: "ValueAsIs",
        })
      },
      adjustedBiasCorrected: {
        el: new radioButton(config, {
          label: sem.t('adjustedBiasCorrected'),
          no: "gpbox3",
          increment: "adjustedBiasCorrected",
          value: "bca.simple",
          extraction: "ValueAsIs",
        })
      },
      basic: {
        el: new radioButton(config, {
          label: sem.t('basic'),
          no: "gpbox3",
          increment: "basic",
          value: "basic",
          extraction: "ValueAsIs",
        })
      },
      bootstratRep: {
        el: new input(config, {
          no: 'bootstratRep',
          label: sem.t('bootstratRep'),
          placeholder: "",
          extraction: "TextAsIs",
          type: "numeric",
          allow_spaces: true,
          value: "1000",
          ml: 4,
          width: "w-25",
        })
      },
      mediationSrcCtrl: {
        el: new semSuppCtrl(config, {
          action: "move",
          no: "mediationSrcCtrl", 
          label: sem.t('mediationSrcCtrl')
        })
      },
      mediationDestCtrl: {
        el: new semControl(config, {
          label: sem.t('mediationDestCtrl'),
          no: "mediationDestCtrl",
          style : "ms-list3",
          filter: "Numeric|Date|Logical|Scale|semFactor|relation|covariance|structuralParameter",
          placeHolderText: "Enter higher order factor name",
          allowedSrcCtrls: ["semmediationSrcCtrl"],
          type: "mediation",
          extraction: "mediation",
          required: false,  
        }), r: ['{{ var | safe}}']
      },
      multiGrpSrc: { el: new srcVariableList(config, { label: sem.t('multiGrpSrc'),
        no: "multiGrpSrc",action: "move"}) },
      multiGrpDependent: {
        el: new dstVariable(config, {
          label: sem.t('multiGrpDependent'),
          no: "multiGrpDependent",
          allowedSrcCtrls: ["semmultiGrpSrcVars"],
          filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
          extraction: "NoPrefix|UseComma|Enclosed",   
        }),
      },

      intercepts1: {
        el: new checkbox(config, {
          label: sem.t('intercepts1'),
          no: "intercepts1",
          extraction: "Boolean"
        })
      },
      means: {
        el: new checkbox(config, {
          label: sem.t('means'),
          no: "means",
          newline: true,
          extraction: "Boolean"
        })
      },
      residuals1: {
        el: new checkbox(config, {
          label: sem.t('residuals1'),
          no: "residuals1",
          newline: true,
          extraction: "Boolean"
        })
      },
      residual_covariances: {
        el: new checkbox(config, {
          label: sem.t('residual_covariances'),
          no: "residual_covariances",
          newline: true,
          extraction: "Boolean"
        })
      },
      lv_variances: {
        el: new checkbox(config, {
          label: sem.t('lv_variances'),
          no: "lv_variances",
          newline: true,
          extraction: "Boolean"
        })
      },
      lv_covariances: {
        el: new checkbox(config, {
          label: sem.t('lv_covariances'),
          no: "lv_covariances",
          newline: true,
          extraction: "Boolean"
        })
      },
      regressions: {
        el: new checkbox(config, {
          label: sem.t('regressions'),
          no: "regressions",
          newline: true,
          extraction: "Boolean"
        })
      },
      loadings: {
        el: new checkbox(config, {
          label: sem.t('loadings'),
          no: "loadings",
          newline: true,
          extraction: "Boolean"
        })
      },
      label9: {
        el: new labelVar(config, {
          label: sem.t('label9'),
          style: "mt-2", 
          h:5
        })
      }

    }
    var secOrderFactors = {
      el: new optionsVar(config, {
        no: "sem_options",
        name: sem.t('secOrdFacOptvar'),//"Second order factors",
        layout: "two",
        left: [
          objects.semSuppCtrl1.el,
        ],
        right: [
          objects.sem2.el
        ],
      })
    };
    var equalConst = {
      el: new optionsVar(config, {
        no: "equalConst",
        name: sem.t('EqConstraintsOptvar'),//"Equality constraints",
        layout: "two",
        left: [
          objects.equalityConstraints1.el,
        ],
        right: [
          objects.sem3.el
        ],
      })
    };
    var optionsModelTerms = {
      el: new optionsVar(config, {
        no: "sem_model_terms",
        name: sem.t('sem_model_terms'),
        layout: "three",
        top: [objects.label1.el,],
        left: [
          objects.modelTerms.el,
        ],
        center: [
          objects.modelTerms1.el,
        ],
        right: [
          objects.modelTermsDst.el,
        ],
      })
    };
    var optionsCoVarTerms = {
      el: new optionsVar(config, {
        no: "optionsCoVarTerms",
        name: sem.t('optionsCoVarTerms'),
        layout: "three",
        top: [objects.autoComputeCovar.el,objects.label2.el,],
        left: [
          objects.coVarTerms.el,
        ],
        center: [
          objects.coVarTerms1.el,
        ],
        right: [
          objects.coVarDst.el,
        ],
      })
    };
    var modelOptions = {
      el: new optionsVar(config, {
        no: "modelOptions",
        name: sem.t('modelOptions'),
        content: [
          objects.family.el,
          objects.missing.el,
          objects.label104.el,
          objects.stdall.el,
          objects.stdlv.el,
          objects.stnox.el,
        ]
      })
    };
    var parameterOptions = {
      el: new optionsVar(config, {
        no: "parameterOptions",
        name: sem.t('parameterOptions'),
        layout: "four",
        top: [],
        left: [
          objects.label105.el,
          objects.automatic.el,
          objects.standard.el,
          objects.robust.el,
          objects.pseudoML.el,
          objects.bootstrap.el,
        ],
        center: [
          objects.label106.el,
          objects.percentiles.el,
          objects.normal.el,
          objects.adjustedBiasCorrected.el,
          objects.basic.el,
          objects.bootstratRep.el,
        ],
        right: [
        ],
      })
    };
    var outputOptions = {
      el: new optionsVar(config, {
        no: "outputOptions",
        name: sem.t('outputOptions'),
        layout: "four",
        top: [objects.label5.el],
        left: [
          objects.label4.el,
          objects.addFitMeasures.el,
          objects.mardiaSkew.el,
          objects.mardiaKurt.el,
          objects.label6.el,
          objects.r2squareNone.el,
          objects.r2squareEndo.el
        ],
        center: [
          objects.label5.el,
          objects.observed.el,
          objects.modelImplied.el,
          objects.residual.el,
          objects.residualCovHeatmap.el,
          objects.observedCorr.el,
          objects.modelImpliedCorr.el,
          objects.residualCorr.el,
          objects.residualCorrHeatmap.el,
          objects.label7.el,
          objects.factorScores.el,
          objects.indicators.el,
          objects.dependentVars.el
        ],
        right: [
          objects.label8.el,
          objects.modIndices.el,
          objects.highLowIndices.el,
          objects.threshold.el
        ],
      })
    };
    var mediation = {
      el: new optionsVar(config, {
        no: "mediation_options",
        name: sem.t('mediationOptvar'),//"Mediation",
        layout: "two",
        left: [
          objects.mediationSrcCtrl.el,
        ],
        right: [
          objects.mediationDestCtrl.el
        ],
      })
    };

    var multiGrpOptions = {
      el: new optionsVar(config, {
        no: "multiGrpOptions",
        name: sem.t('multiGrpOptions'),
        layout: "two",
        top: [objects.label5.el],
        left: [
          objects.multiGrpSrc.el,
        ],
        right: [
          objects.multiGrpDependent.el,
          objects.label9.el,
          objects.intercepts1.el,
          objects.means.el,
          objects.residuals1.el,
          objects.residual_covariances.el,
          objects.lv_variances.el,
          objects.lv_covariances.el,
          objects.regressions.el,
          objects.loadings.el,
          
        ]
      })
    };

    var semPlotOptions = {
      el: new optionsVar(config, {
        no: "semPlotOptions",
        name: sem.t('semPlotOptions'),
        layout: "four",
        top: [objects.residuals.el],
        left: [
          objects.label101.el,
          objects.edgeLabels.el,
        ],
        center: [
          objects.label102.el,
          objects.layout.el,
          objects.rotate.el,
        ],
        right: [
          objects.label103.el,
          objects.manifestShapes.el,
          objects.latentShapes.el,
          objects.abbNodeLabels.el,
          objects.abbEdgeLabels.el
        ],
      })
    };
    const content = {
      head: [objects.modelname.el.content],
      left: [objects.content_var.el.content],
      right: [objects.parameterizeFormula.el.content, objects.sem.el.content],
      bottom: [secOrderFactors.el.content, optionsModelTerms.el.content, mediation.el.content, optionsCoVarTerms.el.content, equalConst.el.content,modelOptions.el.content, outputOptions.el.content, semPlotOptions.el.content, parameterOptions.el.content, multiGrpOptions.el.content],
      nav: {
        name: sem.t('navigation'),
        icon: "icon-teamwork",
        modal: config.id
      }
    }
    super(config, objects, content);
    
        this.help = {
            title: sem.t('help.title'),
            r_help: "help(data,package='utils')",
            body: sem.t('help.body')
        }
;
  }
  prepareExecution(instance) {
    let res = [];
    let tempRes = [];
    let endoExo = {};
    let allVarsArray = []
    let separator = ',';
    let value = `"{{item | safe}}"`;
    let tempretval = "";
    let finalRetString = "";
    let firstTerm =""
    let secondTerm =""
    let myArray = []
    let flippedParameterCheckbox = false
    let allColumnProps = fetchAllColumnAttributes()
    var code_vars = {
      dataset: {
        name: $(`#${instance.config.id}`).attr('dataset') ? $(`#${instance.config.id}`).attr('dataset') : getActiveDataset()
      },
      selected: instance.dialog.extractSemData()
    }
    //If a grouping variable is specified, we cannot automatically generate parameter labels as Lavaan creates these labels
    //Hence we must automatically suppress the creation of parameter labels
    
    let parameterizeFormulaChkId =""
    if (code_vars.selected.multiGrpDependent.length >0)
    {
      let modalDiv = $(`#sem`).closest('[parameterCount]')
      //Get the setting on the checkbox to check whether syntax should be parameterized or not
      parameterizeFormulaChkId = $(`#${modalDiv[0].id}`).find('[parameterizeFormula]')[0].id
      if ( $(`#${parameterizeFormulaChkId}`).prop('checked'))
      {
        $(`#${parameterizeFormulaChkId}`).prop('checked',false)
        flippedParameterCheckbox = true
      }
    }
    //If mediation terms and a grouping variable are defined, we don't handle this case and display an error
    if (code_vars.selected.multiGrpDependent.length >0 && Object.keys(code_vars.selected.mediationDestCtrl).length >0)
    {
       dialog.showMessageBoxSync({ type: "error", buttons: ["OK"], title: "Not supported", message: `We don't support mediation when a grouping variable is defined. Contact support@blueskystatistics.com if you need this capability.` })
       return res
    }
    code_vars.selected["allLatentLoadingRemoved"] =false
    code_vars.selected["showGraph"] = true
    //Getting pre-transformed equality constraints, latentVars, higherOrderFactors and
    //modelTermsDst and coVarsDst
    //We do this as items in the  latentVars, higherOrderFactors and
    //modelTermsDst and coVarsDst needs to be adjusted based on equality constraints entered
    let equalConstraints = code_vars.selected["sem3"]
    let latentVars = code_vars.selected["sem"]
    //Storing the original latent vars so that we compute observed covariances correctly
    //observed covariances are all the observed variables in the latent loadings and structural parameters
    let latentVarsOriObject = deepCopy(code_vars.selected["sem"])
    let oriHigherOrderFactorsLength = Object.keys(code_vars.selected["sem2"]).length
    let higherOrderFactors = code_vars.selected["sem2"]
    let preTransModelTermsDstLength = Object.keys(code_vars.selected["modelTermsDst"]).length
    let modelTermsDst = code_vars.selected["modelTermsDst"]
    // The array preTransModelTermsDstForObvCovar is used to compute observed covariances
    let preTransModelTermsDstForObvCovar = deepCopy(code_vars.selected["modelTermsDst"])
    let preTranscoVarDst = code_vars.selected["coVarDst"]
    let preTransMediationDestCtrl = code_vars.selected["mediationDestCtrl"]
    //We save the original preTransMediationDestCtrl as this is processed to remove equality constraints and mediation relationships
    //If there are oripreTransMediationDestCtrl or latent loadings we can run the dialog
    let oriPreTransMediationDestCtrl =preTransMediationDestCtrl 
    //Storing original latent variables in oriLatentvars so we can compare length correctly when the latent variables are removed due toequality constraints
    let oriLatentvars = common.transform(latentVars, "NoPrefix|UsePlus","sem_sem" )
    //Resetting the parameter constraints we need to recompute the parameter constraints bececause we may have equality constraints
    $(`#${instance.config.id}`).attr('parameterCount', 0)
    //We adjust LatVars, higher order factors, modeltermsDst for equality constraints
    Object.keys(equalConstraints).forEach(function (key, index) {
          equalConstraints[key].forEach(function (element, index) {
            //We return an object as we need to track when structural parameters are defined
            if (typeof(element) == "object")
            {
                element = element ["item"]
            }   
            if (element.includes ("->"))
            {
                firstTerm = element.split("->")[0]
                secondTerm =element.split("->")[1]
            } else if (element.includes ("<->"))
            {
              firstTerm = element.split("<->")[0]
              secondTerm = element.split("<->")[1]
            }
            if (Object.keys(latentVars).length  != 0)
            {
              if (latentVars[firstTerm] != undefined)
              {
                if (latentVars[firstTerm].includes(secondTerm))
                {
                  if (latentVars[firstTerm].filter(item => item !== secondTerm).length ==0)
                  {
                    delete latentVars[firstTerm]
                    //We set std.lv = true if all loadings of any latent variable are removed due to equality constraints
                    code_vars.selected["allLatentLoadingRemoved"] = true
                  } else {
                    latentVars[firstTerm] = latentVars[firstTerm].filter(item => item !== secondTerm);
                  }
                }
              }
            }			
            if (Object.keys(higherOrderFactors).length != 0)
            {
              if (higherOrderFactors[firstTerm] != undefined)
              {
                if (higherOrderFactors[firstTerm].includes(secondTerm))
                {
                  if (higherOrderFactors[firstTerm].filter(item => item !== secondTerm).length ==0)
                  {
                    delete higherOrderFactors[firstTerm]
                  } else {
                    higherOrderFactors[firstTerm] = higherOrderFactors[firstTerm].filter(item => item !== secondTerm);	
                  }     
                }
              } 
            }
            if (modelTermsDst.length != 0)	
            {
              if (modelTermsDst.includes(element))
              {
                modelTermsDst = modelTermsDst.filter(item => item !== element);	
              }
            }	
            if (preTranscoVarDst.length  != 0)	
            {
              if (preTranscoVarDst.includes(element))
              {
                preTranscoVarDst = preTranscoVarDst.filter(item => item !== element);	
              }
            }	
          })  
    })
	//We needed to determine whether all latent loadings were removed due to the definition of equality constraints
  //This was why we needed to get the syntax with all the latent loadings to determine the original state
  //If all the latent loadings were removed, we need to pass std.lv=TRUE in fit4 <- sem(model4, data = HolzingerSwineford1939,std.lv=TRUE)
  //resetting the parameter count as we have to regenerate latent variables after the adjustment of equality constraints are made
  $(`#${instance.config.id}`).attr('parameterCount', 0)
  //Performing the transformations after adjustments, extraction has to be passed
	code_vars.selected["sem"] = common.transform(latentVars, "NoPrefix|UsePlus","sem_sem" )
  /* if (oriLatentvars.length != 0 && code_vars.selected["sem"].length ==0)
  {
    code_vars.selected["allLatentLoadingRemoved"] = true
  } */
  //We now adjust the structural terms i.e. modeltermsDst to remove all entries in the mediation controls
  //If its in the mediation control i.e. preTransMediationDestCtrl, then it needs to be removed from preTransModelTermsDst
  if (Object.keys(preTransMediationDestCtrl).length != 0)
  { 
    Object.keys(preTransMediationDestCtrl).forEach(function (key, index) {
      preTransMediationDestCtrl[key].forEach(function (element, index) {
      if (modelTermsDst.includes(element))
      {
        modelTermsDst = modelTermsDst.filter(item => item !== element);	
      }
      })
    })
  }  
  //We now examine the structural parameters to make sure that the direct relationship in the mediation is not duplicated in the structural parameters
  //see explanation below 
  //A->B
  //B->C
  //A->C is the direct  relationship in the mediation. This could be duplicated in the structural parameters as the user could typically enter this in the
  //structural parameters. Also note that the user could have entered A->C or C->A. In the case that the user enters C->A in the structural parameters,
  //we need to reverse the direction of the mediation. If the user enters A->C in the structural parameters, we don't have to reverse the direction of the mediation
  //The direct relation in the mediation is represented by the syntax below
  //
  let reverseDirectRelationship = false 
  if (Object.keys(preTransMediationDestCtrl).length != 0) 
  { 
    let mediationItems = []  
    let directEffects = [] 
    
    Object.keys(preTransMediationDestCtrl).forEach(function (key, index) { 
          preTransMediationDestCtrl[key].forEach(function (element, index) { 
          mediationItems.push(element) 
          }) 
    }) 
    //Lets get the direct relationship from the mediation control 
    if (mediationItems.length ==2) 
    { 
      //Lets get the 1st and 2nd items in the elements 
      let firstElement2nditem = mediationItems[0].split("->")[1] 
      let secondElement1stitem = mediationItems[1].split("->")[0] 
      let firstElement1stitem = mediationItems[0].split("->")[0] 
      let secondElement2nditem = mediationItems[1].split("->")[1] 
      if (firstElement2nditem == secondElement1stitem) 
      { 
        //Case 1, the 2nd element of the first item is equal to the 1st element of the 2nd item 
        //A->B and B->C 
        //stop = false 
        //Direct effect 
        //The direct relationship is A->C 
        //A is firstElement1stitem 
        //C is secondElement2nditem 
        //We need to loop through the structural parameters looking for a relationship 
        //that has either A and C or C and A, if so we remove it from structural parameters 
        modelTermsDst.forEach(function (element) { 
        myArray = element.split("->"); 
          if (myArray[0] == firstElement1stitem && myArray[1] == secondElement2nditem) 
          { 
            directEffects.push(element) 
          } else if (myArray[0] == secondElement2nditem && myArray[1] == firstElement1stitem) 
          { 
            directEffects.push(element) 
            reverseDirectRelationship = true 
          } 
        })
      }//End of firstElement2nditem == secondElement1stitem 
      else if (firstElement1stitem == secondElement2nditem) 
      { 
          //Case 2, the 1st element of the first item is equal to the 2nd element of the 2nd item 
          //B->C 
          //A->B 
          //stop = false 
          //Direct effect 
          //a ~ direct * c 
          modelTermsDst.forEach(function (element) { 
          myArray = element.split("->"); 
          if (myArray[0] == secondElement1stitem && myArray[1] == firstElement2nditem) 
          { 
            directEffects.push(element) 
          } else if (myArray[0] == firstElement2nditem && myArray[1] == secondElement1stitem ) 
          { 
            directEffects.push(element) 
            reverseDirectRelationship =true 
          } 
        })
      }
	  }

	//Lets remove the direct effects from the structural parameters as it is accounted for in the mediation
  //Note we have to take care of the case of A->C and C->A
	if (directEffects.length > 0)
	{
		directEffects.forEach (function (element) {
		  if (modelTermsDst.includes(element))
		  {
			modelTermsDst = modelTermsDst.filter(item => item !== element);	
		  } else {
        let temp = element.split("->")
        let reversedElement = temp[1] + "->"+ temp[0]
        if (modelTermsDst.includes(reversedElement))
        {
          modelTermsDst = modelTermsDst.filter(item => item !== reversedElement);	
        }
      }
		})
	}
}
  code_vars.selected["sem2"] = common.transform(higherOrderFactors, "NoPrefix|UsePlus","sem_sem2" )
	code_vars.selected["sem3"] = common.transform(equalConstraints, "equalityConstraints","sem_sem3" )
	code_vars.selected["modelTermsDst"] = common.transform(modelTermsDst, "modelTerms","sem_modelTermsDst" )
  code_vars.selected["coVarDst"] = common.transform(preTranscoVarDst, "coVariances","sem_coVarDst" )
  if (reverseDirectRelationship)
  {
    code_vars.selected["mediationDestCtrl"] = common.transform(preTransMediationDestCtrl, "mediationReverseDirectRel","sem_mediationDestCtrl" )
  } else {
  code_vars.selected["mediationDestCtrl"] = common.transform(preTransMediationDestCtrl, "mediation","sem_mediationDestCtrl" )
  }
  //We don't show the graph when there are both higher order factors and structural parameters
  if ((oriHigherOrderFactorsLength  > 0  && preTransModelTermsDstLength > 0) || code_vars.selected.multiGrpDependent !="" )
    code_vars.selected["showGraph"] = false
  //The way missing values are handled influences how the missing value parameter in the observed covariances are set
  if (code_vars.selected["missing"] =="listwise")
    code_vars.selected["coVarMissingOptions"] = "complete.obs"
  else if (code_vars.selected["missing"] =="fiml" || code_vars.selected["missing"] =="fiml.x" || code_vars.selected["missing"] =="pairwise")
    code_vars.selected["coVarMissingOptions"] = "pairwise.complete.obs"
  else code_vars.selected["coVarMissingOptions"] = "pairwise.complete.obs"
  let item = '{{item | safe}}'; 
  endoExo =latentVars
  //finalRetString contains the string used for observed covariances (see observed covariances checkbox in the dialog)
  //Observed covariances list latent loadings, all observed variables in structural parameters
  //NO COVARIANCES
  Object.keys(latentVarsOriObject).forEach(function (key, index) {
      latentVarsOriObject[key].forEach(function (element, index) {
        if (!allVarsArray.includes(element)) {
            allVarsArray.push(element)
        }
        if (!tempRes.includes("'" + element + "'")) {
            tempRes.push("'" + element + "'")
        }
      })
    })
    myArray = []
    let modTerms = []
    if (preTransModelTermsDstForObvCovar.length != 0) {
      myArray = []
      preTransModelTermsDstForObvCovar.forEach(function (valueStructParams) {
        myArray = valueStructParams.split("->");
        myArray.forEach(function (val, index) {
          if (!allVarsArray.includes(val) && allColumnProps[val] != undefined ) {
            allVarsArray.push(val)
          if (!tempRes.includes("'" + val + "'")) {
              tempRes.push("'" + val + "'")
            }
          }
        })
      })
    }
    if (tempRes.length != 0)
    {
        tempretval = tempRes.join(separator);
        if (finalRetString == "") {
          finalRetString = tempretval
        }
        else {
          finalRetString = finalRetString + "," + tempretval
        }
    } 
    if (code_vars.selected.combokid == null || code_vars.selected.combokid == 'null') 
      code_vars.selected.combokid = ""
    code_vars.selected.endoExoString = finalRetString
    code_vars.selected.useSemFunction = true
    if (preTransModelTermsDstLength == 0 && oriLatentvars.length == 0) {
      dialog.showMessageBoxSync({ type: "error", buttons: ["OK"], title: "Required controls not populated", message: `You need to specify latent traits or a structural relationship.` })
      return res
    } else  if (code_vars.selected.modelTermsDst.length == 0) {
      code_vars.selected.useSemFunction = false
    } else if (code_vars.selected.sem.length == 0) {
      code_vars.selected.useSemFunction = true
    } else {
      code_vars.selected.useSemFunction = true
    }
    //Retaining this code for reuse
   /*  myArray = []
    modTerms = []
    if (code_vars.selected.modelTermsDst != "") {
      myArray = []
      modTerms = instance.objects.modelTermsDst.el.getVal()
      modTerms.forEach(function (value) {
        myArray = value.split("->");
        myArray.forEach(function (val, index) {
          if (!allVarsArray.includes(val) && allColumnProps[val] != undefined ) {
            allVarsArray.push(val)
          }
        })
      })
    } */
    if (code_vars.selected.coVarDst != "") {
      myArray = []
      modTerms = instance.objects.coVarDst.el.getVal()
      modTerms.forEach(function (value) {
        myArray = value.split("<->");
        myArray.forEach(function (val, index) {
          if (!allVarsArray.includes(val) && allColumnProps[val] != undefined) {
            allVarsArray.push(val)
          }
        })
      })
    }
    allVarsArray.forEach(function (val, index) {
      allVarsArray[index] = "'" + val + "'";
    })
    let groupEqual =[]
    let  groupEqualString =""
    if (code_vars.selected.intercepts1 == "TRUE") groupEqual.push("'"+"intercepts"+"'")
    if (code_vars.selected.means == "TRUE") groupEqual.push("'"+"means"+"'")
    if (code_vars.selected.residuals1 == "TRUE") groupEqual.push("'"+"residuals"+"'")
    if (code_vars.selected.residual_covariances == "TRUE") groupEqual.push("'"+"residual.covariances"+"'")
    if (code_vars.selected.lv_variances == "TRUE") groupEqual.push("'"+"lv.variances"+"'")
    if (code_vars.selected.lv_covariances == "TRUE") groupEqual.push("'"+"lv.covariances"+"'")
    if (code_vars.selected.regressions == "TRUE") groupEqual.push("'"+"regressions"+"'")
    if (code_vars.selected.loadings == "TRUE") groupEqual.push("'"+"loadings"+"'")
    groupEqualString = groupEqual.join(",")
    code_vars.selected.groupEqualString = groupEqualString
    code_vars.selected.allvars = allVarsArray.join(separator)
    let finalString =""
    if (flippedParameterCheckbox)
    {
      finalString = instance.dialog.renderR(code_vars)+"\n"+"cat('As a grouping variable was specified, we suppressed the automatic generation of parameter labels as the R lavaan automatically creates these.\n')";   
    }
    else
    {
      finalString = instance.dialog.renderR(code_vars);
    }
    res.push({ cmd: finalString, cgid: newCommandGroup(`${instance.config.id}`, `${instance.config.label}`), oriR: instance.config.RCode, code_vars: code_vars })
    if (flippedParameterCheckbox)
    {
      $(`#${parameterizeFormulaChkId}`).prop('checked',true)
    }
    return res;
  }
}

module.exports = {
    render: () => new sem().render()
}

