/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */


var localization = {
    en: {
        title: "Multi-layer Perceptron, using RSNNS package",
        navigation: "Multi-layer Perceptron",
        label1: "PLEASE DUMMY CODE FACTOR VARIABLES, SEE DATA > COMPUTE DUMMY VARIABLES (KEEP ALL LEVELS A.K.A 1 HOT ENCODING). SCALE AND CENTER NUMERIC VARIABLES, SEE DATA > STANDARDIZE VARIABLES",
        model: "Enter a model name",
        dependentvar: "Dependent variable",
        independentvars: "Independent variable(s)",
        seed: "Set seed",
        iter: "Max iterations to learn",
        tf: "Learning function",
        label2: "No of hidden layers and the neurons per hidden layer",
        layers: "Specify the number of neurons in each layer, for example 1. For 5 neurons in 1 layer, enter 5 2. For 5 neurons in layer 1, 6 neurons in layer 2, 7 neurons in layer 3 enter 5,6,7",
        learnfuncparams: "Learning function parameters",
        help: {
            title: "Multi-layer Perceptron, using RSNNS package",
            r_help: "help(mlp, package ='RSNNS')",
            body: `
            <b>NOTE</b></br>
            When you specify a single dependent variable, it can be numeric or factor. If the dependent variable specified is a factor, we automatically dummy code the factor variable using one-hot Encoding using the decode function in the RSNNS package.</br></br>
            Additionally, if you are using one-hot encoding to dummy code a factor variable, you can specify more than one dependent variable in the dialog. In this case, the dependent variables must be of type numeric.</br></br>
            You can use "Data > Compute dummy variables", choose the “Keep all levels” setting to get one-hot encoding.</br></br>
            For dependent variables of type factor, we will display a confusion matrix, ROC and model accuracy statistics when scoring a dataset using the model built. The predictions generated are of type factor since we predict the class. These will be saved in the dataset along with the predicted probabilities when scoring.</br></br>
            When there are dummy coded dependent variables, we will not display a confusion matrix, ROC and model accuracy statistics when scoring a dataset using the model built. However, the predictions will be saved in the dataset when scoring the dataset. The predictions are the probabilities associated with the dummy coded dependent variables.</br></br>
            It usually best to standardize independent variables (they must be numeric, too) See “Data > Standardize Variables.”</br></br>
            If you have categorical independent variables, use one-hot encoding to dummy code the factor variables.</br></br>
            <b>Description</b></br>
            This function creates a multilayer perceptron (MLP) and trains it. MLPs are fully connected feedforward networks, and probably the most common network architecture in use. Training is usually performed by error backpropagation or a related procedure.</br>
            There are a lot of different learning functions present in SNNS that can be used together with this function, e.g., Std_Backpropagation, BackpropBatch, BackpropChunk, BackpropMomentum, BackpropWeightDecay, Rprop, Quickprop, SCG (scaled conjugate gradient), ...</br>
            <b>Usage</b>
            <br/>
            <code> 
            mlp(x, ...)<br/>
            ## Default S3 method:<br/>
            mlp(x, y, size = c(5), maxit = 100,
              initFunc = "Randomize_Weights", initFuncParams = c(-0.3, 0.3),
              learnFunc = "Std_Backpropagation", learnFuncParams = c(0.2, 0),
              updateFunc = "Topological_Order", updateFuncParams = c(0),
              hiddenActFunc = "Act_Logistic", shufflePatterns = TRUE,
              linOut = FALSE, outputActFunc = if (linOut) "Act_Identity" else
              "Act_Logistic", inputsTest = NULL, targetsTest = NULL,
              pruneFunc = NULL, pruneFuncParams = NULL, ...)
            </code> <br/>
            <b>Arguments</b><br/>
            <ul>
            <li>
            x: a matrix with training inputs for the network
            </li>
            <li>
            ... : additional function parameters (currently not used)
            </li>
            <li>
            y: the corresponding targets values
            </li>
            <li>
            size: number of units in the hidden layer(s)
            </li>
            <li>
            maxit: maximum of iterations to learn
            </li>
            <li>
            initFunc: the initialization function to use
            </li>
            <li>
            initFuncParams: the parameters for the initialization function
            </li>
            <li>
            learnFunc: the learning function to use
            </li>
            <li>
            learnFuncParams: the parameters for the learning function
            </li>
            <li>
            updateFunc: the update function to use
            </li>
            <li>
            updateFuncParams: the parameters for the update function
            </li>
            <li>
            hiddenActFunc: the activation function of all hidden units
            </li>
            <li>
            shufflePatterns: should the patterns be shuffled?
            </li>
            <li>
            linOut: sets the activation function of the output units to linear or logistic (ignored if outputActFunc is given)
            </li>
            <li>
            outputActFunc: the activation function of all output units
            </li>
            <li>
            inputsTest: a matrix with inputs to test the network
            </li>
            <li>
            targetsTest: the corresponding targets for the test input
            </li>
            <li>
            pruneFunc: the pruning function to use
            </li>
            <li>
            pruneFuncParams: the parameters for the pruning function. Unlike the other functions, these have to be given in a named list. See the pruning demos for further explanation.
            </li>
            </ul>
            <b>Details</b></br>
            Std_Backpropagation, BackpropBatch, e.g., have two parameters, the learning rate and the maximum output difference. The learning rate is usually a value between 0.1 and 1. It specifies the gradient descent step width. The maximum difference defines, how much difference between output and target value is treated as zero error, and not backpropagated. This parameter is used to prevent overtraining. For a complete list of the parameters of all the learning functions, see the SNNS User Manual, pp. 67.</br>
            The defaults that are set for initialization and update functions usually don't have to be changed.</br>
            <b>Value</b><br/>
            an rsnns object.
            <b>References</b><br/>
            Rosenblatt, F. (1958), 'The perceptron: A probabilistic model for information storage and organization in the brain', Psychological Review 65(6), 386–408.<br/>
            Rumelhart, D. E.; Clelland, J. L. M. & Group, P. R. (1986), Parallel distributed processing :explorations in the microstructure of cognition, Mit, Cambridge, MA etc.<br/>
            Zell, A. et al. (1998), 'SNNS Stuttgart Neural Network Simulator User Manual, Version 4.2', IPVR, University of Stuttgart and WSI, University of Tübingen.<br/> http://www.ra.cs.uni-tuebingen.de/SNNS/welcome.html<br/>
            Zell, A. (1994), Simulation Neuronaler Netze, Addison-Wesley. (in German)<br/>
            <b>Examples</b><br/>
            <code> 
            data(iris)<br/>
            #shuffle the vector<br/>
            iris <- iris[sample(1:nrow(iris),length(1:nrow(iris))),1:ncol(iris)]<br/>
            irisValues <- iris[,1:4]<br/>
            irisTargets <- decodeClassLabels(iris[,5])<br/>
            #irisTargets <- decodeClassLabels(iris[,5], valTrue=0.9, valFalse=0.1)<br/>
            iris <- splitForTrainingAndTest(irisValues, irisTargets, ratio=0.15)<br/>
            iris <- normTrainingAndTestSet(iris)<br/>
            model <- mlp(iris$inputsTrain, iris$targetsTrain, size=5, learnFuncParams=c(0.1),
                          maxit=50, inputsTest=iris$inputsTest, targetsTest=iris$targetsTest)<br/>
            summary(model)<br/>
            model<br/>
            weightMatrix(model)<br/>
            extractNetInfo(model)<br/>
            par(mfrow=c(2,2))<br/>
            plotIterativeError(model)<br/>
            predictions <- predict(model,iris$inputsTest)<br/>
            plotRegressionError(predictions[,2], iris$targetsTest[,2])<br/>
            confusionMatrix(iris$targetsTrain,fitted.values(model))<br/>
            confusionMatrix(iris$targetsTest,predictions)<br/>
            plotROC(fitted.values(model)[,2], iris$targetsTrain[,2])<br/>
            plotROC(predictions[,2], iris$targetsTest[,2])<br/>
            #confusion matrix with 402040-method<br/>
            confusionMatrix(iris$targetsTrain, encodeClassLabels(fitted.values(model),
                                                                   method="402040", l=0.4, h=0.6))<br/>
            </code> <br/>
            <b>Package</b></br>
            RSNNS;NeuralNetTools</br>
            <b>Help</b></br>
            For detailed help click on the R icon on the top right hand side of this dialog overlay or run the following command in the R syntax editor</br>
            help(mlp, package ='RSNNS')
			`}
    }
}

class multiLayerPerceptron extends baseModal {
    constructor() {
        var config = {
            id: "multiLayerPerceptron",
            label: localization.en.title,
            modalType: "two",
            RCode: `
require(RSNNS);
require(NeuralNetTools);
#Setting a seed
set.seed({{selected.seed | safe}})
#Creating the model
if ( class({{dataset.name}}[, c({{selected.dependentvar | safe}})]) == "factor")
{
    {{selected.model | safe}}<-mlp( x={{dataset.name}}[, c({{selected.independentvars | safe}})], y=RSNNS::decodeClassLabels({{dataset.name}}[, c({{selected.dependentvar | safe}})]), size = {{selected.layers | safe}}, maxit = {{selected.iter | safe}},
    learnFunc = "{{selected.tf | safe}}" {{if (options.selected.learnfuncparams !== "")}}, learnFuncParams = c({{selected.learnfuncparams | safe}}) {{/if}})
} else
{
    {{selected.model | safe}}<-mlp( x={{dataset.name}}[, c({{selected.independentvars | safe}})], y={{dataset.name}}[, c({{selected.dependentvar | safe}})], size = {{selected.layers | safe}}, maxit = {{selected.iter | safe}},
    learnFunc = "{{selected.tf | safe}}" {{if (options.selected.learnfuncparams !== "")}}, learnFuncParams = c({{selected.learnfuncparams | safe}}) {{/if}})
}
local({
    #Summarizing the model
    BSkyRes<-summary({{selected.model | safe}})
    #Extracting and displaying model information
    BSkyInfo<-extractNetInfo({{selected.model | safe}})
    BSkyFormat(BSkyInfo)
    #Plotting the neural net
    NeuralNetTools::plotnet({{selected.model | safe}})
    #Setting attributes to support scoring
    attr(.GlobalEnv\${{selected.model | safe}},"depvar")="{{selected.dependentvar | safe}}"
    attr(.GlobalEnv\${{selected.model | safe}},"indepvar")="{{selected.independentvars | safe}}"
    attr(.GlobalEnv\${{selected.model | safe}},"classDepVar")= class({{dataset.name}}[, c({{selected.dependentvar | safe}})])
    attr(.GlobalEnv\${{selected.model | safe}},"depVarSample")= sample({{dataset.name}}[, c({{selected.dependentvar | safe}})], size = 2, replace = TRUE)
})
`
        }
        var objects = {
            label1: { el: new labelVar(config, { label: localization.en.label1, h: 6 }) },
            content_var: { el: new srcVariableList(config, {action: "move"}) },
            model: {
                el: new input(config, {
                    no: 'model',
                    label: localization.en.model,
                    placeholder: "",
                    value: "mlp1",
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
                    filter: "Numeric|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
                    required: true,
                }), r: ['{{ var | safe}}']
            },
            independentvars: {
                el: new dstVariableList(config, {
                    label: localization.en.independentvars,
                    no: "independentvars",
                    filter: "Numeric|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
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
                    step: 100,
                    value: 100,
                    extraction: "NoPrefix|UseComma"
                })
            },
            tf: {
                el: new comboBox(config, {
                    no: 'tf',
                    label: localization.en.tf,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    default: "Std_Backpropagation",
                    options: ["Std_Backpropagation", "BackpropBatch", "BackpropChunk", "BackpropMomentum", "BackpropWeightDecay", "Rprop", "Quickprop", "SCG"]
                })
            },
            label2: { el: new labelVar(config, { label: localization.en.label2, style: "mt-4",h: 6 }) },
            layers: {
                el: new input(config, {
                    no: "layers",
                    label: localization.en.layers,
                    allow_spaces:true,
                    placeholder: "",
                    extraction: "TextAsIs",
                    value: 5,
                    wrapped: 'c(%val%)',
                    required: true,
                })
            },
            learnfuncparams: {
                el: new input(config, {
                    no: "learnfuncparams",
                    allow_spaces:true,
                    label: localization.en.learnfuncparams,
                    placeholder: "",
                    extraction: "TextAsIs",
                    value: "",
                })
            },
        }
        const content = {
            head: [objects.label1.el.content],
            left: [objects.content_var.el.content],
            right: [objects.model.el.content, objects.dependentvar.el.content, objects.independentvars.el.content,],
            bottom: [objects.seed.el.content, objects.iter.el.content, objects.tf.el.content, objects.label2.el.content, objects.layers.el.content, objects.learnfuncparams.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-mlp",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new multiLayerPerceptron().render()