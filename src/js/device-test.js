import {Settings} from "~/src/settings/settings";

export function flattenToArray(obj) {
    //{ key1: value1, key2: value2 } => [ [key1,value1],[key2,value2],... ] => [ key1,value1,key2,value2,... ]
    return Object.entries(obj).flat();
}

export function mapToArray(obj) {
    //{ key1: value1, key2: value 2, ... } => [ {key1: value1}, {key2: value3} ]
    return Object.entries(obj).map(( [k, v] ) => ({ [k]: v }));
}

export class DeviceTest{
    /**
     * Init
     * @param {Object} container element
     */
    constructor(container) {
        this.container = container;
        this.deviceData = this.gatherDeviceData();
        this.renderDeviceInfo();
    }
    gatherDeviceData() {
        const data = []; //[ {key1,value1}, {key2,value2}, ... ]

        const userAgent = navigator?.userAgent;
        data.push({userAgent});

        const featuresToDetect = [
            "pointer:none",
            "pointer:coarse",
            "pointer:fine",
            "any-pointer:none",
            "any-pointer:coarse",
            "any-pointer:fine",
            "hover:none",
            "hover:hover",
            "any-hover:none",
            "any-hover:hover"
        ];
        featuresToDetect.forEach(feature => {
            data.push({
                [feature]: window.matchMedia(`(${feature})`).matches
            });
        });

        return data;
    }

    renderDeviceInfo() {
        const container = this.container.querySelector('#deviceinfo');

        const collection = this.deviceData.flatMap(flattenToArray);

        const frag = document.createDocumentFragment();
        collection.forEach(cellData => {
            console.log(cellData);
            frag.appendChild(this.renderCellEl(cellData));
        });
        container.appendChild(frag);
    }

    renderCellEl(value) {
        const el = document.createElement('div');
        el.innerHTML = value;
        if (value === true) {
            el.className = 'text-success';
        } else if (value === false) {
            el.className = 'text-danger';
        }
        return el;
    }
}