import {Settings} from "~/src/settings/settings";

// export class DeviceData {
//     constructor() {}
//     get agent() {}
//     get isTouch
// }

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
        const data = [];

        const userAgent = navigator?.userAgent;
        data.push({userAgent});

        const featuresToDetect = [
            "pointer:none",
            "pointer:coarse",
            "pointer:fine",
            "hover:none",
            "hover:hover",
            "any-pointer:none",
            "any-pointer:coarse",
            "any-pointer:fine",
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

    mapResult(obj) {
        return Object.entries(obj).map(( [k, v] ) => ({ [k]: v }));
    }

    renderDeviceInfo() {
        const container = this.container.querySelector('#deviceinfo');
        
        //[{key, value},{key, value}] -> [ {key}, {value}, {key}, {value} ]
        const collection = this.deviceData.reduce((result, obj, index) => {
            const [key, value] = Object.entries(obj)[0];
            result.push(key);
            result.push(value);
            return result;
        }, []);

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