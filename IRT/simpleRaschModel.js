
var localization = {
    en: {
        title: "Simple Rasch Model",
        navigation: "Simple Rasch Model",
        modelname: "Enter model name",
        destinationvars: "Desitination variable(s)",
        estimationlbl: "Estimation",
        rad1: "Use CML estimation",
        chk1: "Compute standardized error",
        chk2: "Normalize parameters to sum (0)",
        rad2: "Use MML estimation",
        help: {
            title: "Simple Rasch Model",
            r_help: "help(RM, package='eRm')",
            body: `
            <b>Description</b>
            <br/>
            Creates a Simple Rasch model using CML or MML estimation.
            <br/><br/>
            For CML estimation, we invoke eRm::RM to compute the parameter estimates of a Rasch model for binary item responses by using CML estimation.
            <br/><br/>
            For MML estimation, we invoke TAM::tam.mml to generate parameter estimates of a uni-dimensional  model 
            <br/><br/>
            <b>Usage for CML estimation</b>
            <br/>
            <code>
            eRm::RM(X, se = TRUE, sum0 = TRUE, etaStart) 
            </code>
            <br/><br/>
            <b>Arguments</b>
            <br/>          
            <ul>
            <li>
            X:  Input 0/1 data matrix or data frame; rows represent individuals, columns represent items. Missing values are inserted as NA.
            </li>
            <li>
            W:  Design matrix for the Rasch model. If omitted, the function will compute W automatically.
            </li>
            <li>
            se: If TRUE, the standard errors are computed.
            </li>
            <li>
            sum0: If TRUE, the parameters are normed to sum-0 by specifying an appropriate W. If FALSE, the first parameter is restricted to 0.
            </li>
            <li>
            etaStart: A vector of starting values for the eta parameters can be specified. If missing, the 0-vector is used.
            </li>
            </ul>
            <br/><br/><br/>
            <b>Usage for MML estimation</b>
            <br/>
            <code>
            tam.mml(resp,verbose=FALSE )
            </code>
            <br/><br/>
            <b>Arguments</b>
            <br/>             
            <ul>
            <li>
            resp: Data frame with polytomous item responses k=0,...,K. Missing responses must be declared as NA.
            </li>
            <li>
            irtmodel: For fixed item slopes (in tam.mml) options include PCM (partial credit model), PCM2 (partial credit model with ConQuest parametrization 'item+item*step' and RSM (rating scale model; the ConQuest parametrization 'item+step'). 
            <br/>
            For estimated item slopes (only available in tam.mml.2pl) options are 2PL (all slopes of item categories are estimated; Nominal Item Response Model), GPCM (generalized partial credit model in which every item gets one and only slope parameter per dimension) and 2PL.groups (subsets of items get same item slope estimates) and a design matrix E on item slopes in the generalized partial credit model (GPCM.design, see Examples). Note that item slopes cannot be estimated with faceted designs using the function tam.mml.mfr. However, it is easy to use pre-specified design matrices and apply some restrictions to tam.mml.2pl
            </li>
            <li>
            verbose: Logical indicating whether output should be printed during iterations. 
            </li>
            </ul>
            <br/><br/>
            <b>Packages</b>
            <br/>
            TAM, eRm
            <br/><br/>            
            <b>Help</b>
            <br/>
            help(RM, package='eRm')
            <br/>
            help(tam.mml, package='TAM')
`}
    }
}

class simpleRaschModel extends baseModal {
    constructor() {
        var config = {
            id: "simpleRaschModel",
            label: localization.en.title,
            modalType: "two",
            RCode: `
require(eRm);
require(TAM);
if (!validateDataRasch( vars =c({{selected.destinationvars | safe}}), data ="{{dataset.name}}"))
{
    cat("\nAll variables being analyzed to create a simple  RASCH model must be dichotomous with unique values of either 0 or 1. Please recode the variables (see Data->Recode) to meet these requirements and re-run the analysis")
} else
{
    if ("{{selected.estimation | safe}}"=="CML")
    {
        {{selected.modelname | safe}} <- eRm::RM({{dataset.name}}[,c({{selected.destinationvars | safe}})], se={{selected.stderr | safe}}, sum0={{selected.normalize | safe}}) 
        BSkySummaryeRm({{selected.modelname | safe}})
    }
    if ("{{selected.estimation | safe}}"=="MML")
    {
        {{selected.modelname | safe}}<-TAM::tam.mml({{dataset.name}}[,c({{selected.destinationvars | safe}})]) 
        BSkySummary.tam.mml({{selected.modelname | safe}},verbose=FALSE)
    }
}

`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, { action: "move" }) },
            modelname: {
                el: new input(config, {
                    no: 'modelname',
                    label: localization.en.modelname,
                    placeholder: "",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
                    value: "simpleRaschModel1",
                    overwrite: "dataset"
                })
            },
            destinationvars: {
                el: new dstVariableList(config, {
                    label: localization.en.destinationvars,
                    no: "destinationvars",
                    required: true,
                    filter: "Numeric|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|UseComma|Enclosed",
                }), r: ['{{ var | safe}}']
            },


            label1: { el: new labelVar(config, { label: localization.en.estimationlbl, style: "mt-2", h: 6 }) },
            cmlrad: {
                el: new radioButton(config, {
                    label: localization.en.rad1,
                    no: "estimation",
                    increment: "cml",
                    value: "CML",
                    state: "checked",
                    extraction: "ValueAsIs",
                    dependent_objects: ['stderr', 'normalize']
                })
            },
            stderr: {
                el: new checkbox(config, {
                    label: localization.en.chk1,
                    no: "stderr",
                    style: "ml-4",
                    bs_type: "valuebox",
                    extraction: "TextAsIs",
                    true_value: "TRUE",
                    false_value: "FALSE",
                    state: "checked",
                    newline: true,
                })
            },
            normalize: {
                el: new checkbox(config, {
                    label: localization.en.chk2,
                    no: "normalize",
                    style: "ml-4",
                    bs_type: "valuebox",
                    extraction: "TextAsIs",
                    true_value: "TRUE",
                    false_value: "FALSE",
                    state: "checked",
                    newline: true,
                })
            },

            mmlrad: {
                el: new radioButton(config, {
                    label: localization.en.rad2,
                    no: "estimation",
                    increment: "mml",
                    value: "MML",
                    extraction: "ValueAsIs"
                })
            }

        };
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.modelname.el.content, objects.destinationvars.el.content,
            objects.label1.el.content,
            objects.cmlrad.el.content, objects.stderr.el.content, objects.normalize.el.content,
            objects.mmlrad.el.content
            ],
            nav: {
                name: localization.en.navigation,
                icon: "icon-s",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new simpleRaschModel().render()