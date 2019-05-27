# MendixCollector

This is a NodeJS app that scrapes all available metrics from a MendixApplication and then sends them to a Wavefront proxy for monitoring.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

* NodeJS >= 6.4.1
* NPM >= 6.4.1
* A Mendix application
* Your M2EE_ADMIN_PASS
* Your M2EE_ADMIN_PORT
* Wavefront Account
* Wavefront Proxy

### Installing

These instructions are intended for development only.  See production for production instructions.

```
git clone https://github.com/krisclarkdev/MendixCollector.git
cd MendixCollector
npm install
```

Open package.json and change all CHANGEME values to match your enviornment

## Running the tests

```
npm run test
```

This test will make sure you can connect to Mendix and send metrics into Wavefront.  Within a few second you should be 
able to see metrics in Wavefront coming from the Mendix source.

## Deployment

To deploy you can either download a release for your platform from this repository or you can build from source
yourself.

### Building from source

```
npm run build
```

This will produce 

```
MendixCollector-linux
MendixCollector-macos
MendixCollector-win.exe
```

If you are deploying to linux or mac make sure to chmod +x the binary.

### Running

To run the binary open a terminal and execute

```
node ./MendixCollector.js  --interval=30 --hostname=http://CHANGEME --port=CHANGEME --password=CHANGEME --wfproxy=CHANGEME --wfport=CHANGEME
```

## Authors

* **Kristopher Clark** - *Initial work* - [krisclarkdev](https://github.com/krisclarkdev)

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE.md](LICENSE.md) file for details
