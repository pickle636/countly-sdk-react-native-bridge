import React, { Component } from 'react';
import { Text, Button, ScrollView, Image, View, TextInput, StyleSheet } from 'react-native';
import Countly from 'countly-sdk-react-native-bridge';

const successCodes = [100, 101, 200, 201, 202, 205, 300, 301, 303, 305];
const failureCodes = [400, 402, 405, 408, 500, 501, 502, 505];

class Example extends Component {
    constructor(props) {
        super(props);
        this.state = { ratingId: '61eac4627b8ad224e37bb3f5' };
        this.config = {};

        this.onInit = this.onInit.bind(this);
        this.onStart = this.onStart.bind(this);
        this.basicEvent = this.basicEvent.bind(this);
        this.eventWithSum = this.eventWithSum.bind(this);
        this.eventWithSegment = this.eventWithSegment.bind(this);
        this.eventWithSumAndSegment = this.eventWithSumAndSegment.bind(this);
        this.startEvent = this.startEvent.bind(this);
        this.test = this.test.bind(this);
        this.onSendUserData = this.onSendUserData.bind(this);
        this.onSendUserDataBulk = this.onSendUserDataBulk.bind(this);
        this.onSetUserProperties = this.onSetUserProperties.bind(this);
        this.onUpdateUserData = this.onUpdateUserData.bind(this);
        this.userData_setProperty = this.userData_setProperty.bind(this);
        this.userData_increment = this.userData_increment.bind(this);
        this.userData_multiply = this.userData_multiply.bind(this);
        this.userData_saveMax = this.userData_saveMax.bind(this);
        this.userData_saveMin = this.userData_saveMin.bind(this);
        this.userData_setOnce = this.userData_setOnce.bind(this);
        this.changeDeviceId = this.changeDeviceId.bind(this);
        this.askForNotificationPermission = this.askForNotificationPermission.bind(this);

        this.startTrace = this.startTrace.bind(this);
        this.endTrace = this.endTrace.bind(this);
        this.recordNetworkTraceSuccess = this.recordNetworkTraceSuccess.bind(this);
        this.recordNetworkTraceFailure = this.recordNetworkTraceFailure.bind(this);
        this.random = this.random.bind(this);
        this.setCustomCrashSegments = this.setCustomCrashSegments.bind(this);
        this.presentRatingWidgetUsingEditBox = this.presentRatingWidgetUsingEditBox.bind(this);
    }

    componentDidMount() {
        //       this.onInit();
    }

    async onInit() {
        if (!(await Countly.isInitialized())) {
            /** Recommended settings for Countly initialisation */
            Countly.setLoggingEnabled(true); // Enable countly internal debugging logs
            Countly.enableCrashReporting(); // Enable crash reporting to report unhandled crashes to Countly
            Countly.setRequiresConsent(true); // Set that consent should be required for features to work.
            Countly.giveConsentInit(['location', 'sessions', 'attribution', 'push', 'events', 'views', 'crashes', 'users', 'push', 'star-rating', 'apm', 'feedback', 'remote-config']); // give conset for specific features before init.
            Countly.setLocationInit('TR', 'Istanbul', '41.0082,28.9784', '10.2.33.12'); // Set user initial location.

            /** Optional settings for Countly initialisation */
            Countly.enableParameterTamperingProtection('salt'); // Set the optional salt to be used for calculating the checksum of requested data which will be sent with each request
            // Countly.pinnedCertificates("count.ly.cer"); // It will ensure that connection is made with one of the public keys specified
            // Countly.setHttpPostForced(false); // Set to "true" if you want HTTP POST to be used for all requests
            Countly.enableApm(); // Enable APM features, which includes the recording of app start time.
            Countly.pushTokenType(Countly.messagingMode.DEVELOPMENT, 'ChannelName', 'ChannelDescription'); // Set messaging mode for push notifications

            if (Platform.OS.match('ios')) {
                Countly.recordAttributionID('ADVERTISING_ID');
            } else {
                Countly.enableAttribution(); // Enable to measure your marketing campaign performance by attributing installs from specific campaigns.
            }

            Countly.configureIntentRedirectionCheck(['MainActivity'], ['com.countly.demo']);

            Countly.setStarRatingDialogTexts('Title', 'Message', 'Dismiss');
            await Countly.init('https://try.count.ly', 'YOUR_APP_KEY'); // Initialize the countly SDK.
            Countly.appLoadingFinished();
            /**
             * Push notifications settings
             * Should be call after init
             */
            Countly.registerForNotification((theNotification) => {
                const jsonString = JSON.stringify(JSON.parse(theNotification));
                console.log(`Just received this notification data: ${jsonString}`);
                alert(`theNotification: ${jsonString}`);
            }); // Set callback to receive push notifications
            Countly.askForNotificationPermission('android.resource://com.countly.demo/raw/notif_sample'); // This method will ask for permission, enables push notification and send push token to countly server.
        }
    }

    onStart() {
        Countly.start();
    }

    onStop() {
        Countly.stop();
    }

    onSendUserData() {
        // example for setUserData
        const options = {};
        options.name = 'Name of User';
        options.username = 'Username';
        options.email = 'User Email';
        options.organization = 'User Organization';
        options.phone = 'User Contact number';
        options.picture = 'https://count.ly/images/logos/countly-logo.png';
        options.picturePath = '';
        options.gender = 'Male';
        options.byear = 1989;
        Countly.setUserData(options);
    }

    onSetUserProperties() {
        // example for setUserData
        const options = {};
        // Predefined user properties
        options.name = 'Name of User';
        options.username = 'Username';
        options.email = 'User Email';
        options.organization = 'User Organization';
        options.phone = 'User Contact number';
        options.picture = 'https://count.ly/images/logos/countly-logo.png';
        options.picturePath = '';
        options.gender = 'Male';
        options.byear = 1989;

        // Custom User Properties
        options.customeValueA = 'Custom value A';
        options.customeValueB = 'Custom value B';

        Countly.userDataBulk.setUserProperties(options);

        Countly.userDataBulk.save();
    }

    onSendUserDataBulk() {
        Promise.allSettled([
            Countly.userDataBulk.setProperty('key', 'value'),
            Countly.userDataBulk.setProperty('increment', 5),
            Countly.userDataBulk.increment('increment'),
            Countly.userDataBulk.setProperty('incrementBy', 5),
            Countly.userDataBulk.incrementBy('incrementBy', 10),
            Countly.userDataBulk.setProperty('multiply', 5),
            Countly.userDataBulk.multiply('multiply', 20),
            Countly.userDataBulk.setProperty('saveMax', 5),
            Countly.userDataBulk.saveMax('saveMax', 100),
            Countly.userDataBulk.setProperty('saveMin', 5),
            Countly.userDataBulk.saveMin('saveMin', 50),
            Countly.userDataBulk.setOnce('setOnce', 200),
            Countly.userDataBulk.pushUniqueValue('type', 'morning'),
            Countly.userDataBulk.pushValue('type', 'morning'),
            Countly.userDataBulk.pullValue('type', 'morning'),
        ]).then((values) => {
            // We need to call the "save" in then block else it will cause a race condition and "save" may call before all the user profiles calls are completed
            Countly.userDataBulk.save();
        });
    }

    onUpdateUserData() {
        // example for setUserData
        const options = {};
        options.organization = 'Updated User Organization';
        options.phone = 'Updated User Contact number';
        options.gender = 'Female';
        options.byear = 1995;
        Countly.setUserData(options);
    }

    basicEvent() {
        // example for basic event
        const event = { 'eventName': 'Basic Event', 'eventCount': 1 };
        Countly.sendEvent(event);
    }

    eventWithSum() {
        // example for event with sum
        const event = { 'eventName': 'Event With Sum', 'eventCount': 1, 'eventSum': '0.99' };
        Countly.sendEvent(event);
    }

    eventWithSegment() {
        // example for event with segment
        let event = { 'eventName': 'Event With Segment', 'eventCount': 1 };
        event.segments = { 'Country': 'Turkey', 'Age': '28' };
        Countly.sendEvent(event);
        event = { 'eventName': 'Event With Segment', 'eventCount': 1 };
        event.segments = { 'Country': 'France', 'Age': '38' };
        Countly.sendEvent(event);
    }

    eventWithSumAndSegment() {
        // example for event with segment and sum
        let event = { 'eventName': 'Event With Sum And Segment', 'eventCount': 1, 'eventSum': '0.99' };
        event.segments = { 'Country': 'Turkey', 'Age': '28' };
        Countly.sendEvent(event);
        event = { 'eventName': 'Event With Sum And Segment', 'eventCount': 3, 'eventSum': '1.99' };
        event.segments = { 'Country': 'France', 'Age': '38' };
        Countly.sendEvent(event);
    }

    // TIMED EVENTS
    startEvent() {
        Countly.startEvent('timedEvent');
        setTimeout(() => {
            Countly.endEvent('timedEvent');
        }, 1000);
    }

    /*
      setTimeout may not work correctly if you are attached to Chrome Debugger.
      for workaround see: https://github.com/facebook/react-native/issues/9436
     */
    timedEventWithSum() {
        // Event with sum
        Countly.startEvent('timedEventWithSum');
        const event = {
            'eventName': 'timedEventWithSum',
            'eventSum': '0.99',
        };
        setTimeout(() => {
            Countly.endEvent(event);
        }, 1000);
    }

    timedEventWithSegment() {
        // Event with segment
        Countly.startEvent('timedEventWithSegment');
        const event = {
            'eventName': 'timedEventWithSegment',
        };
        event.segments = {
            'Country': 'Germany',
            'Age': '32',
        };
        setTimeout(() => {
            Countly.endEvent(event);
        }, 1000);
    }

    timedEventWithSumAndSegment() {
        // Event with Segment, sum and count
        Countly.startEvent('timedEventWithSumAndSegment');
        const event = {
            'eventName': 'timedEventWithSumAndSegment',
            'eventCount': 1,
            'eventSum': '0.99',
        };
        event.segments = {
            'Country': 'India',
            'Age': '21',
        };
        setTimeout(() => {
            Countly.endEvent(event);
        }, 1000);
    }
    // TIMED EVENTS

    userData_setProperty() {
        Countly.userData.setProperty('setProperty', 'keyValue');
    }

    userData_increment() {
        Countly.userData.setProperty('increment', 5);
        Countly.userData.increment('increment');
    }

    userData_incrementBy() {
        Countly.userData.setProperty('incrementBy', 5);
        Countly.userData.incrementBy('incrementBy', 10);
    }

    userData_multiply() {
        Countly.userData.setProperty('multiply', 5);
        Countly.userData.multiply('multiply', 20);
    }

    userData_saveMax() {
        Countly.userData.setProperty('saveMax', 5);
        Countly.userData.saveMax('saveMax', 100);
    }

    userData_saveMin() {
        Countly.userData.setProperty('saveMin', 5);
        Countly.userData.saveMin('saveMin', 50);
    }

    userData_setOnce() {
        Countly.userData.setOnce('setOnce', 200);
    }

    userData_pushUniqueValue() {
        Countly.userData.pushUniqueValue('type', 'morning');
    }

    userData_pushValue() {
        Countly.userData.pushValue('type', 'morning');
    }

    userData_pullValue() {
        Countly.userData.pullValue('type', 'morning');
    }

    changeDeviceId() {
        Countly.changeDeviceId('02d56d66-6a39-482d-aff0-d14e4d5e5fda');
    }

    giveConsent(name) {
        Countly.giveConsent([name]);
    }

    removeConsent(name) {
        Countly.removeConsent([name]);
    }

    giveMultipleConsent() {
        Countly.giveConsent(['events', 'views', 'star-rating', 'crashes', 'invalidFeatureName']);
    }

    removeMultipleConsent() {
        Countly.removeConsent(['events', 'views']);
    }

    giveAllConsent() {
        Countly.giveAllConsent();
    }

    removeAllConsent() {
        Countly.removeAllConsent();
    }

    remoteConfigUpdate() {
        Countly.remoteConfigUpdate((data) => {
            console.log(data);
        });
    }

    updateRemoteConfigForKeysOnly() {
        Countly.updateRemoteConfigForKeysOnly(['test1'], (data) => {
            console.log(data);
        });
    }

    updateRemoteConfigExceptKeys() {
        Countly.updateRemoteConfigExceptKeys(['test1'], (data) => {
            console.log(data);
        });
    }

    getRemoteConfigValueForKeyBoolean() {
        Countly.getRemoteConfigValueForKey('booleanValue', (data) => {
            console.log(data);
        });
    }

    getRemoteConfigValueForKeyFloat() {
        Countly.getRemoteConfigValueForKey('floatValue', (data) => {
            console.log(data);
        });
    }

    getRemoteConfigValueForKeyInteger() {
        Countly.getRemoteConfigValueForKey('integerValue', (data) => {
            console.log(data);
        });
    }

    getRemoteConfigValueForKeyString() {
        Countly.getRemoteConfigValueForKey('stringValue', (data) => {
            console.log(data);
        });
    }

    getRemoteConfigValueForKeyJSON() {
        Countly.getRemoteConfigValueForKey('jsonValue', (data) => {
            console.log(data);
        });
    }

    remoteConfigClearValues() {
        Countly.remoteConfigClearValues();
    }

    setLocation() {
        const countryCode = 'us';
        const city = 'Houston';
        const latitude = '29.634933';
        const longitude = '-95.220255';
        const ipAddress = '103.238.105.167';

        Countly.setLocation(countryCode, city, `${latitude},${longitude}`, ipAddress);
    }

    disableLocation() {
        Countly.disableLocation();
    }

    askForNotificationPermission() {
        Countly.askForNotificationPermission();
    }

    setStarRatingDialogTexts() {
        Countly.setStarRatingDialogTexts();
    }

    showStarRating() {
        Countly.showStarRating();
    }

    showFeedbackPopup() {
        Countly.showFeedbackPopup('5f8c837a5294f7aae370067c', 'Submit');
    }

    presentRatingWidget() {
        Countly.presentRatingWidgetWithID('625f9032028614795fe5a85b', 'Submit', (error) => {
            if (error != null) {
                console.log(error);
            }
        });
    }

    presentRatingWidgetUsingEditBox() {
        Countly.presentRatingWidgetWithID(this.state.ratingId, 'Submit', (error) => {
            if (error != null) {
                console.log(`presentRatingWidgetUsingEditBox : ${error}`);
            }
        });
    }

    showSurvey() {
        Countly.getFeedbackWidgets((retrivedWidgets, error) => {
            if (error != null) {
                console.log(`showSurvey Error : ${error}`);
            } else {
                console.log(`showSurvey Success : ${retrivedWidgets.length}`);
                const surveyWidget = retrivedWidgets.find((x) => x.type === 'survey');
                if (surveyWidget) {
                    Countly.presentFeedbackWidgetObject(
                        surveyWidget,
                        'Close',
                        () => {
                            console.log('showSurvey presentFeedbackWidgetObject : ' + 'Widgetshown');
                        },
                        () => {
                            console.log('showSurvey presentFeedbackWidgetObject : ' + 'Widgetclosed');
                        }
                    );
                }
            }
        });
    }

    showNPS() {
        Countly.getFeedbackWidgets((retrivedWidgets, error) => {
            if (error != null) {
                console.log(`showNPS Error : ${error}`);
            } else {
                console.log(`showNPS Success : ${retrivedWidgets.length}`);
                const npsWidget = retrivedWidgets.find((x) => x.type === 'nps');
                if (npsWidget) {
                    Countly.presentFeedbackWidgetObject(
                        npsWidget,
                        'Close',
                        () => {
                            console.log('showNPS presentFeedbackWidgetObject : ' + 'Widgetshown');
                        },
                        () => {
                            console.log('showNPS presentFeedbackWidgetObject : ' + 'Widgetclosed');
                        }
                    );
                }
            }
        });
    }

    addCrashLog() {
        Countly.addCrashLog('My crash log in string.');
    }

    addLogException() {
        Countly.addCrashLog('User Performed Step A');
        setTimeout(() => {
            Countly.addCrashLog('User Performed Step B');
        }, 1000);
        setTimeout(() => {
            Countly.addCrashLog('User Performed Step C');
            try {
                const a = {};
                const x = a.b.c; // this will create error.
            } catch (error) {
                setTimeout(() => {
                    const stack = error.stack.toString();
                    Countly.logException(stack, true, { '_facebook_version': '0.0.1' });
                }, 1000);
            }
        }, 1000);
    }

    logException() {
        Countly.logException();
    }

    // APM Examples
    startTrace() {
        const traceKey = 'Trace Key';
        Countly.startTrace(traceKey);
    }

    endTrace() {
        const traceKey = 'Trace Key';
        const customMetric = {
            'ABC': 1233,
            'C44C': 1337,
        };
        Countly.endTrace(traceKey, customMetric);
    }

    random(number) {
        return Math.floor(Math.random() * number);
    }

    recordNetworkTraceSuccess() {
        const networkTraceKey = 'api/endpoint.1';
        const responseCode = successCodes[this.random(successCodes.length)];
        const requestPayloadSize = this.random(700) + 200;
        const responsePayloadSize = this.random(700) + 200;
        Countly.recordNetworkTrace(networkTraceKey, responseCode, requestPayloadSize, responsePayloadSize);
    }

    recordNetworkTraceFailure() {
        const networkTraceKey = 'api/endpoint.1';
        const responseCode = failureCodes[this.random(failureCodes.length)];
        const requestPayloadSize = this.random(700) + 250;
        const responsePayloadSize = this.random(700) + 250;
        const startTime = new Date().getTime();
        const endTime = startTime + 500;
        Countly.recordNetworkTrace(networkTraceKey, responseCode, requestPayloadSize, responsePayloadSize, startTime, endTime);
    }

    setCustomCrashSegments() {
        const segment = { 'Key': 'Value' };
        Countly.setCustomCrashSegments(segment);
    }

    /*
    testCrash(){
        Countly.testCrash();
    }
    */
    setCustomMetrics() {
        const customMetric = {
            '_carrier': 'Custom Carrier',
        };
        Countly.setCustomMetrics(customMetric);
    }

    test() {
        this.onInit();
        this.onStart();

        this.basicEvent();
        this.eventWithSum();
        this.eventWithSegment();
        this.eventWithSumAndSegment();

        this.startEvent();

        this.onSendUserData();
        this.onSendUserDataBulk();
        this.onSetUserProperties();
        this.onUpdateUserData();
        this.userData_setProperty();
        this.userData_increment();
        this.userData_incrementBy();
        this.userData_multiply();
        this.userData_saveMax();
        this.userData_saveMin();
        this.userData_setOnce();

        // Note: Crash test for setLocation method.
        // Countly.setLocation(null, city, latitude + "," + longitude, ipAddress);
        // Countly.setLocation(null, null, latitude + "," + longitude, ipAddress);
        // Countly.setLocation(null, null, null, ipAddress);
        // Countly.setLocation(null, null, null, null);
        // Countly.setLocation(countryCode, null, null, null);
        // Countly.setLocation(countryCode, city, null, null);
        // Countly.setLocation(countryCode, city, latitude + "," + longitude, null);

        // Countly.setLocation(countryCode, city, ",", ipAddress);
        // Countly.setLocation(countryCode, city, "0,0", ipAddress);
        // Countly.setLocation(countryCode, city, "a,b", ipAddress);
        // Countly.setLocation(countryCode, city, "abcd", ipAddress);
    }

    render() {
        return (
            <ScrollView>
                <View style={{ justifyContent: 'center', alignItems: 'center', margin: 20 }}>
                    <Image source={{ uri: 'https://count.ly/images/logos/countly-logo.png' }} style={{ width: 144, height: 42 }} onError={(e) => console.log(e.nativeEvent.error)} />
                    <Text style={[{ fontSize: 24, textAlign: 'center' }]}>React Native Demo App</Text>
                </View>
                <Button onPress={this.test} title="Test" color="#1b1c1d">
                    {' '}
                </Button>
                <Button onPress={this.onInit} title="Init">
                    {' '}
                </Button>
                <Button onPress={this.onStart} title="Start" color="#5bbd72">
                    {' '}
                </Button>
                <Button onPress={this.onStop} title="Stop" color="#d95c5c">
                    {' '}
                </Button>
                <Text style={[{ textAlign: 'center' }]}>.</Text>
                <Text style={[{ textAlign: 'center' }]}>Events Start</Text>
                <Button onPress={this.basicEvent} title="Basic Events" color="#e0e0e0">
                    {' '}
                </Button>
                <Button onPress={this.eventWithSum} title="Event with Sum" color="#e0e0e0">
                    {' '}
                </Button>
                <Button onPress={this.eventWithSegment} title="Event with Segment" color="#e0e0e0">
                    {' '}
                </Button>
                <Button onPress={this.eventWithSumAndSegment} title="Even with Sum and Segment" color="#841584">
                    {' '}
                </Button>
                <Button onPress={this.startEvent} title="Timed event" color="#e0e0e0">
                    {' '}
                </Button>
                <Button onPress={this.timedEventWithSum} title="Timed events with Sum" color="#e0e0e0">
                    {' '}
                </Button>
                <Button onPress={this.timedEventWithSegment} title="Timed events with Segment" color="#e0e0e0">
                    {' '}
                </Button>
                <Button onPress={this.timedEventWithSumAndSegment} title="Timed events with Sum and Segment" color="#e0e0e0">
                    {' '}
                </Button>
                <Text style={[{ textAlign: 'center' }]}>Events End</Text>
                <Text style={[{ textAlign: 'center' }]}>.</Text>
                <Text style={[{ textAlign: 'center' }]}>2017</Text>
                <Text style={[{ textAlign: 'center' }]}>User Methods Start</Text>
                <Button onPress={this.onSendUserData} title="Send Users Data" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.onUpdateUserData} title="Update Users Data" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.userData_setProperty} title="UserData.setProperty" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.userData_increment} title="UserData.increment" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.userData_incrementBy} title="UserData.incrementBy" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.userData_multiply} title="UserData.multiply" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.userData_saveMax} title="UserData.saveMax" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.userData_saveMin} title="UserData.saveMin" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.userData_setOnce} title="UserData.setOnce" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.userData_pushUniqueValue} title="UserData.pushUniqueValue" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.userData_pushValue} title="UserData.pushValue" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.userData_pullValue} title="UserData.pullValue" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.onSetUserProperties} title="Set Users Properties" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.onSendUserDataBulk} title="Send Users Data Bulk" color="#00b5ad">
                    {' '}
                </Button>
                <Text style={[{ textAlign: 'center' }]}>User Methods End</Text>
                <Text style={[{ textAlign: 'center' }]}>.</Text>
                <Text style={[{ textAlign: 'center' }]}>Other Methods Start</Text>
                <Button
                    onPress={function () {
                        Countly.recordView('HomePage');
                    }}
                    title="Record View: 'HomePage'"
                    color="#e0e0e0"
                >
                    {' '}
                </Button>
                <Button
                    onPress={function () {
                        Countly.recordView('Dashboard');
                    }}
                    title="Record View: 'Dashboard'"
                    color="#e0e0e0"
                >
                    {' '}
                </Button>
                <Button
                    onPress={function () {
                        Countly.recordView('HomePage', { 'version': '1.0', '_facebook_version': '0.0.1' });
                    }}
                    title="Record View: 'HomePage' with Segment"
                    color="#e0e0e0"
                >
                    {' '}
                </Button>
                <Button onPress={this.setLocation} title="Set Location" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.disableLocation} title="Disable Location" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.showStarRating} title="Show Star Rating Model" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.presentRatingWidget} title="Show FeedBack Model" color="#00b5ad">
                    {' '}
                </Button>
                <TextInput style={styles.inputRoundedBorder} placeholder="Enter a Rating ID" onChangeText={(ratingId) => this.setState({ ratingId })} onSubmitEditing={(ratingId) => this.setState({ ratingId })} value={this.state.ratingId} />
                <Button disabled={!this.state.ratingId} onPress={this.presentRatingWidgetUsingEditBox} title="Show Feedback using EditBox" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.showSurvey} title="Show Survey" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.showNPS} title="Show NPS" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.eventSendThreshold} title="Set Event Threshold" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.setCustomCrashSegments} title="Set Custom Crash Segment" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.setCustomMetrics} title="Set Custom Metrics" color="#00b5ad">
                    {' '}
                </Button>
                <Text style={[{ textAlign: 'center' }]}>Other Methods End</Text>
                <Text style={[{ textAlign: 'center' }]}>.</Text>
                <Text style={[{ textAlign: 'center' }]}>Push Notification Start</Text>
                <Button onPress={this.askForNotificationPermission} title="askForNotificationPermission" color="#00b5ad" />
                <Button onPress={this.changeDeviceId} title="Change Device ID" color="#00b5ad" />
                <Text style={[{ textAlign: 'center' }]}>Push Notification End</Text>
                <Text style={[{ textAlign: 'center' }]}>.</Text>
                <Text style={[{ textAlign: 'center' }]}>Consent Start</Text>
                <Button onPress={this.giveAllConsent} title="Give all Consent" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.removeAllConsent} title="Remove all Consent" color="#00b5ad">
                    {' '}
                </Button>
                {/* Give Consent */}
                <Button
                    onPress={() => {
                        this.giveConsent('sessions');
                    }}
                    title="Give sessions"
                    color="#00b5ad"
                >
                    {' '}
                </Button>
                <Button
                    onPress={() => {
                        this.giveConsent('events');
                    }}
                    title="Give events"
                    color="#00b5ad"
                >
                    {' '}
                </Button>
                <Button
                    onPress={() => {
                        this.giveConsent('views');
                    }}
                    title="Give views"
                    color="#00b5ad"
                >
                    {' '}
                </Button>
                <Button
                    onPress={() => {
                        this.giveConsent('location');
                    }}
                    title="Give location"
                    color="#00b5ad"
                >
                    {' '}
                </Button>
                <Button
                    onPress={() => {
                        this.giveConsent('crashes');
                    }}
                    title="Give crashes"
                    color="#00b5ad"
                >
                    {' '}
                </Button>
                <Button
                    onPress={() => {
                        this.giveConsent('attribution');
                    }}
                    title="Give attribution"
                    color="#00b5ad"
                >
                    {' '}
                </Button>
                <Button
                    onPress={() => {
                        this.giveConsent('users');
                    }}
                    title="Give users"
                    color="#00b5ad"
                >
                    {' '}
                </Button>
                <Button
                    onPress={() => {
                        this.giveConsent('push');
                    }}
                    title="Give push"
                    color="#00b5ad"
                >
                    {' '}
                </Button>
                <Button
                    onPress={() => {
                        this.giveConsent('star-rating');
                    }}
                    title="Give star-rating"
                    color="#00b5ad"
                >
                    {' '}
                </Button>
                <Button
                    onPress={() => {
                        this.giveConsent('apm');
                    }}
                    title="Give APM"
                    color="#00b5ad"
                >
                    {' '}
                </Button>
                {/* Remove Consent */}
                <Button
                    onPress={() => {
                        this.removeConsent('sessions');
                    }}
                    title="Remove sessions"
                    color="#00b5ad"
                >
                    {' '}
                </Button>
                <Button
                    onPress={() => {
                        this.removeConsent('events');
                    }}
                    title="Remove events"
                    color="#00b5ad"
                >
                    {' '}
                </Button>
                <Button
                    onPress={() => {
                        this.removeConsent('views');
                    }}
                    title="Remove views"
                    color="#00b5ad"
                >
                    {' '}
                </Button>
                <Button
                    onPress={() => {
                        this.removeConsent('location');
                    }}
                    title="Remove location"
                    color="#00b5ad"
                >
                    {' '}
                </Button>
                <Button
                    onPress={() => {
                        this.removeConsent('crashes');
                    }}
                    title="Remove crashes"
                    color="#00b5ad"
                >
                    {' '}
                </Button>
                <Button
                    onPress={() => {
                        this.removeConsent('attribution');
                    }}
                    title="Remove attribution"
                    color="#00b5ad"
                >
                    {' '}
                </Button>
                <Button
                    onPress={() => {
                        this.removeConsent('users');
                    }}
                    title="Remove users"
                    color="#00b5ad"
                >
                    {' '}
                </Button>
                <Button
                    onPress={() => {
                        this.removeConsent('push');
                    }}
                    title="Remove push"
                    color="#00b5ad"
                >
                    {' '}
                </Button>
                <Button
                    onPress={() => {
                        this.removeConsent('star-rating');
                    }}
                    title="Remove star-rating"
                    color="#00b5ad"
                >
                    {' '}
                </Button>
                <Button
                    onPress={() => {
                        this.removeConsent('apm');
                    }}
                    title="Remove APM"
                    color="#00b5ad"
                >
                    {' '}
                </Button>
                <Button onPress={this.giveMultipleConsent} title="Give multiple consent" color="#00b5ad">
                    {' '}
                </Button>{' '}
                <Button onPress={this.removeMultipleConsent} title="Remove multiple consent" color="#00b5ad">
                    {' '}
                </Button>
                <Text style={[{ textAlign: 'center' }]}>Consent End</Text>
                <Text style={[{ textAlign: 'center' }]}>.</Text>
                <Text style={[{ textAlign: 'center' }]}>Remote Config Start</Text>
                <Button onPress={this.remoteConfigUpdate} title="Update Remote Config" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.updateRemoteConfigForKeysOnly} title="Update Remote Config with Keys Only" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.updateRemoteConfigExceptKeys} title="Update Remote Config Except Keys" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.getRemoteConfigValueForKeyBoolean} title="Boolean Test" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.getRemoteConfigValueForKeyFloat} title="Float Test" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.getRemoteConfigValueForKeyInteger} title="Integer Test" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.getRemoteConfigValueForKeyString} title="String Test" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.getRemoteConfigValueForKeyJSON} title="JSON Test" color="#00b5ad">
                    {' '}
                </Button>
                <Button onPress={this.remoteConfigClearValues} title="Clear remote config cache" color="#00b5ad">
                    {' '}
                </Button>
                <Text style={[{ textAlign: 'center' }]}>Remote Config End</Text>
                <Text style={[{ textAlign: 'center' }]}>.</Text>
                <Text style={[{ textAlign: 'center' }]}>Crash Event start</Text>
                <Button onPress={this.addCrashLog} title="Add Crash Log" color="#00b5ad">
                    {' '}
                </Button>
                <Text style={[{ textAlign: 'center' }]}>Crash Event End</Text>
                <Text style={[{ textAlign: 'center' }]}>.</Text>
                <Text style={[{ textAlign: 'center' }]}>APM Example Start</Text>
                <Button onPress={this.startTrace} title="Start Trace" color="#1b1c1d">
                    {' '}
                </Button>
                <Button onPress={this.endTrace} title="End Trace" color="#1b1c1d">
                    {' '}
                </Button>
                <Button onPress={this.recordNetworkTraceSuccess} title="End Network Request Success" color="#1b1c1d">
                    {' '}
                </Button>
                <Button onPress={this.recordNetworkTraceFailure} title="End Network Request Failure" color="#1b1c1d">
                    {' '}
                </Button>
                <Text style={[{ textAlign: 'center' }]}>APM Example Start</Text>
                <Text style={[{ textAlign: 'center' }]}>.</Text>
                {/*
            < Button onPress = { this.testCrash } title = "Test Native Crash" color = "crimson"> </Button>
            */}
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    inputRoundedBorder: {
        margin: 5,
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'grey',
        padding: 10,
        fontSize: 20,
    },
});

module.exports = Example;
