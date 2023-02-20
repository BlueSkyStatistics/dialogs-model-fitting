
var localization = {
    en: {
        title: "Decision Trees",
        navigation: "Decision Trees",
        TxtTreeName: "Enter model Name",
        TreeGenChkbox: "Don't re-generate if tree already exists",
        dependent: "Dependent variable",
        independent: "Independent variable(s)",
        TxtMinSplit: "Minimum split",
        minBucket: "Minimum bucket",
        TxtCP: "Complexity parameter",
        maxDepth: "Maximum depth",
        PruneTreeChkbox: "Prune tree",
        rd0: "Don't prune",
        rd1: "Use optimal complexity parameter",
        rd2: "Specify complexity parameter",
        TxtCPPrune: "Enter complexity parameter",
        PlotCVChkbox: "Plot cross-validation",
        PlotRSQRChkbox: "Plot R-squared ",
        help: {
            title: "Decision Trees",
            r_help: "help(rpart, package ='rpart')",
            body: `
                <b>Note</b></br>
                Dependent variables can be factor, ordinal, string, logical and numeric</br>
                Independent Variables can be factor, ordinal, string, logical and numeric</br></br>
                <b>Description</b></br>
                Fit a Recursive Partitioning and Regression Tree model
                <br/>
                <b>Usage</b>
                <br/>
                <code> 
                rpart(formula, data, weights, subset, na.action = na.rpart, method,
                      model = FALSE, x = FALSE, y = TRUE, parms, control, cost, ...)
                </code> <br/>
                <b>Arguments</b><br/>
                <ul>
                <li>
                formula: a formula, with a response but no interaction terms. If this a a data frame, that is taken as the model frame (see model.frame).
                </li>
                <li>
                data: an optional data frame in which to interpret the variables named in the formula.
                </li>
                <li>
                weights: optional case weights.
                </li>
                <li>
                subset: optional expression saying that only a subset of the rows of the data should be used in the fit.
                </li>
                <li>
                na.action: the default action deletes all observations for which y is missing, but keeps those in which one or more predictors are missing.
                </li>
                <li>
                method: one of "anova", "poisson", "class" or "exp". If method is missing then the routine tries to make an intelligent guess. If y is a survival object, then method = "exp" is assumed, if y has 2 columns then method = "poisson" is assumed, if y is a factor then method = "class" is assumed, otherwise method = "anova" is assumed. It is wisest to specify the method directly, especially as more criteria may added to the function in future.
                Alternatively, method can be a list of functions named init, split and eval. Examples are given in the file ‘tests/usersplits.R’ in the sources, and in the vignettes ‘User Written Split Functions’.
                </li>
                <li>
                model: if logical: keep a copy of the model frame in the result? If the input value for model is a model frame (likely from an earlier call to the rpart function), then this frame is used rather than constructing new data.
                </li>
                <li>
                x: keep a copy of the x matrix in the result.
                </li>
                <li>
                y: keep a copy of the dependent variable in the result. If missing and model is supplied this defaults to FALSE.
                </li>
                <li>
                parms: optional parameters for the splitting function.<br/>
                Anova splitting has no parameters.<br/>
                Poisson splitting has a single parameter, the coefficient of variation of the prior distribution on the rates. The default value is 1.<br/>
                Exponential splitting has the same parameter as Poisson.<br/>
                For classification splitting, the list can contain any of: the vector of prior probabilities (component prior), the loss matrix (component loss) or the splitting index (component split). The priors must be positive and sum to 1. The loss matrix must have zeros on the diagonal and positive off-diagonal elements. The splitting index can be gini or information. The default priors are proportional to the data counts, the losses default to 1, and the split defaults to gini.<br/>
                </li>
                <li>
                control: a list of options that control details of the rpart algorithm. See rpart.control.
                </li>
                <li>
                cost: a vector of non-negative costs, one for each variable in the model. Defaults to one for all variables. These are scalings to be applied when considering splits, so the improvement on splitting on a variable is divided by its cost in deciding which split to choose.
                </li>
                <li>
                ...: arguments to rpart.control may also be specified in the call to rpart. They are checked against the list of valid arguments.
                </li>
                </ul>
                <b>Details</b></br>
                This differs from the tree function in S mainly in its handling of surrogate variables. In most details it follows Breiman et. al (1984) quite closely. R package tree provides a re-implementation of tree.
                <b>Value</b></br>
                An object of class rpart. See rpart.object.</br>
                <b>References</b></br>
                Breiman L., Friedman J. H., Olshen R. A., and Stone, C. J. (1984) Classification and Regression Trees. Wadsworth.</br>
                <b>See Also</b></br>
                rpart.control, rpart.object, summary.rpart, print.rpart</br>
                <b>Examples</b></br>
                fit <- rpart(Kyphosis ~ Age + Number + Start, data = kyphosis)</br>
                fit2 <- rpart(Kyphosis ~ Age + Number + Start, data = kyphosis,
                              parms = list(prior = c(.65,.35), split = "information"))</br>
                fit3 <- rpart(Kyphosis ~ Age + Number + Start, data = kyphosis,
                              control = rpart.control(cp = 0.05))</br>
                par(mfrow = c(1,2), xpd = NA) # otherwise on some devices the text is clipped</br>
                plot(fit)</br>
                text(fit, use.n = TRUE)</br>
                plot(fit2)</br>
                text(fit2, use.n = TRUE)</br>
                <b>Package</b></br>
                rpart;rpart.plot;partykit</br>
                <b>Help</b></br>
                help(rpart, package ='rpart')</br></br>
                <b>Description</b></br>
                Control for Rpart Fits. Various parameters that control aspects of the rpart fit.
                <br/>
                <b>Usage</b>
                <br/>
                <code> 
                rpart.control(minsplit = 20, minbucket = round(minsplit/3), cp = 0.01, 
                              maxcompete = 4, maxsurrogate = 5, usesurrogate = 2, xval = 10,
                              surrogatestyle = 0, maxdepth = 30, ...)
                </code> <br/>
                <b>Arguments</b><br/>
                <ul>
                <li>
                minsplit: the minimum number of observations that must exist in a node in order for a split to be attempted.
                </li>
                <li>
                minbucket: the minimum number of observations in any terminal <leaf> node. If only one of minbucket or minsplit is specified, the code either sets minsplit to minbucket*3 or minbucket to minsplit/3, as appropriate.
                </li>
                <li>
                cp: complexity parameter. Any split that does not decrease the overall lack of fit by a factor of cp is not attempted. For instance, with anova splitting, this means that the overall R-squared must increase by cp at each step. The main role of this parameter is to save computing time by pruning off splits that are obviously not worthwhile. Essentially,the user informs the program that any split which does not improve the fit by cp will likely be pruned off by cross-validation, and that hence the program need not pursue it.
                </li>
                <li>
                maxcompete: the number of competitor splits retained in the output. It is useful to know not just which split was chosen, but which variable came in second, third, etc.
                </li>
                <li>
                maxsurrogate: the number of surrogate splits retained in the output. If this is set to zero the compute time will be reduced, since approximately half of the computational time (other than setup) is used in the search for surrogate splits.
                </li>
                <li>
                usesurrogate: how to use surrogates in the splitting process. 0 means display only; an observation with a missing value for the primary split rule is not sent further down the tree. 1means use surrogates, in order, to split subjects missing the primary variable; if all surrogates are missing the observation is not split. For value 2 ,if all surrogates are missing, then send the observation in the majority direction. A value of 0 corresponds to the action of tree, and 2 to the recommendations of Breiman et.al (1984).
                </li>
                <li>
                xval: number of cross-validations.
                </li>
                <li>
                surrogatestyle: controls the selection of a best surrogate. If set to 0 (default) the program uses the total number of correct classification for a potential surrogate variable, if set to 1 it uses the percent correct, calculated over the non-missing values of the surrogate. The first option more severely penalizes covariates with a large number of missing values.
                </li>
                <li>
                maxdepth: Set the maximum depth of any node of the final tree, with the root node counted as depth 0. Values greater than 30 rpart will give nonsense results on 32-bit machines.
                </li>
                <li>
                ...: mop up other arguments.
                </li>
                </ul>
                <b>Value</b></br>
                A list containing the options. 
                      `}
    }
}

class decisionTrees extends baseModal {
    constructor() {
        var config = {
            id: "decisionTrees",
            label: localization.en.title,
            modalType: "two",
            splitProcessing: true,
            RCode: `
require(rpart)
require(rpart.plot)
require(partykit)
#Generate a new tree model if the model does not exist of the user has chosen the option to generate a model
if(!{{selected.TreeGenChkbox | safe}} || !exists("{{selected.TxtTreeName | safe}}"))
{
    {{selected.TxtTreeName | safe}} = rpart({{selected.dependent | safe}}~{{selected.independent | safe}}, data = {{dataset.name}}, control = rpart.control(minsplit={{selected.TxtMinSplit | safe}},{{ if (options.selected.minbucket=="")}}minbucket ={{selected.minBucket | safe}},{{/if}}maxdepth={{selected.maxDepth | safe}},cp ={{selected.TxtCP | safe}}))
}
#If the user selected the option to prune the tree, prune it
var ="{{selected.grp1 | safe}}"
if(var != "FALSE")
{
     if(var =='useOptimal')
     {
         bsky_tree = prune({{selected.TxtTreeName | safe}}, cp = {{selected.TxtTreeName | safe}}$cptable[which.min({{selected.TxtTreeName | safe}}$cptable[,"xerror"]),"CP"])
     } else 
     {
         # prune the tree with the complexity parameter (cp) that the user provided
         bsky_tree = prune({{selected.TxtTreeName | safe}}, cp = {{selected.TxtCPPrune | safe}})
     }
} else
{
    #Storing the model specified into bsky_tree for summaries below
    bsky_tree = {{selected.TxtTreeName | safe}}
}
if(var != "FALSE")
{
cat("Statistics for the pruned model are displayed")
}
BSkyFormat(bsky_tree$method, singleTableOutputHeader=c("Tree Type"))
BSkyFormat(as.data.frame(bsky_tree$control), singleTableOutputHeader=c("Control Parameters"))
BSkyFormat(as.data.frame(bsky_tree$cptable), singleTableOutputHeader=c("CP Table"))
BSkyFormat(as.data.frame(bsky_tree$variable.importance), singleTableOutputHeader=c("Variable Importance"))
if({{selected.PlotCVChkbox | safe}})  
{ 
    plotcp(bsky_tree, sub ="Plot of the Complexity Parameter table")  
}
if({{selected.PlotRSQRChkbox | safe}}) 
{ 
    #plot cp table
    rsq.rpart(bsky_tree) 
}
#appropriate for the "anova" method                     
BSkytmp = rpart.plot( {{selected.TxtTreeName | safe}}, type = 5, main="Decision Tree Diagram", roundint = FALSE) 
#Adding attributes to support scoring
#We don't add dependent and independent variables as this is handled by our functions
attr(.GlobalEnv\${{selected.TxtTreeName | safe}},"classDepVar")= class({{dataset.name}}[, c("{{selected.dependent | safe}}")])
attr(.GlobalEnv\${{selected.TxtTreeName | safe}},"depVarSample")= sample({{dataset.name}}[, c("{{selected.dependent | safe}}")], size = 2, replace = TRUE)
rm(bsky_tree)
#Useful commands
#plot(bsky_tree)
#Summarize the model
#summary(bsky_tree)
#Print the cp table
#printcp(bsky_tree)
`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            TxtTreeName: {
                el: new input(config, {
                    no: 'TxtTreeName',
                    label: localization.en.TxtTreeName,
                    placeholder: "",
                    extraction: "TextAsIs",
                    value: "treeModel1",
                    overwrite: "dataset"
                })
            },
            TreeGenChkbox: {
                el: new checkbox(config, {
                    label: localization.en.TreeGenChkbox, no: "TreeGenChkbox",
                    true_value: "TRUE",
                    style: "mt-2 mb-3",
                    false_value: "FALSE",
                    extraction: "Boolean"
                })
            },
            dependent: {
                el: new dstVariable(config, {
                    label: localization.en.dependent,
                    no: "dependent",
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            independent: {
                el: new dstVariableList(config, {
                    label: localization.en.independent,
                    no: "independent",
                    required: true,
                    filter: "String|Numeric|Date|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UsePlus",
                }), r: ['{{ var | safe}}']
            },
            TxtMinSplit: {
                el: new inputSpinner(config, {
                    no: 'TxtMinSplit',
                    label: localization.en.TxtMinSplit,
                    min: 0,
                    max: 9999999,
                    step: 1,
                    value: 20,
                    extraction: "NoPrefix|UseComma"
                })
            },
            minBucket: {
                el: new inputSpinner(config, {
                    no: 'minBucket',
                    label: localization.en.minBucket,
                    min: 0,
                    max: 9999999,
                    step: 1,
                    extraction: "NoPrefix|UseComma"
                })
            },
            TxtCP: {
                el: new inputSpinner(config, {
                    no: 'TxtCP',
                    label: localization.en.TxtCP,
                    min: 0,
                    max: 9999999,
                    step: 0.01,
                    value: 0.01,
                    extraction: "NoPrefix|UseComma"
                })
            },
            maxDepth: {
                el: new inputSpinner(config, {
                    no: 'maxDepth',
                    label: localization.en.maxDepth,
                    min: 0,
                    max: 9999999,
                    step: 1,
                    value: 30,
                    extraction: "NoPrefix|UseComma"
                })
            },
            radio1: {
                el: new radioButton(config, {
                    label: localization.en.rd0,
                    no: "grp1",
                    increment: "rd0",
                    value: "FALSE",
                    state: "checked",
                    ml: 4,
                    extraction: "ValueAsIs"
                })
            },
            radio2: {
                el: new radioButton(config, {
                    label: localization.en.rd1,
                    no: "grp1",
                    increment: "rd1",
                    value: "useOptimal",
                    state: "",
                    ml: 4,
                    extraction: "ValueAsIs"
                })
            },
            radio3: {
                el: new radioButton(config, {
                    label: localization.en.rd2,
                    no: "grp1",
                    increment: "rd2",
                    value: "TRUE",
                    state: "",
                    ml: 4,
                    required: true,
                    dependant_objects: ['TxtCPPrune'],
                    extraction: "ValueAsIs"
                })
            },
            input1: {
                el: new inputSpinner(config, {
                    no: 'TxtCPPrune',
                    label: localization.en.TxtCPPrune,
                    min: 0,
                    max: 9999999,
                    step: 0.01,
                    ml:3,
                    value: 0.01,
                    extraction: "NoPrefix|UseComma"
                })
            },
            PlotCVChkbox: {
                el: new checkbox(config, {
                    label: localization.en.PlotCVChkbox,
                    true_value: "TRUE",
                    false_value: "FALSE",
                    no: "PlotCVChkbox", 
                    extraction: "Boolean"
                })
            },
            PlotRSQRChkbox: {
                el: new checkbox(config, {
                    label: localization.en.PlotRSQRChkbox, 
                    no: "PlotRSQRChkbox",
                    true_value: "TRUE",
                    false_value: "FALSE",
                    extraction: "Boolean",
                })
            },
        };
        var plots = {
            el: new optionsVar(config, {
                no: "plots",
                name: "Plots",
                content: [
                    objects.PlotCVChkbox.el,
                    objects.PlotRSQRChkbox.el
                ]
            })
        };
        var prePruningOptions = {
            el: new optionsVar(config, {
                no: "prePruningOptions",
                name: "PrePruning",
                content: [
                    objects.TxtMinSplit.el,
                    objects.minBucket.el,
                    objects.TxtCP.el,
                    objects.maxDepth.el,
                ]
            })
        };
        var pruneTree = {
            el: new optionsVar(config, {
                no: "pruneTree",
                name: "Prune Tree",
                content: [
                    objects.radio1.el,
                    objects.radio2.el,
                    objects.radio3.el,
                    objects.input1.el
                ]
            })
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.TxtTreeName.el.content, objects.TreeGenChkbox.el.content, objects.dependent.el.content, objects.independent.el.content,],
            bottom: [prePruningOptions.el.content, pruneTree.el.content, plots.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-decision_tree",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new decisionTrees().render()