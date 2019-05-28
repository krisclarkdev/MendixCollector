'use strict';

const args     = require('yargs').argv;
const axios    = require('axios');
const metrics  = require('wavefrontmetrics');
const registry = new metrics.Registry();
const prefix = "mendix";
const flatten = require('flat');

let the_interval = args.interval * 1000;
let interval = args.interval;
let hostname = args.hostname + ':' + args.port;
let password = new Buffer(args.password).toString('base64');
let wfproxy  = args.wfproxy;
let wfport   = args.wfport;

const proxyReporter = new metrics.WavefrontProxyReporter(registry, prefix, wfproxy, wfport, {'source': "mendix"});

proxyReporter.start(5000);

let headers = {
    'Content-Type': 'application/json',
    'X-M2EE-Authentication': password
};

function addMetric(metric, value, tags) {
    try {
        registry.addTaggedMetric(metric, new metrics.Gauge(value), tags);
    }catch(err){
        console.log(err);
    }
}
let flattenObject = function(ob) {
    var toReturn = {};

    for (var i in ob) {
        if (!ob.hasOwnProperty(i)) continue;

        if ((typeof ob[i]) == 'object') {
            var flatObject = flattenObject(ob[i]);
            for (var x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;

                toReturn[i + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
};

let stageMetrics = function(res) {
    try {
        if(res.data.feedback.requests !== undefined) {
            for(let i=0; i<res.data.feedback.requests.length; i++) {
                let name  = '';
                let value = res.data.feedback.requests[i].value;

                if(res.data.feedback.requests[i].name == '') {
                    name = 'root';
                }else{
                    name = res.data.feedback.requests[i].name;
                }

                name = name.replace(/\//g,'.');
                name = 'requests.' + name;

                if(name[name.length -1] == '.') {
                    name = name.substring(0, name.length - 1);
                }

                addMetric(name, value);
            }
        }else{
            let flatObject = flattenObject(res.data.feedback);

            for(let key in flatObject) {
                if(!isNaN(flatObject[key])) {
                    addMetric(key, flatObject[key]);
                }else{

                }
            }
        }

    }catch(ex){
        console.log('Error flattening response.  Will ignore and continue to the next object.')
    }
};

let currentExecutions = function() {
    axios.post(hostname,{action: "get_current_runtime_requests", params: {}}, {headers: headers})
        .then((res) => {
            stageMetrics(res);
        })
        .catch((error) => {
            console.error(error)
        });
};

function getRuntimeStats() {
    axios.post(hostname,{action: "runtime_statistics", params: {}}, {headers: headers})
        .then((res) => {
            stageMetrics(res);
        })
        .catch((error) => {
            console.error(error)
        });
}

function getStateStats() {
    axios.post(hostname,{action: "cache_statistics", params: {}}, {headers: headers})
        .then((res) => {
            stageMetrics(res);
        })
        .catch((error) => {
            console.error(error)
        });
}

function getServerStats(){
    axios.post(hostname,{action: "server_statistics", params: {}}, {headers: headers})
        .then((res) => {
            stageMetrics(res);
        })
        .catch((error) => {
            console.error(error)
        });
}

function getLoggedInUsersStats(){
    axios.post(hostname,{action: "get_logged_in_user_names", params: {}}, {headers: headers})
        .then((res) => {
            stageMetrics(res);
        })
        .catch((error) => {
            console.error(error)
        });
}

currentExecutions();
getRuntimeStats();
getStateStats();
getServerStats();
getLoggedInUsersStats();

setInterval(function() {
    currentExecutions();
    getRuntimeStats();
    getStateStats();
    getServerStats();
    getLoggedInUsersStats();

}, the_interval);
