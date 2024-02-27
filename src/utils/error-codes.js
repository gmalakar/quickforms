
'use strict';
export default class ErrorCode {
    Builder = {
        //builder
        INVALID_PLACEHOLDER: 'Placeholder element does not exist.',
        MISSING_PLACEHOLDER: 'Missing placeholder id.',
        MISSING_FORM_METADATA: 'Missing form metadata.',
        MISSING_CONTAINER: 'Missing Container.',
        INVALID_BUILDER: 'Missing or invalid FormBuilder instance.',
    };
    Component = {
        //component
        MISSING_PROPERTIES: 'Missing Component properties',
        INVALID_TYPE: 'Invalid Component type.',
        MISSING_NAME: 'Missing Component name.',
        MISSING_TYPE: 'Missing Component type.',
        MISSING_LABEL: 'Missing Component label.',
        INVALID_ATTRIBUTE: 'Invalid Component attribute.',
        INVALID_EVENT_LISTENER: 'Invalid event listerers.',
        INVALID_PROPERTIES: 'Invalid Component properties.',
        INVALID_NAME: 'Invalid Component Name.',
        USED_NAME: 'Component Name is already in use.',
        INVALID_COMPONENT_ARRAY: 'Invalid component array!',
        MISSING_CONTAINER: 'Missing Container Name.'
    };
    Form = {
        //form
        //component
        MISSING_PROPERTIES: 'Missing Component properties',
        INVALID_TYPE: 'Invalid Component type.',
        MISSING_NAME: 'Missing Form name.',
        MISSING_CONTAINER: 'Missing Container.',
        MISSING_INSTANCE: 'Missing Form instance.',
        INVALID_INSTANCE: 'Invalid Form instance.',
        MISSING_PLACEHOLDER: 'Missing or invalid form placeholder.',
        MISING_LISTENER: 'Missing listener from caller.',
    }
}