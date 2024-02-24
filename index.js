import Builder from './src/builder/builder.js'
let formMetaData = {};
formMetaData['name'] = 'testform';
let formBuilder = new Builder('builder-container', formMetaData);
formBuilder.buildBuilder();
