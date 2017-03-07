<div class="bookwize-integrated theme-d">

    <div class="loader" id="Loader">
         <div class="bg"></div>
         <section class="inner">
        <div class="container-fluid loader-content">
            <header class="loader-header" data-bind="text: title">Please wait ...</header>
            <div data-bind="visible: showError" style="display:none">
                <div class="container">
                    <div class="row">
                        <div class="alert alert-danger">
                            <h3 style="text-transform:capitalize;" data-bind="html: message().severity"></h3>
                            <p data-bind="html: message().text"></p>
                        </div>
                        <div data-bind="visible: message().severity == 'critical'">
                            <p class="loader-reload" data-bind="click: reload">
                                Click here to start over
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footer class="loader-footer">
            <p>POWERED BY</p>
            <img style="width:160px;" alt="logo"
                 src="https://ibe.blob.core.windows.net/images/bookwize-logo.png">
        </footer>
        <!-- </section> -->
    </div>

    <div style="display: none;">
        <i class="datepicker-trigger fa fa-calendar" id="CalendarTrigger"></i>
    </div>
    <div id="Header" data-template="<?php echo BW_PUBLIC_URL; ?>public/partials/templates/header_%theme%.html"></div>
    <div id="ReservationContainer" class="reservation-container">
        <section data-template="<?php echo BW_PUBLIC_URL; ?>public/partials/templates/rateplan.html" id="Rateplan">
        </section>
        <section data-template="<?php echo BW_PUBLIC_URL; ?>public/partials/templates/step1_%theme%.html" id="Step1">
        </section>
        <section data-template="<?php echo BW_PUBLIC_URL; ?>public/partials/templates/step2_%theme%.html" id="Step2">
        </section>
        <section data-template="<?php echo BW_PUBLIC_URL; ?>public/partials/templates/step3_%theme%.html" id="Step3">
        </section>
        <section data-template="<?php echo BW_PUBLIC_URL; ?>public/partials/templates/step4_%theme%.html" id="Step4">
        </section>
    </div>

    <section data-template="<?php echo BW_PUBLIC_URL; ?>public/partials/templates/my-reservation/index.html"
             id="MyReservation"></section>
</div>
