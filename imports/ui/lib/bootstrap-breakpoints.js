const BootstrapBreakpoints = {};

BootstrapBreakpoints.isBreakpoint = function isBreakpoint( alias ) {
    return $('.device-' + alias).is(':visible');
};

export default BootstrapBreakpoints;