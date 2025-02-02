
var localization = {
    en: {
        title: "Training Neuralnets, using neuralnet package",
        navigation: "Neuralnets",
        label1: "PLEASE DUMMY CODE FACTOR VARIABLES, SEE DATA > COMPUTE DUMMY VARIABLES (KEEP ALL LEVELS A.K.A 1 HOT ENCODING). SCALE AND CENTER NUMERIC VARIABLES, SEE DATA > STANDARDIZE VARIABLES",
        model: "Enter a model name",
        dependentvar: "Dependent variable",
        independentvars: "Independent variable(s)",
        seed: "Set seed",
        iter: "Max steps for learning",
        tf: "Algorithm",
        threshold: "Threshold",
        label2: "No of hiddden layers and the neurons per hidden layer",
        layers: "Specify the number of neurons in each layer, for example 1. For 5 neurons in 1 layer, enter 5 2. For 5 neurons in layer 1, 6 neurons in layer 2, 7 neurons in layer 3 enter 5,6,7",
        OutActFunc: "Specify an output activation function",
        rep: "Repetitions for neural network training",
        label3: "Multiplication factors for upper and lower learning rate",
        minus: "Upper (minus)",
        upper: "Lower (plus)",
        lifesign: "Setting of how much to print during calculation of the neural net",
        lifesignstep: "Stepsize to print the minimal threshold in full lifesign mode",
        errfct: "Differentiable function used for calculation of the error",
        linearoutput: "Activation function should not be applied to the output neurons",
        likelihood: "Likelihood",
		advanced_lbl: "Advanced",
        help: {
            title: "Training Neuralnets, using neuralnet package",
            r_help: "help(neuralnet, package='neuralnet')",
            body: `
            <b>NOTE</b></br>
            When specifying a singe dependent variable, it  can be numeric or factor. If the dependent variable specified is a factor, we automatically dummy code the factor variable using one-hot Encoding using the decode function in the RSNNS package.</br></br>
            Additionally, if you are using one-hot encoding to dummy code a factor variable, you can specify more than one dependent variable in the dialog. In this case, the dependent variables must be of type numeric.</br></br>
            You can use "Data > Compute dummy variables", choose the “Keep all levels” setting to get one-hot encoding.</br></br>
            For dependent variables of type factor, we will display a confusion matrix, ROC and model accuracy statistics when scoring a dataset using the model built. The predictions generated are of type factor since we predict the class. These will be saved in the dataset along with the predicted probabilities when scoring.</br></br>
            When there are dummy coded dependent variables, we will not display a confusion matrix, ROC and model accuracy statistics when scoring a dataset using the model built. However, the predictions will be saved in the dataset when scoring the dataset. The predictions are the probabilities associated with the dummy coded dependent variables.</br></br>
            It usually best to standardize independent variables (they must be numeric, too) See “Data > Standardize Variables.”</br></br>
            If you have categorical independent variables, use one-hot encoding to dummy code the factor variables.</br></br>
            <b>Description</b></br>
            Train neural networks using backpropagation, resilient backpropagation (RPROP) with (Riedmiller, 1994) or without weight backtracking (Riedmiller and Braun, 1993) or the modified globally convergent version (GRPROP) by Anastasiadis et al. (2005). The function allows flexible settings through custom-choice of error and activation function. Furthermore, the calculation of generalized weights (Intrator O. and Intrator N., 1993) is implemented.
            <b>Usage</b>
            <br/>
            <code> 
            neuralnet(formula, data, hidden = 1, threshold = 0.01,
              stepmax = 1e+05, rep = 1, startweights = NULL,
              learningrate.limit = NULL, learningrate.factor = list(minus = 0.5,
              plus = 1.2), learningrate = NULL, lifesign = "none",
              lifesign.step = 1000, algorithm = "rprop+", err.fct = "sse",
              act.fct = "logistic", linear.output = TRUE, exclude = NULL,
              constant.weights = NULL, likelihood = FALSE)
            </code> <br/>
            <b>Arguments</b><br/>
            <ul>
            <li>
            formula: a symbolic description of the model to be fitted.
            </li>
            <li>
            data: a data frame containing the variables specified in formula.
            </li>
            <li>
            hidden: a vector of integers specifying the number of hidden neurons (vertices) in each layer.
            </li>
            <li>
            threshold: a numeric value specifying the threshold for the partial derivatives of the error function as stopping criteria.
            </li>
            <li>
            stepmax: the maximum steps for the training of the neural network. Reaching this maximum leads to a stop of the neural network's training process.
            </li>
            <li>
            rep: the number of repetitions for the neural network's training.
            </li>
            <li>
            startweights: a vector containing starting values for the weights. Set to NULL for random initialization.
            </li>
            <li>
            learningrate.limit: a vector or a list containing the lowest and highest limit for the learning rate. Used only for RPROP and GRPROP.</li>
            <li>
            learningrate.factor: a vector or a list containing the multiplication factors for the upper and lower learning rate. Used only for RPROP and GRPROP.
            </li>
            <li>
            learningrate: a numeric value specifying the learning rate used by traditional backpropagation. Used only for traditional backpropagation.
            </li>
            <li>
            lifesign: a string specifying how much the function will print during the calculation of the neural network. 'none', 'minimal' or 'full'.
            </li>
            <li>
            lifesign.step: an integer specifying the stepsize to print the minimal threshold in full lifesign mode.
            </li>
            <li>
            algorithm: a string containing the algorithm type to calculate the neural network. The following types are possible: 'backprop', 'rprop+', 'rprop-', 'sag', or 'slr'. 'backprop' refers to backpropagation, 'rprop+' and 'rprop-' refer to the resilient backpropagation with and without weight backtracking, while 'sag' and 'slr' induce the usage of the modified globally convergent algorithm (grprop). See Details for more information.
            </li>
            <li>
            err.fct: a differentiable function that is used for the calculation of the error. Alternatively, the strings 'sse' and 'ce' which stand for the sum of squared errors and the cross-entropy can be used.
            </li>
            <li>
            act.fct: a differentiable function that is used for smoothing the result of the cross product of the covariate or neurons and the weights. Additionally the strings, 'logistic' and 'tanh' are possible for the logistic function and tangent hyperbolicus.
            </li>
            <li>
            linear.output: logical. If act.fct should not be applied to the output neurons set linear output to TRUE, otherwise to FALSE.
            </li>
            <li>
            exclude: a vector or a matrix specifying the weights, that are excluded from the calculation. If given as a vector, the exact positions of the weights must be known. A matrix with n-rows and 3 columns will exclude n weights, where the first column stands for the layer, the second column for the input neuron and the third column for the output neuron of the weight.
            </li>
            <li>
            constant.weights: a vector specifying the values of the weights that are excluded from the training process and treated as fix.
            </li>
            <li>
            likelihood: logical. If the error function is equal to the negative log-likelihood function, the information criteria AIC and BIC will be calculated. Furthermore the usage of confidence.interval is meaningful.
            </li>
            </ul>
            <b>Details</b><br/>
            The globally convergent algorithm is based on the resilient backpropagation without weight backtracking and additionally modifies one learning rate, either the learningrate associated with the smallest absolute gradient (sag) or the smallest learningrate (slr) itself. The learning rates in the grprop algorithm are limited to the boundaries defined in learningrate.limit.
            ​<b>Value</b><br/>
            neuralnet returns an object of class nn. An object of class nn is a list containing at most the following components:<br/>
            call: the matched call.<br/>
            response: extracted from the data argument.<br/>
            covariate: the variables extracted from the data argument.<br/>
            model.list: a list containing the covariates and the response variables extracted from the formula argument.<br/>
            err.fct: the error function.<br/>
            act.fct: the activation function.<br/>
            data: the data argument.<br/>
            net.result: a list containing the overall result of the neural network for every repetition.<br/>
            weights: a list containing the fitted weights of the neural network for every repetition.<br/>
            generalized.weights: a list containing the generalized weights of the neural network for every repetition.<br/>
            result.matrix: a matrix containing the reached threshold, needed steps, error, AIC and BIC (if computed) and weights for every repetition. Each column represents one repetition.<br/>
            startweights: a list containing the startweights of the neural network for every repetition.<br/>
            ​<b>Examples</b><br/>
            <code> 
            ​library(neuralnet)
            ​# Binary classification
            nn <- neuralnet(Species == "setosa" ~ Petal.Length + Petal.Width, iris, linear.output = FALSE)
            ## Not run: print(nn)
            ## Not run: plot(nn)
            # Multiclass classification
            nn <- neuralnet(Species ~ Petal.Length + Petal.Width, iris, linear.output = FALSE)
            ## Not run: print(nn)
            ## Not run: plot(nn)
            # Custom activation function
            softplus <- function(x) log(1 + exp(x))
            nn <- neuralnet((Species == "setosa") ~ Petal.Length + Petal.Width, iris, 
                            linear.output = FALSE, hidden = c(3, 2), act.fct = softplus)
            ## Not run: print(nn)
            ## Not run: plot(nn)
            </code> <br/>
            <b>Package</b></br>
            neuralnet;NeuralNetTools</br>
            <b>Help</b></br>
            For detailed help click on the R icon on the top right hand side of this dialog overlay or run the following command in the R syntax editor</br>
            help(neuralnet, package='neuralnet')
			`}
    }
}

class neuralNets extends baseModal {
    constructor() {
        var config = {
            id: "neuralNets",
            label: localization.en.title,
            modalType: "two",
            RCode: `
require(neuralnet);
require(NeuralNetTools);
#Setting a seed
set.seed({{selected.seed | safe}})
#Creating the model
{{selected.model | safe}}<-neuralnet::neuralnet( formula={{selected.dependentvar | safe}} ~ {{selected.independentvars | safe}}, data = {{dataset.name}}, hidden = c({{selected.layers | safe}}),threshold ={{selected.threshold | safe}},  stepmax = {{selected.iter | safe}}, rep ={{selected.rep | safe}}, algorithm= "{{selected.tf | safe}}",learningrate.factor = list(minus = {{selected.minus | safe}}, plus = {{selected.upper | safe}}),lifesign = '{{selected.lifesign | safe}}', lifesign.step = {{selected.lifesignstep | safe}}, err.fct = '{{selected.errfct | safe}}', act.fct = '{{selected.OutActFunc | safe}}', linear.output = {{selected.linearoutput | safe}},  likelihood = {{selected.likelihood | safe}})
if (!is.null({{selected.model | safe}}))
{
    #Plotting the model
    NeuralNetTools::plotnet({{selected.model | safe}})
    plot({{selected.model | safe}},rep="best")
    #Listing weights
    NeuralNetTools::neuralweights({{selected.model | safe}})
    #Setting attributes to support scoring
    attr(.GlobalEnv\${{selected.model | safe}},"depvar")="'{{selected.dependentvar | safe }}'"
    attr(.GlobalEnv\${{selected.model | safe}},"indepvar")=paste(stringr::str_split("{{selected.independentvars}}",fixed("+")),sep=",", collapse="")
    attr(.GlobalEnv\${{selected.model | safe}},"classDepVar")= class({{dataset.name}}[, c("{{selected.dependentvar | safe}}")])
    attr(.GlobalEnv\${{selected.model | safe}},"depVarSample")= sample({{dataset.name}}[, c("{{selected.dependentvar | safe}}")], size = 2, replace = TRUE)
}
`
        }
        var objects =
        {
            label1: { el: new labelVar(config, { label: localization.en.label1, h: 6 }) },
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            model: {
                el: new input(config, {
                    no: 'model',
                    label: localization.en.model,
                    placeholder: "",
                    extraction: "NoPrefix|UseComma",
                    required: true,
                    type: "character",
                    overwrite: "dataset"
                })
            },
            dependentvar: {
                el: new dstVariableList(config, {
                    label: localization.en.dependentvar,
                    no: "dependentvar",
                    filter: "Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UsePlus",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            independentvars: {
                el: new dstVariableList(config, {
                    label: localization.en.independentvars,
                    no: "independentvars",
                    filter: "Numeric|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UsePlus",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            seed: {
                el: new inputSpinner(config, {
                    no: "seed",
                    label: localization.en.seed,
                    min: 0,
                    max: 100000000000,
                    step: 1,
                    value: 12345,
                    extraction: "NoPrefix|UseComma"
                })
            },
            iter: {
                el: new inputSpinner(config, {
                    no: "iter",
                    label: localization.en.iter,
                    min: 0,
                    max: 100000000000,
                    step: 1000,
                    value: 10000,
                    extraction: "NoPrefix|UseComma"
                })
            },
            tf: {
                el: new comboBox(config, {
                    no: 'tf',
                    label: localization.en.tf,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    default: "rprop+",
                    options: ["rprop+", "rprop-", "sag", "slr",]
                })
            },
            threshold: {
                el: new inputSpinner(config, {
                    no: "threshold",
                    label: localization.en.threshold,
                    min: 0,
                    max: 100000000000,
                    step: 0.01,
                    value: 0.01,
                    extraction: "NoPrefix|UseComma"
                })
            },
            label2: { el: new labelVar(config, { label: localization.en.label2, style: "mt-4", h: 6 }) },
            layers: {
                el: new input(config, {
                    no: "layers",
                    allow_spaces:true,
                    label: localization.en.layers,
                    placeholder: "",
                    extraction: "TextAsIs",
                    value: 5,
                    required: true,
                })
            },
            OutActFunc: {
                el: new comboBox(config, {
                    no: "OutActFunc",
                    label: localization.en.OutActFunc,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    default: "logistic",
                    options: ["logistic", "tanh"]
                })
            },
            rep: {
                el: new inputSpinner(config, {
                    no: "rep",
                    label: localization.en.rep,
                    min: 1,
                    max: 99999999,
                    step: 100,
                    value: 1,
                    extraction: "NoPrefix|UseComma"
                })
            },
            label3: { el: new labelVar(config, { no: 'label3', label: localization.en.label3, style:"mt-3",h: 6 }) },
            minus: {
                el: new inputSpinner(config, {
                    no: "minus",
                    label: localization.en.minus,
                    min: 0,
                    max: 10000000000,
                    step: 0.1,
                    value: 0.5,
                    extraction: "NoPrefix|UseComma"
                })
            },
            upper: {
                el: new inputSpinner(config, {
                    no: "upper",
                    label: localization.en.upper,
                    min: 0,
                    max: 99999999,
                    step: 0.1,
                    value: 1.2,
                    extraction: "NoPrefix|UseComma"
                })
            },
            lifesign: {
                el: new comboBox(config, {
                    no: 'lifesign',
                    label: localization.en.lifesign,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["none", "minimal", "full"],
                    default: "none"
                })
            },
            lifesignstep: {
                el: new inputSpinner(config, {
                    no: "lifesignstep",
                    label: localization.en.lifesignstep,
                    min: 1,
                    max: 9999999999,
                    step: 1000,
                    value: 1000,
                    extraction: "NoPrefix|UseComma"
                })
            },
            errfct: {
                el: new comboBox(config, {
                    no: "errfct",
                    label: localization.en.errfct,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["sse", "ce"],
                    default: "sse"
                })
            },
            linearoutput: {
                el: new comboBox(config, {
                    no: "linearoutput",
                    label: localization.en.linearoutput,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["TRUE", "FALSE"],
                    default: "TRUE"
                })
            },
            likelihood: {
                el: new comboBox(config, {
                    no: "likelihood",
                    label: localization.en.likelihood,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["TRUE", "FALSE"],
                    default: "FALSE"
                }
                )
            },
        };
        var advanced = {
            el: new optionsVar(config, {
                no: "advanced",
                name: localization.en.advanced_lbl,
                content: [
                    objects.rep.el,
                    objects.label3.el,
                    objects.minus.el,
                    objects.upper.el,
                    objects.lifesign.el,
                    objects.lifesignstep.el,
                    objects.errfct.el,
                    objects.linearoutput.el,
                    objects.likelihood.el,
                ]
            })
        };
        const content = {
            head: [objects.label1.el.content],
            left: [objects.content_var.el.content],
            right: [objects.model.el.content, objects.dependentvar.el.content, objects.independentvars.el.content,],
            bottom: [objects.seed.el.content, objects.iter.el.content, objects.threshold.el.content, objects.tf.el.content, objects.label2.el.content, objects.layers.el.content, objects.OutActFunc.el.content, advanced.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-brain",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new neuralNets().render()