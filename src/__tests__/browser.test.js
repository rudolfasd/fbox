import puppeteer from 'puppeteer';
import faker from 'faker';


const HEADLESS = true
const PAGE_WAIT_FOR = false
const SLOWMO = 0

/*
const HEADLESS = false
const PAGE_WAIT_FOR = true
const SLOWMO = 5
*/

describe('BROWSER', () => {
    let browser;
    let page;
    let mouse;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: HEADLESS,
            args: ['--no-sandbox'],
            slowMo: SLOWMO
        });
        page = await browser.newPage();
        await page.goto('http://localhost:3000/');
        page.emulate({
            viewport: {
                width: 1400,
                height: 900,
            },
            userAgent: ''
        });
        mouse = page.mouse;
    });

    afterAll(async() => {
        await pageWaitFor(5000);
        browser.close();
    });

    const pageWaitFor = async (ms) => {
        if (PAGE_WAIT_FOR) { await page.waitFor(ms); };
    };
    const mouseDrag = async (pos,offset,options) => {
        const start_drag_left = pos.left + pos.width/2;
        const start_drag_top = pos.top + pos.height/2;
        const stop_drag_left = start_drag_left + offset[0];
        const stop_drag_top = start_drag_top + offset[1];
        await mouse.move(start_drag_left, start_drag_top);
        await mouse.down();
        await mouse.move(stop_drag_left, stop_drag_top,options);
        await pageWaitFor(500);
        await mouse.up();
    };
    const mouseDragTo = async (pos1,pos2,options) => {
        const start_drag_left = pos1.left + pos1.width/2;
        const start_drag_top = pos1.top + pos1.height/2;
        const stop_drag_left = pos2.left + pos2.width/2;
        const stop_drag_top = pos2.top+ pos2.height/2;
        await mouse.move(start_drag_left, start_drag_top);
        await mouse.down();
        await mouse.move(stop_drag_left, stop_drag_top,options);
        await pageWaitFor(500);
        await mouse.up();
    };    
    const getPosition = async (element) => {
        const pos = await page.evaluate((e) => {
            const {top, left, width, height} = e.getBoundingClientRect();
            return {top, left, width, height};
        }, element);
        return pos;
    };

    it('Check all necessary page parts',async () => {
        const divApp = await page.$eval('.App', e => e ? true: false);
        expect(divApp).toBe(true);
        const divMapView = await page.$eval('#MapView', e => e ? true: false);
        expect(divMapView).toBe(true);
        const divPointList = await page.$eval('.point-list', e => e ? true: false);
        expect(divPointList).toBe(true);
        const inputTextField = await page.$eval('.input-text-field', e => e ? true: false);
        expect(inputTextField).toBe(true);
    }, 16000);
    
    it('Create 5 points - testing creating items on list and placemarks on map', async () => {
        const randomInteger = (min, max) => {
            let rand = min + Math.random() * (max + 1 - min);
            return Math.floor(rand);
        };
        const randomMinus = () => {
            if (Math.random() < 0.5) return -1;
            return 1;
        };

        let points;
        let placemarks;
        let text;

        const inputTextField = await page.$('input.input-text-field');
        await inputTextField.tap();
   
        const divMapView = await page.$('#MapView');
        const mapPos = await getPosition(divMapView);
        const mapDragPos = {...mapPos, width: 60, heigth: 60};

        points = await page.$$('.point-list .item');
        expect(points.length).toBe(0);

        placemarks = await page.$$('.ymaps-2-1-74-placemark-overlay');
        expect(points.length).toBe(0);

        for (let i=0; i<5; i++){
            let dx,dy;
            dx=randomInteger(10,20)*randomMinus();
            dy=randomInteger(10,20)*randomMinus();

            await mouseDrag(mapDragPos,[dx,dy]);

            text = faker.lorem.sentence();
            await page.type('input.input-text-field', text);
            await page.keyboard.press('Enter');
        }

        points = await page.$$('.point-list .item');
        expect(points.length).toBe(5);

        placemarks = await page.$$('.ymaps-2-1-74-placemark-overlay');
        expect(points.length).toBe(5);

    }, 16000);

    it('Dragging 5t placemark - testing redraw route', async () => {
        const placemarks = await page.$$('.ymaps-2-1-74-placemark__content');
        const pathdBefore = await page.$eval('path', e => e.getAttribute('d'));

        const pos = await getPosition(placemarks[4]);
        await mouseDrag(pos,[50,50],{steps: 10});

        const pathdAfter = await page.$eval('path', e => e.getAttribute('d'));
        expect(pathdBefore === pathdAfter).toBeFalsy();

    }, 16000);

    it('Move 1t to 3d on point-list - testing dragging, redraw route, update placemarks content',async () => {
        const point1Text = await page.$$eval('.item-text',elems => elems[0].innerText);
        const point2Text = await page.$$eval('.item-text',elems => elems[1].innerText);
        const point3Text = await page.$$eval('.item-text',elems => elems[2].innerText);

        const placemarksIds = await page.$$eval('.ymaps-2-1-74-placemark__content ymaps[id]',(elems) => {
            return elems.map(e => e.getAttribute('id'));
        });        
        const placemark1Content = await page.$eval(`.ymaps-2-1-74-placemark__content ymaps[id=${placemarksIds[0]}] ymaps`,e => e.innerText);        
        expect(placemark1Content).toBe('1');
        const placemark2Content = await page.$eval(`.ymaps-2-1-74-placemark__content ymaps[id=${placemarksIds[1]}] ymaps`,e => e.innerText);        
        expect(placemark2Content).toBe('2');
        const placemark3Content = await page.$eval(`.ymaps-2-1-74-placemark__content ymaps[id=${placemarksIds[2]}] ymaps`,e => e.innerText);        
        expect(placemark3Content).toBe('3');

        const pathdBefore = await page.$eval('path',e => e.getAttribute('d'));

        const points = await page.$$('.point-list .item');
        const pos1 = await getPosition(points[0]);
        const pos3 = await getPosition(points[2]);
        await pageWaitFor(500);
        await mouseDragTo(pos1,pos3,{steps: 10});

        const pathdAfter = await page.$eval('path',e => e.getAttribute('d'));
        expect(pathdBefore === pathdAfter).toBeFalsy();

        const placemark1ContentAfterDrag = await page.$eval(`.ymaps-2-1-74-placemark__content ymaps[id=${placemarksIds[0]}] ymaps`,e => e.innerText);        
        expect(placemark1ContentAfterDrag ).toBe('3');
        const placemark2ContentAfterDrag  = await page.$eval(`.ymaps-2-1-74-placemark__content ymaps[id=${placemarksIds[1]}] ymaps`,e => e.innerText);        
        expect(placemark2ContentAfterDrag ).toBe('1');
        const placemark3ContentAfterDrag  = await page.$eval(`.ymaps-2-1-74-placemark__content ymaps[id=${placemarksIds[2]}] ymaps`,e => e.innerText);        
        expect(placemark3ContentAfterDrag ).toBe('2');

        const point1TextAfterDrag = await page.$$eval('.item-text',elems => elems[0].innerText);
        const point2TextAfterDrag = await page.$$eval('.item-text',elems => elems[1].innerText);
        const point3TextAfterDrag = await page.$$eval('.item-text',elems => elems[2].innerText);
        expect(point1TextAfterDrag).toBe(point2Text);
        expect(point2TextAfterDrag).toBe(point3Text);
        expect(point3TextAfterDrag).toBe(point1Text);
    }, 16000);

    it('Deleting 4t placemark - decrease amount of list-items and placemarks,redraw route, update placemarks content', async () => {
        await pageWaitFor(500);
        const removeButtons = await page.$$('.point-list .item .item-remove');
        const pos = await getPosition(removeButtons[3]);

        const placemarksIds = await page.$$eval('.ymaps-2-1-74-placemark__content ymaps[id]',(elems) => {
            return elems.map(e => e.getAttribute('id'));
        });
        const placemark4Content = await page.$eval(`.ymaps-2-1-74-placemark__content ymaps[id=${placemarksIds[3]}] ymaps`,e => e.innerText);        
        expect(placemark4Content).toBe('4');
        const placemark5Content = await page.$eval(`.ymaps-2-1-74-placemark__content ymaps[id=${placemarksIds[4]}] ymaps`,e => e.innerText);        
        expect(placemark5Content).toBe('5');

        const pathdBefore = await page.$eval('path',e => e.getAttribute('d'));

        await mouse.move(pos.left + pos.width/2, pos.top + pos.height/2);
        await page.waitFor(500);
        await mouse.click(pos.left + pos.width/2, pos.top + pos.height/2);
        await mouse.move(0,0);

        const pathdAfter = await page.$eval('path',e => e.getAttribute('d'));
        expect(pathdBefore === pathdAfter).toBeFalsy();

        const placemark4ContentAfterDel = await page.$(`.ymaps-2-1-74-placemark__content ymaps[id=${placemarksIds[3]}] ymaps`);        
        expect(placemark4ContentAfterDel).toBeFalsy();
        const placemark5ContentAfterDel = await page.$eval(`.ymaps-2-1-74-placemark__content ymaps[id=${placemarksIds[4]}] ymaps`,e => e.innerText);        
        expect(placemark5ContentAfterDel).toBe('4');

        const points = await page.$$('.point-list .item');
        expect(points.length).toBe(4);
        const placemarks = await page.$$('.ymaps-2-1-74-placemark-overlay');
        expect(placemarks.length).toBe(4);
    }, 16000);

    xit('Open balloon for 1t point', async () => {
        /* Attention! This test uses Yandex GeoCoder. */
        /* Test doesn't work correctly in headless(true) mode */
        const placemarks = await page.$$('.ymaps-2-1-74-placemark__content');
        const pos = await getPosition(placemarks[0]);
        const balloonBeforeClick = await page.$$('.ymaps-2-1-74-balloon-panel');
        expect(balloonBeforeClick.length).toBe(0);
        await mouse.click(pos.left + pos.width/2, pos.top + pos.height/2);
        await page.waitFor(1000);
        const balloonAfterClick = await page.$$('.ymaps-2-1-74-balloon-panel');
        expect(balloonAfterClick.length).toBe(1);
    }, 16000);

    it('Deleting all points and placemarks', async () => {
        await pageWaitFor(500);
        const removeAllBtn = await page.$('.sep-btn-del-all');
        const pos = await getPosition(removeAllBtn);
        await mouse.move(pos.left + pos.width/2, pos.top + pos.height/2);
        await pageWaitFor(500);
        await mouse.click(pos.left + pos.width/2, pos.top + pos.height/2);
        
        const points = await page.$$('.point-list .item');
        expect(points.length).toBe(0);
        const placemarks = await page.$$('.ymaps-2-1-74-placemark-overlay');
        expect(placemarks.length).toBe(0);
        const path = await page.$('path');
        expect(path).toBeFalsy();
    }, 16000);
});
