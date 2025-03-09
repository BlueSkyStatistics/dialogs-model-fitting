/**
  * This file is protected by copyright (c) 2023-2025 by BlueSky Statistics, LLC.
  * All rights reserved. The copy, modification, or distribution of this file is not
  * allowed without the prior written permission from BlueSky Statistics, LLC.
 */


var localization = {
    en: {
        title: "Display Contrasts",
        navigation: "Display Contrasts",
        target: "Destination",
        help: {
            title: "Display Contrasts",
            r_help: "help(contrasts, package ='stats')",
            body: `
            <b>Description</b></br>
            Display contrasts associated with a factor variable.
            <br/>
            <b>Usage</b>
            <br/>
            <code> 
            contrasts(x)
            </code> <br/>
            <b>Arguments</b><br/>
            <ul>
            <li>
            x: an R object.​
            </li>
            </ul>
            <b>Package</b></br>
            stats</br>
            <b>Help</b></br>
            help(contrasts, package ='stats')        
            `}
    }
}

class contrastsDisplay extends baseModal {
    constructor() {
        var config = {
            id: "contrastsDisplay",
            label: localization.en.title,
            modalType: "two",
            RCode: `
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
        }
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.target.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-eye",
                modal: config.id
            }
        }
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new contrastsDisplay().render()