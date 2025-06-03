/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */


var localization = {
    en: {
        title: "Set Contrasts For Factor variables",
        navigation: "Set Contrasts",
        target: "Destination",
        label1: "Contrasts",
        Dummy: "Treatment (dummy) contrasts",
        Deviation: "Sum (deviation) contrasts",
        Helmert: "Helmert contrasts",
        Poly: "Polynomial contrasts",
        help: {
            title: "Set Contrasts",
            r_help: "help(contrasts, package ='stats')",
            body: `
            <b>Description</b></br>
            ​Set and view the contrasts associated with a factor.
            <br/>
            <b>Usage</b>
            <br/>
            <code> 
            contrasts(x) <-value
            </code> <br/>
            <b>Arguments</b><br/>
            <ul>
            <li>
            x: an R object.​
            </li>
            <li>
            value: either a numeric matrix (or a sparse or dense matrix of a class extending dMatrix from package Matrix) whose columns give coefficients for contrasts in the levels of x, or the (quoted) name of a function which computes such matrices e.g. “contr.treatment”, “contr.sum”, “contr.helmert”, “contr.poly”
            </li>
            </ul>
            <b>Package</b></br>
            stats</br>
            <b>Help</b></br>
            help(contrasts, package ='stats')       
            `}
    }
}

class contrastsSet extends baseModal {
    constructor() {
        var config = {
            id: "contrastsSet",
            label: localization.en.title,
            modalType: "two",
            RCode: `
#Set contrasts
contrasts({{dataset.name}}\${{selected.target | safe}}) = {{selected.Contrast | safe}}(nlevels({{dataset.name}}\${{selected.target | safe}}))
#Display contrasts
BSkyFormat( contrasts({{dataset.name}}\${{selected.target | safe}}) ,singleTableOutputHeader=paste("Contrasts for","{{selected.target | safe}}" ))
            `
        }
        var objects = {
            content_var: { el: new srcVariableList(config) },
            target: {
                el: new dstVariable(config, {
                    label: localization.en.target,
                    no: "target",
                    filter: "Numeric|Logical|Ordinal|Nominal",
                    extraction: "NoPrefix|UseComma",
                    required: true
                }), r: ['{{ var | safe}}']
            },
            label1: { el: new labelVar(config, { label: localization.en.label1,  style: "mt-3", h: 6 }) },
            Dummy: {
                el: new radioButton(config, {
                    label: localization.en.Dummy,
                    no: "Contrast",
                    increment: "Dummy",
                    value: "contr.treatment",
                    state: "checked",
                    extraction: "ValueAsIs"
                })
            },
            Deviation: {
                el: new radioButton(config, {
                    label: localization.en.Deviation,
                    no: "Contrast",
                    increment: "Deviation",
                    value: "contr.sum",
                    state: "",
                    extraction: "ValueAsIs"
                })
            },
            Helmert: {
                el: new radioButton(config, {
                    label: localization.en.Helmert,
                    no: "Contrast",
                    increment: "Helmert",
                    value: "contr.helmert",
                    state: "",
                    extraction: "ValueAsIs"
                })
            },
            Poly: {
                el: new radioButton(config, {
                    label: localization.en.Poly,
                    no: "Contrast",
                    increment: "Poly",
                    value: "contr.poly",
                    state: "",
                    extraction: "ValueAsIs"
                })
            },
        }
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.target.el.content, objects.label1.el.content, objects.Dummy.el.content, objects.Deviation.el.content, objects.Helmert.el.content, objects.Poly.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-gears",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new contrastsSet().render()