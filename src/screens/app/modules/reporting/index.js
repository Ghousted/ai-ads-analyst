import { reportingVals } from './reporting';
import { ReportingView, ReportingOverlay } from './ReportingView';
import { docEditor } from './docEditor';

const reporting = { id: 'reporting', vals: reportingVals, View: ReportingView, Overlay: ReportingOverlay, methods: docEditor };

export default reporting;
