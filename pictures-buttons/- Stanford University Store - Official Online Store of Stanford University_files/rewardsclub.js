﻿var rewardsFailureToSignupMessage = 'We are unable to register you at this time. Our systems are currently down. Please try again later.';

function rewardsForgotPasswordResponse(data) {
    jQuery('div.RewardsStatusForgotPasswordResponseContainer').html(data.Message);
    jQuery('div.RewardsStatusForgotPasswordFormContainer').css('display', 'none');
    jQuery('div.RewardsStatusForgotPasswordResponseContainer').css('display', 'block');
}

function rewardsSignupResponse(data) {
    jQuery('body').trigger('rewards.joinclick.tracking');
    switch (data.RewardsStatusString) {
        case "RegisteredMemberSignedUp":
            // Has account, is memeber, wasn't signed in though, show content from 'RewardsClubAlreadySignedUp'
            jQuery('div.RewardsSignupResponseContainer').html(data.RewardsContent);
            jQuery('div.RewardsStatusFormSignupFormContainer').css('display', 'none');
            jQuery('div.RewardsSignupResponseContainer').css('display', 'block');
            jQuery("input#Register_Submit").prop("disabled", false);
            break;
        case "SignUpSuccess":
            // New account entirely, show content from 'RewardsClubWelcomeMessage'
            jQuery('div.RewardsSignupResponseContainer').html(data.RewardsContent);
            jQuery('div.RewardsStatusFormSignupFormContainer').css('display', 'none');
            jQuery('div.RewardsSignupResponseContainer').css('display', 'block');
            jQuery('body').trigger('rewards_rewardsPageSignupCustomEvent', [data.CustomerId, 'rewardsclub', data.RewardsStatusString]);
            break;
        case "SignUpFailure":
            // Something went wrong here.
            changeAlert(data.RewardsStatusMessage, "error", "#ui-rewards-message");
            jQuery("div#ui-rewards-message").removeClass("hidden");
            jQuery("input#Register_Submit").prop("disabled", false);
            break;
        default:
            jQuery("input#Register_Submit").prop("disabled", false);
    }
}


function fakeRewardsSignupResponse(data) {
    jQuery('body').trigger('rewards.joinclick.tracking');
    if (data.RewardsStatusString == 'SignUpSuccess') {
        jQuery('div.RewardsSignupResponseContainer').html(data.RewardsContent);
        jQuery('div.RewardsExistingCustomerJoinContentContainer').css('display', 'none');
        jQuery('div.RewardsSignupResponseContainer').css('display', 'block');
        jQuery('body').trigger('rewards_rewardsPageSignupCustomEvent', [data.CustomerId, 'rewardsclub', data.RewardsStatusString]);
    }
    else {
        changeAlert(rewardsFailureToSignupMessage, "error", "#ui-rewards-message");
    }
}


// In case that event doesn't trigger for some reason.
jQuery(document).ready(function () {
    jQuery('html').trigger('rewardsSignupFormReadyEvent');
});


jQuery(document).ready(function () {

    // Swap out default values JS
    jQuery("body").on("focus", "input.defaultValueResetInput", function (event) {
        if (jQuery(this).val() == jQuery(this).data('default-value')) {
            jQuery(this).val('');
        }
    });
    jQuery("body").on("blur", "input.defaultValueResetInput", function (event) {
        if (jQuery(this).val() == '') {
            jQuery(this).val(jQuery(this).data('default-value'));
        }
    });

    // Join Button Event for Existing customers.
    jQuery("body").on("click", "a.RewardsExistingCustomerJoinButton", function (event) {
        var requestVerificationToken = jQuery("input[name='__RequestVerificationToken']").val();

        jQuery.ajax({
            type: "POST",
            url: "/rewards/assign",
            data: {
                userName: "blah",
                firstName: "blah",
                lastName: "blah",
                password: "blah",
                __RequestVerificationToken: requestVerificationToken
            },
            cache: false,
            success: function (data) {
                fakeRewardsSignupResponse(data);
            },
            error: function () {
                changeAlert(rewardsFailureToSignupMessage, "error", "#ui-rewards-message");
            }
        });
    });

    // Rewards Club Password Mess
    // This mass of Javascript allows a "default" text of "Password" to appear in the
    // fake text password field, but then switches to a hidden real password field when
    // the fake is given focus, which hides the characters entered into the field.
    // http://www.electrictoolbox.com/jquery-toggle-between-password-text-field/
    // - RMC - 08/12/2013
    jQuery('input#Register_Fake_Password').css('display', 'inline-block');
    jQuery('input#password').css('display', 'none');
    jQuery("body").on("focus", "input#Register_Fake_Password", function (event) {
        jQuery("input#Register_Fake_Password").css('display', 'none');
        jQuery('input#password').css('display', 'block');
        jQuery('input#password').focus();
    });
    jQuery("body").on("blur", "input#password", function (event) {
        if (jQuery(this).val() == '') {
            jQuery('input#password').css('display', 'none');
            jQuery("input#Register_Fake_Password").css('display', 'block');
        }
    });

    // Add 'notEqual' to jQuery.validate
    jQuery.validator.addMethod("notEqual", function (value, element, param) {
        return this.optional(element) || value != param;
    }, "Please specify a different (non-default) value");

    // Validates the Forgot Password Form
    jQuery("#RewardsStatusForgotPasswordForm").validate(
    {
        errorElement: "li",
        errorClass: "error",
        focusInvalid: false,
        onfocusout: false,
        ignore: ".ignore",
        debug: true,

        rules:
        {
            RewardsStatusForgotPasswordFormEmail: {
                required: true,
                email: true
            }
        },

        messages:
        {
            RewardsStatusForgotPasswordFormEmail: "An e-mail address is required. Please ensure it is entered in the correct format. (Ex: name@email.com)"
        },

        submitHandler: function (form) {
            // We return false so as not to submit this form, ever.
            // utility/forgotpassword

            var forgotPasswordJson = '{ "userName": "' + jQuery(form).find('#RewardsStatusForgotPasswordFormEmail').val() + '" }';
            jQuery.ajax({
                type: "POST",
                url: "/utility/forgotpassword",
                data: forgotPasswordJson,
                cache: false,
                contentType: 'application/json',
                success: function (data) {
                    rewardsForgotPasswordResponse(data);
                },
                error: function () {
                    changeAlert(rewardsFailureToSignupMessage, "error", "#ui-rewards-message");
                }
            });
            return false;
        },

        invalidHandler: function (event, validator) {
            // 'this' refers to the form
            var errors = validator.numberOfInvalids();
            if (!errors) {
                jQuery('div.RewardsStatusForgotPasswordValidationArea').css('display', 'none');
            }
        },

        errorPlacement: function (error, element) {
            error.appendTo('ul.RewardsStatusForgotPasswordValidationArea');
            jQueryValidateTrackError(element, error);
        }

    });

    // Add the Click Handler for the Forgot Password Toggle
    // This is not your standard display toggle, as we have a bit of added functionality.
    jQuery("body").on("click", "a#RewardsFormForgotPasswordLink", function (event) {
        if (
                (jQuery('input#userName').val() != '')
                && (jQuery('input#userName').val() != jQuery('input#userName').data('default-value'))
                && ((jQuery('input#RewardsStatusForgotPasswordFormEmail').val() == '') || (jQuery('input#RewardsStatusForgotPasswordFormEmail').val() == jQuery('input#RewardsStatusForgotPasswordFormEmail').data('default-value')))
            ) {
            jQuery('input#RewardsStatusForgotPasswordFormEmail').val(jQuery('input#userName').val());
        }
        toggleTargetDisplayClass('div.RewardsStatusForgotPasswordToggleContainer');
    });

    // JS Functionality for the retry link
    jQuery("body").on("click", "a#rewardsForgotPasswordRetry", function (event) {
        jQuery('div.RewardsStatusForgotPasswordResponseContainer').css('display', 'none');
        // Should we be blanking the form?
        jQuery('div.RewardsStatusForgotPasswordFormContainer').css('display', 'block');
    });

    var rewardsSignUpFormValidator = function (formName, options) {
        // Validates the Registration - New Customer Form
        return jQuery(formName).validate(
            $.extend(options, {
                rules:
                {
                    firstName: {
                        required: true,
                        maxlength: 50,
                        notEqual: "First Name"
                    },
                    lastName: {
                        required: true,
                        maxlength: 50,
                        notEqual: "Last Name"
                    },
                    userName: {
                        required: true,
                        email: true
                    },
                    password: {
                        required: true,
                        minlength: 8,
                        maxlength: 20
                    }
                },

                messages:
                {
                    'firstName': {
                        required: "First Name is required.",
                        maxlength: "This field cannot be more than 50 characters long.",
                        notEqual: "First Name is required."
                    },
                    'lastName': {
                        required: "Last Name is required.",
                        maxlength: "This field cannot be more than 50 characters long.",
                        notEqual: "Last Name is required."
                    },
                    'userName': "An e-mail address is required. Please ensure it is entered in the correct format. (Ex: name@email.com)",
                    'password': "A password is required. Your password should be between 8 and 20 characters long."
                },

                invalidHandler: function (e) {
                    jQueryValidateTrackError(e.target);
                },

                submitHandler: function (form) {
                    clearErrors();
                    // if validation is successfull return true else false.
                    // We return false so as not to submit this form, ever.
                    jQuery(form).find("input[type='submit']").attr('disabled', true);

                    // Blur the focus so the user will not accidentally hit enter and submit the form again
                    document.activeElement && document.activeElement.blur();

                    var firstName = jQuery(form).find("input[name='firstName']").val();
                    var lastName = jQuery(form).find("input[name='lastName']").val();
                    var userName = jQuery(form).find("input[name='userName']").val();
                    var password = jQuery(form).find("input[name='password']").val();
                    var requestVerificationToken = jQuery(form).find("input[name='__RequestVerificationToken']").val();

                    var validator = $(form).validate();
                    jQuery.ajax({
                        type: "POST",
                        url: "/rewards/assign",
                        data: {
                            __RequestVerificationToken: requestVerificationToken,
                            firstName: firstName,
                            lastName: lastName,
                            userName: userName,
                            password: password
                        },
                        cache: false,
                        success: function () {
                            var callback = validator.settings.ajaxSuccessCallback;
                            if (typeof callback === 'function') {
                                callback.apply(this, arguments);
                            }
                        },
                        timeout: 15000,
                        error: function () {
                            var callback = validator.settings.ajaxErrorCallback;
                            if (typeof callback === 'function') {
                                callback.apply(this, arguments);
                            }
                        }
                    });
                    return false;
                }
            }));
    };

    rewardsSignUpFormValidator("#RewardsStatusSignupForm", {
        errorElement: "li",
        errorClass: "error",
        focusInvalid: false,
        ignore: ".ignore",
        success: function (li, element) {
            if (!li.text().trim()) {
                li.remove();
            }
            if (jQuery("div#ui-rewards-message").find("li").length == 0) {
                jQuery("div#ui-rewards-message").addClass("hidden");
            }
        },
        errorPlacement: function (error, element) {
            error.appendTo('ul.RewardsStatusSignupValidationArea');
            jQuery("div#ui-rewards-message").removeClass("hidden");
        },
        ajaxSuccessCallback: function (data) {
            rewardsSignupResponse(data);
        },
        ajaxErrorCallback: function () {
            changeAlert(rewardsFailureToSignupMessage, "error", "#ui-rewards-message");
        }
    });

    rewardsSignUpFormValidator("#RewardsStatusSignupLoginForm", {
        errorPlacement: function (error, element) {
            clearErrors();
            error.appendTo(element.parent());
            error.css('display', 'block');
            $(document).foundation();
        },
        success: function (error, element) {
            error.remove();
            $(document).foundation();
        },
        ajaxSuccessCallback: function (data) {
            var form = $("#RewardsStatusSignupLoginForm");
            handleRewardsSignUpLoginSuccess(data, form);
        },
        ajaxErrorCallback: function () {
            changeAlert(rewardsFailureToSignupMessage, "error", "#ui-rewards-message");
            jQuery("input#Register_Submit").prop("disabled", false);
        }
    });

    $("form#JoinFanCashConfirmationForm").on('submit', function (event) {
        var form = this;
        $(form).find("input[type='submit']").attr("disabled", true);
        $.ajax({
            type: "POST",
            url: $(form).attr("action"),
            data: $(form).serialize(),
            cache: false,
            success: function (data) {
                handleRewardsSignUpLoginSuccess(data, form);
            },
            error: function (status) {
                handleRewardsSignUpLoginSuccess(status || {}, form);
            }
        });
        event.preventDefault();
        return false;
    });

    $(".rewards-club-signup-and-login-content [name='continue']").on('click', handleContinueShopping);
});

function showRewardsStatusModal() {
    var modal = $('.rewards-status');
    modal.find("[name='continue']").on('click', handleContinueShopping);
    modal.foundation('reveal', 'open');
}

function handleContinueShopping(event) {
    event.preventDefault();
    location.href = TCS.RewardsReturnUrl || '/';
    return false;
}

function handleRewardsSignUpLoginSuccess(data, form) {
    var modal = $('.rewards-status');
    jQuery('body').trigger('rewards.joinclick.tracking');
    window.scrollTo(0, 0);

    if (!data) {
        changeAlert(rewardsFailureToSignupMessage, "error", "#ui-rewards-message");
    }
    else {
        switch (data.RewardsStatusString) {
            case "SignUpSuccess":
            case "RegisteredMemberSignedUp":
                jQuery('body').trigger('rewards_rewardsPageSignupCustomEvent', [data.CustomerId, 'rewardsclub', data.RewardsStatusString]);
                var innerDiv = $('<div class="' + data.RewardsStatusString + '" />');
                innerDiv.html(data.RewardsContent).appendTo(modal);
                showRewardsStatusModal();
                break;
            case "SignUpFailure":
                var message = data.RewardsStatusMessage.replace(/\\n/g, '<br />');
                changeAlert(message, "error", "#ui-rewards-message");
                break;
            default:
                changeAlert(rewardsFailureToSignupMessage, "error", "#ui-rewards-message");
        }
    }

    if (form) {
        $(form).find("input[type='submit']").prop("disabled", false);
    }
}

function rewardsSocialAjax(ajaxOptions) {
    FB.api('/me', function (response) {
        if (response && !response.error) {

            var socialData = {
                inputData: {
                    SocialType: "facebook",
                    SocialEmail: response.email,
                    SocialID: response.id,
                    SocialAccessToken: FB.getAccessToken(),
                    FirstName: response.first_name,
                    LastName: response.last_name
                }
            };

            if (response.location) {
                socialData.inputData.Location = response.location.name;
            }
            if (response.locale) {
                socialData.inputData.Locale = response.locale;
            }
            if (response.birthday) {
                socialData.inputData.SocialBirthday = response.birthday;
            }

            jQuery.ajax($.extend({
                type: "post",
                url: "/rewards/socialsignup",
                data: JSON.stringify(socialData),
                contentType: "application/json",
                cache: false
            }, ajaxOptions));
        }
    });
}

function socialRewardsClubSignup() {
    jQuery("div.socialLoginIndicator").removeClass("hidden");
    jQuery("div.socialLoginButtons").addClass("hidden");
    jQuery('body').trigger('rewards.joinclick.tracking');

    rewardsSocialAjax({
        success: function (json, textStatus) {
            if (json.RewardsStatusString == "SignUpSuccess" || json.RewardsStatusString == "RegisteredMemberSignedUp") {
                jQuery("div.socialLoginIndicator").addClass("hidden");
                jQuery("div.socialLoginButtons").removeClass("hidden");
                jQuery("div.RewardsStatusFormSignupFormContainer").html(json.RewardsContent);
                jQuery('body').trigger('rewards_rewardsPageSignupCustomEvent', [json.CustomerId, 'rewardsclub', json.RewardsStatusString]);
                FB.api('/me/picture?width=90', function (response) {
                    if (response && !response.error) {
                        if (response.data.url !== undefined) {
                            jQuery("img#rewardsClubSocialInfoImage").attr("src", response.data.url);
                        }
                    }
                });
                if (jQuery("li#rewardsClubSocialInfoName").length > 0) {
                    jQuery("li#rewardsClubSocialInfoName").html(response.first_name + ' ' + response.last_name);
                }
            }
            else if (json.RewardsStatusMessage !== null) {
                changeAlert(json.RewardsStatusMessage, "error", "#ui-rewards-message");
                jQuery("div.socialLoginIndicator").addClass("hidden");
                jQuery("div.socialLoginButtons").removeClass("hidden");
            }
        },
        timeout: 15000,
        error: function () {
            changeAlert("Error", "error", "#ui-rewards-message");
            jQuery("div.socialLoginIndicator").addClass("hidden");
            jQuery("div.socialLoginButtons").removeClass("hidden");
        }
    });
}

function socialRewardsClubSignupLogin() {
    rewardsSocialAjax({
        success: function (data) {
            handleRewardsSignUpLoginSuccess(data);
        },
        error: function (status) {
            handleRewardsSignUpLoginSuccess(status || {});
        }
    });
}