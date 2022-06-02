import {Settings} from "~/src/settings/settings";

/**
 * Form Submission Module
 */
export class SubscriberForm{
    /**
     * Init
     * @param {Object} container Form element
     */
    constructor(container) {
        this.container = container;
        this.submitBtn = container.querySelector('#submitBtn');
        this.isPendingSubmit = false;
        container.addEventListener('submit',this.handleSubmit.bind(this),false);
        container.addEventListener('change',this.hideError.bind(this),false);
    }
    /**
     * Get form data
     * @returns {Object} form data
     */
    getPayload() {
        const container = this.container;
        const name = container.querySelector('#inputName').value;
        const email = container.querySelector('#inputEmail').value;
        return {
            name,
            email
        };
    }
    /**
     * Handles form submit click event
     * @param {Object} e Dom click event
     */
    handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        this.hideError();
        const container = this.container;
        const valid = container.checkValidity();
        if (valid && !this.pendingSubmit) {
            this.subscribe();
        }
        container.classList.add('was-validated');
    }
    /**
     * Submit form 
     */
    async subscribe() {
        const url = `${Settings.apiUrl}/api/subscriber`;
        const payload = this.getPayload();

        this.pendingSubmit = true;
        try {
            const response = await this.postSubscriberData(url,payload);
            if (response.status === 201) {
                this.handleSuccess(await response.json());
            } else {
                this.handleError(response);
            }
        } catch (ex) {
            this.handleError(ex);
        } finally {
            this.pendingSubmit = false;
        }
    }
    /**
     * Post subscriber's data to api
     * @param {String} url Endpoint Url
     * @param {Object} payload Payload to send
     * @returns {Promise} Promise object represents the created record
     */
    async postSubscriberData(url,payload) {
        return await fetch(url,{
            method:'post',
            body: JSON.stringify(payload),
            headers:{
                'content-type':'application/json; charset=utf-8'
            }
        });
    }
    /**
     * Get pending status
     * @returns {Boolean} Pending status
     */
    get pendingSubmit() {
        return this.isPendingSubmit;
    }
    /**
     * Set pending status and show loading spinner
     * @param {Boolean} value Pending status
     */
    set pendingSubmit(value) {
        const btn = this.submitBtn;
        if (value) {
            btn.setAttribute('disabled',true);
            btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
        } else {
            btn.removeAttribute('disabled');
            btn.innerHTML = `Submit`;
        }
        this.isPendingSubmit = value;
    }
    /**
     * Handle successful submission
     * @param {Object} data created record from api
     */
    handleSuccess(data) {
        location.reload();
    }
    /**
     * Handle failed submission
     * @param {Object} error Exception or Response from API
     */
    handleError(error) {
        //show error message
        this.submitBtn.setCustomValidity(true);
    }
    /**
     * Hide submission alert
     */
    hideError() {
        this.submitBtn.setCustomValidity("");
    }
    
}