import loadScript from '../loadScript';


describe('loadScript',() => {
    beforeEach(()=>{
        document.head.innerHTML = '<head></head>'
        mockCallback.mockClear();
    })
    const mockCallback = jest.fn();
    it('testing with callback',() => {
        loadScript('ScriptSrc','ScriptId', mockCallback);
        document.querySelector('script#ScriptId').onload();
        expect(mockCallback).toHaveBeenCalledTimes(1);
    });
    it('testing when script have been already added',() => {
        document.head.innerHTML = '<head><script id="ScriptId" src="ScriptSrc"></head>'
        loadScript('ScriptSrc','ScriptId', mockCallback);
        expect(mockCallback).toHaveBeenCalledTimes(0);
    });
});