import { browser, by, element, $ } from 'protractor';

export class OverviewPage {
    navigateTo() {
        browser.get('/airline/AAL/tails/N101NN/flights/1838/overview');
    }

    getIdElement(id) {
        return element(by.id(id));
    }

    getText(selElement) {
        return selElement.getText();
    }
}
