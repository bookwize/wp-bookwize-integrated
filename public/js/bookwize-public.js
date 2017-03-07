var step1, step2, step3, step4, IBEStepsMain, myReservation, guestPreferences, loader, ratePlan, lang, header;
$(document).ready(function () {
    if (typeof google === 'object' && typeof google.maps === 'object') {
        return;
    } else {
        $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyAwNrMVC8KUcrJXw5ceZbJJ6NP2rK37TBQ', function () {
        });
    }
});
// key => page url, value: DOM Element ID
var routes = {
    "1": "Step1",
    "2": "Step2",
    "3": "Step3",
    "4": "Step4",
    "Rateplan": "Rateplan",
    "MyReservation": "MyReservation"
};


(function ($) {
    'use strict';

    if (typeof $ === 'undefined' && typeof jQuery !== 'undefined') {
        var $ = jQuery;
    }

    $.wait = function (ms) {
        var defer = $.Deferred();
        setTimeout(function () {
            defer.resolve();
        }, ms);
        return defer;
    };

    /*
     * Loader is handled by the MainView.ready() observable using subscriptions
     *
     * All steps should be initialized centrally by the ViewModel.setStep() function.
     * setStep should handle template loading, visibility and styling.
     *
     * initStep1, initStep2 etc should be used for viewmodel initialization and binding creations. Since they can be called multiple times there should be
     * a check if model is already loaded and binded.
     *
     * for indexes use Index suffix, for example "step" suggests an object, "stepIndex" suggests an integer.
     *
     */
    function MainView() {
        var self = this;

        // observables used to synchronize different view models on same view
        self.lang = ko.observable('');
        self.currency = ko.observable('');
        self.ready = ko.observable(false);

        // used in step2 to trigger cancel button if
        // customer preferences are opened and users click outside
        self.updateCustomerPreferences = ko.observable(false);

        self.ready.subscribe(function (value) {
            loader.visible(!value);

            if (value) {
                $(".dropdown").removeClass("open");

                self.applyBodyClass();

                $.wait(500).then(self.animate.steps);
                $.wait(500).then(function () {
                    self.navigationSteps(self.currentStep - 1);
                });
            }
        });

        self.metaTitles = [
            "Step 1 - Booking Engine",
            "Step 2 - Booking Engine",
            "Step 3 - Booking Engine",
            "Step 4 - Booking Engine",
            "Contact- Booking Engine",
            "My Reservation - Booking Engine"
        ];

        self.currentStep = 1;
        self.layouts = ['rows', 'grid'];
        self.layout = 0;
        self.muktipleRooms = 1;
        self.theme = "d";
        self.themes = [{
            element: $("#Header"),
            // key: theme from querystring, value: templatefile_<theme> eg. step1_c.html
            themes: {
                'a': 'a',
                'b': 'b',
                'c': 'a',
                'd': 'a',
                'e': 'a'
            }
        }, {
            element: $("#ReservationContainer #Step1"),
            // key: theme from querystring, value: templatefile_<theme> eg. step1_c.html
            themes: {
                'a': 'a',
                'b': 'b',
                'c': 'c',
                'd': 'd',
                'e': 'd'
            }
        }, {
            element: $("#ReservationContainer #Step2"),
            // key: theme from querystring, value: templatefile_<theme>, eg. step2_b.html
            themes: {
                'a': 'a',
                'b': 'b',
                'c': 'b',
                'd': 'c',
                'e': 'c'
            }
        }, {
            element: $("#ReservationContainer #Step3"),
            // key: theme from querystring, value: templatefile_<theme>, eg. step2_b.html
            themes: {
                'a': 'a',
                'b': 'a',
                'c': 'a',
                'd': 'b',
                'e': 'c'
            }
        }, {
            element: $("#ReservationContainer #Step4"),
            // key: theme from querystring, value: templatefile_<theme>, eg. step2_b.html
            themes: {
                'a': 'a',
                'b': 'a',
                'c': 'a',
                'd': 'b',
                'e': 'c'
            }
        }];
        self.isIntegratedPage = function () {
            var found = false;
            if (window.location.href.indexOf(IBEConfig.integrated_page) > -1 || window.location.href.indexOf(IBEConfig.integrated_page + "?page=MyReservation") > -1) {
                found = true;
            }
            return found;
        };
        self.setTheme = function () {
            if (self.isIntegratedPage()) {
                $('.ibe-body').addClass('theme-' + self.theme);
                $.each(self.themes, function (index1, value) {
                    if (value.element.length) {
                        var supportedTheme = value.themes[self.theme];
                        var template = value.element.data('template').replace('%theme%', supportedTheme);
                        value.element.attr('data-template', template).data('template', template);
                    }
                });
            }
        };


        // Each step notifies its ready event
        self.onReadyEvents = {
            step1: function (status) {

                if (status) {
                    self.metaTitles = [
                        IBE.Utils.translate("meta.title.1"), IBE.Utils.translate("meta.title.2"), IBE.Utils.translate("meta.title.3"), IBE.Utils.translate("meta.title.4"),
                        IBE.Utils.translate("meta.title.contact"),
                        IBE.Utils.translate("meta.title.myreservation")
                    ];

                    // initialize welcome message
                    if (IBE.Utils.getReservationSetting(step1, 'WelcomeMessage') !== "") {
                        IBE.Utils.bindTemplate("WelcomeMessage", step1);
                    }

                    $('.ibe .btn-primary').css('background', IBE.Config.bwButtonColor);

                    // Parse deep lining
                    var result = IBE.Utils.parseDeepLinking(window.location.search, step1);
                    if (result === false) {

                        if (self.getParam(window.location.search, "page") !== '1') {
                            History.pushState({
                                page: "1"
                            }, self.metaTitles[0], "?page=1");
                        }

                        // ---- DESIGN STEP1 INIT ----
                        self.ready(status);

                        $(".steps").show();
                        self.scrollTo({
                            offset: 0,
                            duration: 0
                        });
                        self.animate.stepContent();

                        $(document).on("click", ".request-mealplan", function () {
                            self.readMore();
                        });

                        if ($(".step1-offers .slide").length <= 1) {
                            $(".step1-offers .slide-prev, .step1-offers .slide-next").hide();
                        }
                        // ---- DESIGN STEP1 END ----

                    } else {
                        submitStep1(result);
                    }
                }
            },
            step2: function (status) {

                function _init_guest_preferences() {
                    // bind guest preferences
                    guestPreferences = new IBE.ViewModels.Step1ViewModel();

                    // We must assign to guestPreferences the references from step1
                    guestPreferences.couponCode = step1.couponCode;
                    guestPreferences.couponValid = step1.couponValid;
                    guestPreferences.boardTypes = step1.boardTypes;
                    guestPreferences.boardType = step1.boardType;
                    guestPreferences.hasMessage = step1.hasMessage;
                    guestPreferences.message = step1.message;
                    guestPreferences.bookingProcess = step2.bookingProcess;
                    guestPreferences.lang = step1.lang;

                    // Overload step1.validate function
                    guestPreferences.validate = function (data, e) {
                        self.updateCustomerPreferences(true);

                        step1.couponCode(data.couponCode());
                        step1.checkIn(guestPreferences.checkIn());
                        step1.checkOut(guestPreferences.checkOut());
                        step1.requestedRooms(guestPreferences.requestedRooms());

                        step1.validate();
                    };
                    guestPreferences.cancelDateChange = function (data, e) {
                        guestPreferences.checkIn(step1.checkIn());
                        guestPreferences.checkOut(step1.checkOut());
                    };
                    guestPreferences.cancelRoomChange = function (data, e) {
                        guestPreferences.requestedRooms.removeAll();
                        ko.utils.arrayForEach(step1.requestedRooms(), function (item) {
                            guestPreferences.requestedRooms.push(item);
                        });
                    };

                    guestPreferences.events.subscribe(function (status) {

                        if (status) {
                            guestPreferences.checkIn(step1.checkIn());
                            guestPreferences.checkOut(step1.checkOut());
                            guestPreferences.couponCode(step1.couponCode());
                            guestPreferences.requestedRooms.removeAll();
                            guestPreferences.boardType(step2.request().preferredBoard());

                            ko.utils.arrayForEach(step1.requestedRooms(), function (item) {
                                guestPreferences.requestedRooms.push(item);
                            });
                        }

                    }, this, "ready");

                    guestPreferences.events.subscribe(function (data) {

                        if (data.success) {
                            submitStep1(data.success);
                        }
                        if (data.failure) {
                            guestPreferences.message(data.failure);
                        }
                    }, this, "submit");

                    guestPreferences.init();

                    $.when(IBE.Utils.bindTemplate("GuestPreferences", guestPreferences)).then(function () {

                        $(document).on('click', '.booking-process .well .navbar-collapse, .booking-process .well .navbar-collapse *', function (e) {
                            e.stopImmediatePropagation();
                            var $el = $("#GuestPreferences-Step1");
                            if ($el.is(":hidden")) {
                                $("#GuestPreferences-Step1").stop().slideDown();
                                $("#GuestPreferences-Step1").addClass("open");
                            } else {
                                $("#GuestPreferences-Step1").stop().slideUp();
                                $("#GuestPreferences-Step1").removeClass("open");
                            }
                        });
                    });

                    // remove all subscriptions because if we change language then step1.init is called
                    step1.dispose();
                }

                self.layout = IBE.Utils.getReservationSetting(step2, "IbeRoomsViewMode");

                if (status) {
                    IBE.Utils.destroyView("Step1");

                    $.when(IBE.Utils.bindTemplate("Step2", step2)).then(function () {
                        $('.ibe .btn-book').css('background', IBE.Config.bwButtonColor);
                        $('.ibe .best-value').css('border-bottom-color', IBE.Config.bwButtonColor);
                        $('.ibe .badge.bar').css('color', IBE.Config.bwButtonColor);
                        _init_guest_preferences();

                        History.pushState({
                            page: "2"
                        }, self.metaTitles[1], "?page=2");

                        // ---- DESIGN STEP2 INIT ----
                        self.ready(status);

                        $(".steps").show();
                        self.scrollTo({
                            offset: 0,
                            duration: 0
                        });
                        self.animate.bgImage();
                        $.wait(500).then(self.animate.stepContent(".step2-content"));

                        $(window).on("resize", self.resize);

                        //self.applyBodyClass(); // add step{index} in body class - used for background image
                        self.roomRowStyles(); // apply styles in center column of each room row

                        if (self.theme == "a") {
                            var initOffset = 190;
                            $(window).scroll(function () {
                                var scrollOffset = $(window).scrollTop();
                                if (initOffset - scrollOffset < 0) {
                                    $(".booking-process").addClass("fixed");
                                    $(".ui-tabs-nav").addClass("fixed");
                                } else {
                                    $(".booking-process").removeClass("fixed");
                                    $(".ui-tabs-nav").removeClass("fixed");
                                }
                            });
                        }

                        $(".room-row").on("click", ".book-room-button", self.bookRoom);
                        $(".room-row").on("click", ".list-row", self.animateRateplanViewButton.show);

                        $(document).on("click", ".room-row .room-info", self.popup.open);
                        $(document).on("click", ".room-row .row-left", self.popup.open);
                        $(document).on("click", ".room-row .room-header span:eq(0)", self.popup.open);
                        $(document).on("click", ".room-row .list-row .rateplan-view-btn", self.popup.open);


                        $(document).on("click", "#GuestPreferences .dropdown-menu", function (e) {

                            if ($(e.target).hasClass("btn-cancel")) {
                                // close dropdown
                                $(".dropdown-toggle").dropdown("toggle");
                                return true;
                            }

                            e.stopImmediatePropagation();
                        });

                        // initialize layouts - do not delete
                        $(document).on("click", ".change-layout li", self.toggleLayout);
                        $(".change-layout li[data-layout='" + self.layouts[self.layout] + "']").trigger("click");

                        $(".room-list").on("click", ".row-left", function () {
                            if (self.layout == self.layouts[1]) {
                                // Grid Layout
                                self.openRoomOverlay($(this));
                                return false;
                            }
                        });
                        $(".room-list").on("click", ".room-row", function () {
                            if (self.layout == self.layouts[1]) {
                                // Grid Layout
                                self.closeRoomOverlay($(this));
                            }
                        });
                        // ---- DESIGN STEP2 END ----
                    });

                }
            },
            step3: function (status) {
                self.ready(status);
                $(".steps").show();

                if (status) {
                    IBE.Utils.destroyView("Step2");
                    $.when(IBE.Utils.bindTemplate("Step3", step3)).then(function () {
                        $('.ibe .btn-primary').css('background', IBE.Config.bwButtonColor);
                        // remove all subscriptions because if we change language then step2.init is called
                        step2.dispose();

                        History.pushState({
                            page: "3"
                        }, self.metaTitles[2], "?page=3");

                        // ---- DESIGN STEP3 INIT ----
                        self.scrollTo({
                            offset: 0
                        });
                        $('.supplement-tooltip').on("click", function () {
                            $(this).parents(".supplement").find(".supplement-description").stop().slideToggle();
                        });

                        // ---- DESIGN STEP3 END ----
                    });
                }
            },
            step4: function (status) {
                if (status) {
                    IBE.Utils.destroyView("Step3");
                    IBE.Utils.bindTemplate("Step4", step4);

                    History.pushState({
                        page: "4"
                    }, self.metaTitles[3], "?page=4");

                    // Bing
                    window.uetq = window.uetq || [];
                    window.uetq.push({
                        'ec': step4.reservation().status(),
                        'ea': 'Transaction',
                        'el': 'Grand Resort Lagonissi',
                        'gv': step4.reservation().totalCost()
                    });

                    // Optimizely
                    window.optimizely = window.optimizely || [];
                    window.optimizely.push(['trackEvent', 'eventName', {
                        'revenue': step4.reservation().totalCost() * 100
                    }]);
                    if (typeof fbq !== 'undefined') {
                        fbq('track', 'Purchase', {
                            value: step4.reservation().totalCost(),
                            currency: self.currency()
                        });
                    }


                    // ---- DESIGN STEP4 INIT ----

                    self.scrollTo({
                        offset: 0
                    });
                    $(".steps").hide();

                    $('.supplement-tooltip').on("click", function () {
                        $(this).parents(".supplement").find(".supplement-description").stop().slideToggle();
                    });
                    // ---- DESIGN STEP4 END ----
                }

                self.ready(status);
            },
            ratePlan: function (status) {
                if (status) {
                    IBE.Utils.bindTemplate("Rateplan", ratePlan);

                    // ---- DESIGN RATEPLAN INIT ----
                    $("#Step1, .steps").css("display", "none");
                    //$(".dropdown").removeClass("open");

                    $(".rateplan-page button").on("click", function () {
                        IBE.Utils.destroyView("Rateplan");

                        $("#Step1, .steps").css("display", "block");
                        History.replaceState(null, "", "");
                        self.setStep(1);
                    });
                    // ---- DESIGN RATEPLAN END  ----
                }

                self.ready(status);
            },
            myReservation: function (status) {
                $(".steps").hide();
                self.scrollTo({
                    offset: 0,
                    duration: 0
                });
                self.ready(status);

                if (status) {
                    // destroy reservation views
                    $("#ReservationContainer").children().each(function (idx, value) {
                        var context = ko.contextFor(value);
                        if (context) {
                            ko.cleanNode(value);
                            $(value).html("");
                        }
                    });

                    IBE.Utils.destroyView("Contact");

                    self.animate.stepContent(".myreservation-content");
                }
            }
        };
        if (self.isIntegratedPage()) {
            // initialization functions for every step/viewmodel
            self.initStep1 = function () {
                self.currentStep = 1;

                if (typeof step1 == "undefined") {
                    //first time to load this step
                    step1 = new IBE.ViewModels.Step1ViewModel();

                    step1.events.subscribe(function (data) {
                        if (data.success) {
                            submitStep1(data.success);
                        }
                        if (data.failure) {
                            IBE.Utils.consoleLog("Failed to submit step 1");
                            $("#GuestPreferences .customer-request .promocode .dropdown-toggle").dropdown("toggle");
                            IBE.Utils.consoleLog(data.failure);
                        }
                    }, this, "submit");

                    step1.events.subscribe(function (error) {

                        if (error.severity == "Forbidden") {
                            self.ready(false);
                        }

                        loader.title("Failed to initialize booking engine :(");
                        loader.message(error);
                        loader.visible(true);

                        IBE.Utils.logEvent(error);

                    }, this, "error");

                    step1.events.subscribe(function (status) {

                        self.onReadyEvents.step1(status);

                    }, this, "ready")
                }

                // Assign global bindings
                step1.lang = self.lang;
                step1.currency = self.currency;

                $.when(IBE.Utils.bindTemplate("Step1", step1)).then(function (response) {
                    step1.init();
                });

                // We call again the isValidCoupon to remove the error message
                step1.clearMessage();
            };
            self.initStep2 = function (data) {
                // data: post data from Step1
                self.currentStep = 2;

                if (typeof(step2) == "undefined") {

                    step2 = new IBE.ViewModels.Step2ViewModel();

                    step2.events.subscribe(function (postdata) {
                        submitStep2(postdata);
                    }, this, "call");

                    step2.events.subscribe(function (postdata) {
                        submitStep2(postdata);
                    }, this, "submit");

                    step2.events.subscribe(function (status) {

                        self.onReadyEvents.step2(status);

                    }, this, "ready");

                    step2.events.subscribe(function (error) {

                        if (error.severity == "Forbidden") {
                            self.ready(false);
                        }

                        loader.title("Failed to initialize booking engine :(");
                        loader.message(error);
                        loader.visible(true);

                        IBE.Utils.logEvent(error);


                    }, this, "error");
                }

                // Assign global bindings
                step2.lang = self.lang;
                step2.currency = self.currency;

                if (typeof(data) != "undefined") {
                    // when first time step1 is submitted

                    try {
                        IBE.Utils.destroyView("Step2");
                        step2.init(data);
                        if (typeof ga !== 'undefined') {
                            ga('send', 'event', 'step1', 'submit');
                        }
                    } catch (e) {
                        step1.message(e.message);
                        IBE.Utils.logEvent(e);
                        self.ready(true);
                        return false;
                    }

                } else {
                    // when push state occurs

                    self.onReadyEvents.step2(true);
                }

                return true;
            };
            self.initStep3 = function (data) {
                // data: post data from Step2

                self.currentStep = 3;

                if (typeof(step3) == "undefined") {
                    step3 = new IBE.ViewModels.Step3ViewModel();

                    step3.events.subscribe(function (postdata) {
                        submitStep3(postdata);
                    }, this, "call");

                    step3.events.subscribe(function (postdata) {
                        submitStep3(postdata);
                    }, this, "submit");

                    step3.events.subscribe(function (status) {
                        self.onReadyEvents.step3(status);
                    }, this, "ready");

                    step3.events.subscribe(function (error) {
                        //step3.message(error);

                        loader.title("Failed to initialize booking engine :(");
                        loader.message(error);
                        loader.visible(true);

                        IBE.Utils.logEvent(error);

                    }, this, "error");

                }
                /*else {
                 self.onReadyEvents.step3(true);
                 } */

                // assign global bindings
                step3.lang = self.lang;
                step3.currency = self.currency;

                step3.init(data);
                if (typeof ga !== 'undefined') {
                    ga('send', 'event', 'step2', 'submit');
                }
                return true;
            };
            self.initStep4 = function (data) {
                // data: post data from Step3

                self.currentStep = 4;

                if (typeof(step4) == "undefined") {
                    step4 = new IBE.ViewModels.Step4ViewModel();

                    step4.events.subscribe(function (postdata) {

                        submitStep3(postdata);

                    }, this, "call");

                    step4.events.subscribe(function (postdata) {

                        submitStep3(postdata);

                    }, this, "submit");

                    step4.events.subscribe(function (status) {

                        self.onReadyEvents.step4(status);

                    }, this, "ready");

                    step4.events.subscribe(function (error) {
                        //debugger;
                        self.ready(true);
                        step3.clearMessage();
                        step3.message(error);

                        if (error.severity == 'critical') {
                            loader.title("Failed to submit booking :(");
                            loader.message(error);
                            loader.visible(true);
                        }
                        ;

                        IBE.Utils.logEvent(error);

                    }, this, "error");
                }

                // assign global bindings
                step4.lang = self.lang;
                step4.currency = self.currency;

                try {
                    step4.init(data);
                    if (typeof ga !== 'undefined') {
                        ga('send', 'event', 'step3', 'submit');
                    }
                } catch (e) {

                    step3.clearMessage();

                    var message = {
                        id: "4001",
                        severity: e.severity,
                        text: e.text || e.message
                    };

                    step3.message(message);

                    IBE.Utils.logEvent(message);

                    self.ready(true);
                    return false;
                }
                return true;
            };
            self.initRatePlan = function () {
                var ratePlanId = self.getParam(window.location.search, "rp");

                if (ratePlanId == "") {
                    History.replaceState(null, "", "");
                    self.setStep(1);
                }

                if (typeof ratePlan == "undefined") {

                    ratePlan = new IBE.ViewModels.Step1ViewModel();

                    ratePlan.events.subscribe(function (status) {

                        self.onReadyEvents.ratePlan(status);

                    }, this, "ready");

                }

                try {
                    ratePlan.setRateplan(parseInt(ratePlanId));
                } catch (e) {

                    self.setStep(1);
                    return false;
                }
                return true;
            };
            self.initMyReservation = function () {
                self.currentStep = "-myreservation";
                self.ready(false);

                if (typeof myReservation == "undefined") {

                    myReservation = new IBE.ViewModels.MyReservation({
                        email: IBE.Utils.getParam(window.location.search, 'email'),
                        code: IBE.Utils.getParam(window.location.search, 'code')
                    });

                    myReservation.events.subscribe(function (status) {

                        self.onReadyEvents.myReservation(status);
                    }, this, "ready");

                    myReservation.events.subscribe(function () {

                        self.setStep(1);
                    }, this, "logout");

                    myReservation.events.subscribe(function (status) {
                    }, this, "login");

                    myReservation.events.subscribe(function (error) {
                        //self.onReadyEvents.myReservation(true);
                        self.ready(true);
                        myReservation.ready(true);
                        myReservation.clearMessage();
                        myReservation.message(error);

                        if (error.severity == 'critical') {
                            loader.title("Failed to fetch booking :(");
                            loader.message(error);
                            loader.visible(true);
                        }

                        IBE.Utils.logEvent(error);
                    }, this, "error");
                }

                // ---- Clean / destroy  steps

                self.destroyStep(2);
                self.destroyStep(3);
                self.destroyStep(4);
                self.destroyStep('guestPreferences');
                // Assign global bindings
                myReservation.lang = self.lang;
                myReservation.currency = self.currency;

                try {

                    $.when(IBE.Utils.bindTemplate("MyReservation", myReservation)).then(function (response) {
                        myReservation.init();
                    });

                } catch (e) {
                    self.ready(true);
                    myReservation.message(e);
                    return false;
                }
                return true;
            };
            self.setStep = function (index, data) {
                self.currentStep = index;
                self.ready(false);
                loader.visible(true);

                var elementIndex = index - 1; // in order to get element index

                switch (index) {
                    case 1:
                        // ---- Clean / destroy / remove from memory forward steps
                        self.destroyStep(2);
                        self.destroyStep(3);
                        self.destroyStep(4);

                        self.initStep1();
                        break;
                    case 2:
                        // ---- Clean / destroy / remove from memory forward steps
                        self.destroyStep(3);
                        self.destroyStep(4);

                        self.initStep2(data);

                        // Remove last room from selectedRooms in order to select again a different room
                        if (step2.selectedRooms().length > 0) {
                            step2.selectedRooms().splice(step2.tabsCount - 1, step2.tabsCount);
                            $(".ui-tabs li:last-child").trigger("click");
                        }

                        break;
                    case 3:
                        // ---- Clean / destroy / remove from memory forward steps
                        self.destroyStep(4);

                        if (typeof(data) == "undefined") {
                            self.ready(true);
                            break;
                        }
                        self.initStep3(data);
                        break;
                    case 4:
                        if (typeof(data) == "undefined") {
                            self.ready(true);
                            break;
                        }

                        self.initStep4(data);
                        break;
                    default:
                        self.ready(true);
                        break;
                }

                $(document).on('click', '.culture .view-all-currencies', function (e) {
                    e.stopPropagation();
                });

                $(document).on('click', '.yamm .dropdown-menu', function (e) {
                    e.stopPropagation();
                });

                $(document).on("click", ".request-mealplans .btn", function () {
                    $(".request-mealplans .btn").removeClass("active");
                    $(this).addClass("active");
                });
            };

            self.animateRateplanViewButton = {
                show: function () {
                    $(this).parents(".table-list").find(".label-free-cancellation").removeClass("label-active");
                    $(this).parents(".table-list").find(".rateplan-view-btn").removeClass("active");
                    $(this).parents(".table-list").find(".rateplan-name .text").css({
                        marginLeft: 0
                    });

                    $(this).find(".rateplan-view-btn").addClass("active");
                    $(this).find(".label-free-cancellation").addClass("label-active");

                    var offset = $(this).find(".rateplan-view-btn").width() + 30;
                    $(this).find(".rateplan-name .text").css({
                        marginLeft: offset
                    });
                },
                reset: function () {
                    // hide all VIEW buttons in rateplans rows
                    $(".table-list .rateplan-view-btn.active").removeClass("active");
                    $(".table-list .label-free-cancellation.label-active").removeClass("label-active");
                    $(".table-list .rateplan-name .text").css({
                        marginLeft: 0
                    });
                }
            };

            self.readMore = function () {
                $(".mealplan-description").readmore({
                    speed: 277,
                    maxHeight: 105,
                    moreLink: '<div class="readmore-js-toggle">' + IBE.Utils.translate('readMore') + '</div>',
                    lessLink: '<div class="readmore-js-toggle">' + IBE.Utils.translate('close') + '</div>'
                });
            };

            self.destroyStep = function (stepIndex) {
                switch (stepIndex) {
                    case 1:
                        IBE.Utils.destroyView("Step1");
                        if (step1) {
                            step1.dispose();
                            step1 = undefined;
                        }
                        break;
                    case 2:
                        IBE.Utils.destroyView("Step2");
                        if (step2) {
                            step2.dispose();
                            step2 = undefined;
                        }
                        break;
                    case 3:
                        IBE.Utils.destroyView("Step3");
                        if (step3) {
                            step3.dispose();
                            step3 = undefined;
                        }
                        break;
                    case 4:
                        IBE.Utils.destroyView("Step4");
                        if (step4) {
                            step4.dispose();
                            step4 = undefined;
                        }
                        break;
                    case 'guestPreferences':
                        IBE.Utils.destroyView("GuestPreferences");
                        if (guestPreferences) {
                            guestPreferences.dispose();
                            guestPreferences = undefined;
                        }
                        break;
                }
                ;
            };

            self.navigationSteps = function (elementIndex) {
                $(".steps .step").on('click', function () {

                });
                $(".steps .step").removeClass("active").removeClass("inactive");
                $(".steps .step").each(function (idx, item) {
                    if (idx > elementIndex || self.currentStep == 4) {
                        $(this).addClass("inactive");
                    }

                    if (idx == elementIndex) {
                        $(this).addClass("active");
                    }
                });

                $('[data-dots]').each(function () {
                    var html = '';
                    for (var i = 0; i < $(this).data("dots"); i++) {
                        html += '<span class="dot"></span>';
                    }
                    $(this).html(html);
                });
            };

            self.bookRoom = function (e) {
                self.scrollTo({
                    offset: 0
                });
            };

            // Currently used only for background-image
            self.applyBodyClass = function () {

                var classes = $("body").attr("class").split(" ");
                for (var i = 0; i < classes.length; i++) {
                    if (classes[i].slice(0, 4) === 'step') {
                        $("body").removeClass(classes[i]);
                    }
                }
                $("body").addClass("step" + self.currentStep);
            };

            self.resize = function () {
                try {
                    self.resizeRoomImages();
                } catch (e) {
                    // resize before step2 is bound
                }
            };

            self.resizeRoomImages = function () {

                var width = $(window).width();

                if (width <= 990) {
                    step2.roomImageWidth(964);
                    step2.roomImageHeight(250);
                }

                if (width > 990 && width <= 1200) {
                    if (self.layout == "grid") {
                        step2.roomImageWidth(964);
                        step2.roomImageHeight(250);
                    } else {
                        step2.roomImageWidth(291);
                        step2.roomImageHeight(210);
                    }
                }

            };

            // Remove old layout class and add new one in all room lists
            self.toggleLayout = function (e) {
                e.stopPropagation();

                var oldLayoutClass = $(".change-layout li.active").data('layout');
                var newLayoutClass = $(this).data('layout');
                self.layout = newLayoutClass;

                $(".change-layout li").removeClass("active");
                $(this).addClass("active");

                var $roomlist = $(".room-list");
                $roomlist.removeClass("layout-" + oldLayoutClass);
                $roomlist.addClass("layout-" + newLayoutClass);
                $roomlist.addClass("anim");

                if (newLayoutClass == "grid") {
                    $roomlist.find(".room-row").addClass("col-lg-4");
                    $roomlist.find(".room-row .row-right .room-action").addClass("clearfix");
                    $roomlist.find(".room-row .row-right .room-prices").addClass("col-lg-6");
                    $roomlist.find(".room-row .row-right .booking-action").addClass("col-lg-6 no-padding");
                } else {
                    $roomlist.find(".room-row").removeClass("col-lg-4");
                    $roomlist.find(".room-row .row-right .room-action").removeClass("clearfix");
                    $roomlist.find(".room-row .row-right .room-prices").removeClass("col-lg-6");
                    $roomlist.find(".room-row .row-right .booking-action").removeClass("col-lg-6");
                    $roomlist.find(".room-row .row-right .booking-action").removeClass("no-padding");
                    $roomlist.find(".table-list").slideDown(300);

                }
                self.resizeRoomImages();
                self.roomRowStyles();
            };

            self.popup = {
                $el: null,
                events: function ($el, $triggerEl) {

                    self.popup.$el.off('shown.bs.modal');
                    self.popup.$el.off('hidden.bs.modal');

                    self.popup.$el.on('shown.bs.modal', function (e) {

                        $("html").addClass("modal-open");
                        $(".modal-backdrop").height($(document).height());

                        // Event listeners for bootstap collapse
                        self.popup.accordion();

                        // hide all VIEW buttons in rateplans rows
                        self.animateRateplanViewButton.reset();

                        // set popup menu
                        self.popup.selectMenu($triggerEl);

                        $el.find(".popup-rateplan .book-room-button button").on("click", function () {
                            self.popup.close();
                            self.bookRoom();
                        });
                    });

                    self.popup.$el.on('hidden.bs.modal', function (e) {
                        $("html").removeClass("modal-open");
                    });

                },
                open: function (e) {
                    var showModal = true;
                    if (self.layout == self.layouts[1]) {
                        // We are using grid Layout and we only open modal when click on Room Info
                        if ($(this).hasClass("row-left") || $(this).hasClass("room-header")) {
                            self.openRoomOverlay($(this));
                            showModal = false;
                        }
                    }
                    if (!showModal) {
                        return;
                    }

                    self.popup.$el = $(document).find("#RoomPopUp");
                    self.popup.events(self.popup.$el, $(this));
                    self.popup.$el.modal("show");

                    // see bootstrap event shown.bs.modal

                },
                // Close bootstrap modal, remove body class
                close: function (e) {
                    $("#RoomPopUp").modal("hide");
                    $("body").removeClass("modal-open");
                    $(".modal-backdrop").remove();
                },
                // Used for bootstrap collapse plugin
                accordion: function () {
                    $("#ReservationContainer").on("shown.bs.collapse", ".panel-collapse", function () {
                        var $panel = $(this).parents(".panel");
                        $panel.find("a .fa-caret-down").hide();
                        $panel.find("a .fa-caret-up").show();
                    });
                    $("#ReservationContainer").on("hidden.bs.collapse", ".panel-collapse", function () {
                        var $panel = $(this).parents(".panel");
                        $panel.find("a .fa-caret-down").show();
                        $panel.find("a .fa-caret-up").hide();
                    });
                },
                selectMenu: function ($el) {
                    //var t = setTimeout(function(){
                    var target = $el.data("target");
                    if (typeof target == "undefined") {
                        target = "room-info";
                    }

                    // Select item from popup sidebar
                    self.popup.$el.find(".sidebar .list-group .list-group-item[data-target='" + target + "']").trigger("click");

                    // Enable selected rateplan
                    var rateplanId = $el.data("rateplanId");
                    var roomId = $el.parents(".room-row").data("room-id");

                    if (typeof rateplanId != "undefined") {
                        self.popup.$el.find(".nav-pills li a[data-rateplan-id='" + rateplanId + "']").trigger("click");
                    }

                    IBE.Utils.gaTrack({
                        action: 'send',
                        command: 'event',
                        data: '/step2/popup/room-' + roomId
                    });
                }
            };

            // Open room thumb overlay in grid layout
            self.openRoomOverlay = function ($element) {
                $(".room-list").removeClass("anim");

                var $parent = $element.parents(".room-row");
                $parent.find(".row-left").stop().slideUp(577);
                $parent.find(".table-list").stop().slideDown(377);
            };

            // Close room thumb overlay in grid layout
            self.closeRoomOverlay = function ($element) {
                $(".room-list").removeClass("anim");

                // $element : the room row
                $element.find(".row-left").slideDown(300, function () {
                    $element.find(".row-left").removeAttr("style");
                });

                $element.find(".table-list").slideUp(300, function () {
                    $element.find(".table-list").removeAttr("style");
                });

                self.roomRowStyles($element); // apply styles for current room row only
            };

            // If $element != undefined, styles are apply to passed element only
            self.roomRowStyles = function ($element) {
                var applyStyles = function (rateplans) {
                    var count = rateplans.length;
                    if (count >= 3) {
                        rateplans.eq(count - 1).css({
                            borderBottom: "none"
                        });
                    }
                    if (count > 3) {
                        $(this).find(".row-center").css({
                            "-webkit-border-radius": "0px 0px 2px 2px",
                            "border-radius": "0px 0px 2px 2px"
                        });
                    }
                };

                if (typeof $element != "undefined") {
                    var $rateplans = $element.find(".table-list .list-row");
                    applyStyles($rateplans);
                    return;
                }

                // for each room, find its rateplans and apply styles based on how many they are
                $(".room-list .room-row").each(function (index, item) {
                    var $rateplans = $(this).find(".table-list .list-row");
                    applyStyles($rateplans);
                });
            };
        }
        // Scroll to specific pixel
        self.scrollTo = function (options) {
            options = $.extend({
                offset: 0,
                duration: 177,
                callback: function () {
                }
            }, options);

            $("html:not(:animated), body:not(:animated)").animate({
                scrollTop: options.offset
            }, {
                duration: options.duration,
                complete: function () {
                    options.callback();
                }
            });
        };

        self.animate = {
            bgImage: function (element) {
                element = element || ".background-image";

                var $element = $(element);
                $element.addClass("animating");
            },
            stepContent: function (element, delay) {
                element = element || ".step1-content";

                var $element = $(element);
                $element.addClass("animating");
            },
            steps: function (element, delay) {
                element = element || ".steps";

                var $element = $(element);
                $element.addClass("animating");
            },
            roomRow: function (element, delay) {
                element = element || ".room-row";

                var $element = $(element);
                $element.addClass("animating");
            }
        };

        // Handles all link click events
        self.pushStates = function () {
            History.options.hashChangeInterval = 500;

            $(document).on("click", ".ibe .steps .step", function (e) {
                var $parent = $(this);
                var url = $(this).find('a').attr("href");
                var title = $(this).find('a').attr("title");
                var page = self.getParam(url, "page");

                if ($parent.is(".step.inactive")) {
                    return false;
                }
                if (self.currentStep == self.getParam(url, "page")) {
                    return false;
                }

                if (page != "") {
                    // prevent event default only if page is valid
                    e.preventDefault();

                    if (!routes.hasOwnProperty(page)) {
                        History.pushState({
                            page: "1"
                        }, self.metaTitles[0], "?page=1");
                    } else {
                        History.pushState({
                            page: self.getParam(url, "page")
                        }, title, url);
                    }
                    self.closeAnimatedElements();
                }

                return true;
            });
        };

        // Get param from url
        self.getParam = function (url, name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(url);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        };

        self.isPageStateActive = function () {
            var page = self.getParam(window.location.search, 'page');
            return page == History.getState().data.page;
        };


        // Restore default layout, closes all opened menus/animated elements
        self.closeAnimatedElements = function () {
            var elements = [".header-sidebar", ".reservation-container"];

            $.each(elements, function (index, element) {
                $.each($(element), function (idx, el) {

                    var classes = $(el).attr("class").split(" ");
                    $(classes).each(function (i, item) {
                        classes[i] = item.indexOf("animate-") === -1 ? item : "";
                    });
                    $(el).attr("class", classes.join(" "));

                });
            });
        };
        self.getPostByBookwizeLiquidPageType = function (type) {
            return ko.utils.arrayFirst(IBE.Config.pages, function (item) {
                    return item.bookwize_liquid_page_type == type;
                }) || {};
        };
    }

    function Loader() {
        var self = this;

        var visible = ko.observable(false);

        self.$loader = $(".loader");

        self.title = ko.observable("Please wait ...");

        self.message = ko.observable(new IBE.Models.Message());

        self.showError = ko.computed(function () {
            return (self.message().severity == "critical");
        });

        self.clear = function () {
            self.message(new IBE.Models.Message());
            self.title('');
        };

        self.reload = function () {
            self.clear();
            window.location.reload();
        };

        self.visible = ko.computed({
            read: function () {
                return visible();
            },
            write: function (newValue) {

                // if error message exists, always show loader screen with error message
                if (self.message().id > 0) {
                    visible(true);
                } else {
                    visible(newValue);
                }

                if (visible()) {
                    self.$loader.show();
                } else {
                    self.$loader.hide();
                }
            }
        }).extend({
            notify: "always"
        });
    }

    var allowForward = false;

    function submitStep1(data) {
        if (IBEStepsMain.isIntegratedPage()) {
            if (data) {
                allowForward = true;
                IBEStepsMain.ready(false);
                IBEStepsMain.setStep(2, data);
            }
        }
    }

    function submitStep2(data) {
        if (IBEStepsMain.isIntegratedPage()) {
            if (data) {
                allowForward = true;
                IBEStepsMain.ready(false);
                IBEStepsMain.setStep(3, data);
            }
        }
    }

    function submitStep3(data) {
        if (IBEStepsMain.isIntegratedPage()) {
            if (data) {
                allowForward = true;
                IBEStepsMain.ready(false);
                IBEStepsMain.setStep(4, data);
            }
        }
    }

    IBEStepsMain = new MainView();


    $(function () {
        lang = $('html').attr('lang');
        (function (window, undefined) {
            if (IBEStepsMain.isIntegratedPage()) {
                // get theme from URL and set it
                var theme = IBEStepsMain.getParam(window.location.search, "theme");
                if (theme != "") {
                    IBEStepsMain.theme = theme;
                }
                IBEStepsMain.setTheme();

                var multipleRooms = IBEStepsMain.getParam(window.location.search, "rooms");
                if (multipleRooms != "") {
                    IBEStepsMain.multipleRooms = multipleRooms;
                }
            }

            // get language from query string
            var queryLang = IBEStepsMain.getParam(window.location.search, "lang");
            // if query string {lang} is set and it is supported by the IBE, asssign to global lang
            if (queryLang && queryLang[3] && IBE.Config.languages.indexOf(queryLang[3]) != -1) {
                lang = queryLang[3];
            }
            if (IBEStepsMain.isIntegratedPage()) {
                History.Adapter.onDomLoad(function (e) {

                    var state = History.getState();
                    if (typeof(state.data.page) == "undefined") {
                        var page = IBEStepsMain.getParam(window.location.search, "page");

                        if (page == "") {
                            var rateplan = IBEStepsMain.getParam(window.location.search, "rp");
                            if (rateplan != "") {
                                page = "rp";
                            }
                        }

                        state.data.page = (page == "") ? "1" : page;
                    }

                    // in case State.data.page is an interger
                    state.data.page = "" + state.data.page;
                    switch (state.data.page.toLocaleLowerCase()) {
                        case "myreservation":
                            IBEStepsMain.initMyReservation();
                            break;
                        case "contact":
                            IBEStepsMain.initContact();
                            break;
                        case "rp":
                            IBEStepsMain.initRatePlan();
                            break;
                        default:
                            // But if he has already made a reservation using the reservationSubmited load step4
                            var reservationUser = Cache.read("ReservationUser");
                            if (reservationUser !== false) {
                                IBEStepsMain.setStep(4, reservationUser);
                                break;
                            }

                            IBEStepsMain.setStep(1);

                            // IBE.Utils.gaTrack({action: 'send', command: 'pageview', data: '/step1'});

                            break;
                    }
                });

                // Bind to StateChange Event
                History.Adapter.bind(window, 'statechange', function (e) {
                    var state = History.getState();
                    var states = History.savedStates;
                    var previousState = states[states.length - 2];


                    if (typeof(state.data.page) == "undefined") {
                        History.pushState({
                            page: "1"
                        }, IBEStepsMain.metaTitles[0], "?page=1");
                        return;
                    }

                    if (state.data.page.length == 1 && previousState.data.page < state.data.page && allowForward == false) {
                        History.pushState({
                            page: previousState.data.page + ""
                        }, IBEStepsMain.metaTitles[previousState.data.page - 1], "?page=" + previousState.data.page);
                    }

                    // If user was in step4 and goes back, load step1
                    if (previousState.data.page == "4" && state.data.page < previousState.data.page) {
                        state.data.page = "1";
                    }

                    // User must go only from step3 -> step4
                    if (state.data.page == "4" && previousState.data.page != "3") {
                        // UNLESS he has already made a reservation using the reservationSubmited load step4
                        if (Cache.read("ReservationUser") !== false) {
                            return true;
                        }
                        state.data.page = "1";
                    }
                    // User must go only from step2 -> step3
                    if (state.data.page == "3" && previousState.data.page != "2") {
                        state.data.page = "1";
                    }

                    // if we are in the same page, do not re initialize
                    if (IBEStepsMain.getParam(window.location.search, 'page') == previousState.data.page ||
                        state.data.page == previousState.data.page) {
                        return false;
                    }

                    IBEStepsMain.popup.close();

                    var result = IBE.Utils.parseDeepLinking(window.location.search, step1);
                    if (result === false) {
                        //do nothing
                    } else {
                        submitStep1(result);
                        return true;
                    }

                    if (!routes.hasOwnProperty(state.data.page)) {
                        History.pushState({
                            page: "1"
                        }, IBEStepsMain.metaTitles[0], "?page=1");
                    }

                    if (state.data.page.length == 1 && previousState.data.page > state.data.page && allowForward == true) {
                        allowForward = false;
                    }

                    // in case State.data.page is an interger
                    state.data.page = "" + state.data.page;
                    switch (state.data.page.toLocaleLowerCase()) {
                        case "myreservation":
                            IBE.Utils.prepareView("myreservation");
                            IBEStepsMain.initMyReservation();
                            break;
                        case "contact":
                            IBE.Utils.prepareView("contact");
                            IBEStepsMain.initContact();
                            break;
                        case "rp":
                            IBE.Utils.prepareView("rateplan");
                            IBEStepsMain.initRatePlan();
                            break;
                        case "1":
                        case "2":
                        case "3":
                        case "4":
                            var index = state.data.page;

                            // destroy other views and keep only {index}
                            IBE.Utils.prepareView(index);
                            IBEStepsMain.setStep(parseInt(index));

                            // IBE.Utils.gaTrack({action: 'send', command: 'pageview', data: '/step' + index});

                            break;
                        default:
                            // should not get in here
                            IBE.Utils.consoleLog("invalid url:" + state.data.step);
                            break;
                    }

                });
            }
        })(window);

        // bind and show loader
        loader = new Loader();
        loader.visible(true);
        ko.applyBindings(loader, document.getElementById('Loader'));

        header = new IBE.ViewModels.HeaderViewModel();

        // if query string {lang} is set and it's valid we change the language
        if (lang) {
            header.lang(lang);
        } else {
            header.lang($('html').attr('lang'));
        }

        // default actions for every view
        IBEStepsMain.lang = header.lang;
        IBEStepsMain.currency = header.currency;
        if (IBEStepsMain.isIntegratedPage()) {
            $.when(IBE.Utils.bindTemplate("Header", header)).then(function () {
                header.init();
            });
        }
        if ($('#Currency').length) {
            $.when(IBE.Utils.bindTemplate("Currency", header)).then(function () {
                header.init();
            });
        }

        IBEStepsMain.pushStates();


        var $window = $(window);
        var $logo = $('.site-branding');

        function scroll() {
            var scrollTop = $window.scrollTop();
            if (scrollTop > 10) {
                $logo.hide();
            } else {
                $logo.show();
            }
        }

        $window.on('scroll', scroll);
        scroll();
    });
})(jQuery);
