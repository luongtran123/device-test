import { JSDOM } from 'jsdom';
import {SubscriberForm} from '~/src/js/subscriber-form';
import html from '~/src/index.html';
import { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks()

//console.log(html);
function getFormElement() {
    const dom = new JSDOM(html,{
        //runScripts: "dangerously",
        //resources: 'usable',
    });
    return dom.window.document.querySelector('#subscriber');
}
function getSubmitBtn(container) {
    return container.querySelector('#submitBtn');
}
describe('when submitting form',()=>{
    beforeEach(() => {
        fetch.resetMocks();
    });

    it("should see an input form with name and email field and a button",()=>{
        const formEl = getFormElement();
        const nameEl = formEl.querySelector('#inputName');
        expect(nameEl).toBeDefined();
        expect(nameEl.value).toBe("");
        const emailEl = formEl.querySelector('#inputEmail');
        expect(emailEl).toBeDefined();
        expect(emailEl.value).toBe("");
        const btn = formEl.querySelector('#submitBtn');
        expect(btn).toBeDefined();
    });
    it("should validate when submit button is clicked",()=>{
        const formEl = getFormElement();
        new SubscriberForm(formEl);
        formEl.checkValidity = jest.fn(()=> false);

        const btn = getSubmitBtn(formEl);
        btn.click();

        expect(formEl.checkValidity()).toBe(false);
    });
    it("should not submit if name is empty",()=>{
        const formEl = getFormElement();
        new SubscriberForm(formEl);
        const btn = getSubmitBtn(formEl);

        const el = formEl.querySelector('#inputName');
        
        el.value = "";
        btn.click();
        expect(el.checkValidity()).toBe(false);
        
        el.value = "name";
        btn.click();
        expect(el.checkValidity()).toBe(true);
    });
    it("should not submit if email is empty",()=>{
        const formEl = getFormElement();
        new SubscriberForm(formEl);
        const btn = getSubmitBtn(formEl);

        const el = formEl.querySelector('#inputEmail');
        
        el.value = "";
        btn.click();
        expect(el.checkValidity()).toBe(false);
        
        el.value = "name@email.com";
        btn.click();
        expect(el.checkValidity()).toBe(true);
    });
    it("should not submit if email is incorrect format",()=>{
        const formEl = getFormElement();
        const form = new SubscriberForm(formEl);
        const btn = getSubmitBtn(formEl);

        const el = formEl.querySelector('#inputEmail');
        const incorrectEmails = [
            "name@domain",
            "name@",
            "name",
            "@domain",
            "name@.com",
            "n@d.c",
            "n@dom.",
            ".n@domain.com",
            "name@domain..com",
            "name@domain.com.",
            "name@domain,com"
        ];
        //form.subscribe = jest.fn();
        const subscribeSpy = jest.spyOn(form, 'subscribe');
        let invalid = 0;
        incorrectEmails.forEach(value=>{
            el.value = value;
            btn.click();
            if (el.checkValidity()=== false) {
                invalid++;
            } 
        });
        expect(invalid).toBe(incorrectEmails.length);
        expect(subscribeSpy).not.toHaveBeenCalled();
        subscribeSpy.mockRestore();
    });
    it("should submit correct data to api if form is validated", ()=>{
        const formEl = getFormElement();
        const form = new SubscriberForm(formEl);
        const btn = getSubmitBtn(formEl);
        const data = {
            name: "myName",
            email: "myName@myEmail.com"
        };

        formEl.querySelector('#inputName').value = data.name;
        formEl.querySelector('#inputEmail').value = data.email;
        expect(formEl.checkValidity()).toBe(true);

        const payloadSpy = jest.spyOn(form, 'getPayload');
        const subscribeSpy = jest.spyOn(form, 'subscribe');
        const postSpy = jest.spyOn(form, 'postSubscriberData');

        const body = JSON.stringify(Object.assign({},data,{id:20}));
        fetch.mockResponseOnce(body,{ status: 201 });

        form.handleSuccess = jest.fn();
        form.handleError = jest.fn();

        btn.click();

        expect(payloadSpy).toHaveBeenCalled();
        expect(subscribeSpy).toHaveBeenCalled();
        expect(postSpy).toHaveBeenCalledWith(expect.anything(),data);

        payloadSpy.mockRestore();
        subscribeSpy.mockRestore();
        postSpy.mockRestore();
    });
});
