
var localization = {
    en: {
        title: "Extreme Gradient Boosting",
        navigation: "Extreme Gradient Boosting",
        label1: "DUMMY CODE FACTOR VARIABLES, SEE VARIABLES>COMPUTE>DUMMY CODE USE OPTION KEEP ALL LEVELS. FOR PREDICTING MULTIPLE CLASSES, READ HELP (CLICK  ? ICON ON DIALOG).",
        model: "Enter model name",
        dependentvar: "Dependent variable",
        independentvars: "Independent variable(s)",
        objective: "Objective",
        seed: "Set seed",
        nrounds: "Max no of boosting iterations",
        maxdepth: "Maximum depth",
        minchildweight: "Minimum child weight",
        maxdeltastep: "Maximum delta step",
        eta: "eta (learning rate)",
        gamma: "gamma",
        objective: "Objective",
        numclasses: "Number of classes. **Use only with multi:softmax and multi:softprob",
        basescore: "Base score",
        Verbose: "Verbose mode (0=Silent, 1=performance info, 2= other info)",
        printevery: "Print each n-th iteration evaluation messages when verbose > 0",
		OptvarTaskparam: "Task Parameters",
		OptvarAdvDiagnostics: "Advanced Diagnostics",
		OptvarTreeBoostparam: "Parameters for Tree Boosting",	
        help: {
            title: "Extreme Gradient Boosting",
            r_help: "help(xgboost, package ='xgboost')",
            body: `
                <b>Description</b></br>
                Create an eXtreme Gradient Boosting model
                <br/>
                <b>NOTE</b></br>
                1.For predicting dependent variable of type factor, you need to recode the dependent variable to a numeric with values starting from 0. For example, if there are 3 levels in the factor variable, the numeric variable will contain values 0,1,2.</br>
                See Data > Recode Variables. Alternately just convert the factor variable to numeric, typically the levels will get mapped to integers starting from 1 and subtract 1 from the resulting variable. This will give you a numeric variable with values starting from 0.</br>
                You also need to set the objective to multi:softmax (predicts classes) or multi:softprob (predicts probabilities) and enter the  number of classes in the number of classes textbox.</br>
                The number of classes must be entered only for multi:softmax and multi:softprob. Errors will be generated if number of classes is entered for the other objectives.</br>
                2. You need to dummy code independent factor variables, use 1-Hot encoding see Data > Compute Dummy Variables</br>
                3. A confusion matrix and ROC curve is not generated when the objective selected is one of reg:squarederror, reg:logistic, binary:logitraw and rank:pairwise as the predict function 
                does not return the class of the dependent variable. The numeric predictions (in the case of reg:squarederror), scores, ranks etc that the predict function returns are stored in the dataset. See help(predict.xgb.Booster) for more details</br>
                4. A confusion matrix is not generated when the objective selected is multi:softprob as the predict function returns the predicted probabilities and not the class of the dependent variable. The predicted probabilities are saved in the dataset and the ROC curve is generated. To see the confusion matrix, select multi:softmax as the objective.</br>
                5. A ROC curve is not generated when the objective of multi:softmax is selected as the predict function returns the class and not the predicted probabilities. To see the ROC curve select multi:softprob as the objective .</br>
                <br/>
                <b>Usage</b>
                <br/>
                <code> 
                xgboost(data = NULL, label = NULL, missing = NA, weight = NULL,
                  params = list(), nrounds, verbose = 1, print_every_n = 1L,
                  early_stopping_rounds = NULL, maximize = NULL, save_period = NULL,
                  save_name = "xgboost.model", xgb_model = NULL, callbacks = list(), ...)
                </code> <br/>
                <b>Arguments</b><br/>
                <ul>
                <li>
                params: the list of parameters. The complete list of parameters is available at http://xgboost.readthedocs.io/en/latest/parameter.html. Below is a shorter summary:<br/>
                </li>
                <li>
                1. General Parameters<br/>
                This dialog uses gbtree (tree booster)<br/>
                </li>
                <li>
                2. Booster Parameters<br/>
                2.1. Parameter for Tree Booster<br/>
                eta:  control the learning rate: scale the contribution of each tree by a factor of 0 < eta < 1 when it is added to the current approximation.<br/>
                Used to prevent overfitting by making the boosting process more conservative.<br/>
                Lower value for eta implies larger value for nrounds: low eta value means model more robust to overfitting but slower to compute. Default: 0.3<br/>
                gamma: minimum loss reduction required to make a further partition on a leaf node of the tree. the larger, the more conservative the algorithm will be.<br/>
                max_depth: maximum depth of a tree. Default: 6<br/>
                min_child_weight: minimum sum of instance weight (hessian) needed in a child. If the tree partition step results in a leaf node with the sum of instance weight less than min_child_weight, then the building process will give up further partitioning. In linear regression mode, this simply corresponds to minimum number of instances needed to be in each node. The larger, the more conservative the algorithm will be. Default: 1<br/>
                </li>
                <li>
                3. Task Parameters<br/>
                objective: specify the learning task and the corresponding learning objective, users can pass a self-defined function to it. The default objective options are below:<br/>
                reg:squarederror -Regression with squared loss (Default).<br/>
                reg:logistic logistic regression.<br/>
                binary:logistic -logistic regression for binary classification. Output probability.<br/>
                binary:logitraw -logistic regression for binary classification, output score before logistic transformation.<br/>
                num_class: set the number of classes. To use only with multiclass objectives.<br/>
                multi:softmax -set xgboost to do multiclass classification using the softmax objective. Class is represented by a number and should be from 0 to num_class - 1.<br/>
                multi:softprob -same as softmax, but prediction outputs a vector of ndata * nclass elements, which can be further reshaped to ndata, nclass matrix. The result contains predicted probabilities of each data point belonging to each class.<br/>
                rank:pairwise -set xgboost to do ranking task by minimizing the pairwise loss.<br/>
                base_score: the initial prediction score of all instances, global bias. Default: 0.5<br/>
                eval_metric: evaluation metrics for validation data. Users can pass a self-defined function to it. Default: metric will be assigned according to objective(rmse for regression,
                and error for classification, mean average precision for ranking). List is provided in detail section.<br/>
                data: training dataset. xgb.train accepts only an xgb.DMatrix as the input. xgboost, in addition, also accepts matrix, dgCMatrix, or name of a local data file.<br/>
                nrounds: max number of boosting iterations.<br/>
                verbose: If 0, xgboost will stay silent. If 1, it will print information about performance. If 2, some additional information will be printed out. Note that setting verbose > 0 automatically engages the cb.print.evaluation(period=1) callback function.<br/>
                print_every_n: Print each n-th iteration evaluation messages when verbose>0. Default is 1 which means all messages are printed. This parameter is passed to the cb.print.evaluation callback.<br/>
                label: vector of response values. Should not be provided when data is a local data file name or an xgb.DMatrix.<br/>
                missing: by default is set to NA, which means that NA values should be considered as 'missing' by the algorithm. Sometimes, 0 or other extreme value might be used to represent missing values. This parameter is only used when input is a dense matrix.<br/>
                </li>
                </ul>
                <b>Details</b></br>
                The evaluation metric is chosen automatically by Xgboost (according to the objective) when the eval_metric parameter is not provided.</br>
                User may set one or several eval_metric parameters. Note that when using a customized metric, only this single metric can be used. The following is the list of built-in metrics for which Xgboost provides optimized implementation:</br>
                rmse root mean square error. http://en.wikipedia.org/wiki/Root_mean_square_error</br>
                logloss negative log-likelihood. http://en.wikipedia.org/wiki/Log-likelihood</br>
                mlogloss multiclass logloss. http://wiki.fast.ai/index.php/Log_Loss</br>
                error Binary classification error rate. It is calculated as (# wrong cases) / (# all cases). By default, it uses the 0.5 threshold for predicted values to define negative and positive instances.</br>
                Different threshold (e.g., 0.) could be specified as "error@0."</br>
                merror Multiclass classification error rate. It is calculated as (# wrong cases) / (# all cases).</br>
                auc Area under the curve. http://en.wikipedia.org/wiki/Receiver_operating_characteristic#'Area_under_curve for ranking evaluation.</br>
                aucpr Area under the PR curve. https://en.wikipedia.org/wiki/Precision_and_recall for ranking evaluation.</br>
                ndcg Normalized Discounted Cumulative Gain (for ranking task). http://en.wikipedia.org/wiki/NDCG</br>
                </br>
                The following callbacks are automatically created when certain parameters are set:</br>
                cb.print.evaluation is turned on when verbose > 0; and the print_every_n parameter is passed to it.</br>
                cb.evaluation.log is on when watchlist is present.</br>
                cb.early.stop: when early_stopping_rounds is set.</br>
                cb.save.model: when save_period > 0 is set.</br></br>
                <b>Value</b></br>
                An object of class xgb.Booster with the following elements:</br>
                handle a handle (pointer) to the xgboost model in memory.</br>
                raw a cached memory dump of the xgboost model saved as R's raw type.</br>
                niter: number of boosting iterations.</br>
                evaluation_log: evaluation history stored as a data.table with the first column corresponding to iteration number and the rest corresponding to evaluation metrics' values. It is created by the cb.evaluation.log callback.</br>
                call: a function call.</br>
                params: parameters that were passed to the xgboost library. Note that it does not capture parameters changed by the cb.reset.parameters callback.</br>
                callbacks callback functions that were either automatically assigned or explicitly passed.</br>
                best_iteration: iteration number with the best evaluation metric value (only available with early stopping).</br>
                best_ntreelimit: the ntreelimit value corresponding to the best iteration, which could further be used in predict method (only available with early stopping).</br>
                best_score: the best evaluation metric value during early stopping. (only available with early stopping).</br>
                feature_names: names of the training dataset features (only when column names were defined in training data).</br>
                nfeatures: number of features in training data.</br>
                <b>References</b></br>
                Tianqi Chen and Carlos Guestrin, "XGBoost: A Scalable Tree Boosting System", 22nd SIGKDD Conference on Knowledge Discovery and Data Mining, 2016, https://arxiv.org/abs/1603.02754</br>
                <b>See Also</b></br>
                callbacks, predict.xgb.Booster, xgb.cv</br>
                <b>Examples</b></br>
                data(agaricus.train, package='xgboost')</br>
                data(agaricus.test, package='xgboost')</br>
                ## A simple xgb.train example:</br>
                # These functions could be used by passing them either:</br>
                ## An 'xgboost' interface example:</br>
                bst <- xgboost(data = agaricus.train$data, label = agaricus.train$label,
                               max_depth = 2, eta = 1, nthread = 2, nrounds = 2,
                               objective = "binary:logistic")</br>
                pred <- predict(bst, agaricus.test$data)</br>
                `}
    }
}

class extremeGradientBoosting extends baseModal {
    constructor() {
        var config = {
            id: "extremeGradientBoosting",
            label: localization.en.title,
            modalType: "two",
            RCode: `
require(xgboost);
require(ggplot2);
#Setting a seed
set.seed({{selected.seed | safe}})
#Creating the model
{{selected.model | safe}} <- xgboost::xgboost(data = as.matrix({{dataset.name}}[,c({{selected.independentvars | safe}})]), label = {{dataset.name}}\${{selected.dependentvar | safe}},  params = list(booster = "gbtree", objective = "{{selected.objective | safe}}", eta={{selected.eta | safe}}, gamma={{selected.gamma | safe}}, max_depth={{selected.maxdepth | safe}}, max_delta_step ={{selected.maxdeltastep | safe}}, min_child_weight={{selected.minchildweight | safe}}), nrounds={{selected.nrounds | safe}}, base_score={{selected.basescore | safe}}, verbose ={{selected.Verbose | safe}}, {{if (options.selected.numclasses !== "")}}  num_class= {{selected.numclasses | safe}}, {{/if}} print_every_n = {{selected.printevery | safe}})
#Variable importance
BSkyImpMatrix <- xgboost::xgb.importance (feature_names =c({{selected.independentvars | safe}}) ,model = {{selected.model | safe}})
#Graph the importance
print(xgb.ggplot.importance(importance_matrix = BSkyImpMatrix ) +ggtitle("Feature Importance Bar Plot") +labs(y="Importance(Gain)"))
#Importance in tabular format
BSkyFormat(as.data.frame(BSkyImpMatrix ),singleTableOutputHeader = "Feature Importance")
#Setting attributes to support scoring
attr(.GlobalEnv\${{selected.model | safe}},"depvar")="'{{selected.dependentvar | safe}}'"
attr(.GlobalEnv\${{selected.model | safe}},"indepvar")="c({{selected.independentvars | safe}})"
attr(.GlobalEnv\${{selected.model | safe}},"classDepVar")= class({{dataset.name}}[, c("{{selected.dependentvar | safe}}")])
attr(.GlobalEnv\${{selected.model | safe}},"depVarSample")= sample({{dataset.name}}[, c("{{selected.dependentvar | safe}}")], size = 2, replace = TRUE)
#Plot the tree
#xgboost::xgb.plot.tree(model={{selected.model | safe}})
rm(BSkyImpMatrix)
`
        };
        var objects = {
            label1: { el: new labelVar(config, { label: localization.en.label1, h: 6 }) },
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            model: {
                el: new input(config, {
                    no: 'model',
                    label: localization.en.model,
                    placeholder: "",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "xgboostModel",
                    overwrite: "dataset"
                })
            },
            dependentvar: {
                el: new dstVariable(config, {
                    label: localization.en.dependentvar,
                    no: "dependentvar",
                    filter: "Numeric|Scale",
                    extraction: "NoPrefix|UseComma",
                    // required:true,
                }), r: ['{{ var | safe}}']
            },
            independentvars: {
                el: new dstVariableList(config, {
                    label: localization.en.independentvars,
                    no: "independentvars",
                    //required:true,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
                }), r: ['{{ var | safe}}']
            },
            seed: {
                el: new inputSpinner(config, {
                    no: "seed",
                    label: localization.en.seed,
                    min: 0,
                    max: 999999999,
                    step: 1,
                    value: 12345,
                    extraction: "NoPrefix|UseComma"
                })
            },
            nrounds: {
                el: new inputSpinner(config, {
                    no: "nrounds",
                    label: localization.en.nrounds,
                    min: 0,
                    max: 10,
                    step: 1,
                    value: 5,
                    extraction: "NoPrefix|UseComma"
                })
            },
            maxdepth: {
                el: new advancedSlider(config, {
                    no: "maxdepth",
                    label: localization.en.maxdepth,
                    min: 0,
                    max: 10,
                    step: 1,
                    value: 6,
                    extraction: "NoPrefix|UseComma"
                })
            },
            minchildweight: {
                el: new advancedSlider(config, {
                    no: "minchildweight",
                    label: localization.en.minchildweight,
                    min: 0,
                    max: 10,
                    step: 1,
                    value: 1,
                    extraction: "NoPrefix|UseComma"
                })
            },
            maxdeltastep: {
                el: new advancedSlider(config, {
                    no: "maxdeltastep",
                    label: localization.en.maxdeltastep,
                    min: 0,
                    max: 10,
                    step: 1,
                    value: 1,
                    extraction: "NoPrefix|UseComma"
                })
            },
            eta: {
                el: new advancedSlider(config, {
                    no: "eta",
                    label: localization.en.eta,
                    min: 0,
                    max: 1,
                    step: 0.1,
                    value: 0.3,
                    extraction: "NoPrefix|UseComma"
                })
            },
            gamma: {
                el: new advancedSlider(config, {
                    no: "gamma",
                    label: localization.en.gamma,
                    min: 0,
                    max: 1,
                    step: 0.1,
                    value: 0,
                    extraction: "NoPrefix|UseComma"
                })
            },
            objective: {
                el: new comboBox(config, {
                    no: 'objective',
                    label: localization.en.objective,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["reg:squarederror", "reg:logistic", "binary:logistic", "binary:logitraw", "multi:softmax", "multi:softprob", "rank:pairwise"],
                    default: "reg:logistic"
                })
            },
            numclasses: {
                el: new inputSpinner(config, {
                    no: 'numclasses',
                    label: localization.en.numclasses,
                    min: 0,
                    max: 9999999,
                    step: 1,
                    extraction: "NoPrefix|UseComma"
                })
            },
            basescore: {
                el: new inputSpinner(config, {
                    no: "basescore",
                    label: localization.en.basescore,
                    min: 0,
                    max: 100,
                    step: 0.1,
                    value: 0.5,
                    extraction: "NoPrefix|UseComma"
                })
            },
            Verbose: {
                el: new comboBox(config, {
                    no: 'Verbose',
                    label: localization.en.Verbose,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["0", "1", "2"],
                    default: "0"
                })
            },
            printevery: {
                el: new comboBox(config, {
                    no: 'printevery',
                    label: localization.en.printevery,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["0", "1", "2"],
                    default: "0"
                })
            },
        };
        var taskParameters = {
            el: new optionsVar(config, {
                no: "taskParameters",
                name: localization.en.OptvarTaskparam,
                content: [
                    objects.objective.el,
                    objects.numclasses.el,
                    objects.basescore.el,
                ]
            })
        };
        var advanced = {
            el: new optionsVar(config, {
                no: "advanced",
                name: localization.en.OptvarAdvDiagnostics,
                content: [
                    objects.Verbose.el,
                    objects.printevery.el,
                ]
            })
        };
        var paramsTreeBoosting = {
            el: new optionsVar(config, {
                no: "paramsTreeBoosting",
                name: localization.en.OptvarTreeBoostparam,
                content: [
                    objects.maxdepth.el,
                    objects.minchildweight.el,
                    objects.maxdeltastep.el,
                    objects.eta.el,
                    objects.gamma.el,
                ]
            }
            )
        };
        const content = {
            head: [objects.label1.el.content],
            left: [objects.content_var.el.content],
            right: [objects.model.el.content, objects.dependentvar.el.content, objects.independentvars.el.content, objects.seed.el.content, objects.nrounds.el.content],
            bottom: [paramsTreeBoosting.el.content, taskParameters.el.content, advanced.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-xgb",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new extremeGradientBoosting().render()